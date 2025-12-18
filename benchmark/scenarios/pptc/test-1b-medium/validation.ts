import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 274: SWOT analysis | Task: Exchange W and O sections (W moves right of S, O moves below S)

export const Test: TChangesetTestProtocol = [
  // Count tests - verify all groups and shapes preserved
  { name: "count_shapes", description: "4 SWOT groups preserved", slideId: 274, filter: { shapeType: "group" }, expected: 4 },
  { name: "count_shapes", description: "1 center image preserved", slideId: 274, filter: { shapeType: "image" }, expected: 1 },

  // After swap: W (group 439) should be in top-right area (where O was)
  // Original O position: topLeft X ~1416
  { name: "greater_than", description: "W group moved to right side", slideId: 274, shapeId: 439, key: "pos.topLeft[0]", expected: 1200 },

  // After swap: O (group 443) should be in bottom-left area (where W was)
  // Original W position: topLeft X ~51
  { name: "less_than", description: "O group moved to left side", slideId: 274, shapeId: 443, key: "pos.topLeft[0]", expected: 700 },

  // S section should remain in top-left (unchanged)
  { name: "less_than", description: "S group remains on left side", slideId: 274, shapeId: 434, key: "pos.topLeft[0]", expected: 700 },

  // T section should remain in bottom-right (unchanged)
  { name: "greater_than", description: "T group remains on right side", slideId: 274, shapeId: 447, key: "pos.topLeft[0]", expected: 1200 },

  // Alignment: S and W should be horizontally aligned (same row) after swap
  // W should be right of S with similar Y coordinate
  {
    name: "filtered_equality",
    description: "S and W horizontally aligned (top row)",
    slideId: 274,
    filters: [
      { shapeType: "textbox", rawText: "S" },
      { shapeType: "textbox", rawText: "W" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // Alignment: O and T should be vertically aligned (same column) after swap
  // O should be below S on left side
  {
    name: "filtered_equality",
    description: "O and T vertically stacked (bottom row)",
    slideId: 274,
    filters: [
      { shapeType: "textbox", rawText: "O" },
      { shapeType: "textbox", rawText: "T" },
    ],
    key: "pos.topLeft[1]",
    minMatchCount: 2,
  },

  // Layout check: W should be to the RIGHT of S (not below)
  { name: "greater_than", description: "W is to the right of S", slideId: 274, shapeId: 440, key: "pos.topLeft[0]", expected: 500 },

  // Boundary check
  { name: "within_boundaries", description: "All shapes within slide boundaries", slideId: 274, minMargin: 0 },

  // LLM Judge
  {
    name: "llm_judge",
    description: "LLM evaluation of SWOT section swap",
    slideId: 274,
    autoGenerate: true,
    criteria: "Evaluate if the W (Weaknesses) and O (Opportunities) sections were correctly exchanged, placing W to the right of S and O below S.",
    focusAreas: [
      "W section is now positioned to the right of S (horizontally adjacent)",
      "O section is now positioned below S (vertically stacked)",
      "S and T sections remain in their original positions",
      "Overall SWOT layout maintains visual balance",
      "Text content preserved in each section",
    ],
    expectedChanges: [
      "W section moved from bottom-left to top-right",
      "O section moved from top-right to bottom-left",
    ],
  },
];
