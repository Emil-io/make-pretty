import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be 3 group shapes (main blocks)",
        slideId: 290,
        filter: { shapeType: "group" },
        expected: 5, // 3 main blocks + 2 nested groups
    },

    // Alignment tests - all 3 main blocks should have same Y position
    {
        name: "all_are_equal",
        description: "The 3 main blocks should be horizontally aligned (same top Y)",
        objects: [
            { slideId: 290, shapeId: 447, key: "pos.topLeft[1]" },
            { slideId: 290, shapeId: 450, key: "pos.topLeft[1]" },
            { slideId: 290, shapeId: 454, key: "pos.topLeft[1]" },
        ],
    },

    // The green background rectangles should be aligned
    {
        name: "all_are_equal",
        description: "Green background rectangles should be horizontally aligned",
        objects: [
            { slideId: 290, shapeId: 448, key: "pos.topLeft[1]" },
            { slideId: 290, shapeId: 451, key: "pos.topLeft[1]" },
            { slideId: 290, shapeId: 455, key: "pos.topLeft[1]" },
        ],
    },

    // The green background rectangles should have equal size
    {
        name: "all_are_equal",
        description: "Green background rectangles should have equal width",
        objects: [
            { slideId: 290, shapeId: 448, key: "size.w" },
            { slideId: 290, shapeId: 451, key: "size.w" },
            { slideId: 290, shapeId: 455, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Green background rectangles should have equal height",
        objects: [
            { slideId: 290, shapeId: 448, key: "size.h" },
            { slideId: 290, shapeId: 451, key: "size.h" },
            { slideId: 290, shapeId: 455, key: "size.h" },
        ],
    },

    // Statistics textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Statistics text (2 out of 5, 95%, 12 million) should be horizontally aligned",
        slideId: 290,
        filters: [
            { shapeType: "textbox", rawText: "2 out of 5" },
            { shapeType: "textbox", rawText: "95%" },
            { shapeType: "textbox", rawText: "12 million" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Description textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Elaborate description texts should be horizontally aligned",
        slideId: 290,
        filter: { shapeType: "textbox", rawTextContains: "Elaborate" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Horizontal spacing between main blocks should be equal
    {
        name: "filtered_spacing",
        description: "Main blocks should have equal horizontal spacing",
        slideId: 290,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of left block alignment task",
        slideId: 290,
        autoGenerate: true,
        criteria: "Evaluate if the left block and its content have been aligned to match the position and layout of the other two blocks.",
        focusAreas: [
            "Left block (green rectangle with content) is aligned vertically with center and right blocks",
            "All three blocks share the same top Y coordinate",
            "Content within the left block (statistics, descriptions) aligns with corresponding content in other blocks",
            "Visual symmetry and consistent spacing between all three blocks",
        ],
        expectedChanges: [
            "Left block moved down to align with center and right blocks",
            "Content within left block repositioned to match layout of other blocks",
            "Consistent horizontal alignment across all three columns",
        ],
    },
];
