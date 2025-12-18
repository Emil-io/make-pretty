import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Verify table exists
    {
        name: "count_shapes",
        description: "There should be exactly 1 table shape",
        slideId: 264,
        filter: { shapeType: "table" },
        expected: 1,
    },

    // Verify table now has 5 rows (was 4)
    {
        name: "includes",
        description: "Table should have 5 rows after adding new row",
        slideId: 264,
        shapeId: 733,
        key: "rows",
        expected: 5,
    },

    // Verify table still has 1 column
    {
        name: "includes",
        description: "Table should still have 1 column",
        slideId: 264,
        shapeId: 733,
        key: "columns",
        expected: 1,
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of table row addition",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if a 5th row has been added to the table with 'Add text' as placeholder text.",
        focusAreas: [
            "Table now contains 5 rows instead of 4",
            "The new 5th row contains 'Add text' as placeholder text",
            "Table maintains consistent formatting and styling with existing rows",
            "Table dimensions adjusted appropriately for the new row"
        ],
        expectedChanges: [
            "New row added to the table",
            "5th row contains 'Add text' placeholder",
            "Table structure remains intact"
        ],
    },
];
