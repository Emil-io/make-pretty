import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify textbox with content still exists
    {
        name: "count_shapes",
        description: "There should be at least 1 textbox containing 'Data Science Consulting'",
        slideId: 256,
        filter: { shapeType: "textbox", rawTextContains: "Consulting" },
        expected: 1,
    },

    // Count test - verify total textbox count
    {
        name: "count_shapes",
        description: "Textboxes should be preserved (company name + title text)",
        slideId: 256,
        filter: { shapeType: "textbox", rawTextContains: "Data" },
        expected: 1,
    },

    // LLM Judge for semantic validation of text overflow fix
    {
        name: "llm_judge",
        description: "LLM evaluation of text overflow fix",
        slideId: 256,
        autoGenerate: true,
        criteria:
            "Evaluate if the 'Consulting' text overflow issue has been fixed by properly placing 'Consulting' on a new row/line",
        focusAreas: [
            "'Consulting' is no longer overflowing beyond the visible slide area",
            "'Consulting' appears on a new line/row below 'Data Science'",
            "The text 'Data Science Consulting' is still readable and complete",
            "Text layout maintains visual hierarchy and professional appearance",
        ],
        expectedChanges: [
            "'Consulting' moved to a new row/line",
            "Text overflow issue resolved",
            "Text remains fully visible within the slide boundaries",
        ],
    },
];
