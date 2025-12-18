import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "All 7 shapes should be preserved on the slide",
        slideId: 256,
        expected: 7,
    },

    // Count textboxes
    {
        name: "count_shapes",
        description: "There should be 2 textboxes on the slide",
        slideId: 256,
        filter: { shapeType: "textbox" },
        expected: 2,
    },

    // The textboxes should maintain left alignment (same X coordinate)
    {
        name: "filtered_equality",
        description: "Both textboxes should remain left-aligned at the same X position",
        slideId: 256,
        filter: { shapeType: "textbox" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of textbox width fix to prevent text overflow",
        slideId: 256,
        autoGenerate: true,
        criteria: "Evaluate if the 'Mother's Day' textbox has been widened to prevent the 's' from 'Mother's' flowing into a new row.",
        focusAreas: [
            "The word 'Mother's' is fully displayed on a single line without overflow",
            "The textbox width has been increased to accommodate the text",
            "The text 'Day' remains on its own line below 'Mother's'",
            "The overall visual appearance and positioning of the textbox is maintained",
        ],
        expectedChanges: [
            "Textbox containing 'Mother's Day' is wider",
            "The 's' from 'Mother's' no longer wraps to a new line",
        ],
    },
];
