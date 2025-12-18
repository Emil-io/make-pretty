import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all elements remain
    {
        name: "count_shapes",
        description: "There should be exactly 7 image shapes",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        expected: 7, // 3 circular profile images + 4 decorative images
    },
    {
        name: "count_shapes",
        description: "There should be exactly 7 textboxes",
        slideId: 264,
        filter: {
            shapeType: "textbox",
        },
        expected: 7, // 1 main title + 3 headings + 3 descriptions
    },

    // Verify 3 circular profile images exist
    {
        name: "count_shapes",
        description: "There should be exactly 3 circular profile images with ellipse shape",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        expected: 3,
    },

    // Horizontal alignment for the 3 profile images
    {
        name: "filtered_equality",
        description: "All 3 profile images should be horizontally aligned at same Y coordinate",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Width equality for the 3 profile images
    {
        name: "filtered_equality",
        description: "All 3 profile images should have equal width",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 3,
    },

    // Height equality for the 3 profile images
    {
        name: "filtered_equality",
        description: "All 3 profile images should have equal height",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Horizontal alignment for the 3 "ADD A MAIN POINT" headings
    {
        name: "filtered_equality",
        description: "All 3 'ADD A MAIN POINT' headings should be horizontally aligned at same Y coordinate",
        slideId: 264,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Horizontal alignment for the 3 description texts
    {
        name: "filtered_equality",
        description: "All 3 description texts should be horizontally aligned at same Y coordinate",
        slideId: 264,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Horizontal spacing between profile images
    {
        name: "filtered_spacing",
        description: "The 3 profile images should have equal horizontal spacing",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 264,
        minMargin: 10,
    },

    // Distribution test - ensure profile images are well distributed across slide
    {
        name: "slide_fill_distribution",
        description: "Profile images should fill at least 60% of slide width",
        slideId: 264,
        filter: {
            shapeType: "image",
        },
        minFillPercentage: 60,
    },

    // LLM Judge test for overall coherence, design, and task success
    {
        name: "llm_judge",
        description: "LLM evaluation of whether headings have been moved below the pictures with proper rearrangement",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if the slide successfully completes the requested task: moving the 3 'ADD A MAIN POINT' headings to be positioned below their corresponding profile pictures, while maintaining a well-organized and visually appealing layout.",
        focusAreas: [
            "The 3 'ADD A MAIN POINT' headings are now positioned BELOW their corresponding profile pictures (not above)",
            "Vertical ordering follows the logical flow: profile pictures first, then headings, then descriptions",
            "All 3 columns (left, center, right) maintain consistent vertical spacing and alignment",
            "Headings are properly centered below their respective profile pictures",
            "Descriptions remain properly positioned below their respective headings",
            "The overall layout is balanced, organized, and visually coherent",
            "Professional appearance with proper spacing between elements"
        ],
        expectedChanges: [
            "Headings repositioned from above pictures to below pictures",
            "Vertical reordering: pictures → headings → descriptions",
            "Maintained horizontal alignment across all three columns",
            "Consistent spacing and professional visual appearance"
        ],
    },
];
