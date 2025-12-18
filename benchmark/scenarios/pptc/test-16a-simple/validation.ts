import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify textboxes are preserved
    {
        name: "count_shapes",
        description: "There should be 14 textbox shapes on the slide",
        slideId: 283,
        filter: { shapeType: "textbox" },
        expected: 14,
    },

    // Top headings alignment: "Credits" (left) and "Fonts In this Presentation" (right)
    {
        name: "filtered_equality",
        description: "Top headings should be horizontally aligned (same Y)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Credits" },
            { shapeType: "textbox", rawText: "Fonts In this Presentation" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Subheadings below main titles should be aligned
    {
        name: "filtered_equality",
        description: "Subheadings below titles should be horizontally aligned",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawTextContains: "This presentation template is free" },
            { shapeType: "textbox", rawTextContains: "This presentation\ntemplate uses" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // First orange text items alignment: "SlidesCarnival" (left) with "Titles" (right)
    {
        name: "filtered_equality",
        description: "First orange text items should be horizontally aligned (SlidesCarnival with Titles)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawTextContains: "SlidesCarnival" },
            { shapeType: "textbox", rawText: "Titles" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // First subheadings alignment: left "for the presentation template" with "Bungee Outline"
    {
        name: "filtered_equality",
        description: "First subheadings should be aligned (for the presentation template with Bungee Outline)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Bungee Outline" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 1,
    },

    // Second orange text items alignment: "Pexels" (left) with "Body Copy" (right)
    // The third spot (Headers) should be left open, so Pexels aligns with Body Copy
    {
        name: "filtered_equality",
        description: "Second orange text items should be aligned (Pexels with Body Copy)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Pexels" },
            { shapeType: "textbox", rawText: "Body Copy" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Second subheadings alignment: left "for the presentation template" with "Lato"
    {
        name: "filtered_equality",
        description: "Second subheadings should be aligned (for the presentation template with Lato)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Lato" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 1,
    },

    // Left column vertical alignment check (center X should match)
    {
        name: "filtered_equality",
        description: "Left column items should be vertically aligned (same center X)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Credits" },
            { shapeType: "textbox", rawTextContains: "SlidesCarnival" },
            { shapeType: "textbox", rawText: "Pexels" },
        ],
        key: "pos.center[0]",
        minMatchCount: 3,
    },

    // Right column vertical alignment check (center X should match)
    {
        name: "filtered_equality",
        description: "Right column items should be vertically aligned (same center X)",
        slideId: 283,
        filters: [
            { shapeType: "textbox", rawText: "Fonts In this Presentation" },
            { shapeType: "textbox", rawText: "Titles" },
            { shapeType: "textbox", rawText: "Headers" },
            { shapeType: "textbox", rawText: "Body Copy" },
        ],
        key: "pos.center[0]",
        minMatchCount: 4,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of alignment between left and right sections",
        slideId: 283,
        autoGenerate: true,
        criteria: "Evaluate if the orange text and subheadings on the left side are properly aligned at the same height as corresponding items on the right side, with the third spot left open.",
        focusAreas: [
            "Credits and Fonts In this Presentation headings are at the same Y position",
            "SlidesCarnival and Titles orange text items are horizontally aligned",
            "Pexels and Body Copy orange text items are horizontally aligned (skipping Headers spot)",
            "Subheadings below each orange text are properly aligned with their right-side counterparts",
            "The third spot on the left (where Headers would be) is intentionally left empty",
            "Overall visual balance and symmetry between left and right columns",
        ],
        expectedChanges: [
            "Left column orange text repositioned to align with right column counterparts",
            "Left column subheadings repositioned to align with right column counterparts",
            "Third spot on left side left open (no content at Headers/Bungee level)",
        ],
    },
];
