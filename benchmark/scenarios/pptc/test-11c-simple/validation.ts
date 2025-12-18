import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify table structure is preserved
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 262,
        filter: { shapeType: "table" },
        expected: 1,
    },

    // Verify table dimensions are preserved
    {
        name: "includes",
        description: "Table should have 3 rows",
        slideId: 262,
        shapeId: 212,
        key: "rows",
        expected: 3,
    },
    {
        name: "includes",
        description: "Table should have 2 columns",
        slideId: 262,
        shapeId: 212,
        key: "columns",
        expected: 2,
    },

    // Verify right column text content is preserved (column index 1)
    {
        name: "includes",
        description: "Right column row 0 should contain the alternative text",
        slideId: 262,
        shapeId: 212,
        key: "cells[1].text",
        expected: "Discuss an existing alternative people use to address the problem.",
    },
    {
        name: "includes",
        description: "Right column row 1 should contain the alternative text",
        slideId: 262,
        shapeId: 212,
        key: "cells[3].text",
        expected: "Discuss an existing alternative people use to address the problem.",
    },
    {
        name: "includes",
        description: "Right column row 2 should contain the alternative text",
        slideId: 262,
        shapeId: 212,
        key: "cells[5].text",
        expected: "Discuss an existing alternative people use to address the problem.",
    },

    // Boundary test - table should remain within slide boundaries
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 262,
        minMargin: 0,
    },

    // LLM Judge for semantic validation of font size change
    {
        name: "llm_judge",
        description: "LLM evaluation of font size reduction for one-liner text",
        slideId: 262,
        autoGenerate: true,
        criteria: "Evaluate if the font size in the right column of the table has been decreased so that text fits on one line without wrapping.",
        focusAreas: [
            "Text in the right column cells fits on a single line without word wrapping",
            "Font size has been reduced appropriately to achieve one-liner text",
            "Text content in the right column is preserved and readable",
            "Table structure and layout remain intact",
            "Visual consistency between all three right column cells",
        ],
        expectedChanges: [
            "Font size decreased in the right column cells",
            "Text 'Discuss an existing alternative people use to address the problem.' now fits on one line",
            "No text wrapping or line breaks within right column cells",
        ],
    },
];
