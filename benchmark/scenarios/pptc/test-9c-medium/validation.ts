import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are present
    {
        name: "count_shapes",
        description: "There should be exactly 2 image shapes",
        slideId: 262,
        filter: { shapeType: "image" },
        expected: 2,
    },

    // The two images should have equal width (1/3 of slide width)
    {
        name: "filtered_equality",
        description: "Both images should have equal width (1/3 of slide each)",
        slideId: 262,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 2,
    },

    // The two images should have equal height
    {
        name: "filtered_equality",
        description: "Both images should have equal height",
        slideId: 262,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 2,
    },

    // Images should be vertically centered - check center Y positions are at slide center
    {
        name: "filtered_equality",
        description: "Both images should be centered vertically (same center Y)",
        slideId: 262,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 2,
    },

    // Check horizontal spacing between images (equal distribution)
    {
        name: "filtered_spacing",
        description: "Images should have equal horizontal spacing",
        slideId: 262,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 2,
    },

    // Text section should be vertically centered - check the main text boxes
    {
        name: "all_are_equal",
        description: "Main text boxes should be centered with the images vertically",
        objects: [
            { slideId: 262, shapeId: 463, key: "pos.center[1]" }, // Image 1
            { slideId: 262, shapeId: 464, key: "pos.center[1]" }, // Image 2
        ],
    },

    // Verify slide fill distribution - sections should fill the slide width
    {
        name: "slide_fill_distribution",
        description: "Content should fill at least 90% of slide width with 3 equal sections",
        slideId: 262,
        minFillPercentage: 90,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of 1/3 width sections and vertical centering",
        slideId: 262,
        autoGenerate: true,
        criteria: "Evaluate if the slide has 3 equal-width sections (each 1/3 of slide width) with all content vertically centered.",
        focusAreas: [
            "Each of the 3 sections takes up exactly 1/3 of the slide width",
            "All sections are vertically centered on the slide",
            "Equal horizontal spacing between sections",
            "Visual balance and professional appearance of the layout",
        ],
        expectedChanges: [
            "Each section resized to 1/3 of slide width",
            "All content centered vertically within the slide",
            "Consistent spacing and alignment across sections",
        ],
    },
];
