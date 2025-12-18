import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
  // All SWOT letter headings (S, W, O, T) should be vertically aligned (same X)
  {
    name: "filtered_equality",
    description: "All SWOT headings (S, W, O, T) should start at the same horizontal point",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "S" },
      { shapeType: "textbox", rawText: "W" },
      { shapeType: "textbox", rawText: "O" },
      { shapeType: "textbox", rawText: "T" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 4,
  },

  // All subtitle labels should be vertically aligned (same X)
  {
    name: "filtered_equality",
    description: "All subtitle labels should start at the same horizontal point",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "STRENGTHS" },
      { shapeType: "textbox", rawText: "WEAKNESSES" },
      { shapeType: "textbox", rawText: "OPPORTUNITIES" },
      { shapeType: "textbox", rawText: "THREATS" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 4,
  },

  // All question textboxes should be vertically aligned (same X)
  {
    name: "filtered_equality",
    description: "All question textboxes should start at the same horizontal point",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawTextContains: "What are you doing well" },
      { shapeType: "textbox", rawTextContains: "Where do you need to improve" },
      { shapeType: "textbox", rawTextContains: "What are your goals" },
      { shapeType: "textbox", rawTextContains: "What are the blockers" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 4,
  },

  // Row 1 (S row): Heading S should be horizontally aligned with its questions
  {
    name: "filtered_equality",
    description: "Row 1: S heading and its questions should be in same row (Y aligned)",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "S" },
      { shapeType: "textbox", rawTextContains: "What are you doing well" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // Row 2 (W row): Heading W should be horizontally aligned with its questions
  {
    name: "filtered_equality",
    description: "Row 2: W heading and its questions should be in same row (Y aligned)",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "W" },
      { shapeType: "textbox", rawTextContains: "Where do you need to improve" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // Row 3 (O row): Heading O should be horizontally aligned with its questions
  {
    name: "filtered_equality",
    description: "Row 3: O heading and its questions should be in same row (Y aligned)",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "O" },
      { shapeType: "textbox", rawTextContains: "What are your goals" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // Row 4 (T row): Heading T should be horizontally aligned with its questions
  {
    name: "filtered_equality",
    description: "Row 4: T heading and its questions should be in same row (Y aligned)",
    slideId: 284,
    filters: [
      { shapeType: "textbox", rawText: "T" },
      { shapeType: "textbox", rawTextContains: "What are the blockers" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // LLM Judge for semantic validation
  {
    name: "llm_judge",
    description: "LLM evaluation of SWOT layout reorganization",
    slideId: 284,
    autoGenerate: true,
    criteria:
      "Evaluate if the SWOT headings (S, W, O, T) are positioned on the left with questions to the right, and all text is properly left-aligned.",
    focusAreas: [
      "All SWOT letter headings (S, W, O, T) are positioned on the left side of their respective rows",
      "Questions/bullet points are positioned to the right of their corresponding heading",
      "All headings start at the same horizontal (X) position",
      "All question blocks start at the same horizontal (X) position",
      "Text in question blocks appears left-bound/left-aligned",
    ],
    expectedChanges: [
      "SWOT headings moved to left side of each row",
      "Questions repositioned to the right of headings",
      "Consistent horizontal alignment for all headings and all questions",
    ],
  },
];
