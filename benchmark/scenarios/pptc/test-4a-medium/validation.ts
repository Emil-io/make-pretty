import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-4a: Add a fifth column "CHANGES" to the SWOT table
// Initial state: Table has 3 rows x 4 columns (S, W, O, T)
// Expected: Table has 3 rows x 5 columns (S, W, O, T, CHANGES) with good questions

export const Test: TChangesetTestProtocol = [
    // Count - verify table exists
    { name: "count_shapes", description: "1 table", slideId: 269, filter: { shapeType: "table" }, expected: 1 },

    // Table structure - 5 columns after adding CHANGES
    { name: "equals", description: "Table has 5 columns", slideId: 269, shapeId: 452, key: "columns", expected: 5 },
    { name: "equals", description: "Table has 3 rows", slideId: 269, shapeId: 452, key: "rows", expected: 3 },
    { name: "equals", description: "Table has 15 cells (3x5)", slideId: 269, shapeId: 452, key: "cells.length", expected: 15 },

    // Fifth column header should contain "C" or "CHANGES"
    { name: "includes", description: "Fifth column header contains C", slideId: 269, shapeId: 452, key: "cells[4].text", expected: "C" },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 269, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of CHANGES column addition",
        slideId: 269,
        autoGenerate: true,
        criteria: "Evaluate if a fifth column 'CHANGES' was added to the SWOT table with appropriate questions, and table is properly aligned.",
        focusAreas: [
            "Fifth column added with 'CHANGES' header (or 'C')",
            "Column contains relevant questions about change management",
            "Table maintains consistent alignment and spacing",
            "Table fits within slide boundaries",
        ],
        expectedChanges: [
            "Fifth column 'CHANGES' added to right of table",
            "Questions added for the CHANGES column",
            "Table realigned to accommodate new column",
        ],
    },
];
