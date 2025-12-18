import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes preserved
    {
        name: "count_shapes",
        description: "There should be 3 tables (nonogram grids)",
        slideId: 293,
        filter: { shapeType: "table" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "There should be 4 textboxes (title + 3 explanations)",
        slideId: 293,
        filter: { shapeType: "textbox" },
        expected: 4,
    },

    // Layout checks - textboxes should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "The 3 explanation textboxes should be horizontally aligned (same Y)",
        slideId: 293,
        filters: [
            { shapeType: "textbox", rawTextContains: "Look at the numbers" },
            { shapeType: "textbox", rawTextContains: "consecutive black cells" },
            { shapeType: "textbox", rawTextContains: "1 black cell followed" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Tables should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "The 3 tables should be horizontally aligned (same Y)",
        slideId: 293,
        filter: { shapeType: "table" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Tables should have equal size
    {
        name: "filtered_equality",
        description: "Tables should have equal width",
        slideId: 293,
        filter: { shapeType: "table" },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "Tables should have equal height",
        slideId: 293,
        filter: { shapeType: "table" },
        key: "size.h",
        minMatchCount: 3,
    },

    // Tables should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Tables should have equal horizontal spacing",
        slideId: 293,
        filter: { shapeType: "table" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for content shift validation
    {
        name: "llm_judge",
        description: "LLM evaluation of text content rotation",
        slideId: 293,
        autoGenerate: true,
        criteria: "Evaluate if the text content of the three explanation textboxes has been shifted one position to the right (circular rotation).",
        focusAreas: [
            "The leftmost textbox now contains the text that was originally in the rightmost textbox (about '1 black cell followed by 3 black cells')",
            "The middle textbox now contains the text that was originally in the leftmost textbox (about 'Look at the numbers on the sides')",
            "The rightmost textbox now contains the text that was originally in the middle textbox (about 'three consecutive black cells')",
            "All three explanation textboxes still exist and contain meaningful content",
            "The overall layout and positioning of textboxes is preserved",
        ],
        expectedChanges: [
            "Text content rotated one position to the right across the three explanation textboxes",
            "Leftmost box now has rightmost content, middle has leftmost content, rightmost has middle content",
            "Layout and visual appearance of textboxes preserved",
        ],
    },
];
