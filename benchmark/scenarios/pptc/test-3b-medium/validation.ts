import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 285: Move rightmost column of grid icons to leftmost, shift others right
// Original: 6x5 grid of rect autoShapes (30 total), plus 2 textboxes (title/instructions)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes preserved
    { name: "count_shapes", description: "30 rect icons in grid", slideId: 285, filter: { autoShapeType: "rect" }, expected: 30 },
    { name: "count_shapes", description: "2 textboxes preserved", slideId: 285, filter: { shapeType: "textbox" }, expected: 2 },

    // Row alignment - 5 rows should each have icons at same Y
    { name: "filtered_equality", description: "Icons in rows aligned (same Y)", slideId: 285, filter: { autoShapeType: "rect" }, key: "pos.center[1]", minMatchCount: 6 },

    // Column alignment - 6 columns should each have icons at same X
    { name: "filtered_equality", description: "Icons in columns aligned (same X)", slideId: 285, filter: { autoShapeType: "rect" }, key: "pos.center[0]", minMatchCount: 5 },

    // Horizontal spacing - icons evenly spaced in each row
    { name: "filtered_spacing", description: "Icons evenly spaced horizontally", slideId: 285, filter: { autoShapeType: "rect" }, direction: "horizontal", minMatchCount: 6, groupByPerpendicularPosition: true },

    // Vertical spacing - icons evenly spaced in each column
    { name: "filtered_spacing", description: "Icons evenly spaced vertically", slideId: 285, filter: { autoShapeType: "rect" }, direction: "vertical", minMatchCount: 5, groupByPerpendicularPosition: true },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 285, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of column shift operation",
        slideId: 285,
        autoGenerate: true,
        criteria: "Evaluate if the rightmost column of icons was moved to the leftmost position, with all other columns shifted right.",
        focusAreas: [
            "Rightmost column icons now appear in leftmost position",
            "Other columns shifted one position to the right",
            "Grid structure (6x5) maintained",
            "Alignment and spacing preserved across rows and columns",
        ],
        expectedChanges: [
            "Rightmost column moved to leftmost position",
            "All other columns shifted one position right",
            "Grid alignment and spacing maintained",
        ],
    },
];
