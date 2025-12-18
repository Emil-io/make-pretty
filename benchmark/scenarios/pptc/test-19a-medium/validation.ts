import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 3 columns of content exist
    {
        name: "count_shapes",
        description: "Should have 3 groups (one per column)",
        slideId: 280,
        filter: { shapeType: "group" },
        expected: 6, // 2 groups per column (top and bottom box) x 3 columns
    },

    // Horizontal alignment - column groups should share same Y positions (top row)
    {
        name: "filtered_equality",
        description: "Top row groups should be horizontally aligned (same Y)",
        slideId: 280,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // 3 columns, top row
    },

    // Equal sizing - groups should have equal dimensions
    {
        name: "filtered_equality",
        description: "Groups should have equal width",
        slideId: 280,
        filter: { shapeType: "group" },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "Groups should have equal height",
        slideId: 280,
        filter: { shapeType: "group" },
        key: "size.h",
        minMatchCount: 3,
    },

    // Horizontal spacing - columns should be evenly distributed
    {
        name: "filtered_spacing",
        description: "Column groups should have equal horizontal spacing",
        slideId: 280,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // Key Metric labels alignment
    {
        name: "filtered_equality",
        description: "Key Metric labels should have equal width",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Key Metric" },
        key: "size.w",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of three-column layout creation",
        slideId: 280,
        autoGenerate: true,
        criteria: "Evaluate if three identical columns have been created from the original left column, with proper spacing and border distances.",
        focusAreas: [
            "Three columns are present, each replicating the structure of the original left column",
            "Each column contains the same visual elements (boxes, images, text)",
            "The right edge margin matches the left edge margin (symmetric border distances)",
            "Columns are evenly spaced horizontally across the slide",
            "All three columns are vertically aligned (same Y positions)",
            "The overall layout is balanced and professional",
        ],
        expectedChanges: [
            "Two additional columns created to the right of the original",
            "Column spacing is consistent and even",
            "Border distance from right edge matches left edge",
            "All column elements (groups, images, text) are duplicated correctly",
        ],
    },
];
