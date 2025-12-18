import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-48b: Pls make it a 2x2 table and populate it with 4 dummy genres.
//
// Initial state: Table might not be properly structured, and cells may not contain genre names
// Expected:
// 1. Table should be 4 rows x 2 columns (8 cells total: 4 genre cells + 4 description cells)
// 2. 4 cells should contain dummy genre names (not placeholder text like "Add a genre name")
// 3. 4 cells should contain descriptions for the genres
//
// Structure:
// - Table: shape 466 (should be 2x2 after transformation)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: TABLE STRUCTURE TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 263,
        filter: { shapeType: "table" },
        expected: 1,
    },
    {
        name: "equals",
        description: "Table should have 4 rows (2 rows for genres, 2 rows for descriptions)",
        slideId: 263,
        shapeId: 466,
        key: "rows",
        expected: 4,
    },
    {
        name: "equals",
        description: "Table should have 2 columns",
        slideId: 263,
        shapeId: 466,
        key: "columns",
        expected: 2,
    },
    {
        name: "equals",
        description: "Table should have exactly 8 cells (4 rows × 2 columns: 4 genre cells + 4 description cells)",
        slideId: 263,
        shapeId: 466,
        key: "cells.length",
        expected: 8,
    },

    // ============================================
    // SECTION 2: GENRE CONTENT TESTS
    // ============================================
    // Test that genre name cells contain genre names (not placeholder text)
    // In a 2x2 table with descriptions, we need to identify which cells are genre cells
    // Based on the structure, genre names are typically in row 0 (cells 0 and 1) and row 2 (cells 4 and 5)
    // But for a 2x2 table, if we have 4 cells total, cells 0 and 1 might be genres, and cells 2 and 3 might be descriptions
    // We'll use LLM judge to verify which cells contain genres vs descriptions

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Table is 2x2 with 4 cells
    // - All cells contain dummy genre names (not placeholder text)
    // - Genre names are appropriate and diverse
    {
        name: "llm_judge",
        description: "LLM evaluation of 2x2 table with 4 dummy genres",
        slideId: 263,
        autoGenerate: true,
        criteria: "Evaluate if the table (shape 466) is a 4x2 table with exactly 4 rows and 2 columns (8 cells total: 4 genre cells + 4 description cells). The table should contain 4 dummy genres with their descriptions. The genre names should be actual genre names (like 'Comedy', 'Drama', 'Romance', 'Documentary', etc.) and not placeholder text like 'Add a genre name' or empty. All 4 genre name cells should have distinct, appropriate genre names. The 4 description cells should contain elaboration or description text for the genres (they may contain placeholder text like 'Briefly elaborate on what you want to discuss.'). The table should be organized with genre names and their corresponding descriptions in a structured layout.",
        focusAreas: [
            "Table has exactly 4 rows and 2 columns (4x2 grid, 8 cells total)",
            "Table has exactly 8 cells (4 genre cells + 4 description cells)",
            "4 genre name cells contain actual genre names (not placeholder text like 'Add a genre name')",
            "Genre names are actual, appropriate genres (e.g., Comedy, Drama, Romance, Documentary)",
            "All 4 genre names are distinct and diverse",
            "4 description cells contain elaboration or placeholder text for the genres",
            "Table structure properly organizes genre names with their corresponding descriptions",
            "Overall table structure and content quality",
        ],
        expectedChanges: [
            "Table is structured as 4x2 format with genre and description rows",
            "4 genre cells are populated with dummy genre names",
            "4 description cells contain elaboration text",
            "Genre names are appropriate and diverse",
        ],
    },
];

