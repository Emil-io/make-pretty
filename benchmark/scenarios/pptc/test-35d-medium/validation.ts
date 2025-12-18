import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-35d: Add a 5th table to the right (Q1 - copy from the left) and make it fit the slide
//
// Task: Copy the Q1 (1ST QUARTER) table and add it as a 5th table on the right,
//       resize and distribute all tables to fit the slide
// Initial state: 4 tables (Q1, Q2, Q3, Q4) representing quarterly timelines
// Expected: 5 tables total, evenly distributed, all fitting within slide boundaries

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: TABLE COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 5 tables after adding the new Q1 table",
        slideId: 270,
        filter: { shapeType: "table" },
        expected: 5,
    },

    // ============================================
    // SECTION 2: NEW TABLE CONTENT VERIFICATION
    // ============================================
    // The new 5th table should be a copy of Q1, so it should have "1ST QUARTER" as header
    // We can't test by specific shapeId since it will be new, but LLM judge will verify

    // ============================================
    // SECTION 3: TABLE STRUCTURE VERIFICATION
    // ============================================
    // Verify original tables are preserved
    {
        name: "includes",
        description: "Original Q1 table should still exist with '1ST QUARTER' header",
        slideId: 270,
        shapeId: 2168,
        key: "cells[0].text",
        expected: "1ST QUARTER",
    },
    {
        name: "includes",
        description: "Q2 table should be preserved with '2ND QUARTER' header",
        slideId: 270,
        shapeId: 2169,
        key: "cells[0].text",
        expected: "2ND QUARTER",
    },
    {
        name: "includes",
        description: "Q3 table should be preserved with '3RD QUARTER' header",
        slideId: 270,
        shapeId: 2170,
        key: "cells[0].text",
        expected: "3RD QUARTER",
    },
    {
        name: "includes",
        description: "Q4 table should be preserved with '4TH QUARTER' header",
        slideId: 270,
        shapeId: 2171,
        key: "cells[0].text",
        expected: "4TH QUARTER",
    },

    // ============================================
    // SECTION 4: TABLE DIMENSIONS
    // ============================================
    // Verify original Q1 table structure
    {
        name: "includes",
        description: "Q1 table should have 7 rows",
        slideId: 270,
        shapeId: 2168,
        key: "rows",
        expected: 7,
    },
    {
        name: "includes",
        description: "Q1 table should have 1 column",
        slideId: 270,
        shapeId: 2168,
        key: "columns",
        expected: 1,
    },

    // ============================================
    // SECTION 5: ALIGNMENT TESTS
    // ============================================
    {
        name: "filtered_equality",
        description: "All 5 tables should be horizontally aligned (same Y position)",
        slideId: 270,
        filter: { shapeType: "table" },
        key: "pos.topLeft[1]", // Y coordinate
        minMatchCount: 5,
    },
    {
        name: "filtered_equality",
        description: "All 5 tables should have equal height",
        slideId: 270,
        filter: { shapeType: "table" },
        key: "size.h",
        minMatchCount: 5,
    },

    // ============================================
    // SECTION 6: DISTRIBUTION TESTS
    // ============================================
    {
        name: "filtered_spacing",
        description: "All 5 tables should have equal horizontal spacing",
        slideId: 270,
        filter: { shapeType: "table" },
        direction: "horizontal",
        minMatchCount: 5,
    },
    {
        name: "slide_fill_distribution",
        description: "Tables should fill at least 75% of slide width",
        slideId: 270,
        filter: { shapeType: "table" },
        minFillPercentage: 75,
    },

    // ============================================
    // SECTION 7: BOUNDARY TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin and fit within slide",
        slideId: 270,
        minMargin: 10,
    },

    // ============================================
    // SECTION 8: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of Q1 table duplication and layout adjustments",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if a 5th table (copy of Q1 with '1ST QUARTER' header) has been added to the right side, and all 5 tables are properly resized and distributed to fit the slide.",
        focusAreas: [
            "A 5th table exists on the slide, positioned to the right of Q4",
            "The new 5th table is a copy of Q1 (contains '1ST QUARTER' header and Q1 months: January, February, March)",
            "All 5 tables are evenly distributed horizontally across the slide",
            "Tables are horizontally aligned at the same Y-coordinate",
            "All tables have been resized appropriately to fit within the slide boundaries",
            "Equal spacing maintained between all adjacent tables",
        ],
        expectedChanges: [
            "New 5th table added with Q1 content (1ST QUARTER, January, February, March)",
            "5 tables evenly distributed across slide width",
            "Tables resized to fit within slide boundaries",
            "Consistent spacing and alignment maintained",
        ],
    },
];
