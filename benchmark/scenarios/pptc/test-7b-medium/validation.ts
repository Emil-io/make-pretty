import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - After combining numbers with descriptions, should have fewer textboxes
    // Original: 1 title + 3 numbers (1., 2., 3.) + 3 descriptions + 1 empty = 8 textboxes
    // Expected: 1 title + 3 combined (number + description) + 1 empty = 5 textboxes
    {
        name: "count_shapes",
        description: "Should have 5 textboxes after combining numbers with descriptions",
        slideId: 278,
        filter: { shapeType: "textbox" },
        expected: 5,
    },

    // Verify standalone number textboxes no longer exist (rawText exact match)
    {
        name: "count_shapes",
        description: "No standalone '1.' textbox should remain",
        slideId: 278,
        filter: { shapeType: "textbox", rawText: "1." },
        expected: 0,
    },
    {
        name: "count_shapes",
        description: "No standalone '2.' textbox should remain",
        slideId: 278,
        filter: { shapeType: "textbox", rawText: "2." },
        expected: 0,
    },
    {
        name: "count_shapes",
        description: "No standalone '3.' textbox should remain",
        slideId: 278,
        filter: { shapeType: "textbox", rawText: "3." },
        expected: 0,
    },

    // Verify combined textboxes contain both number and description text
    {
        name: "count_shapes",
        description: "Should have 1 textbox containing '1.' with Canva description",
        slideId: 278,
        filter: { shapeType: "textbox", rawTextContains: "1." },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "Should have 1 textbox containing '2.' with Share description",
        slideId: 278,
        filter: { shapeType: "textbox", rawTextContains: "2." },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "Should have 1 textbox containing '3.' with PowerPoint description",
        slideId: 278,
        filter: { shapeType: "textbox", rawTextContains: "3." },
        expected: 1,
    },

    // Alignment - All 3 combined step textboxes should be left-aligned at same X position
    {
        name: "filtered_equality",
        description: "Combined step textboxes should be left-aligned at same X",
        slideId: 278,
        filter: { shapeType: "textbox", rawTextContains: "on the" },
        key: "pos.topLeft[0]",
        minMatchCount: 1,
    },

    // Check all steps are left-aligned at the same X position using multi-filter
    {
        name: "filtered_equality",
        description: "All 3 step textboxes should be vertically aligned (same left X)",
        slideId: 278,
        filters: [
            { shapeType: "textbox", rawTextContains: "1." },
            { shapeType: "textbox", rawTextContains: "2." },
            { shapeType: "textbox", rawTextContains: "3." },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // LLM judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of text merging task",
        slideId: 278,
        autoGenerate: true,
        criteria: "Evaluate if the numbers (1., 2., 3.) were properly combined with their corresponding descriptions into single textboxes, with text right next to numbers.",
        focusAreas: [
            "Each step number (1., 2., 3.) is in the same textbox as its description",
            "Numbers appear at the beginning followed by the description text",
            "Left alignment is maintained for all step textboxes",
        ],
        expectedChanges: [
            "Numbers 1., 2., 3. combined with their descriptions into single textboxes",
            "Separate standalone number textboxes removed",
        ],
    },
];
