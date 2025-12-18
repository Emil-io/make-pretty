import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 281: Agenda page with 4 agenda points (each with purple lines)
// Task: Add a 5th agenda point with purple lines and realign existing ones

export const Test: TChangesetTestProtocol = [
  // Count tests - verify 5th agenda point was added
  {
    name: "count_shapes",
    description: "Should have 10 purple rectangles (2 per agenda point × 5 points)",
    slideId: 281,
    filter: { shapeType: "autoShape", fillColor: "#CEABDD" },
    expected: 10,
  },

  // Purple lines alignment - left column should be vertically aligned
  {
    name: "filtered_equality",
    description: "Left purple rectangles should have same X position",
    slideId: 281,
    filter: { shapeType: "autoShape", fillColor: "#CEABDD" },
    key: "pos.topLeft[0]",
    minMatchCount: 5,
  },

  // Purple lines should have equal width
  {
    name: "filtered_equality",
    description: "Purple rectangles should have equal width",
    slideId: 281,
    filter: { shapeType: "autoShape", fillColor: "#CEABDD" },
    key: "size.w",
    minMatchCount: 5,
  },

  // Purple lines should have equal height
  {
    name: "filtered_equality",
    description: "Purple rectangles should have equal height",
    slideId: 281,
    filter: { shapeType: "autoShape", fillColor: "#CEABDD" },
    key: "size.h",
    minMatchCount: 5,
  },

  // Vertical spacing between purple lines should be equal
  {
    name: "filtered_spacing",
    description: "Purple rectangles should have equal vertical spacing",
    slideId: 281,
    filter: { shapeType: "autoShape", fillColor: "#CEABDD" },
    direction: "vertical",
    minMatchCount: 5,
    groupByPerpendicularPosition: true,
  },

  // Boundary check
  {
    name: "within_boundaries",
    description: "All shapes should remain within slide boundaries",
    slideId: 281,
    minMargin: 0,
  },

  // LLM Judge for semantic validation
  {
    name: "llm_judge",
    description: "LLM evaluation of 5th agenda point addition and realignment",
    slideId: 281,
    autoGenerate: true,
    criteria: "Evaluate if a 5th agenda point was added with corresponding purple lines and all agenda items are properly realigned.",
    focusAreas: [
      "5th agenda point added with same structure as existing ones",
      "New purple lines added for the 5th point (matching style)",
      "All 5 agenda points evenly spaced vertically",
      "Purple lines properly aligned and consistent in size",
      "Overall visual balance maintained",
    ],
    expectedChanges: [
      "New agenda point group added (5th item)",
      "2 new purple rectangles added for 5th agenda point",
      "Existing agenda points and lines realigned for even spacing",
    ],
  },
];
