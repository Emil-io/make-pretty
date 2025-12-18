import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-49d: Delete column 4 and resize accordingly
//
// Initial state: Table has 5 rows x 4 columns (20 cells total), column 4 (colIndex 3) contains data
// Expected:
// 1. Column 4 (colIndex 3) should be deleted
// 2. Table should have 3 columns (not 4)
// 3. Table should have 15 cells (not 20, since 5 rows × 3 columns = 15)
// 4. Table should be resized accordingly (width reduced)
// 5. Rows should remain 5

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 273,
        filter: { shapeType: "table" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: TABLE STRUCTURE TESTS
    // ============================================
    // Verify column count is 3 (column 4 deleted)
    {
        name: "equals",
        description: "Table should have exactly 3 columns (after deleting column 4)",
        slideId: 273,
        shapeId: 527,
        key: "columns",
        expected: 3,
    },
    // Verify row count is still 5
    {
        name: "equals",
        description: "Table should still have 5 rows",
        slideId: 273,
        shapeId: 527,
        key: "rows",
        expected: 5,
    },
    // Verify total cell count is 15 (5 rows × 3 columns)
    {
        name: "equals",
        description: "Table should have exactly 15 cells (5 rows × 3 columns)",
        slideId: 273,
        shapeId: 527,
        key: "cells.length",
        expected: 15,
    },

    // ============================================
    // SECTION 3: DELETION VERIFICATION
    // ============================================
    // Verify that no cells have colIndex 3 (column 4 deleted)
    // We check a few cells to ensure column 4 is deleted
    // Since we can't easily iterate through all cells, we verify that
    // - The table has the correct number of cells (15)
    // - The table has 3 columns
    // The LLM judge will verify the content is correct

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Column 4 has been deleted (no cells with colIndex 3)
    // - Table has been resized accordingly
    // - Remaining columns contain correct data (Table 1, Table 2, Table 3 in first row)
    // - Overall visual balance and professional appearance
    {
        name: "llm_judge",
        description: "LLM evaluation of column deletion and table resizing",
        slideId: 273,
        autoGenerate: true,
        criteria: "Evaluate if column 4 has been deleted from the table and the table has been resized accordingly. The table should have 3 columns (Table 1, Table 2, Table 3) and 5 rows, with no cells from column 4 remaining.",
        focusAreas: [
            "Column 4 (colIndex 3) has been completely deleted from the table",
            "Table has exactly 3 columns (down from 4)",
            "Table has exactly 15 cells (down from 20, since 5 rows × 3 columns = 15)",
            "Table has been resized accordingly (width reduced to fit 3 columns)",
            "Remaining columns contain correct data (Table 1, Table 2, Table 3 in first row, with their corresponding data)",
            "Rows remain 5 as expected",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Column 4 deleted from the table",
            "Table resized to fit 3 columns instead of 4",
            "Table structure: 5 rows × 3 columns = 15 cells",
            "Improved visual balance and professional appearance",
        ],
    },
];

