import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 3 groups exist (the 3 columns)
    {
        name: "count_shapes",
        description: "There should be 3 group shapes (the 3 columns)",
        slideId: 280,
        filter: {
            shapeType: "group",
        },
        expected: 3,
    },

    // All 3 groups should have equal width (1/3 each)
    {
        name: "filtered_equality",
        description: "All 3 column groups should have equal width",
        slideId: 280,
        filter: {
            shapeType: "group",
        },
        key: "size.w",
        minMatchCount: 3,
    },

    // All 3 groups should have equal height
    {
        name: "filtered_equality",
        description: "All 3 column groups should have equal height",
        slideId: 280,
        filter: {
            shapeType: "group",
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // All 3 groups should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "All 3 column groups should be horizontally aligned at same Y",
        slideId: 280,
        filter: {
            shapeType: "group",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Groups should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "The 3 column groups should have equal horizontal spacing",
        slideId: 280,
        filter: {
            shapeType: "group",
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of equal column width layout",
        slideId: 280,
        autoGenerate: true,
        criteria: "Evaluate if all 3 columns have equal width (1/3 of the layout each) as requested.",
        focusAreas: [
            "All 3 columns (left orange, middle green, right image) have equal width",
            "Columns are properly aligned horizontally at the same Y position",
            "Equal spacing between columns is maintained",
            "Overall visual balance with 3 equal-width columns",
        ],
        expectedChanges: [
            "Left and middle columns resized to match the width of the right image column",
            "All 3 columns now have equal 1/3 width distribution",
            "Consistent horizontal spacing between columns",
        ],
    },
];
