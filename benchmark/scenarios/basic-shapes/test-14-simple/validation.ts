import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },

    // Size equality tests
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Alignment test
    {
        name: "filtered_equality",
        description: "All 4 boxes should be horizontally aligned (same Y coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Corner radius equality
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal corner radius",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 4,
    },

    // Equal spacing between boxes
    {
        name: "filtered_spacing",
        description: "All 4 boxes should have equal horizontal spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Boundary test - equal margins to left and right
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries with proper margins",
        slideId: 266,
        minMargin: 10,
    },

    // Slide fill distribution - boxes should span most of the width
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide with even left/right margins",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 70,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box resizing and spacing",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the four boxes have been resized to have even spacing and the same space to the left and right slide borders.",
        focusAreas: [
            "Four boxes have even spacing between them",
            "Equal space from left slide border to first box",
            "Equal space from right slide border to last box",
            "Boxes are properly sized and aligned",
            "Visual balance and symmetry",
        ],
        expectedChanges: [
            "Boxes resized for even spacing",
            "Equal margins on left and right",
        ],
    },
];
