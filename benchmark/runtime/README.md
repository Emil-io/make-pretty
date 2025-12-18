# Benchmark Runtime API

API for running and evaluating PowerPoint changeset benchmarks.

## Running

```bash
cd benchmark
npm run start    # Production mode
npm run dev      # Watch mode (auto-reload)
```

Server runs on **port 5050**.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scenarios` | List all test case IDs |
| GET | `/scenarios/datamodel/:caseId` | Get datamodel + prompt for a test case |
| POST | `/scenarios/submit-changeset` | Submit a changeset, inject into pptx, extract result |
| GET | `/scenarios/results/:whiteAgentId` | Validate all results for an agent |
| POST | `/scenarios/restart` | Clear all generated files |

## Endpoint Details

### GET `/scenarios`

Returns all available test case IDs.

```json
{ "ids": ["basic-shapes-test-1", "pptc-test-25a", ...] }
```

### GET `/scenarios/datamodel/:caseId`

Returns the datamodel and prompt for a test case. If `datamodel.json` doesn't exist, it will be auto-generated from `pres.pptx`.

```json
{
  "caseId": "basic-shapes-test-1",
  "datamodel": { ... },
  "prompt": "Align the three shapes horizontally..."
}
```

### POST `/scenarios/submit-changeset`

Submit a changeset to be applied to a presentation.

**Request body:**
```json
{
  "caseId": "basic-shapes-test-1",
  "whiteAgentId": "my-agent-v1",
  "changeset": "{ ... }"  // JSON string
}
```

**Flow:**
1. Validates changeset against schema
2. Injects changeset into the source `pres.pptx`
3. Saves modified pptx to `__generated__/{caseId}_{whiteAgentId}_injected.pptx`
4. Extracts datamodel from modified pptx
5. Saves datamodel to `__generated__/{caseId}:::{whiteAgentId}.json`

### GET `/scenarios/results/:whiteAgentId`

Validates all submitted results for an agent against their test assertions.

```json
{
  "whiteAgentId": "my-agent-v1",
  "score": 83.3,
  "totalTests": 6,
  "totalPassed": 5,
  "totalFailed": 1,
  "tests": [
    {
      "caseId": "basic-shapes-test-1",
      "success": false,
      "passed": 5,
      "failed": 1,
      "errors": [{ "testName": "equal_spacing", "message": "..." }]
    }
  ]
}
```

### POST `/scenarios/restart`

Clears all files in `__generated__/` folder.

## Folder Structure

```
benchmark/
  scenarios/
    {scenario}/           # e.g., "basic-shapes", "pptc"
      {test}/             # e.g., "test-1", "test-25a"
        pres.pptx         # Source presentation
        prompt.md         # Task prompt for the agent
        datamodel.json    # Auto-generated from pres.pptx if missing
        validation.ts     # Test assertions (exports `Test`)
  __generated__/          # Output folder
    {caseId}:::{agentId}.json    # Extracted datamodels
    {caseId}_{agentId}_injected.pptx  # Modified presentations
  runtime/
    server.ts             # Express server entry point
    routes.ts             # API route definitions
    service.ts            # Business logic
    scenarios.ts          # File system operations
```

## Test Assertions

Each test case should have a `validation.ts` file that exports a `Test` array:

```typescript
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
  {
    name: "all_are_equal",
    description: "Y-coordinate alignment",
    objects: [
      { slideId: 257, shapeId: 4, key: "pos.topLeft[1]" },
      { slideId: 257, shapeId: 5, key: "pos.topLeft[1]" },
    ],
  },
  {
    name: "within_boundaries",
    slideId: 257,
    minMargin: 10,
  },
];
```

### Available Test Types

- `equals` / `not_equals` - Compare a value against expected
- `all_are_equal` / `some_are_equal` / `none_are_equal` - Compare multiple objects
- `greater_than` / `less_than` / `greater_than_or_equal` / `less_than_or_equal` - Numerical comparisons
- `includes` / `not_includes` - Check if value contains substring
- `count_slides` / `count_shapes` - Count elements
- `within_boundaries` - Check shapes are within slide margins
- `equal_spacing` - Check equal spacing between shapes
- `llm_judge` - LLM-based evaluation
