import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 257 | Task: Underline the heading and the subheadings that are in the stars
// Heading (id: 103): "How to Use This Presentation"
// Subheadings (id: 105, 107, 109): "Google Slides", "PowerPoint", "Canva"

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes preserved
    {
        name: "count_shapes",
        description: "All textboxes should be preserved",
        slideId: 257,
        filter: { shapeType: "textbox" },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "All autoShapes should be preserved",
        slideId: 257,
        filter: { shapeType: "autoShape" },
        expected: 5,
    },

    // Alignment tests - subheadings should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Subheadings (Google Slides, PowerPoint, Canva) should be horizontally aligned at same Y",
        slideId: 257,
        filter: { shapeType: "textbox", rawTextContains: "Google Slides|PowerPoint|Canva" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Layout preservation - subheadings should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Subheadings should have equal horizontal spacing",
        slideId: 257,
        filter: { shapeType: "textbox", rawTextContains: "Google Slides|PowerPoint|Canva" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Subheadings should have equal width
    {
        name: "filtered_equality",
        description: "Subheadings should have equal width",
        slideId: 257,
        filter: { shapeType: "textbox", rawTextContains: "Google Slides|PowerPoint|Canva" },
        key: "size.w",
        minMatchCount: 3,
    },

    // Boundary check - all shapes within slide
    {
        name: "within_boundaries",
        description: "All shapes should be within slide boundaries",
        slideId: 257,
        minMargin: 0,
    },

    // LLM Judge - for semantic validation of underlining
    {
        name: "llm_judge",
        description: "LLM evaluation of text underlining",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the heading and subheadings have been properly underlined as requested.",
        focusAreas: [
            "Main heading 'How to Use This Presentation' is underlined",
            "Subheading 'Google Slides' is underlined",
            "Subheading 'PowerPoint' is underlined",
            "Subheading 'Canva' is underlined",
            "Body text (instructions) should NOT be underlined",
            "Overall visual appearance and readability maintained",
        ],
        expectedChanges: [
            "Heading text underlined",
            "All three subheadings (Google Slides, PowerPoint, Canva) underlined",
            "No other text formatting changes",
        ],
    },
];
