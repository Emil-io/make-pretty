import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify all 39 icons are preserved
    {
        name: "count_shapes",
        description: "All 39 icon images should be preserved",
        slideId: 281,
        filter: { shapeType: "image" },
        expected: 39,
    },

    // Grid layout tests - icons should be arranged in rows and columns

    // Row alignment: icons in the same row should have the same Y coordinate
    {
        name: "filtered_equality",
        description: "Icons in a row should be horizontally aligned (same Y coordinate)",
        slideId: 281,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 6, // At least 6 icons per row in a grid
    },

    // Column alignment: icons in the same column should have the same X coordinate
    {
        name: "filtered_equality",
        description: "Icons in a column should be vertically aligned (same X coordinate)",
        slideId: 281,
        filter: { shapeType: "image" },
        key: "pos.center[0]",
        minMatchCount: 5, // At least 5 icons per column in a grid
    },

    // Horizontal spacing: icons in rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Icons should have equal horizontal spacing within rows",
        slideId: 281,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 6,
        groupByPerpendicularPosition: true, // Group by Y (same row) before checking spacing
    },

    // Vertical spacing: icons in columns should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Icons should have equal vertical spacing within columns",
        slideId: 281,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 5,
        groupByPerpendicularPosition: true, // Group by X (same column) before checking spacing
    },

    // Icons should stay within slide boundaries
    {
        name: "within_boundaries",
        description: "All icons should be within slide boundaries",
        slideId: 281,
        minMargin: 0,
    },

    // LLM Judge for semantic validation of grid layout
    {
        name: "llm_judge",
        description: "LLM evaluation of icon grid arrangement",
        slideId: 281,
        autoGenerate: true,
        criteria: "Evaluate if the 39 icons have been arranged into a proper grid layout that is somewhat quadratic (wider than high) on the right half of the slide.",
        focusAreas: [
            "Icons are arranged in a clear grid pattern with rows and columns",
            "Grid dimensions are appropriate (wider than high, somewhat quadratic)",
            "Icons are evenly distributed with consistent spacing",
            "Grid is positioned on the right half of the slide, not overlapping the left text area",
            "Visual balance and professional appearance of the grid layout",
        ],
        expectedChanges: [
            "Icons reorganized from scattered positions into a structured grid",
            "Consistent horizontal and vertical spacing between icons",
            "Grid positioned on the right portion of the slide",
        ],
    },
];
