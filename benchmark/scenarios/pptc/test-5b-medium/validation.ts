import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 294: Convert to 2x3 grid layout
// 6 content boxes (Yellow, Blue, Red × 2 rows) should form a proper 2×3 grid

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 6 content boxes in grid
    { name: "count_shapes", description: "6 content textboxes", slideId: 294, filter: { shapeType: "textbox", rawTextContains: "Is the color" }, expected: 6 },

    // Row alignment (same Y) - top row
    {
        name: "filtered_equality",
        description: "Top row horizontally aligned",
        slideId: 294,
        filters: [
            { shapeType: "textbox", rawTextContains: "Yellow" },
            { shapeType: "textbox", rawTextContains: "Blue" },
            { shapeType: "textbox", rawTextContains: "Red" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Column alignment (same X) - Yellow column
    {
        name: "filtered_equality",
        description: "Yellow column vertically aligned",
        slideId: 294,
        filter: { shapeType: "textbox", rawTextContains: "Yellow" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },
    // Column alignment - Blue column
    {
        name: "filtered_equality",
        description: "Blue column vertically aligned",
        slideId: 294,
        filter: { shapeType: "textbox", rawTextContains: "Blue" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },
    // Column alignment - Red column
    {
        name: "filtered_equality",
        description: "Red column vertically aligned",
        slideId: 294,
        filter: { shapeType: "textbox", rawTextContains: "Red" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Size equality - all boxes same dimensions
    { name: "filtered_equality", description: "Boxes equal width", slideId: 294, filter: { shapeType: "textbox", rawTextContains: "Is the color" }, key: "size.w", minMatchCount: 6 },
    { name: "filtered_equality", description: "Boxes equal height", slideId: 294, filter: { shapeType: "textbox", rawTextContains: "Is the color" }, key: "size.h", minMatchCount: 6 },

    // Spacing - horizontal (columns) with grouping by row
    { name: "filtered_spacing", description: "Columns evenly spaced", slideId: 294, filter: { shapeType: "textbox", rawTextContains: "Is the color" }, direction: "horizontal", minMatchCount: 3, groupByPerpendicularPosition: true },
    // Spacing - vertical (rows)
    { name: "filtered_spacing", description: "Rows evenly spaced", slideId: 294, filter: { shapeType: "textbox", rawTextContains: "Is the color" }, direction: "vertical", minMatchCount: 2, groupByPerpendicularPosition: true },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 294, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of 2x3 grid layout",
        slideId: 294,
        autoGenerate: true,
        criteria: "Evaluate if content boxes are arranged in a proper 2×3 grid layout.",
        focusAreas: [
            "6 content boxes arranged in 2 rows × 3 columns",
            "Rows horizontally aligned with consistent Y positions",
            "Columns vertically aligned with consistent X positions",
            "Equal spacing between rows and columns",
            "All boxes have consistent size",
        ],
        expectedChanges: [
            "Content rearranged into 2×3 grid",
            "Consistent alignment and spacing",
            "Balanced visual layout",
        ],
    },
];
