import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all images are preserved
    {
        name: "count_shapes",
        description: "There should be 6 image shapes on the slide",
        slideId: 283,
        filter: { shapeType: "image" },
        expected: 6,
    },

    // Main images row alignment - 4 images should be horizontally aligned
    {
        name: "filtered_equality",
        description: "The 4 main team member images should be horizontally aligned (same Y)",
        slideId: 283,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Images should have equal width
    {
        name: "filtered_equality",
        description: "Main images should have equal width",
        slideId: 283,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 4,
    },

    // Images should have equal height
    {
        name: "filtered_equality",
        description: "Main images should have equal height",
        slideId: 283,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 4,
    },

    // Images should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Main images should have equal horizontal spacing",
        slideId: 283,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 4,
        groupByPerpendicularPosition: true,
    },

    // Name labels should remain aligned
    {
        name: "filtered_equality",
        description: "Name labels should be horizontally aligned",
        slideId: 283,
        filter: { shapeType: "textbox", rawText: "Name" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Title labels should remain aligned
    {
        name: "filtered_equality",
        description: "Title or Position labels should be horizontally aligned",
        slideId: 283,
        filter: { shapeType: "textbox", rawText: "Title or Position" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // LLM Judge for semantic validation of image swap
    {
        name: "llm_judge",
        description: "LLM evaluation of image swap correctness",
        slideId: 283,
        autoGenerate: true,
        criteria: "Evaluate if the images of the white girl and the asian dude have been correctly swapped while preserving the overall layout.",
        focusAreas: [
            "The white girl's image position is now where the asian dude's image was",
            "The asian dude's image position is now where the white girl's image was",
            "Overall slide layout and alignment is preserved",
            "No other images were affected by the swap",
        ],
        expectedChanges: [
            "Two specific images swapped positions",
            "Layout and spacing remain unchanged",
        ],
    },
];
