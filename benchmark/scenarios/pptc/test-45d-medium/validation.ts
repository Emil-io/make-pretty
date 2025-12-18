import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-45d: Pls add two features to the middle plan.
//
// Initial state: Middle plan table has 2 features (rows with "Add a feature")
// Expected:
// 1. Middle plan table (shape 398) should have 4 rows with "Add a feature" text
// 2. The two new features should be added to rows 2 and 3 (currently empty)
//
// Structure:
// - Left plan: Table 399 (center X = 373.9)
// - Middle plan: Table 398 (center X = 959.8) - THIS IS THE TARGET
// - Right plan: Table 391 (center X = 1545.8)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 table shapes (one for each pricing plan)",
        slideId: 273,
        filter: { shapeType: "table" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "There should be at least 2 group shapes (pricing plan containers)",
        slideId: 273,
        filter: { shapeType: "group" },
        expected: 2,
    },

    // ============================================
    // SECTION 2: TABLE CONTENT TESTS
    // ============================================
    // Verify the middle table structure and cell content
    // The middle table (398) should have 4 cells with "Add a feature" text
    {
        name: "equals",
        description: "Middle plan table (shape 398) should have 6 rows",
        slideId: 273,
        shapeId: 398,
        key: "rows",
        expected: 6,
    },
    {
        name: "equals",
        description: "Middle plan table (shape 398) should have 1 column",
        slideId: 273,
        shapeId: 398,
        key: "columns",
        expected: 1,
    },
    // Verify that cells 0, 1, 2, 3 contain "Add a feature"
    // (cells are stored in row-major order, so for a 1-column table: row 0 = index 0, row 1 = index 1, etc.)
    {
        name: "includes",
        description: "Middle table cell 0 (row 0) should contain 'Add a feature'",
        slideId: 273,
        shapeId: 398,
        key: "cells[0].text",
        expected: "Add a feature",
    },
    {
        name: "includes",
        description: "Middle table cell 1 (row 1) should contain 'Add a feature'",
        slideId: 273,
        shapeId: 398,
        key: "cells[1].text",
        expected: "Add a feature",
    },
    {
        name: "includes",
        description: "Middle table cell 2 (row 2) should contain 'Add a feature' (newly added)",
        slideId: 273,
        shapeId: 398,
        key: "cells[2].text",
        expected: "Add a feature",
    },
    {
        name: "includes",
        description: "Middle table cell 3 (row 3) should contain 'Add a feature' (newly added)",
        slideId: 273,
        shapeId: 398,
        key: "cells[3].text",
        expected: "Add a feature",
    },

    // ============================================
    // SECTION 3: POSITION TESTS
    // ============================================
    // Verify that the middle table is positioned between left and right tables
    {
        name: "greater_than",
        description: "Middle table (398) center X should be greater than left table (399) center X",
        slideId: 273,
        shapeId: 398,
        key: "pos.center[0]",
        expected: 400, // Left table center is ~373.9
    },
    {
        name: "less_than",
        description: "Middle table (398) center X should be less than right table (391) center X",
        slideId: 273,
        shapeId: 398,
        key: "pos.center[0]",
        expected: 1200, // Right table center is ~1545.8
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Middle plan table has 4 rows with "Add a feature" text
    // - The two new features are properly added
    // - Overall structure and content are correct
    {
        name: "llm_judge",
        description: "LLM evaluation of two features added to middle plan",
        slideId: 273,
        autoGenerate: true,
        criteria: "Evaluate if two features have been added to the middle pricing plan. The middle plan table (shape 398, center X ~960) should now have 4 rows containing 'Add a feature' text instead of the original 2. The table should have 6 total rows, with 4 rows containing 'Add a feature' and 2 rows empty. The left and right plans should remain unchanged with their original feature counts.",
        focusAreas: [
            "Middle plan table (shape 398) has 4 rows with 'Add a feature' text",
            "The two new features are added to rows 2 and 3 (previously empty)",
            "Table structure is correct (6 rows, 1 column)",
            "Left and right plans remain unchanged",
            "Overall visual consistency and layout are maintained",
        ],
        expectedChanges: [
            "Two new features added to middle plan table",
            "Middle plan table now has 4 rows with 'Add a feature' text",
            "Rows 2 and 3 now contain 'Add a feature' (previously empty)",
            "Table structure and layout remain consistent",
        ],
    },
];

