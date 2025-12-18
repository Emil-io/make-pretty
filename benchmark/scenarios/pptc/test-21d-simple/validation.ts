import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "All 3 autoShape rectangles should be preserved",
        slideId: 290,
        filter: { shapeType: "autoShape" },
        expected: 2,
    },
    {
        name: "count_shapes",
        description: "Image should be preserved",
        slideId: 290,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "All 4 textboxes should be preserved",
        slideId: 290,
        filter: { shapeType: "textbox" },
        expected: 4,
    },

    // Bold text validation - both bottom textboxes should have bold text
    {
        name: "includes",
        description: "SlidesCarnival text should be bold",
        slideId: 290,
        shapeId: 491,
        key: "xml",
        expected: 'bold="true"',
    },
    {
        name: "includes",
        description: "Pexels text should be bold",
        slideId: 290,
        shapeId: 492,
        key: "xml",
        expected: 'bold="true"',
    },

    // Text size validation - font size should remain 23.0
    {
        name: "includes",
        description: "SlidesCarnival text should maintain font size 23.0",
        slideId: 290,
        shapeId: 491,
        key: "xml",
        expected: 'size="23.0"',
    },
    {
        name: "includes",
        description: "Pexels text should maintain font size 23.0",
        slideId: 290,
        shapeId: 492,
        key: "xml",
        expected: 'size="23.0"',
    },

    // One-liner validation - text should not wrap to multiple lines
    // Original shapes have only one <p> element - check that text remains single paragraph
    {
        name: "not_includes",
        description: "SlidesCarnival text should remain a one-liner (no line break)",
        slideId: 290,
        shapeId: 491,
        key: "rawText",
        expected: "\n",
    },
    {
        name: "not_includes",
        description: "Pexels text should remain a one-liner (no line break)",
        slideId: 290,
        shapeId: 492,
        key: "rawText",
        expected: "\n",
    },

    // Alignment - bottom textboxes should remain horizontally aligned
    {
        name: "all_are_equal",
        description: "Both bottom textboxes should remain horizontally aligned (same Y)",
        objects: [
            { slideId: 290, shapeId: 491, key: "pos.topLeft[1]" },
            { slideId: 290, shapeId: 492, key: "pos.topLeft[1]" },
        ],
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of bold text formatting",
        slideId: 290,
        autoGenerate: true,
        criteria: "Evaluate if the two bottom text elements have been made bold while remaining one-liners with unchanged text size.",
        focusAreas: [
            "Both 'SlidesCarnival for the presentation template' and 'Pexels for the photos' are bold",
            "Text remains on a single line without wrapping",
            "Font size has not been decreased",
            "Overall layout and alignment preserved",
        ],
        expectedChanges: [
            "Two bottom text elements made bold",
            "Text remains one-liner without size reduction",
        ],
    },
];
