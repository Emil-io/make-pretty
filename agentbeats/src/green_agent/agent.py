"""Green agent implementation - manages assessment and evaluation."""

import json
import os
import httpx
import random
from datetime import datetime
from typing import Any

import dotenv
import tomllib
import uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCard, SendMessageSuccessResponse, Message
from a2a.utils import new_agent_text_message, get_text_parts
from src.my_util import parse_tags, my_a2a

# Note: This repo originally contained a tau-bench demo. We keep only the PowerPoint
# benchmark implementation here; tau-bench code paths have been removed.

dotenv.load_dotenv()


def load_agent_card_toml(agent_name: str) -> dict[str, Any]:
    current_dir = __file__.rsplit("/", 1)[0]
    with open(f"{current_dir}/{agent_name}.toml", "rb") as f:
        return tomllib.load(f)


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
        # best-effort only
        pass


def _case_difficulty(case_id: object) -> str:
    """
    Infer difficulty bucket from scenario id suffix.

    Examples:
    - basic-shapes-test-1-simple -> simple
    - pptc-test-37c-medium -> medium
    - pptc-test-10d-complex -> hard
    """
    if not isinstance(case_id, str):
        return "unknown"
    cid = case_id.lower()
    if cid.endswith("-simple"):
        return "simple"
    if cid.endswith("-medium"):
        return "medium"
    # The scenario list uses "-complex" for the hardest bucket.
    if cid.endswith("-complex") or cid.endswith("-hard"):
        return "hard"
    return "unknown"


def _select_cases_with_mix(ids: list[str], num_cases: int) -> list[str]:
    """
    Select cases using a target difficulty mix.

    For a 10-case run, target is: 7 simple, 2 medium, 1 hard.
    If a bucket doesn't have enough cases, backfill from the remaining pool.
    """
    if not ids or num_cases <= 0:
        return []

    k = min(num_cases, len(ids))

    # Default: preserve existing behavior unless the run is exactly 10 cases.
    if k != 10:
        return random.sample(ids, k)

    buckets: dict[str, list[str]] = {"simple": [], "medium": [], "hard": [], "unknown": []}
    for cid in ids:
        buckets[_case_difficulty(cid)].append(cid)

    targets: dict[str, int] = {"simple": 7, "medium": 2, "hard": 1}
    chosen: list[str] = []
    for key in ("simple", "medium", "hard"):
        want = targets[key]
        pool = buckets.get(key, [])
        if want <= 0 or not pool:
            continue
        take = min(want, len(pool))
        picked = random.sample(pool, take)
        chosen.extend(picked)

    # Backfill if any bucket was short (or if lots were "unknown").
    if len(chosen) < k:
        remaining = [cid for cid in ids if cid not in set(chosen)]
        chosen.extend(random.sample(remaining, min(k - len(chosen), len(remaining))))

    # Ensure exact k (defensive in case of duplicates).
    return chosen[:k]


###
# (tau-bench green-agent implementation removed)
###


class PptGreenAgentExecutor(AgentExecutor):
    """
    Green agent for the PowerPoint benchmark.

    Flow:
    - POST /scenarios/restart
    - GET /scenarios -> choose N random
    - For each case: send caseId to white agent via A2A (white handles fetch + submit)
    - GET /scenarios/results/:whiteAgentId and report
    """

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        user_input = context.get_user_input()
        tags_all = parse_tags(user_input)
        battle_id = tags_all.get("battle_id") or os.environ.get("AGENTBEATS_BATTLE_ID")

        white_agent_url = tags_all.get("white_agent_url") or os.getenv("WHITE_AGENT_URL")
        if not white_agent_url:
            msg = "Green(PPT): Missing <white_agent_url> tag and WHITE_AGENT_URL not set"
            _post_agentbeats_event(battle_id, msg, "ppt_green_agent")
            await event_queue.enqueue_event(new_agent_text_message(msg))
            return

        benchmark_api_url = tags_all.get("benchmark_api_url") or os.getenv(
            "PPT_BENCHMARK_API_URL", "http://localhost:5050"
        )
        white_agent_id = tags_all.get("white_agent_id") or os.getenv(
            "PPT_WHITE_AGENT_ID", "agentbeats-white"
        )
        num_cases_raw = tags_all.get("num_cases") or os.getenv("PPT_NUM_CASES", "10")
        try:
            num_cases = max(1, int(num_cases_raw))
        except Exception:
            num_cases = 10

        print(
            f"Green(PPT): starting; benchmark_api_url={benchmark_api_url} white_agent_url={white_agent_url} "
            f"white_agent_id={white_agent_id} num_cases={num_cases}"
        )
        _post_agentbeats_event(
            battle_id=battle_id,
            message="Green(PPT): Starting evaluation",
            reported_by="ppt_green_agent",
            detail={
                "benchmark_api_url": benchmark_api_url,
                "white_agent_url": white_agent_url,
                "white_agent_id": white_agent_id,
                "num_cases": num_cases,
            },
        )

        async with httpx.AsyncClient(timeout=60.0) as client:
            # 1) restart
            try:
                print("Green(PPT): resetting benchmark suite via POST /scenarios/restart ...")
                await client.post(f"{benchmark_api_url}/scenarios/restart")
                print("Green(PPT): reset complete.")
                _post_agentbeats_event(
                    battle_id=battle_id,
                    message="Green(PPT): Restarted benchmark (cleared generated files)",
                    reported_by="ppt_green_agent",
                )
            except Exception as ex:
                msg = f"Green(PPT): Failed to restart benchmark: {ex}"
                _post_agentbeats_event(battle_id, msg, "ppt_green_agent")
                await event_queue.enqueue_event(new_agent_text_message(msg))
                return

            # 2) list tests
            try:
                print("Green(PPT): fetching all test case ids via GET /scenarios ...")
                resp = await client.get(f"{benchmark_api_url}/scenarios")
                resp.raise_for_status()
                ids = resp.json().get("ids", [])
                if not isinstance(ids, list) or not ids:
                    raise ValueError("No scenario ids returned")
                print(f"Green(PPT): got {len(ids)} test case ids.")
            except Exception as ex:
                msg = f"Green(PPT): Failed to fetch scenarios: {ex}"
                _post_agentbeats_event(battle_id, msg, "ppt_green_agent")
                await event_queue.enqueue_event(new_agent_text_message(msg))
                return

        chosen = _select_cases_with_mix(ids, num_cases)
        print(f"Green(PPT): selected {len(chosen)} cases: {chosen}")
        _post_agentbeats_event(
            battle_id=battle_id,
            message="Green(PPT): Selected cases",
            reported_by="ppt_green_agent",
            detail={
                "selected": chosen,
                "difficulty_counts": {
                    "simple": sum(1 for c in chosen if _case_difficulty(c) == "simple"),
                    "medium": sum(1 for c in chosen if _case_difficulty(c) == "medium"),
                    "hard": sum(1 for c in chosen if _case_difficulty(c) == "hard"),
                    "unknown": sum(1 for c in chosen if _case_difficulty(c) == "unknown"),
                },
            },
        )

        # 3) dispatch one-by-one to white agent (A2A)
        context_id = None
        results_local: list[dict] = []
        for idx, case_id in enumerate(chosen, start=1):
            print(
                f"Green(PPT): sending test case {idx}/{len(chosen)} case_id={case_id} -> {white_agent_url}"
            )
            task_text = f"""
You are the white agent for the PowerPoint benchmark.
Handle exactly one case, then respond with a short status.

<benchmark_api_url>
{benchmark_api_url}
</benchmark_api_url>
<case_id>
{case_id}
</case_id>
<white_agent_id>
{white_agent_id}
</white_agent_id>
<battle_id>
{battle_id or ''}
</battle_id>
            """.strip()

            _post_agentbeats_event(
                battle_id=battle_id,
                message=f"Green(PPT): Sending case {idx}/{len(chosen)} to white",
                reported_by="ppt_green_agent",
                detail={"case_id": case_id},
            )

            try:
                white_agent_response = await my_a2a.send_message(
                    white_agent_url, task_text, context_id=context_id
                )
                res_root = white_agent_response.root
                assert isinstance(res_root, SendMessageSuccessResponse)
                res_msg = res_root.result
                assert isinstance(res_msg, Message)
                if context_id is None:
                    context_id = res_msg.context_id
                text_parts = get_text_parts(res_msg.parts)
                white_text = text_parts[0] if text_parts else ""
                print(
                    f"Green(PPT): received submission for case_id={case_id} "
                    f"(white_reply_preview={white_text[:120]!r})"
                )
                results_local.append({"case_id": case_id, "white_reply": white_text[:800]})
                _post_agentbeats_event(
                    battle_id=battle_id,
                    message=f"Green(PPT): White replied for {case_id}",
                    reported_by="ppt_green_agent",
                    detail={"reply_preview": white_text[:400]},
                )
            except Exception as ex:
                print(f"Green(PPT): ERROR from white for {case_id}: {ex}")
                results_local.append({"case_id": case_id, "white_error": str(ex)})
                _post_agentbeats_event(
                    battle_id=battle_id,
                    message=f"Green(PPT): White failed for {case_id}",
                    reported_by="ppt_green_agent",
                    detail={"error": str(ex)},
                )

        # 4) evaluate: fetch server-side results for this white_agent_id
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                print(f"Green(PPT): fetching evaluation via GET /scenarios/results/{white_agent_id} ...")
                resp = await client.get(f"{benchmark_api_url}/scenarios/results/{white_agent_id}")
                resp.raise_for_status()
                evaluation = resp.json()
                # Print a concise end-of-run evaluation line for terminal visibility.
                score = evaluation.get("score") if isinstance(evaluation, dict) else None
                total_passed = evaluation.get("totalPassed") if isinstance(evaluation, dict) else None
                total_failed = evaluation.get("totalFailed") if isinstance(evaluation, dict) else None
                if isinstance(score, (int, float)):
                    print(
                        f"Green(PPT): evaluation fetched (white_agent_id={white_agent_id}) "
                        f"score={score:.1f}% assertions_passed={total_passed} assertions_failed={total_failed}"
                    )
                else:
                    print(f"Green(PPT): evaluation fetched (white_agent_id={white_agent_id}).")
            except Exception as ex:
                evaluation = {"error": f"Failed to fetch results: {ex}"}

        markdown = (
            "## PowerPoint Benchmark Results\n\n"
            f"- **white_agent_id**: `{white_agent_id}`\n"
            f"- **num_cases_requested**: {num_cases}\n"
            f"- **num_cases_dispatched**: {len(chosen)}\n\n"
            "### Selected cases\n"
            + "\n".join([f"- `{c}`" for c in chosen])
            + "\n\n"
            "### White agent per-case status (preview)\n"
            + "\n".join(
                [
                    f"- `{r.get('case_id')}`: {('ERR ' + r.get('white_error')) if r.get('white_error') else r.get('white_reply','')[:120]}"
                    for r in results_local
                ]
            )
            + "\n\n"
            "### Evaluation\n"
            f"```json\n{json.dumps(evaluation, indent=2)}\n```\n"
        )
        _post_agentbeats_event(
            battle_id=battle_id,
            message="Green(PPT): Evaluation complete",
            reported_by="ppt_green_agent",
            markdown_content=markdown[:10000],
            detail={"selected_cases": chosen},
            is_result=True,
        )
        # Return a short summary to the caller (full JSON is posted to AgentBeats backend).
        try:
            score = evaluation.get("score") if isinstance(evaluation, dict) else None
            if isinstance(score, (int, float)):
                summary = f"PowerPoint benchmark score (assertions) for `{white_agent_id}`: {score:.1f}%"
            else:
                summary = f"PowerPoint benchmark score (assertions) for `{white_agent_id}`: unavailable"
        except Exception as _:
            summary = f"PowerPoint benchmark score (assertions) for `{white_agent_id}`: unavailable"

        await event_queue.enqueue_event(new_agent_text_message(summary))

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        raise NotImplementedError()


def start_green_agent(
    agent_name: str = "ppt_green_agent", host: str = "localhost", port: int = 9001
) -> None:
    print(f"Starting green agent ({agent_name})...")
    agent_card_dict = load_agent_card_toml(agent_name)

    # # without controller
    # url = f"http://{host}:{port}"
    # agent_card_dict["url"] = url  # complete all required card fields

    # A2A AgentCard.url is required; default to local URL if not provided.
    agent_card_dict["url"] = os.getenv("AGENT_URL") or f"http://{host}:{port}/"

    agent_executor: AgentExecutor
    # Only PowerPoint benchmark green agent supported in this repo now.
    agent_executor = PptGreenAgentExecutor()

    request_handler = DefaultRequestHandler(
        agent_executor=agent_executor,
        task_store=InMemoryTaskStore(),
    )

    app = A2AStarletteApplication(
        agent_card=AgentCard(**agent_card_dict),
        http_handler=request_handler,
    )

    uvicorn.run(app.build(), host=host, port=port)
