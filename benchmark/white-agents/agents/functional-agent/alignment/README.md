# Alignment Agent

## Overview

The alignment agent is designed with a focused purpose: **to handle only the alignment and positioning of shapes**, _not_ their styling, text, or other properties. To achieve this, our codebase establishes a two-layered system:

1. **Changeset Schemas (Minified/Specialized Models):**
    - We define specialized models for the alignment agent, often excluding properties related to styling, text, borders, and other non-alignment fields.
    - This ensures the alignment agent receives only the minimal data it needs, reducing complexity and preventing accidental updates to non-alignment attributes.

2. **Mappings Between Full and Minified Models:**
    - When changes (from the agent) need to be propagated to the main application, we use explicit mappings to translate alignment-only changes back onto the full datamodel.
    - This separation creates a clear boundary: the agent can't affect styling, colors, or text by mistake.

## Why This Architecture?

- **Safety:** Prevents the alignment agent from inadvertently modifying properties it shouldn't touch, like fill color or font.
- **Efficiency:** Smaller, focused models are easier to process and validate for the agent.
- **Clarity:** By separating alignment-specific code and data, our intentions are explicit and the system is easier to maintain.

**Summary:**  
The split between changeset and full datamodel is intentional and essential. The alignment agent interacts only with a trimmed-down set of shape data. All updates are guaranteed to be restricted to alignment properties, thereby preserving the integrity of all styling and text settings.

## Configuration

The alignment agent's model configuration is defined in `config.toml`. This file controls:
- Model name (e.g., "gpt-5")
- Reasoning effort level ("minimal", "low", "medium", "high")
- Verbosity settings ("low", "medium", "high")

Example configuration:
```toml
[model]
name = "gpt-5"
verbosity = "low"
verbose = false

[model.reasoning]
effort = "medium"
```

## Changeset Schema

The changeset schema definitions for the PowerPoint Alignment Agent are located in the `changeset/schemas/` directory.

### Generated Schema

The YAML schema file is auto-generated and located at `changeset/__generated__/changeset-schema.yaml`.

### Regenerate Schema

To regenerate the schema, run:

```bash
# From project root
npx tsx benchmark/white-agents/agents/functional-agent/alignment/scripts/generate-schema.ts

# Or from the alignment directory
cd benchmark/white-agents/agents/functional-agent/alignment
npx tsx scripts/generate-schema.ts
```

This will generate the `changeset-schema.yaml` file based on the TypeScript schema definitions in the `changeset/schemas/` directory.
