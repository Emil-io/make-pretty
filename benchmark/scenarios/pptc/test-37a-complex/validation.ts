import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 11 image shapes",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        expected: 11, // 4 large boxes + 4 small icons + arrows + decorative images
    },
    {
        name: "count_shapes",
        description: "There should be exactly 9 textboxes",
        slideId: 274,
        filter: {
            shapeType: "textbox",
        },
        expected: 9, // 1 title + 4 headings + 4 descriptions
    },

    // Horizontal alignment for the 4 main headings - should all be at same Y position (aligned to first box)
    {
        name: "filtered_equality",
        description: "All 4 'ADD A MAIN POINT' headings should be horizontally aligned at same Y coordinate",
        slideId: 274,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Horizontal alignment for the 4 large boxes - should all be at same Y position
    {
        name: "filtered_equality",
        description: "At least 3 large boxes should be horizontally aligned at same Y coordinate",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Width equality for the 4 large boxes
    {
        name: "filtered_equality",
        description: "All 4 large boxes should have equal width",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 4,
    },

    // Height equality for the 4 large boxes
    {
        name: "filtered_equality",
        description: "All 4 large boxes should have equal height",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Horizontal spacing between boxes
    {
        name: "filtered_spacing",
        description: "The 4 large boxes should have equal horizontal spacing",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Vertical alignment for description texts below boxes
    {
        name: "filtered_equality",
        description: "The 4 description texts should be horizontally aligned at same Y coordinate",
        slideId: 274,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 274,
        minMargin: 10,
    },

    // Distribution test - ensure boxes are well distributed across slide
    {
        name: "slide_fill_distribution",
        description: "Boxes should fill at least 60% of slide width",
        slideId: 274,
        filter: {
            shapeType: "image",
        },
        minFillPercentage: 60,
    },

    // LLM Judge test for overall coherence, design, and task success
    {
        name: "llm_judge",
        description: "LLM evaluation of alignment, arrow duplication, overall coherence and design quality",
        slideId: 274,
        autoGenerate: true,
        criteria: "Evaluate if the slide successfully completes the requested task: aligning 4 headings to the position of the first box, aligning all boxes horizontally, and duplicating arrows between boxes. Also assess overall design coherence and visual balance.",
        focusAreas: [
            "All 4 'ADD A MAIN POINT' headings are aligned at the same vertical position as the first large box",
            "All 4 large image boxes are horizontally aligned at the same Y-coordinate",
            "Arrows are properly placed between all adjacent boxes (3 arrows total between 4 boxes)",
            "Visual spacing and distribution of elements creates a balanced timeline layout",
            "Text elements (headings and descriptions) are consistently positioned relative to their boxes",
            "Overall design maintains coherence and professional appearance"
        ],
        expectedChanges: [
            "Headings repositioned to align with first box position",
            "Boxes aligned horizontally at same Y-coordinate",
            "Additional arrows duplicated and placed between boxes",
            "Consistent spacing between timeline elements"
        ],
    },
];
