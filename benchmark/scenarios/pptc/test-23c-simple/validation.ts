import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes are preserved
    {
        name: "count_shapes",
        description: "There should be 6 image shapes",
        slideId: 288,
        filter: { shapeType: "image" },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "There should be 1 textbox for the caption",
        slideId: 288,
        filter: { shapeType: "textbox" },
        expected: 1,
    },

    // Verify the instruction text was replaced (should not contain the original instruction)
    {
        name: "not_includes",
        description: "Textbox should not contain the original instruction text",
        slideId: 288,
        shapeId: 404,
        key: "rawText",
        expected: "Write a caption for the photos",
    },

    // Alignment tests - images should share some X coordinates (left column alignment)
    {
        name: "filtered_equality",
        description: "Some images should be vertically aligned (same X coordinate)",
        slideId: 288,
        filter: { shapeType: "image" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Size tests - the two right-side images should have equal width
    {
        name: "filtered_equality",
        description: "Right column images should have equal width",
        slideId: 288,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 2,
    },

    // Boundary test - all shapes should be within slide margins
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 288,
        minMargin: 0,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of caption writing task",
        slideId: 288,
        autoGenerate: true,
        criteria: "Evaluate if the instruction text was replaced with an appropriate caption for the photos shown on the slide.",
        focusAreas: [
            "The original instruction 'Write a caption for the photos' has been replaced",
            "A new caption is written that relates to the photos on the slide",
            "The caption is appropriate and descriptive for a photo collage",
            "The textbox position and formatting are preserved",
        ],
        expectedChanges: [
            "Instruction text replaced with a meaningful caption",
            "Caption describes or relates to the photos",
            "Original layout and image positions maintained",
        ],
    },
];
