import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - Marcos removed
    {
        name: "count_shapes",
        description: "Should have 3 circular images after removing Marcos",
        slideId: 295,
        filter: { shapeType: "image" },
        expected: 3,
    },

    {
        name: "count_shapes",
        description: "Should have 3 team member textboxes after removing Marcos",
        slideId: 295,
        filter: { shapeType: "textbox", rawTextContains: "JOB TITLE" },
        expected: 3,
    },

    // Verify Marcos is removed
    {
        name: "count_shapes",
        description: "Marcos Galán textbox should be removed",
        slideId: 295,
        filter: { shapeType: "textbox", rawTextContains: "Marcos" },
        expected: 0,
    },

    // Horizontal row layout - each image and text pair should be in the same row (same Y)
    // Images should be vertically aligned (stacked in rows - same X)
    {
        name: "filtered_equality",
        description: "All 3 images should be vertically aligned (same X - forming rows)",
        slideId: 295,
        filter: { shapeType: "image" },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Textboxes should be vertically aligned (same X)
    {
        name: "filtered_equality",
        description: "All 3 textboxes should be vertically aligned (same X - forming rows)",
        slideId: 295,
        filter: { shapeType: "textbox", rawTextContains: "JOB TITLE" },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Vertical spacing between rows should be equal
    {
        name: "filtered_spacing",
        description: "Images should have equal vertical spacing between rows",
        slideId: 295,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 3,
    },

    // Images should maintain equal size
    {
        name: "filtered_equality",
        description: "All images should have equal width",
        slideId: 295,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 3,
    },

    {
        name: "filtered_equality",
        description: "All images should have equal height",
        slideId: 295,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 3,
    },

    // LLM judge for overall layout
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal row layout transformation",
        slideId: 295,
        criteria: "Evaluate if Marcos Galán was removed and the remaining 3 team members are arranged as horizontal rows instead of columns.",
        focusAreas: [
            "Marcos Galán (image and textbox) has been completely removed",
            "The 3 remaining team members (Imani, Ixchel, Nils) are arranged in horizontal rows",
            "Each row contains an image and corresponding text side by side",
            "Rows are vertically stacked with consistent spacing",
            "Overall layout is balanced and visually appealing",
        ],
        expectedChanges: [
            "Marcos Galán removed from the slide",
            "Layout changed from 4 columns to 3 horizontal rows",
            "Each team member's image and text arranged horizontally in a row",
            "Consistent vertical spacing between the 3 rows",
        ],
    },
];
