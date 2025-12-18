import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all images are preserved after exchange
    {
        name: "count_shapes",
        description: "All image shapes should be preserved (17 images total)",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        expected: 17,
    },

    // Row alignment - images in each row should stay horizontally aligned
    {
        name: "filtered_equality",
        description: "Top row images should be horizontally aligned (same Y coordinate)",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 5, // 5 images in each row of the 5x3 grid
    },

    // Size consistency - all grid images should have equal dimensions
    {
        name: "filtered_equality",
        description: "Grid images should have equal width",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 15, // 15 images in the main grid have same size
    },

    {
        name: "filtered_equality",
        description: "Grid images should have equal height",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 15, // 15 images in the main grid have same size
    },

    // Horizontal spacing - images in rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Images in each row should have equal horizontal spacing",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 5,
        groupByPerpendicularPosition: true,
    },

    // Vertical spacing - images in columns should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Images in each column should have equal vertical spacing",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        direction: "vertical",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of image exchange task completion",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if the images on the left and right sides have been properly exchanged while maintaining the overall layout structure.",
        focusAreas: [
            "Left-side images are now positioned on the right side of the slide",
            "Right-side images are now positioned on the left side of the slide",
            "Grid layout structure and alignment is preserved after exchange",
            "Images maintain their relative positions within their new columns",
            "Overall visual symmetry and professional appearance is maintained",
        ],
        expectedChanges: [
            "Left images moved to right positions",
            "Right images moved to left positions",
            "Grid alignment and spacing preserved",
        ],
    },
];
