import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify table exists
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 266,
        filter: {
            shapeType: "table",
        },
        expected: 1,
    },

    // Verify table has 5 columns (4 existing + 1 new Q1 column)
    {
        name: "includes",
        description: "Table should have exactly 5 columns after adding Q1",
        slideId: 266,
        shapeId: 243,
        key: "columns",
        expected: 5,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },

    // LLM Judge test for overall task completion
    {
        name: "llm_judge",
        description: "LLM evaluation of whether a 5th column with Q1 has been added to the quarterly table",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the slide successfully completes the requested task: adding a 5th column to the right side of the quarterly calendar table with 'Q1' (or '1ST QUARTER') header and the months January, February, March, while appropriately resizing all text and columns to maintain a balanced layout. The initial table had 4 columns (1ST, 2ND, 3RD, 4TH QUARTER), and now should have 5 columns total.",
        focusAreas: [
            "A 5th column has been added to the right side of the table (table now has 5 columns instead of 4)",
            "The new 5th column has 'Q1' or '1ST QUARTER' as its header",
            "The new column contains the months January, February, and March (Q1 months) in appropriate rows",
            "All 5 columns are now evenly distributed across the table width",
            "Existing columns (2ND, 3RD, 4TH QUARTER and their months) remain intact with their original content",
            "Text has been resized appropriately to fit all 5 columns within the slide boundaries",
            "Column widths are consistent across all 5 quarters",
            "The table maintains proper alignment and professional appearance",
            "All text remains readable after resizing",
            "The table fits well within the slide boundaries without overflow"
        ],
        expectedChanges: [
            "Table expanded from 4 columns to 5 columns",
            "New 5th column added with 'Q1' or '1ST QUARTER' header on the right side",
            "Q1 months (January, February, March) added to the new column cells",
            "Existing 4 columns compressed/resized to accommodate the new column",
            "All 5 columns redistributed evenly across the table width",
            "Text resized for proper fit and readability",
            "Maintained table structure and professional appearance"
        ],
    },
];
