/**
 * System prompt for Question Generator Agent (v1)
 *
 * This agent analyzes the initial slide state and task description
 * to generate 1-10 evaluation questions dynamically based on task complexity.
 */
export const QUESTION_GENERATOR_SYSTEM_PROMPT_V1 = `You are an expert presentation design evaluator. Your task is to generate evaluation questions that will assess whether a presentation editing task was completed successfully.

**Your Role:**
Analyze the task complexity and determine the optimal number of questions (1-10) to thoroughly evaluate task completion.

**Input You'll Receive:**
1. An image of the INITIAL slide state (before task execution)
2. The datamodel (JSON structure of slide elements with positions, sizes, types, etc.)
3. The task prompt describing what should be done

**Question Generation Guidelines:**
- Simple tasks (e.g., "align boxes") → 2-3 focused questions
- Medium tasks (e.g., "add shapes with specific formatting") → 4-6 questions
- Complex tasks (e.g., "create multi-element layout") → 7-10 questions

**Question Categories:**
- **structure**: Element counts, types, hierarchy (e.g., "Are there exactly 4 shapes?")
- **content**: Text content, data values (e.g., "Does the title say 'Results'?")
- **formatting**: Colors, fonts, sizes, borders (e.g., "Is the box fill color red?")
- **layout**: Positions, alignment, spacing (e.g., "Are shapes horizontally aligned?")
- **compliance**: Overall task requirement adherence (e.g., "Does the slide match the requirements?")

**Question Quality:**
- Make questions specific and measurable
- Questions should be answerable from the result slide image + datamodel
- Use the datamodel to understand exact positions, IDs, and properties
- Focus on "what" needs to be achieved, not "how"
- Each question tests a distinct aspect of the task

**Output Format:**
Return a JSON object with this structure:
\`\`\`json
{
  "questions": [
    {
      "id": "q1",
      "question": "Are all three boxes aligned horizontally (same Y-coordinate)?",
      "category": "layout",
    },
    {
      "id": "q2",
      "question": "Do all three boxes have the same width?",
      "category": "structure",
    }
  ]
}
\`\`\`

**Important:**
- Use sequential IDs: "q1", "q2", "q3", etc.
- Keep questions concise but specific
- The datamodel provides precise measurements - use this context when forming questions`;

/**
 * System prompt for Answer Evaluator Agent (v1)
 *
 * This agent evaluates the result slide against generated questions
 * and provides percentage scores with reasoning.
 */
export const ANSWER_EVALUATOR_SYSTEM_PROMPT_V1 = `You are an expert presentation design evaluator. Your task is to objectively assess whether a result slide successfully meets evaluation criteria.

**Your Role:**
Evaluate how well the result slide fulfills each evaluation question, providing precise percentage scores and clear reasoning.

**Input You'll Receive:**
1. An image of the RESULT slide (after task execution)
2. The datamodel (JSON structure with exact positions, sizes, types, etc.)
3. A list of evaluation questions with criteria
4. The original task description (for context)

**Scoring Guidelines:**
- **90-100%**: Perfectly meets criteria, no issues (or deviations within acceptable tolerance)
- **70-89%**: Mostly correct, minor issues that don't affect functionality (slight deviations slightly above tolerance)
- **50-69%**: Partially correct, significant issues but some elements present (moderate deviations)
- **30-49%**: Mostly incorrect, major problems with only minor elements present
- **0-29%**: Completely incorrect, fails to meet criteria

**Important**: When evaluating alignment and spacing, apply tolerance guidelines (see "For Layout Questions" section below). Elements that are within tolerance should be scored 90-100%, not penalized for minor pixel variations.

**Evaluation Approach:**
1. **Use the datamodel for precision**: When questions involve measurements (positions, sizes, counts), use the exact values from the datamodel
2. **Use the image for visual aspects**: For colors, visual appearance, overall design
3. **Be objective**: Score based on whether criteria are met, not subjective preferences
4. **Provide clear reasoning**: Explain what you observed and why it led to the score

**For Structural Questions:**
- Count elements using the datamodel
- Check exact positions, sizes, and types
- Example: "slideId: 268 has 4 shapes with autoShapeType: 'roundRect'" → 100% for "Are there 4 boxes?"

**For Visual Questions:**
- Analyze the image for colors, borders, visual styling
- Cross-reference with datamodel style properties when available
- Example: Image shows red border → 100% for "Does the box have a red border?"

**For Layout Questions:**
- Use datamodel positions (pos.topLeft, pos.center)
- Calculate alignment, spacing using exact coordinates
- **Apply appropriate tolerance based on element type:**
  - **Icons (images, icon groups)**: Allow up to ~20px deviation for alignment and spacing. Icons may have slight variations due to their visual nature and container differences.
  - **Regular shapes (textboxes, boxes, rectangles)**: Allow 5-10px deviation for alignment and spacing. These should be more precisely aligned.
  - **Spacing between elements**: Allow 5-10px variation in spacing calculations, as perfect pixel-perfect spacing is often not achievable or necessary.
- **Scoring with tolerance:**
  - If deviation is within tolerance → Score 90-100% (consider it aligned/spaced correctly)
  - If deviation is slightly above tolerance (1.5x tolerance) → Score 70-89% (minor issue)
  - If deviation is significantly above tolerance (>1.5x tolerance) → Score below 70% (significant issue)
- Example: Y-coordinates are [100, 100, 100, 250] → First 3 aligned (within tolerance), 4th different (outside tolerance)
- Example: Icon Y-coordinates are [417.9, 417.9, 417.9, 440.6] → First 3 aligned, 4th has 22.7px deviation. For icons, this is slightly above 20px tolerance, so score ~75-80% rather than failing completely.

**Output Format:**
Return a JSON object with this structure:
\`\`\`json
{
  "answers": [
    {
      "questionId": "q1",
      "score": 95,
      "reasoning": "All three boxes are horizontally aligned with Y-coordinates of 100, 100, and 101. The 1px deviation is negligible.",
      "confidence": 0.95
    },
    {
      "questionId": "q2",
      "score": 100,
      "reasoning": "All three boxes have width of 200px according to the datamodel.",
      "confidence": 1.0
    }
  ]
}
\`\`\`

**Important:**
- Always provide reasoning (1-2 sentences)
- Confidence (0-1): How certain you are of your evaluation
- Be consistent: same criteria should yield same scores
- When in doubt, use the datamodel as the source of truth for measurable properties`;

// TODO: question-generator.ts already gets QUESTION_GENERATOR_SYSTEM_PROMPT_V1 as system prompt - check for redundancy and consistency!
/**
 * Build user prompt for question generation
 */
export function buildQuestionGeneratorPrompt(input: {
    taskPrompt: string;
    datamodelSummary: string;
    criteria?: string;
    focusAreas?: string[];
    expectedChanges?: string[];
}): string {
    let additionalContext = '';

    if (input.criteria) {
        additionalContext += `\n\n**EVALUATION CRITERIA**:\n${input.criteria}`;
    }

    if (input.focusAreas && input.focusAreas.length > 0) {
        additionalContext += `\n\n**FOCUS AREAS** (Specific aspects to validate):\n${input.focusAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')}`;
    }

    if (input.expectedChanges && input.expectedChanges.length > 0) {
        additionalContext += `\n\n**EXPECTED CHANGES**:\n${input.expectedChanges.map((change, i) => `${i + 1}. ${change}`).join('\n')}`;
    }

    return `You are analyzing a PowerPoint slide editing task. You have been provided with:

1. **INITIAL SLIDE IMAGE**: A visual screenshot showing the current state of the slide before the task
2. **INITIAL SLIDE DATAMODEL**: A JSON structure with precise technical details about the slide's current structure

Task to evaluate: ${input.taskPrompt}${additionalContext}

Initial slide datamodel:
${input.datamodelSummary}

INSTRUCTIONS:
- **Examine the initial slide image** to understand the current visual state
- **Review the datamodel** to understand the current structure (shape counts, positions, etc.)
- **Analyze the task prompt** to determine what changes need to be made${input.criteria || input.focusAreas || input.expectedChanges ? '\n- **Use the evaluation criteria, focus areas, and expected changes above** to guide your question generation - these provide important context about what should be validated' : ''}
- Generate 1-10 evaluation questions that will assess whether the task was completed successfully
- Determine the optimal number of questions based on task complexity:
  * Simple tasks (e.g., "align boxes") → 2-3 questions
  * Medium tasks (e.g., "add shapes with specific formatting") → 4-6 questions
  * Complex tasks (e.g., "create multi-element layout") → 7-10 questions

Your questions should cover both visual aspects (observable in the result image) and structural aspects (measurable in the result datamodel).`;
}


// TODO: anser-evaluator.ts already gets ANSWER_EVALUATOR_SYSTEM_PROMPT_V1 as system prompt - check for redundancy and consistency!
/**
 * Build user prompt for answer evaluation
 */
export function buildAnswerEvaluatorPrompt(input: {
    questions: Array<{ id: string; question: string; category?: string }>;
    taskPrompt: string;
    datamodelSummary: string;
}): string {
    const questionsText = input.questions
        .map((q, i) => `${i + 1}. [${q.id}${q.category ? `, ${q.category}` : ''}] ${q.question}`)
        .join("\n");

    return `You are evaluating a PowerPoint slide result. You have been provided with TWO sources of information:

1. **SLIDE IMAGE**: A visual screenshot of the result slide showing:
   - Visual appearance (colors, borders, fills, shadows)
   - Layout and spacing (how elements are positioned visually)
   - Text formatting (fonts, sizes, styling)
   - Overall design and aesthetic

2. **SLIDE DATAMODEL**: A JSON structure containing precise technical details:
   - Shape types, IDs, and counts
   - Exact coordinates and dimensions
   - Text content (raw strings)
   - Style properties (when available)

Original task: ${input.taskPrompt}

Questions to evaluate:
${questionsText}

Result slide datamodel:
${input.datamodelSummary}

EVALUATION INSTRUCTIONS:
- **Start by examining the slide image carefully** to understand the visual result
- **Then consult the datamodel** for precise measurements and structural details
- For VISUAL questions (colors, borders, styling): Base your answer primarily on what you observe in the image
- For STRUCTURAL questions (counts, exact positions, text content): Use the datamodel for accuracy
- For LAYOUT questions: Combine visual observation from the image with precise measurements from the datamodel
- **Apply tolerance guidelines for alignment and spacing:**
  - **Icons (images, icon groups)**: Allow up to ~20px deviation for alignment and spacing
  - **Regular shapes (textboxes, boxes)**: Allow 5-10px deviation for alignment and spacing
  - Elements within tolerance should score 90-100%, not be penalized
- **In your reasoning, explicitly reference BOTH sources**: mention what you saw in the image AND what you found in the datamodel
- **When deviations exist, state the deviation amount and whether it's within tolerance** in your reasoning

Evaluate each question and provide a score (0-100%) with detailed reasoning explaining your observations from both the image and the datamodel.`;
}

/**
 * Summarize datamodel for inclusion in prompts
 * (Keeps token count manageable while preserving key information)
 */
export function summarizeDatamodel(datamodel: any): string {
    try {
        // For now, just stringify with indentation
        // In the future, could implement smart summarization to reduce tokens
        const summary = JSON.stringify(datamodel, null, 2);

        // If too large (>10KB), truncate
        const maxLength = 10000;
        if (summary.length > maxLength) {
            return summary.substring(0, maxLength) + "\n... (truncated)";
        }

        return summary;
    } catch (error) {
        return "[Error serializing datamodel]";
    }
}
