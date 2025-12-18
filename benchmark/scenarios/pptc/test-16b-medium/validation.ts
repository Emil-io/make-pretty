import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify key shapes are preserved
    {
        name: "count_shapes",
        description: "There should be 4 groups (A, B, C, D answer boxes)",
        slideId: 284,
        filter: { shapeType: "group" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be 4 autoShape rectangles for answer boxes",
        slideId: 284,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be 4 lines on the slide",
        slideId: 284,
        filter: { shapeType: "line" },
        expected: 4,
    },

    // Row alignment: A and B should be at same Y level (top row)
    {
        name: "filtered_equality",
        description: "Answer boxes A and B should be horizontally aligned (same Y)",
        slideId: 284,
        filters: [
            { shapeType: "textbox", rawText: "A" },
            { shapeType: "textbox", rawText: "B" },
        ],
        key: "pos.center[1]",
        minMatchCount: 2,
    },

    // Row alignment: C and D should be at same Y level (bottom row)
    {
        name: "filtered_equality",
        description: "Answer boxes C and D should be horizontally aligned (same Y)",
        slideId: 284,
        filters: [
            { shapeType: "textbox", rawText: "C" },
            { shapeType: "textbox", rawText: "D" },
        ],
        key: "pos.center[1]",
        minMatchCount: 2,
    },

    // Column alignment: A and C should be at same X level (left column)
    {
        name: "filtered_equality",
        description: "Answer boxes A and C should be vertically aligned (same X)",
        slideId: 284,
        filters: [
            { shapeType: "textbox", rawText: "A" },
            { shapeType: "textbox", rawText: "C" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Column alignment: B and D should be at same X level (right column)
    {
        name: "filtered_equality",
        description: "Answer boxes B and D should be vertically aligned (same X)",
        slideId: 284,
        filters: [
            { shapeType: "textbox", rawText: "B" },
            { shapeType: "textbox", rawText: "D" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Answer box rectangles should have equal size
    {
        name: "filtered_equality",
        description: "All 4 answer box rectangles should have equal width",
        slideId: 284,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 answer box rectangles should have equal height",
        slideId: 284,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.h",
        minMatchCount: 4,
    },

    // Description texts should have consistent positioning within their quadrants
    {
        name: "filtered_equality",
        description: "Description texts should have equal width",
        slideId: 284,
        filter: { shapeType: "textbox", rawTextContains: "elaborate" },
        key: "size.w",
        minMatchCount: 4,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect slide margins",
        slideId: 284,
        minMargin: 10,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of quiz slide layout fix",
        slideId: 284,
        autoGenerate: true,
        criteria: "Evaluate if the Multiple Choice Quiz slide has been fixed with proper alignment and layout for the 4 answer options (A, B, C, D) in a 2x2 grid format.",
        focusAreas: [
            "Answer boxes A and B are horizontally aligned in the top row",
            "Answer boxes C and D are horizontally aligned in the bottom row",
            "Answer boxes A and C are vertically aligned in the left column",
            "Answer boxes B and D are vertically aligned in the right column",
            "All 4 answer boxes have consistent size and spacing",
            "Description texts are properly positioned below their respective answer boxes",
        ],
        expectedChanges: [
            "Answer options aligned in a proper 2x2 grid",
            "Consistent spacing between all elements",
            "Symmetrical and balanced layout",
        ],
    },
];
