import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 5th person elements were added
    {
        name: "count_shapes",
        description: "There should be 5 person images (4 original + 1 new)",
        slideId: 285,
        filter: { shapeType: "image" },
        expected: 7, // 5 person images + 2 corner decorative images
    },

    // Text count - 5 Name + 5 Title textboxes (in groups)
    {
        name: "count_shapes",
        description: "There should be 5 Name textboxes",
        slideId: 285,
        filter: { shapeType: "textbox", rawText: "Name" },
        expected: 5,
    },

    {
        name: "count_shapes",
        description: "There should be 5 Title or Position textboxes",
        slideId: 285,
        filter: { shapeType: "textbox", rawText: "Title or Position" },
        expected: 5,
    },

    // Vertical line count - should have 10 (5 pairs for 5 persons)
    {
        name: "count_shapes",
        description: "There should be 10 vertical green lines (5 pairs)",
        slideId: 285,
        filter: { shapeType: "line" },
        expected: 12, // 10 vertical + 2 horizontal
    },

    // Person images should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "Person images should be horizontally aligned at same Y coordinate",
        slideId: 285,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Person images should have equal height
    {
        name: "filtered_equality",
        description: "Person images should have equal height",
        slideId: 285,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 5,
    },

    // Person images should have equal width
    {
        name: "filtered_equality",
        description: "Person images should have equal width",
        slideId: 285,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 5,
    },

    // Person images should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Person images should have equal horizontal spacing",
        slideId: 285,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 5,
        groupByPerpendicularPosition: true,
    },

    // Name textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Name textboxes should be horizontally aligned",
        slideId: 285,
        filter: { shapeType: "textbox", rawText: "Name" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Title textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Title textboxes should be horizontally aligned",
        slideId: 285,
        filter: { shapeType: "textbox", rawText: "Title or Position" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Text groups should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Name textboxes should have equal horizontal spacing",
        slideId: 285,
        filter: { shapeType: "textbox", rawText: "Name" },
        direction: "horizontal",
        minMatchCount: 5,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect minimum margin from slide edges",
        slideId: 285,
        minMargin: 40,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of adding 5th team member spot",
        slideId: 285,
        autoGenerate: true,
        criteria: "Evaluate if a 5th person spot was added with proper realignment, equal side borders, and matching text/line elements.",
        focusAreas: [
            "5 person images are present and evenly distributed horizontally",
            "Side borders (left and right margins) are equal",
            "All 5 images are horizontally aligned at the same vertical position",
            "Each person has corresponding Name and Title text below",
            "Green vertical lines are present for all 5 person sections",
            "Layout maintains visual balance and professional appearance",
        ],
        expectedChanges: [
            "5th person image added in the row",
            "5th Name and Title or Position text added below",
            "5th pair of green vertical lines added",
            "All elements realigned with equal spacing",
            "Side borders maintained equal",
        ],
    },
];
