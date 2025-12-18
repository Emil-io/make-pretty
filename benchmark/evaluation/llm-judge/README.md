# LLM-as-a-Judge Evaluation System

A two-agent system for evaluating presentation edits using Google's Gemini 2.5 Flash with vision capabilities.

## Overview

The LLM-as-a-Judge system provides automated evaluation of presentation edits by:
1. **Question Generator**: Analyzes the initial slide and task to create 1-10 evaluation questions
2. **Answer Evaluator**: Rates the result slide against generated questions with percentage scores

## Architecture

```
Initial Slide + Task Prompt
    ↓
[Question Generator Agent] → Generates 1-10 questions based on complexity
    ↓ (cached as Markdown)
Result Slide + Questions
    ↓
[Answer Evaluator Agent] → Rates each question 0-100%
    ↓
JSON Output with percentage scores
```

## Setup

### 1. Google Cloud Authentication

Choose one authentication method:

**Option A: API Key** (simpler, limited functionality)
```bash
# In benchmark/.env
GOOGLE_API_KEY=your-api-key-here
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

**Option B: Service Account** (recommended for production)
```bash
# In benchmark/.env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

**Option C: Application Default Credentials**
```bash
# Authenticate with gcloud CLI
gcloud auth application-default login

# In benchmark/.env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 2. Enable Required APIs

In Google Cloud Console, enable:
- Vertex AI API
- Generative Language API

## Usage

### Standalone Script

Run LLM judge independently for testing:

```bash
# Single test case
npm run llm-judge -- --case basic-shapes/test-12

# Entire scenario
npm run llm-judge -- --scenario basic-shapes

# Force regenerate questions (ignore cache)
npm run llm-judge -- --case basic-shapes/test-12 --regenerate

# Save results to file
npm run llm-judge -- --case basic-shapes/test-12 --output results.json

# Verbose output
npm run llm-judge -- --case basic-shapes/test-12 --verbose
```

### In Validation Tests

Add to your test's `validation.ts`:

```typescript
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Deterministic tests for exact measurements
    {
        name: "count_shapes",
        slideId: 268,
        filter: { autoShapeType: "roundRect" },
        expected: 4,
    },

    // LLM judge for visual/semantic validation
    {
        name: "llm_judge",
        description: "Evaluate task completion",
        slideId: 268,
        autoGenerate: true, // Default
    },
];
```

## Question Caching

Questions are automatically cached as Markdown files in each test directory:

**Location**: `scenarios/{scenario}/{test}/llm-judge-questions.md`

**Format**:
```markdown
---
slideId: 268
caseId: basic-shapes/test-12
taskPrompt: "Add a 4th box with black fill..."
generatedAt: "2025-11-26T10:30:00Z"
questionCount: 4
---

# LLM Judge Questions

## Question 1: q1
**Category**: structure
**Weight**: 1.0
**Question**: Are there exactly 4 rounded rectangle shapes?

## Question 2: q2
**Category**: layout
**Weight**: 1.0
**Question**: Is the 4th box positioned below the top 3?
...
```

**Benefits**:
- Human-readable and editable
- Version controlled with code
- Manually refinable if needed
- Automatically reused on subsequent runs

## Output Format

The system returns JSON with structured percentage scores:

```json
{
  "slideId": 268,
  "caseId": "basic-shapes/test-12",
  "questions": [...],
  "answers": [...],
  "questionScoresPercent": {
    "q1": 100.0,
    "q2": 95.0,
    "q3": 100.0,
    "q4": 85.0
  },
  "overallScorePercent": 95.0,
  "evaluatedAt": "2025-11-26T10:35:00Z"
}
```

This enables combining LLM judge scores with deterministic test scores:

```typescript
const deterministicScore = (passedTests / totalTests) * 100; // e.g., 85%
const llmScore = llmJudgeResult.overallScorePercent; // e.g., 92%
const combinedScore = (deterministicScore * 0.6) + (llmScore * 0.4); // Weighted
```

## How It Works

### Question Generation

The Question Generator agent:
1. Receives initial slide image (PNG) + datamodel + task prompt
2. Analyzes task complexity
3. Dynamically generates 1-10 questions:
   - Simple tasks (e.g., "align boxes") → 2-3 questions
   - Complex tasks (e.g., "create dashboard") → 7-10 questions
4. Categorizes questions: structure, content, formatting, layout, compliance
5. Caches questions as Markdown in test directory

### Answer Evaluation

The Answer Evaluator agent:
1. Receives result slide image (PNG) + questions + datamodel
2. For each question:
   - Analyzes visual appearance (from image)
   - Validates structure (from datamodel)
   - Assigns score 0-100% with reasoning
3. Calculates weighted overall score
4. Returns structured JSON output

### Scoring Guidelines

- **90-100%**: Perfectly meets criteria
- **70-89%**: Mostly correct, minor issues
- **50-69%**: Partially correct, significant issues
- **30-49%**: Mostly incorrect, few elements present
- **0-29%**: Completely incorrect or missing

## Key Features

1. **Dynamic Question Count**: LLM determines optimal number based on task complexity
2. **Always Uses Datamodel**: Both agents receive full structural information
3. **Markdown Caching**: Questions saved as human-readable files
4. **Automatic Cache Reuse**: No regeneration unless forced
5. **JSON Output**: Ready for integration with deterministic tests
6. **Gemini 2.5 Flash**: Fast, cost-effective vision-capable model

## Cost Optimization

- Questions cached per test case (only generated once)
- Slide snapshots cached within validation run
- Uses Gemini 2.5 Flash (cost-effective)
- Lazy initialization of LLM clients

**Estimated cost**: ~$0.05-0.15 per test case

## Troubleshooting

### Authentication Errors

```
Error: Could not load the default credentials
```

**Solution**: Set up one of the authentication methods above.

### API Not Enabled

```
Error: Vertex AI API has not been used in project...
```

**Solution**: Enable Vertex AI API in Google Cloud Console.

### Invalid Project ID

```
Error: Project 'your-project-id' not found
```

**Solution**: Set correct `GOOGLE_CLOUD_PROJECT` in `.env` file.

## Files Structure

```
benchmark/evaluation/llm-judge/
├── agents/
│   ├── types.ts                  # Type definitions
│   ├── question-generator.ts     # Agent 1: Generate questions
│   └── answer-evaluator.ts       # Agent 2: Evaluate answers
├── utils/
│   ├── snapshot-service.ts       # Slide snapshot wrapper
│   ├── image-converter.ts        # PNG ↔ base64
│   ├── prompt-templates.ts       # System prompts
│   └── cache.ts                  # Markdown cache I/O
├── index.ts                      # Main orchestrator
└── README.md                     # This file
```

## Development

### Adding New Question Categories

Edit `agents/types.ts`:

```typescript
export type QuestionCategory =
    | "structure"
    | "content"
    | "formatting"
    | "layout"
    | "compliance"
    | "your-new-category"; // Add here
```

### Customizing System Prompts

Edit `utils/prompt-templates.ts`:

```typescript
export const QUESTION_GENERATOR_SYSTEM_PROMPT_V2 = `
Your custom prompt here...
`;
```

Then update the agents to use the new version.

### Adjusting Pass Threshold

In `validation/llm-judge.test.ts`:

```typescript
const passThreshold = 70; // Change this value
```

## License

Part of the MakePretty/BigSure project.
