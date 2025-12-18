import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 257 | Task: Align content and headings that are off
// Issues: "Canva" heading (id:107) at Y:381.9, others at Y:420
// Expected: All 3 section headings aligned at same Y

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "3 heading textboxes", slideId: 257, filter: { shapeType: "textbox", rawTextContains: "Slides|PowerPoint|Canva" }, expected: 3 },
    { name: "count_shapes", description: "All textboxes preserved", slideId: 257, filter: { shapeType: "textbox" }, expected: 6 },

    // Heading alignment - all 3 section headings should be at same Y
    {
        name: "all_are_equal",
        description: "Section headings (Google Slides, PowerPoint, Canva) should be horizontally aligned",
        objects: [
            { slideId: 257, shapeId: 99, key: "pos.topLeft[1]" },  // Google Slides
            { slideId: 257, shapeId: 103, key: "pos.topLeft[1]" }, // PowerPoint
            { slideId: 257, shapeId: 107, key: "pos.topLeft[1]" }, // Canva
        ],
    },

    // Content alignment - bullet point sections should have consistent Y
    {
        name: "all_are_equal",
        description: "Content textboxes should have aligned top positions",
        objects: [
            { slideId: 257, shapeId: 121, key: "pos.topLeft[1]" }, // Google Slides content
            { slideId: 257, shapeId: 100, key: "pos.topLeft[1]" }, // PowerPoint content
            { slideId: 257, shapeId: 104, key: "pos.topLeft[1]" }, // Canva content
        ],
    },

    // Horizontal spacing - headings evenly spaced
    {
        name: "filtered_spacing",
        description: "Section headings should have equal horizontal spacing",
        slideId: 257,
        filter: { shapeType: "textbox", rawTextContains: "Slides|PowerPoint|Canva" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 257, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of alignment corrections",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if content and headings that were misaligned have been properly aligned.",
        focusAreas: [
            "All 3 section headings (Google Slides, PowerPoint, Canva) are horizontally aligned at the same Y position",
            "Content bullet lists are aligned with their respective headings",
            "Visual consistency and professional appearance maintained",
            "Spacing between sections is balanced",
        ],
        expectedChanges: [
            "Canva heading aligned with Google Slides and PowerPoint headings",
            "Content sections aligned consistently",
            "Overall layout appears balanced and professional",
        ],
    },
];
