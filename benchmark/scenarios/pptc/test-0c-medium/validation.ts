import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide: 1920x1080 | Task: Swap left/right sides, all text right-aligned
// Original: Image on right (~989-1780), text on left (~108-960)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "1 image preserved", slideId: 278, filter: { shapeType: "image" }, expected: 1 },
    { name: "count_shapes", description: "7 textboxes preserved", slideId: 278, filter: { shapeType: "textbox" }, expected: 7 },

    // Layout swap - image now on left (X < 960 = midpoint)
    { name: "less_than", description: "Image on left side", slideId: 278, shapeId: 290, key: "pos.topLeft[0]", expected: 960 },

    // Text now on right side (X > 900)
    { name: "greater_than", description: "Title on right side", slideId: 278, shapeId: 291, key: "pos.topLeft[0]", expected: 900 },
    { name: "greater_than", description: "Email label on right", slideId: 278, shapeId: 293, key: "pos.topLeft[0]", expected: 900 },
    { name: "greater_than", description: "Social Media label on right", slideId: 278, shapeId: 295, key: "pos.topLeft[0]", expected: 900 },
    { name: "greater_than", description: "Call us label on right", slideId: 278, shapeId: 297, key: "pos.topLeft[0]", expected: 900 },

    // Text right-alignment in XML (spot check key textboxes)
    { name: "includes", description: "Title right-aligned", slideId: 278, shapeId: 291, key: "xml", expected: 'align="right"' },
    { name: "includes", description: "Email right-aligned", slideId: 278, shapeId: 294, key: "xml", expected: 'align="right"' },
    { name: "includes", description: "Social handle right-aligned", slideId: 278, shapeId: 296, key: "xml", expected: 'align="right"' },
    { name: "includes", description: "Phone right-aligned", slideId: 278, shapeId: 298, key: "xml", expected: 'align="right"' },

    // Alignment - all text right edges aligned
    { name: "filtered_equality", description: "Textboxes right-edge aligned", slideId: 278, filter: { shapeType: "textbox" }, key: "pos.bottomRight[0]", minMatchCount: 6 },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 278, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of layout swap and text alignment",
        slideId: 278,
        autoGenerate: true,
        criteria: "Evaluate if the slide swaps left/right sections and applies right text alignment.",
        focusAreas: [
            "Image positioned on left side of slide",
            "All text content moved to right side",
            "Text paragraphs right-aligned within textboxes",
            "Visual balance and professional appearance",
        ],
        expectedChanges: [
            "Image moved from right to left",
            "Text moved from left to right",
            "All text right-aligned",
        ],
    },
];
