import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
  // Count tests - verify 3 groups still exist (now as rows)
  {
    name: "count_shapes",
    description: "Should still have 3 groups (one per row)",
    slideId: 257,
    filter: { shapeType: "group" },
    expected: 3,
  },

  // Vertical alignment - groups should now be arranged as rows (different Y positions)
  // Headings should all have the same X position (right side)
  {
    name: "filtered_equality",
    description: "Headings should be vertically aligned (same X coordinate) on the right",
    slideId: 257,
    filter: { shapeType: "textbox", rawTextContains: "Slides" },
    key: "pos.topLeft[0]",
    minMatchCount: 1,
  },
  {
    name: "filtered_equality",
    description: "All headings (Google Slides, PowerPoint, Canva) should have same X",
    slideId: 257,
    filters: [
      { shapeType: "textbox", rawText: "Google Slides" },
      { shapeType: "textbox", rawText: "PowerPoint" },
      { shapeType: "textbox", rawText: "Canva" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 3,
  },

  // Body texts should start at the same horizontal coordinate
  {
    name: "filtered_equality",
    description: "Body texts should all start at the same X coordinate",
    slideId: 257,
    filters: [
      { shapeType: "textbox", rawTextContains: "Click on the \"Google Slides\"" },
      { shapeType: "textbox", rawTextContains: "Click on the \"PowerPoint\"" },
      { shapeType: "textbox", rawTextContains: "Click on the \"Canva\"" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 3,
  },

  // Equal vertical spacing - rows should be evenly distributed
  {
    name: "filtered_spacing",
    description: "Groups (rows) should have equal vertical spacing",
    slideId: 257,
    filter: { shapeType: "group" },
    direction: "vertical",
    minMatchCount: 3,
  },

  // Equal sizing - groups should maintain similar dimensions
  {
    name: "filtered_equality",
    description: "Groups should have equal height",
    slideId: 257,
    filter: { shapeType: "group" },
    key: "size.h",
    minMatchCount: 3,
  },

  // LLM Judge for semantic validation
  {
    name: "llm_judge",
    description: "LLM evaluation of column-to-row transformation",
    slideId: 257,
    autoGenerate: true,
    criteria: "Evaluate if the three columns have been converted into three rows, with headings on the right and body texts starting at the same horizontal coordinate.",
    focusAreas: [
      "Original 3 columns are now arranged as 3 horizontal rows",
      "All headings (Google Slides, PowerPoint, Canva) are positioned on the right side",
      "All body texts start at the same X coordinate (left-aligned)",
      "Rows are evenly spaced vertically",
      "The layout transformation is complete and visually balanced",
    ],
    expectedChanges: [
      "Three columns converted to three rows",
      "Headings moved to the right side of each row",
      "Body texts aligned to start at the same horizontal position",
    ],
  },
];
