import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-46b: Add a 5th row to the table pls.
//
// Initial state: Table has 4 rows
// Expected:
// 1. Table should have 5 rows instead of 4
// 2. The 5th row should have 2 cells (matching the 2 columns)
//
// Structure:
// - Table: shape 307 (rows: 4, columns: 2)
// - After adding 5th row: rows should be 5

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 263,
        filter: { shapeType: "table" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: TABLE STRUCTURE TESTS
    // ============================================
    // Verify that the table has 5 rows (added 5th row)
    {
        name: "equals",
        description: "Table should have 5 rows after adding the 5th row",
        slideId: 263,
        shapeId: 307,
        key: "rows",
        expected: 5,
    },
    {
        name: "equals",
        description: "Table should still have 2 columns",
        slideId: 263,
        shapeId: 307,
        key: "columns",
        expected: 2,
    },
    // Verify that the 5th row has cells
    // For a 2-column table, row 4 (5th row) cells are at indices: 4*2 + 0 = 8, 4*2 + 1 = 9
    {
        name: "equals",
        description: "Table should have a cell at row 4, col 0 (5th row, first column)",
        slideId: 263,
        shapeId: 307,
        key: "cells[8].rowIndex",
        expected: 4,
    },
    {
        name: "equals",
        description: "Table should have a cell at row 4, col 1 (5th row, second column)",
        slideId: 263,
        shapeId: 307,
        key: "cells[9].rowIndex",
        expected: 4,
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Table has 5 rows
    // - The 5th row is properly formatted and consistent with other rows
    // - Overall table structure and layout are correct
    {
        name: "llm_judge",
        description: "LLM evaluation of 5th row added to table",
        slideId: 263,
        autoGenerate: true,
        criteria: "Evaluate if a 5th row has been added to the table (shape 307). The table should now have 5 rows instead of the original 4 rows. The 5th row should have 2 cells (matching the 2 columns) and should be properly formatted, consistent with the other rows in the table. The table structure should remain intact with proper spacing and alignment.",
        focusAreas: [
            "Table has 5 rows (added 5th row)",
            "5th row has 2 cells (matching the 2 columns)",
            "5th row is properly formatted and consistent with other rows",
            "Table structure and layout remain intact",
            "Overall visual consistency and organization",
        ],
        expectedChanges: [
            "5th row added to the table",
            "Table now has 5 rows instead of 4",
            "5th row has 2 cells properly formatted",
            "Table structure and formatting remain consistent",
        ],
    },
];

