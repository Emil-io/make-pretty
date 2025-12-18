import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 276: Scattered icons (7 autoShape rects) + NAME/Title groups need alignment
// Task: Align icons and names that are scattered around the slide

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "7 icon shapes preserved", slideId: 276, filter: { shapeType: "autoShape" }, expected: 7 },
    { name: "count_shapes", description: "7 NAME textboxes preserved", slideId: 276, filter: { shapeType: "textbox", rawText: "NAME" }, expected: 7 },
    { name: "count_shapes", description: "7 Title textboxes preserved", slideId: 276, filter: { shapeType: "textbox", rawText: "Title or Position" }, expected: 7 },

    // Icon alignment - at least some should share Y coordinate (row alignment)
    { name: "filtered_equality", description: "Icons in bottom row share Y coordinate", slideId: 276, filter: { shapeType: "autoShape" }, key: "pos.topLeft[1]", minMatchCount: 4 },

    // Icon sizing consistency (already same size, verify preserved)
    { name: "filtered_equality", description: "Icons have equal width", slideId: 276, filter: { shapeType: "autoShape" }, key: "size.w", minMatchCount: 7 },
    { name: "filtered_equality", description: "Icons have equal height", slideId: 276, filter: { shapeType: "autoShape" }, key: "size.h", minMatchCount: 7 },

    // Icon horizontal spacing
    { name: "filtered_spacing", description: "Icons horizontally spaced evenly", slideId: 276, filter: { shapeType: "autoShape" }, direction: "horizontal", minMatchCount: 3, groupByPerpendicularPosition: true },

    // NAME textbox alignment - should align in rows
    { name: "filtered_equality", description: "NAME labels share Y coordinate", slideId: 276, filter: { shapeType: "textbox", rawText: "NAME" }, key: "pos.topLeft[1]", minMatchCount: 4 },

    // Title textbox alignment
    { name: "filtered_equality", description: "Title labels share Y coordinate", slideId: 276, filter: { shapeType: "textbox", rawText: "Title or Position" }, key: "pos.topLeft[1]", minMatchCount: 4 },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 276, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of icon and name alignment",
        slideId: 276,
        autoGenerate: true,
        criteria: "Evaluate if the scattered icons and names have been properly aligned into an organized layout.",
        focusAreas: [
            "Icons are aligned in a grid or row pattern (no longer scattered)",
            "NAME labels are aligned consistently relative to their icons",
            "Title/Position labels are aligned consistently below NAME labels",
            "Even horizontal spacing between icon-name groups",
            "Overall visual coherence and professional appearance",
        ],
        expectedChanges: [
            "Icons repositioned into aligned rows or grid",
            "NAME labels aligned relative to icons",
            "Title labels aligned below NAME labels",
            "Consistent spacing between elements",
        ],
    },
];
