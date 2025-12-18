import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all main shapes are preserved
    {
        name: "count_shapes",
        description: "All 3 team member images should be preserved",
        slideId: 280,
        filter: { shapeType: "image" },
        expected: 3,
    },

    // Row layout: Images should now be vertically stacked (same X coordinate)
    {
        name: "filtered_equality",
        description: "All 3 images should be vertically aligned (same X coordinate) for row layout",
        slideId: 280,
        filter: { shapeType: "image" },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Vertical spacing: Images should be evenly spaced vertically
    {
        name: "filtered_spacing",
        description: "Images should have equal vertical spacing between rows",
        slideId: 280,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 3,
    },

    // Size consistency: Images should maintain equal dimensions
    {
        name: "filtered_equality",
        description: "All images should have equal width",
        slideId: 280,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 3,
    },

    {
        name: "filtered_equality",
        description: "All images should have equal height",
        slideId: 280,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 3,
    },

    // Name labels should be horizontally aligned with their images (same Y or close)
    {
        name: "filtered_equality",
        description: "Name labels should be vertically aligned (same X for text column)",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Surname" },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Title labels should be vertically aligned
    {
        name: "filtered_equality",
        description: "Title labels should be vertically aligned (same X for text column)",
        slideId: 280,
        filter: { shapeType: "textbox", rawText: "Title" },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of layout transformation",
        slideId: 280,
        autoGenerate: true,
        criteria: "Evaluate if the slide layout has been properly transformed: title on left third (vertically centered, one word per row) and team members as 3 horizontal rows on the right 2/3 with text to the right of each picture.",
        focusAreas: [
            "'Meet Our Team' is positioned in the left third of the slide",
            "Title text is split into separate rows (Meet, Our, Team) and vertically centered",
            "Three team members are arranged as horizontal rows instead of columns",
            "Each team member image is on the left with name/title text to its right",
            "Team member rows are evenly spaced in the right 2/3 of the slide",
            "Overall layout is balanced and professional",
        ],
        expectedChanges: [
            "Title moved to left third with words stacked vertically",
            "Team images rearranged from columns to rows",
            "Text positioned to the right of each image",
            "Layout occupies correct slide proportions (1/3 + 2/3)",
        ],
    },
];
