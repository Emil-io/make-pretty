import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide: 960x540 | Task: Increase font size of texts on the right (currently 10pt)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "4 textboxes preserved", slideId: 283, filter: { shapeType: "textbox" }, expected: 4 },
    { name: "count_shapes", description: "3 images preserved", slideId: 283, filter: { shapeType: "image" }, expected: 3 },

    // Right textboxes (670, 671) should have increased font size (original was 10pt)
    { name: "greater_than", description: "Right text 1 font size increased", slideId: 283, shapeId: 670, key: "fontSize", expected: 10 },
    { name: "greater_than", description: "Right text 2 font size increased", slideId: 283, shapeId: 671, key: "fontSize", expected: 10 },

    // Right textboxes should have equal font size after increase
    {
        name: "all_are_equal",
        description: "Right textboxes have equal font size",
        objects: [
            { slideId: 283, shapeId: 670, key: "fontSize" },
            { slideId: 283, shapeId: 671, key: "fontSize" },
        ],
    },

    // Alignment: Right textboxes should remain horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "Right textboxes Y-aligned",
        objects: [
            { slideId: 283, shapeId: 670, key: "pos.topLeft[1]" },
            { slideId: 283, shapeId: 671, key: "pos.topLeft[1]" },
        ],
    },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 283, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of font size increase",
        slideId: 283,
        autoGenerate: true,
        criteria: "Evaluate if the texts on the right side have been increased in size while maintaining layout.",
        focusAreas: [
            "Right-side text boxes have larger font size than original 10pt",
            "Font size increase is reasonable and readable",
            "Both right-side textboxes have consistent font size",
            "Alignment and layout preserved after resizing",
        ],
        expectedChanges: [
            "Font size of right textboxes increased from 10pt",
            "Text remains readable and properly formatted",
        ],
    },
];
