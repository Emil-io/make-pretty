# White Agents

This directory contains white-box agents for PowerPoint changeset generation and testing.

## Directory Structure

```
white-agents/
├── agents/              # Agent implementations
│   └── default-agent/   # Default LangGraph agent
│       └── agent.ts
├── runtime/             # Test runtime infrastructure
│   └── white-agent-runner.ts
└── functional/          # Functional agents (e.g., alignment-agent)
```

## Architecture

### Agent Interface

All agents must implement the `Agent` interface:

```typescript
export interface Agent {
    /**
     * Generate a changeset for the given test case
     */
    generateChangeset(
        datamodel: any,
        userPrompt: string,
        systemPrompt: string,
    ): Promise<any>;

    /**
     * Get the agent's name for logging
     */
    getName(): string;
}
```

### PowerPoint API

Agents receive a `WhiteAgentPPApi` instance through their constructor, which provides:

- `extractDatamodel(presentationPath: string)`: Extract structured data from PowerPoint files
- `injectChangeset(presentationPath: string, changeset: any, outputPath: string)`: Inject changesets into presentations

This allows agents to interact with PowerPoint files during their execution.

### WhiteAgentRunner

The `WhiteAgentRunner` class provides the test infrastructure:

- Test case discovery and filtering
- Datamodel extraction from PowerPoint files
- Changeset injection and validation
- Result tracking and reporting
- Output directory management

### Creating a New Agent

1. Create a new directory under `agents/`:
   ```
   agents/
   └── my-agent/
       └── agent.ts
   ```

2. Implement the `Agent` interface:
   ```typescript
   import { Agent, WhiteAgentPPApi } from "../../runtime/index.js";

   export class MyAgent implements Agent {
       private ppApi: WhiteAgentPPApi;

       constructor(ppApi: WhiteAgentPPApi) {
           this.ppApi = ppApi;
       }

       getName(): string {
           return "My Custom Agent";
       }

       async generateChangeset(
           datamodel: any,
           userPrompt: string,
           systemPrompt: string,
       ): Promise<any> {
           // Your implementation here
           // You can use this.ppApi.extractDatamodel() and this.ppApi.injectChangeset()
           // during the agent's execution if needed
       }
   }
   ```

3. Export from index (optional):
   ```typescript
   // agents/index.ts
   export { MyAgent } from "./my-agent/agent.js";
   ```

4. Create a test file in `scenarios/` or update the existing one:
   ```typescript
   import { MyAgent } from "../white-agents/agents/index.js";
   import { WhiteAgentPPApi, WhiteAgentRunner } from "../white-agents/runtime/index.js";

   // 1. Create PowerPoint API service
   const ppApi = new WhiteAgentPPApi();

   // 2. Create agent with PowerPoint API
   const agent = new MyAgent(ppApi);

   // 3. Create runner with agent and PowerPoint API
   const runner = new WhiteAgentRunner(agent, ppApi, {
       systemPromptName: "prompt",
       scenarioFilter: null,
       caseFilter: null,
   });

   await runner.runAllTests();
   ```

## Running Tests

### Run all tests (default: dummy agent)
```bash
npx vitest run benchmark/scenarios/scenario.test.ts
```

### Select a specific agent
```bash
# Run with dummy agent (default)
AGENT=dummy npx vitest run benchmark/scenarios/scenario.test.ts

# Run with default agent (LangGraph + OpenAI)
AGENT=default npx vitest run benchmark/scenarios/scenario.test.ts
```

Available agents:
- `dummy` (default): Fast, no AI, empty changesets
- `default`: LangGraph + OpenAI GPT-5-mini
- `functional`: Supervisor-based multi-agent system

### Filter by scenario
```bash
SCENARIO=basic-shapes npx vitest run benchmark/scenarios/scenario.test.ts
```

### Filter by specific case
```bash
SCENARIO=basic-shapes CASE=test-1 npx vitest run benchmark/scenarios/scenario.test.ts
```

### Use a different system prompt
```bash
SYS_PROMPT=prompt-v2 npx vitest run benchmark/scenarios/scenario.test.ts
```

### Combine options
```bash
# Run default agent with specific scenario and custom prompt
AGENT=default SCENARIO=basic-shapes SYS_PROMPT=prompt-v2 npx vitest run benchmark/scenarios/scenario.test.ts

# Run dummy agent for fast infrastructure testing
AGENT=dummy SCENARIO=basic-shapes CASE=test-1 npx vitest run benchmark/scenarios/scenario.test.ts
```

## Available Agents

### Default Agent

The `default-agent` uses:
- **LangGraph** for agentic workflow
- **OpenAI GPT-5-mini** for changeset generation
- **Alignment tool** for layout calculations

Configuration can be modified in `agents/default-agent/agent.ts`:
```typescript
const AI_MODEL = "gpt-5-mini"; // <-- EDIT HERE
const REASONING_EFFORT = undefined; // <-- EDIT HERE
```

### Dummy Agent

The `dummy-agent` is a simple test agent that:
- Always returns an empty changeset
- No AI costs or delays
- Useful for testing infrastructure

Usage example:
```typescript
import { DummyAgent } from "../white-agents/agents/index.js";
import { WhiteAgentPPApi, WhiteAgentRunner } from "../white-agents/runtime/index.js";

const ppApi = new WhiteAgentPPApi();
const agent = new DummyAgent(ppApi);
const runner = new WhiteAgentRunner(agent, ppApi, config);
await runner.runAllTests();
```

### Function-Specific Agent

The `functional-agent` is a supervisor-based multi-agent system:
- Uses a supervisor to route tasks to specialized agents
- **AlignmentAgent**: Handles layout, positioning, and alignment
- **CopywriterAgent**: Handles content generation
- **StylingAgent**: Handles visual styling
- Intelligent task routing based on request analysis

Usage example:
```bash
# Run with function-specific agent
AGENT=functional npx vitest run benchmark/scenarios/scenario.test.ts
```

## Functional Agents

The `functional/` directory contains specialized agents:

- **alignment-agent**: Focuses on shape alignment and layout operations
  - See `functional/alignment-agent/agent.ts` for implementation
  - Has its own changeset schema and mapper functions

## Test Results

Test results are stored in:
- `scenarios/<scenario-name>/__generated__/run-<timestamp>/`
  - `_summary.md`: Test summary and statistics
  - `_sys-prompt.md`: System prompt used
  - `_master-analysis.md`: Master analysis document
  - `_changeset-schema.yaml`: Changeset schema
  - `result_<case-id>.pptx`: Generated presentation
  - `result_cs_<case-id>.json`: Generated changeset
  - `result_err_<case-id>.json`: Error details (if failed)

## Agent Development Tips

1. **Context Management**: Schema and analysis context can be set via `setContext()` if your agent needs it
2. **Error Handling**: The runner handles errors gracefully - focus on changeset generation logic
3. **Logging**: Use console.log for debugging - all output is captured in test results
4. **Testing**: Run with `CASE=test-1` to test a single case while developing
5. **Validation**: The runner automatically validates changeset injection success

