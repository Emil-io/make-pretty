import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify all icon images are preserved (39 icons, excluding background image)
    {
        name: "count_shapes",
        description: "There should be 40 image shapes total (1 background + 39 icons)",
        slideId: 286,
        filter: { shapeType: "image" },
        expected: 40,
    },

    // Grid alignment - Row 1: icons should share same Y center
    {
        name: "filtered_equality",
        description: "Row 1 icons should be horizontally aligned (same center Y)",
        slideId: 286,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 8,
    },

    // Grid alignment - additional rows should also be aligned
    {
        name: "filtered_equality",
        description: "Row 2 icons should be horizontally aligned",
        slideId: 286,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 8,
    },

    // Column alignment - icons should share same X center for vertical alignment
    {
        name: "filtered_equality",
        description: "Column icons should be vertically aligned (same center X)",
        slideId: 286,
        filter: { shapeType: "image" },
        key: "pos.center[0]",
        minMatchCount: 4,
    },

    // Horizontal spacing - icons in rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Icons in each row should have equal horizontal spacing",
        slideId: 286,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 7,
        groupByPerpendicularPosition: true,
    },

    // Vertical spacing - rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Icon rows should have equal vertical spacing",
        slideId: 286,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 4,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of grid alignment task",
        slideId: 286,
        autoGenerate: true,
        criteria: "Evaluate if all icons have been aligned into a proper grid layout with one row having 7 items instead of 8 (leaving one spot open).",
        focusAreas: [
            "Icons are arranged in a consistent grid pattern",
            "Each row has icons horizontally aligned at the same Y position",
            "Columns are vertically aligned at consistent X positions",
            "Horizontal spacing between icons in each row is uniform",
            "Vertical spacing between rows is uniform",
            "One row correctly has only 7 icons with an empty spot",
        ],
        expectedChanges: [
            "Icons repositioned into a regular grid layout",
            "Consistent spacing applied between icons",
            "One row left with 7 items as specified",
        ],
    },
];
