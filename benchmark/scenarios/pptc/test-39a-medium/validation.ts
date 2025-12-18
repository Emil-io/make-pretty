import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify 3 groups with icons remain
    {
        name: "count_shapes",
        description: "There should be exactly 3 groups with icons (shapes 6, 10, 14)",
        slideId: 258,
        filter: { shapeType: "group" },
        expected: 5, // Total groups including the ones with icons
    },

    // Images should still be present
    {
        name: "count_shapes",
        description: "There should be exactly 3 image shapes",
        slideId: 258,
        filter: { shapeType: "image" },
        expected: 3,
    },

    // Horizontal alignment - the 3 icon boxes should remain aligned
    {
        name: "filtered_equality",
        description: "The 3 icon boxes should remain horizontally aligned at same Y coordinate",
        slideId: 258,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Equal width for images
    {
        name: "filtered_equality",
        description: "Icon images should maintain equal or similar widths",
        slideId: 258,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 2,
    },

    // Equal height for images
    {
        name: "filtered_equality",
        description: "Icon images should maintain equal or similar heights",
        slideId: 258,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 2,
    },

    // Horizontal spacing between icon boxes
    {
        name: "filtered_spacing",
        description: "Icon boxes should maintain equal horizontal spacing",
        slideId: 258,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of icon boxes positioning adjustment",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the yellow boxes with icons have been moved lower with appropriate spacing to both sides (left and right).",
        focusAreas: [
            "The 3 yellow boxes with icons (Google Slides, PowerPoint, Canva) are positioned lower than originally",
            "There is balanced spacing on both left and right sides of the icon boxes",
            "The icon boxes maintain horizontal alignment with each other",
            "Equal spacing is maintained between the 3 icon boxes",
            "Overall visual balance and professional appearance of the layout"
        ],
        expectedChanges: [
            "Icon boxes moved to a lower vertical position",
            "Balanced left and right margins around the icon boxes",
            "Maintained horizontal alignment and consistent spacing"
        ],
    },
];
