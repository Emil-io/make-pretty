import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count table shapes
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 273,
        filter: { shapeType: "table" },
        expected: 1,
    },

    // Verify table has 4 columns (one W deleted)
    {
        name: "includes",
        description: "Table should have exactly 4 columns after deleting one W column",
        slideId: 273,
        shapeId: 11,
        key: "columns",
        expected: 4,
    },

    // Verify table still has 3 rows
    {
        name: "includes",
        description: "Table should still have 3 rows",
        slideId: 273,
        shapeId: 11,
        key: "rows",
        expected: 3,
    },

    // Verify table size (width) remains the same
    {
        name: "includes",
        description: "Table width should remain approximately the same (1704px)",
        slideId: 273,
        shapeId: 11,
        key: "size.w",
        expected: (w: number) => Math.abs(w - 1704.0) < 10, // Allow 10px tolerance
    },

    // Verify table size (height) remains the same
    {
        name: "includes",
        description: "Table height should remain approximately the same (817px)",
        slideId: 273,
        shapeId: 11,
        key: "size.h",
        expected: (h: number) => Math.abs(h - 817.2) < 10, // Allow 10px tolerance
    },

    // LLM judge for table validation
    {
        name: "llm_judge",
        description: "LLM evaluation of SWOT table column deletion and resizing",
        slideId: 273,
        autoGenerate: true,
        criteria: "Evaluate if one W column has been deleted from the SWOT table and the table/text has been resized to maintain the same outer dimensions.",
        focusAreas: [
            "The table now has 4 columns instead of 5 (S, W, O, T)",
            "One of the two 'W' (WEAKNESSES) columns has been removed",
            "The remaining columns have been resized to fill the original table width",
            "The table maintains its original outer dimensions (approximately 1704 x 817 px)",
            "Text within cells is properly displayed and readable after resizing",
            "The SWOT structure remains intact with all necessary information",
            "Visual balance and professional appearance maintained"
        ],
        expectedChanges: [
            "One W column deleted from the table",
            "Table reduced from 5 columns to 4 columns",
            "Remaining columns resized to maintain original table width",
            "Table outer dimensions unchanged",
            "Text properly adjusted within resized columns"
        ],
    },
];
