import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-26e-table: Add two more "feature" rows to the table of the Asia table
//
// Task: Add two more "feature" rows to the Asia table (same formatting as other tables)
// Initial state: Asia table has 2 filled feature rows, Australia has 4, Europe has 6
// Expected: Asia table should have 4 filled feature rows (matching Australia pattern)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: TABLE STRUCTURE VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have exactly 3 tables (one per pricing package)",
        slideId: 274,
        filter: { shapeType: "table" },
        expected: 5, // 3 main tables + 2 smaller tables
    },

    // ============================================
    // SECTION 2: ASIA TABLE STRUCTURE
    // ============================================
    {
        name: "includes",
        description: "Asia table should still have 6 total rows",
        slideId: 274,
        shapeId: 497,
        key: "rows",
        expected: 6,
    },
    {
        name: "includes",
        description: "Asia table should have 1 column",
        slideId: 274,
        shapeId: 497,
        key: "columns",
        expected: 1,
    },

    // ============================================
    // SECTION 3: ASIA TABLE CONTENT VERIFICATION
    // ============================================
    // Check that first 4 cells now have feature text (instead of just 2)
    {
        name: "includes",
        description: "Asia table row 0 should have feature text",
        slideId: 274,
        shapeId: 497,
        key: "cells[0].text",
        expected: "Add. a feature",
    },
    {
        name: "includes",
        description: "Asia table row 1 should have feature text",
        slideId: 274,
        shapeId: 497,
        key: "cells[1].text",
        expected: "Add. a feature",
    },
    // These two are the NEW rows that should be added:
    {
        name: "includes",
        description: "Asia table row 2 should now have feature text (NEW)",
        slideId: 274,
        shapeId: 497,
        key: "cells[2].text",
        expected: "Add. a feature",
    },
    {
        name: "includes",
        description: "Asia table row 3 should now have feature text (NEW)",
        slideId: 274,
        shapeId: 497,
        key: "cells[3].text",
        expected: "Add. a feature",
    },

    // ============================================
    // SECTION 4: OTHER PACKAGES PRESERVED
    // ============================================
    {
        name: "includes",
        description: "Asia package label should remain",
        slideId: 274,
        shapeId: 499,
        key: "rawText",
        expected: "Asia",
    },
    {
        name: "includes",
        description: "Australia package label should remain",
        slideId: 274,
        shapeId: 494,
        key: "rawText",
        expected: "Australia",
    },
    {
        name: "includes",
        description: "Europe package label should remain",
        slideId: 274,
        shapeId: 504,
        key: "rawText",
        expected: "Europe",
    },
    {
        name: "includes",
        description: "Asia price should remain $200",
        slideId: 274,
        shapeId: 498,
        key: "rawText",
        expected: "200$",
    },

    // ============================================
    // SECTION 5: LAYOUT PRESERVATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should still have 3 package icons/images",
        slideId: 274,
        filter: { shapeType: "image" },
        expected: 4, // Background + 3 icons
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 274,
        minMargin: 10,
    },

    // ============================================
    // SECTION 6: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of Asia table feature row additions",
        slideId: 274,
        autoGenerate: true,
        criteria: "Evaluate if the Asia pricing package table has been updated with two additional feature rows that match the formatting and style of the other pricing packages.",
        focusAreas: [
            "Asia table now has 4 feature rows with text (increased from 2)",
            "New feature rows have consistent text content ('Add. a feature' or similar)",
            "Formatting of new rows matches existing rows in the Asia table",
            "Asia table structure is consistent with Australia table (both having 4 filled rows)",
        ],
        expectedChanges: [
            "Two new feature rows added to Asia table (rows 2 and 3)",
            "Feature rows contain appropriate placeholder text",
            "Overall layout and spacing preserved",
        ],
    },
];
