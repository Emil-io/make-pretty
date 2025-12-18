# Agentify Example: Tau-Bench

Example code for agentifying Tau-Bench using A2A and MCP standards.

## Project Structure

```
src/
├── green_agent/    # Assessment manager agent
├── white_agent/    # Target agent being tested
└── launcher.py     # Evaluation coordinator
```

## Installation

```bash
uv sync
```

## Usage

### 1) Forward the Cloudflare tunnels (public URLs)

Before starting the agents, forward two Cloudflare tunnels (one per agent). Run these in two separate terminals:

```bash
cloudflared tunnel --url http://localhost:8010
cloudflared tunnel --url http://localhost:8020
```

Each command will print a public URL like `https://<something>.trycloudflare.com`.

- That public URL must match the agent’s advertised URL (A2A `AgentCard.url`), via `AGENT_URL`.
- If you’re using a wrapper that expects `CLOUDRUN_HOST`, set it to the tunnel hostname (the `<something>.trycloudflare.com` part) for the matching agent.

### 2) Start the agents (after tunnels are up)

You **must** provide an `OPENAI_API_KEY` (do not commit it). The agents are started from different dirs:

#### Green agent (start from `agentbeats/a1`)

```bash
cd agentbeats/a1

OPENAI_API_KEY=... \
HTTPS_ENABLED=true \
CLOUDRUN_HOST="<green-tunnel>.trycloudflare.com" \
ROLE=green \
HOST=0.0.0.0 \
AGENT_PORT=8010 \
AGENT_URL="https://<green-tunnel>.trycloudflare.com/" \
WHITE_AGENT_URL="https://<white-tunnel>.trycloudflare.com/" \
uv run python main.py run
```

#### White agent (start from `agentbeats/a2`)

```bash
cd agentbeats/a2

OPENAI_API_KEY=... \
HTTPS_ENABLED=true \
CLOUDRUN_HOST="<white-tunnel>.trycloudflare.com" \
ROLE=white \
HOST=0.0.0.0 \
AGENT_PORT=8020 \
AGENT_URL="https://<white-tunnel>.trycloudflare.com/" \
uv run python main.py run
```

### 3) Run the evaluation

From `agentbeats/` you can either run locally (spawns both agents on localhost), or run against the remote/tunneled URLs:

```bash
cd agentbeats

# Local (spawns green+white on localhost:9001/9002)
uv run python main.py launch

# Remote (uses your tunnel URLs)
uv run python main.py launch_remote "https://<green-tunnel>.trycloudflare.com/" "https://<white-tunnel>.trycloudflare.com/"
```
