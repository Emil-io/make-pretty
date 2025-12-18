import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 274,
        filter: { shapeType: "table" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 12 group shapes (check/cross icons)",
        slideId: 274,
        filter: { shapeType: "group" },
        expected: 12,
    },

    // Table structure tests
    {
        name: "includes",
        description: "Table should have 4 rows",
        slideId: 274,
        shapeId: 2,
        key: "rows",
        expected: 4,
    },
    {
        name: "includes",
        description: "Table should have 5 columns",
        slideId: 274,
        shapeId: 2,
        key: "columns",
        expected: 5,
    },

    // Alignment tests - icons in same row should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Icons in row 1 (ITEM row) should be horizontally aligned",
        slideId: 274,
        filter: { shapeType: "group" },
        key: "pos.center[1]",
        minMatchCount: 4, // 4 icons in row 1
    },

    // Icons in same column should be vertically aligned
    {
        name: "filtered_equality",
        description: "Icons in column 4 (rightmost column) should be vertically aligned",
        slideId: 274,
        filter: { shapeType: "group" },
        key: "pos.center[0]",
        minMatchCount: 3, // 3 icons in rightmost column
    },

    // Size consistency - all icons should have equal dimensions
    {
        name: "filtered_equality",
        description: "All check/cross icons should have equal width",
        slideId: 274,
        filter: { shapeType: "group" },
        key: "size.w",
        minMatchCount: 10,
    },
    {
        name: "filtered_equality",
        description: "All check/cross icons should have equal height",
        slideId: 274,
        filter: { shapeType: "group" },
        key: "size.h",
        minMatchCount: 10,
    },

    // Spacing - icons should be evenly distributed
    {
        name: "filtered_spacing",
        description: "Icons should have equal horizontal spacing within rows",
        slideId: 274,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of cross replacement in table",
        slideId: 274,
        autoGenerate: true,
        criteria: "Evaluate if the top right entry of the table has been correctly changed from a check mark to a cross mark, copying the cross style from the same column.",
        focusAreas: [
            "Top right table cell now contains a cross (X) instead of a check mark",
            "The cross mark matches the style of other crosses in the same column (color, size, rotation)",
            "All other check/cross icons remain unchanged",
            "Table structure and layout are preserved",
            "Icon alignment within table cells is maintained",
        ],
        expectedChanges: [
            "Top right icon changed from check mark to cross mark",
            "Cross style copied from existing cross in the same column",
            "Rest of the table icons unchanged",
        ],
    },
];
