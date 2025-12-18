"""White agent implementation - the target agent being tested."""

import json
import os
import uuid
from typing import Any

import uvicorn
import dotenv
import httpx
from datetime import datetime
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentSkill, AgentCard, AgentCapabilities
from a2a.utils import new_agent_text_message
from litellm import completion
from src.my_util import parse_tags

RESPOND_ACTION_NAME = "respond"

dotenv.load_dotenv()


def prepare_white_agent_card(url: str, agent_name: str = "ppt_white_agent") -> AgentCard:
    if agent_name != "ppt_white_agent":
        raise ValueError("Only ppt_white_agent is supported in this repo.")

    skill = AgentSkill(
        id="ppt_benchmark_executor",
        name="PowerPoint benchmark executor",
        description=(
            "Receives a PowerPoint benchmark case_id and submits a changeset via the benchmark API. "
            "Protocol loading/validation runs in the benchmark runtime service."
        ),
        tags=["powerpoint", "benchmark", "white agent"],
        examples=[
            "Given <case_id>pptc-test-3a</case_id> and <benchmark_api_url>http://localhost:5050</benchmark_api_url>, "
            "fetch the datamodel, generate a valid AIChangeset JSON, and submit it.",
        ],
    )

    return AgentCard(
        name=agent_name,
        description="White agent for executing PowerPoint benchmark cases.",
        url=url,
        version="1.0.0",
        default_input_modes=["text/plain"],
        default_output_modes=["text/plain"],
        capabilities=AgentCapabilities(),
        skills=[skill],
    )


def ensure_json_envelope(content: str) -> str:
    # If already wrapped with <json>...</json>, return as-is.
    if "<json>" in content and "</json>" in content:
        return content
    stripped = content.strip()
    # If the content is bare JSON, wrap it.
    try:
        obj = json.loads(stripped)
        if isinstance(obj, dict) and "name" in obj and "kwargs" in obj:
            return f"<json>{json.dumps(obj)}</json>"
    except Exception:
        pass
    # Fallback: wrap as a direct RESPOND action.
    fallback = {
        "name": RESPOND_ACTION_NAME,
        "kwargs": {"content": stripped},
    }
    return f"<json>{json.dumps(fallback)}</json>"


def _ab_backend_url() -> str:
    return os.environ.get("AGENTBEATS_BACKEND_URL", "http://localhost:9000")


def _post_agentbeats_event(
    battle_id: str | None,
    message: str,
    reported_by: str,
    detail: dict[str, Any] | None = None,
    markdown_content: str | None = None,
    is_result: bool = False,
) -> None:
    if not battle_id:
        return
    try:
        payload = {
            "is_result": is_result,
            "message": message,
            "reported_by": reported_by,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        if detail:
            payload["detail"] = detail
        if markdown_content:
            payload["markdown_content"] = markdown_content
        with httpx.Client(timeout=10.0) as client:
            client.post(f"{_ab_backend_url()}/battles/{battle_id}", json=payload)
    except Exception:
        # best-effort logging only
        pass


def _ppt_model() -> str:
    # Allow override; defaults to a real model that exists in most setups.
    # If you set this to a non-existent model name, LLM calls will fail.
    #
    # Per your request, default to GPT-5.2. If your provider doesn't support it,
    # set PPT_MODEL to an available model (e.g. openai/gpt-4o) or configure your
    # LiteLLM proxy/OpenRouter accordingly.
    return os.getenv("PPT_MODEL", "openai/gpt-5.2")


def _ppt_system_prompt() -> str:
    # Keep it conservative to minimize schema violations.
    return """You are a PowerPoint slide editing agent.

You will receive a case_id, a benchmark_api_url, and a slide datamodel JSON plus a natural-language prompt.

You MUST output ONLY valid JSON for an AIChangeset:
{
  "added": [],
  "modified": [],
  "deleted": []
}

Rules:
- Prefer using ONLY 'modified' and 'deleted'. Avoid 'added' unless absolutely necessary.
- For each modified shape:
  - include: {"id": <int>, "shapeType": <one of: textbox,image,chart,autoShape,line,placeholder>}
  - optional: "pos": {"topLeft":[x,y]} and/or "size": {"w": number, "h": number}
  - size keys are EXACTLY 'w' and 'h' (not width/height).
- Avoid modifying shapes with shapeType "autoShape" unless it is strictly necessary to satisfy the instruction.
  If you can accomplish the task by only editing textboxes/images/lines/placeholders, do that instead.
- NEVER use shapeType "group" or "icon" in 'modified' (schema rejects these). If you need to move a group, move its child shapes instead.
- For shapeType "line": do NOT use pos/size. Use startPos/endPos or startFrom/endFrom.
- For shapeType "placeholder": you MUST nest the textbox update under "shape", e.g.:
  {"id": 2, "shapeType":"placeholder", "shape": {"id":2, "shapeType":"textbox", "pos": {...}, "size": {...}, "xml": "..."}}
- Only reference shape IDs that exist in the provided datamodel.
- Keep the changes minimal and targeted.
"""


def _coerce_size_keys(obj: dict) -> None:
    size = obj.get("size")
    if not isinstance(size, dict):
        return
    # Map common mistakes -> expected keys
    if "width" in size and "w" not in size:
        size["w"] = size.get("width")
    if "height" in size and "h" not in size:
        size["h"] = size.get("height")
    # Clean up invalid keys if present
    size.pop("width", None)
    size.pop("height", None)


def _sanitize_changeset(changeset: dict, id_to_type: dict, id_to_details: dict) -> dict:
    out = {
        "added": changeset.get("added") or [],
        "modified": changeset.get("modified") or [],
        "deleted": changeset.get("deleted") or [],
    }
    if not isinstance(out["added"], list):
        out["added"] = []
    if not isinstance(out["modified"], list):
        out["modified"] = []
    if not isinstance(out["deleted"], list):
        out["deleted"] = []

    allowed_modified_types = {
        "placeholder",
        "textbox",
        "image",
        "chart",
        "autoShape",
        "line",
    }

    def _normalize_shape_type(st: object) -> str | None:
        if not isinstance(st, str):
            return None
        s = st.strip()
        if not s:
            return None
        lower = s.lower()
        mapping = {
            "textbox": "textbox",
            "text box": "textbox",
            "text_box": "textbox",
            "text-box": "textbox",
            "text": "textbox",
            "autoshape": "autoShape",
            "auto_shape": "autoShape",
            "auto-shape": "autoShape",
            "image": "image",
            "picture": "image",
            "img": "image",
            "chart": "chart",
            "line": "line",
            "connector": "line",
            "placeholder": "placeholder",
            "group": "group",
            "icon": "icon",
        }
        if lower in mapping:
            return mapping[lower]
        if s in (
            "textbox",
            "image",
            "chart",
            "icon",
            "autoShape",
            "line",
            "group",
            "placeholder",
        ):
            return s
        return None

    # Added shapes are high-risk for schema violations; keep only safe ones.
    safe_added: list[dict] = []
    for a in out["added"]:
        if not isinstance(a, dict):
            continue
        st = _normalize_shape_type(a.get("shapeType"))
        # Keep added extremely conservative: only allow image/textbox additions for now.
        if st not in {"image", "textbox"}:
            continue
        a["shapeType"] = st
        if "_id" not in a:
            a["_id"] = f"NEW-{uuid.uuid4().hex}"
        if not isinstance(a.get("pos"), dict) or not isinstance(a.get("size"), dict):
            continue
        _coerce_size_keys(a)
        safe_added.append(a)
    out["added"] = safe_added

    safe_modified: list[dict] = []
    for m in out["modified"]:
        if not isinstance(m, dict):
            continue
        if "id" not in m:
            continue
        try:
            m["id"] = int(m["id"])
        except Exception:
            continue
        shape_id = m["id"]
        # enforce known ids only
        if shape_id not in id_to_type:
            continue
        # enforce valid discriminator (prefer the true type from the datamodel)
        requested_type = _normalize_shape_type(m.get("shapeType"))
        actual_type = _normalize_shape_type(id_to_type.get(shape_id)) or id_to_type.get(shape_id)
        shape_type = actual_type or requested_type
        if shape_type not in allowed_modified_types:
            # Drop unsupported modified unions (e.g., group/icon) rather than submitting invalid changesets.
            continue
        m["shapeType"] = shape_type

        # normalize size keys if present
        _coerce_size_keys(m)

        # Remove fields invalid for certain modified unions
        if shape_type == "line":
            # Line updates cannot include pos/size/details
            m.pop("pos", None)
            m.pop("size", None)
            m.pop("details", None)

        # for autoShape, if details exist in original, carry it to reduce union issues
        if shape_type == "autoShape" and "details" not in m and shape_id in id_to_details:
            m["details"] = id_to_details[shape_id]

        # placeholder updates must wrap a textbox update under "shape"
        if shape_type == "placeholder":
            nested = m.get("shape")
            if not isinstance(nested, dict):
                nested = {}
            nested["id"] = int(nested.get("id") or shape_id)
            nested["shapeType"] = "textbox"
            # Move textbox-like patch fields into nested shape update
            for k in ("name", "inheritStylesFrom", "pos", "size", "style", "xml", "fontInfo"):
                if k in m:
                    nested[k] = m[k]
            outer_z = m.get("zIndex")
            m.clear()
            m["id"] = int(shape_id)
            m["shapeType"] = "placeholder"
            m["shape"] = nested
            if isinstance(outer_z, int):
                m["zIndex"] = outer_z

        safe_modified.append(m)
    out["modified"] = safe_modified

    safe_deleted: list[dict] = []
    for d in out["deleted"]:
        if not isinstance(d, dict):
            continue
        if "id" not in d:
            continue
        try:
            did = int(d["id"])
        except Exception:
            continue
        if did not in id_to_type:
            continue
        safe_deleted.append({"id": did})
    out["deleted"] = safe_deleted

    return out


def _summarize_changeset(changeset: dict) -> dict[str, Any]:
    """Compute a small, log-friendly summary of the AIChangeset.

    This is intentionally approximate: we count how many shapes were touched and
    roughly how many fields were edited (excluding id/shapeType boilerplate).
    """
    added = changeset.get("added", []) if isinstance(changeset, dict) else []
    modified = changeset.get("modified", []) if isinstance(changeset, dict) else []
    deleted = changeset.get("deleted", []) if isinstance(changeset, dict) else []

    if not isinstance(added, list):
        added = []
    if not isinstance(modified, list):
        modified = []
    if not isinstance(deleted, list):
        deleted = []

    def _safe_id(x: object) -> int | None:
        if not isinstance(x, dict):
            return None
        try:
            return int(x.get("id"))  # type: ignore[arg-type]
        except Exception:
            return None

    def _modified_field_count(x: object) -> int:
        if not isinstance(x, dict):
            return 0
        keys = [k for k in x.keys() if k not in ("id", "shapeType")]
        n = len(keys)
        # For placeholder changes, count nested keys too (common shape updates).
        nested = x.get("shape")
        if isinstance(nested, dict):
            nested_keys = [k for k in nested.keys() if k not in ("id", "shapeType")]
            n += len(nested_keys)
        return n

    added_ids = [i for i in (_safe_id(x) for x in added) if i is not None]
    modified_ids = [i for i in (_safe_id(x) for x in modified) if i is not None]
    deleted_ids = [i for i in (_safe_id(x) for x in deleted) if i is not None]
    approx_fields_changed = sum(_modified_field_count(x) for x in modified)

    # keep logs short
    def _clip(xs: list[int], n: int = 12) -> list[int]:
        return xs[:n]

    return {
        "added": len(added),
        "modified": len(modified),
        "deleted": len(deleted),
        "approx_fields_changed": approx_fields_changed,
        "added_ids": _clip(added_ids),
        "modified_ids": _clip(modified_ids),
        "deleted_ids": _clip(deleted_ids),
    }


class PptWhiteAgentExecutor(AgentExecutor):
    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        user_input = context.get_user_input()
        tags = parse_tags(user_input)
        battle_id = tags.get("battle_id") or os.environ.get("AGENTBEATS_BATTLE_ID")

        benchmark_api_url = tags.get("benchmark_api_url") or os.getenv(
            "PPT_BENCHMARK_API_URL", "http://localhost:5050"
        )
        case_id = tags.get("case_id")
        white_agent_id = tags.get("white_agent_id") or os.getenv(
            "PPT_WHITE_AGENT_ID", "agentbeats-white"
        )

        if not case_id:
            msg = "White(PPT): Missing <case_id>."
            await event_queue.enqueue_event(new_agent_text_message(ensure_json_envelope(msg)))
            return

        print(f"White(PPT): handling case_id={case_id}")
        print(f"White(PPT): received case_id={case_id} benchmark_api_url={benchmark_api_url}")
        _post_agentbeats_event(
            battle_id=battle_id,
            message="White(PPT): Received case",
            reported_by="ppt_white_agent",
            detail={"case_id": case_id, "benchmark_api_url": benchmark_api_url},
        )

        # 1) fetch test data (prompt + datamodel)
        try:
            print(f"White(PPT): fetching datamodel via GET /scenarios/datamodel/{case_id} ...")
            with httpx.Client(timeout=60.0) as client:
                r = client.get(f"{benchmark_api_url}/scenarios/datamodel/{case_id}")
                r.raise_for_status()
                payload = r.json()
                prompt = payload.get("prompt", "")
                datamodel = payload.get("datamodel", {})
            print(f"White(PPT): fetched prompt len={len(str(prompt))} datamodel_keys={list(datamodel.keys()) if isinstance(datamodel, dict) else type(datamodel)}")
        except Exception as ex:
            msg = f"White(PPT): Failed to fetch case data: {ex}"
            _post_agentbeats_event(battle_id, msg, "ppt_white_agent")
            await event_queue.enqueue_event(new_agent_text_message(ensure_json_envelope(msg)))
            return

        # Extract first-slide shapes map to help constrain ids/types
        shapes = []
        if isinstance(datamodel, dict) and "slides" in datamodel and datamodel.get("slides"):
            try:
                shapes = datamodel["slides"][0].get("shapes", []) or []
            except Exception:
                shapes = []
        elif isinstance(datamodel, dict) and "shapes" in datamodel:
            shapes = datamodel.get("shapes") or []

        id_to_type: dict[int, str] = {}
        id_to_details: dict[int, dict] = {}
        for s in shapes:
            if not isinstance(s, dict):
                continue
            sid = s.get("id")
            try:
                sid_int = int(sid)
            except Exception:
                continue
            st = s.get("shapeType")
            if isinstance(st, str):
                id_to_type[sid_int] = st
            if isinstance(s.get("details"), dict):
                id_to_details[sid_int] = s["details"]

        # 2) ask LLM to produce changeset JSON
        model = _ppt_model()
        print(f"White(PPT): generating changeset with model={model} ...")
        user_msg = (
            "CASE_ID: "
            + str(case_id)
            + "\n\nINSTRUCTION:\n"
            + str(prompt)
            + "\n\nDATAMODEL (JSON):\n"
            + json.dumps(datamodel, ensure_ascii=False)
        )
        messages = [
            {"role": "system", "content": _ppt_system_prompt()},
            {"role": "user", "content": user_msg},
        ]

        try:
            resp = completion(
                messages=messages,
                model=model,
                custom_llm_provider=("litellm_proxy" if os.getenv("LITELLM_PROXY_API_KEY") else "openai"),
                temperature=0.0,
            )
            content = resp.choices[0].message["content"]  # type: ignore
            changeset = json.loads(content)
            if not isinstance(changeset, dict):
                raise ValueError("LLM did not return a JSON object")
            print("White(PPT): LLM returned changeset JSON.")
        except Exception as ex:
            msg = f"White(PPT): LLM failed ({model}): {ex}"
            _post_agentbeats_event(battle_id, msg, "ppt_white_agent")
            await event_queue.enqueue_event(new_agent_text_message(ensure_json_envelope(msg)))
            return

        changeset = _sanitize_changeset(changeset, id_to_type, id_to_details)
        summary = _summarize_changeset(changeset)
        print(
            "White(PPT): case summary "
            f"(case_id={case_id}): "
            f"added={summary['added']} modified={summary['modified']} deleted={summary['deleted']} "
            f"approx_fields_changed={summary['approx_fields_changed']} "
            f"modified_ids={summary['modified_ids']} deleted_ids={summary['deleted_ids']}"
        )

        # 3) submit changeset
        try:
            print(f"White(PPT): submitting changeset via POST /scenarios/submit-changeset (case_id={case_id}) ...")
            req_body = {
                "caseId": case_id,
                "whiteAgentId": white_agent_id,
                "changeset": json.dumps(changeset),
            }
            with httpx.Client(timeout=120.0) as client:
                r = client.post(f"{benchmark_api_url}/scenarios/submit-changeset", json=req_body)
                # Important: do NOT fall back to submitting an empty changeset.
                # If the benchmark server rejects the changeset (or detects it didn't apply),
                # we want that to surface as a hard failure so we don't accidentally record
                # an "ok" run with no changes applied.
                r.raise_for_status()
                status = "submitted"
                detail = {}
            print(f"White(PPT): submission status={status} case_id={case_id}")
        except Exception as ex:
            msg = f"White(PPT): Failed to submit changeset (case_id={case_id}): {ex}"
            _post_agentbeats_event(battle_id, msg, "ppt_white_agent")
            await event_queue.enqueue_event(new_agent_text_message(ensure_json_envelope(msg)))
            return

        _post_agentbeats_event(
            battle_id=battle_id,
            message="White(PPT): Submitted case",
            reported_by="ppt_white_agent",
            detail={"case_id": case_id, "status": status, **detail},
        )

        reply = {
            "name": RESPOND_ACTION_NAME,
            "kwargs": {"content": f"ok: {case_id} ({status})"},
        }
        await event_queue.enqueue_event(
            new_agent_text_message(f"<json>{json.dumps(reply)}</json>", context_id=context.context_id)
        )

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        # No long-running tasks to cancel in this simple executor.
        raise NotImplementedError()


def start_white_agent(
    agent_name: str = "ppt_white_agent", host: str = "localhost", port: int = 9002
) -> None:
    print(f"Starting white agent ({agent_name})...")
    # A2A AgentCard.url is required; default to local URL if not provided.
    card = prepare_white_agent_card(
        os.getenv("AGENT_URL") or f"http://{host}:{port}/",
        agent_name=agent_name,
    )
    request_handler = DefaultRequestHandler(
        agent_executor=PptWhiteAgentExecutor(),
        task_store=InMemoryTaskStore(),
    )
    app = A2AStarletteApplication(
        agent_card=card,
        http_handler=request_handler,
    )
    uvicorn.run(app.build(), host=host, port=port)
