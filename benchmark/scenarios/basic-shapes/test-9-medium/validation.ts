import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test
    {
        name: "count_shapes",
        description: "There should be exactly 3 boxes (roundRect shapes)",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3,
    },

    // Size equality tests
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal width",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal height",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Alignment test
    {
        name: "filtered_equality",
        description: "All 3 boxes should be horizontally aligned (same Y coordinate)",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Corner radius equality
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal corner radius",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 3,
    },

    // Spacing test
    {
        name: "filtered_spacing",
        description: "Equal horizontal spacing between the 3 boxes",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 259,
        minMargin: 10,
    },

    // Slide fill distribution
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide horizontally",
        slideId: 259,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 60,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of third shape addition and resizing",
        slideId: 259,
        autoGenerate: true,
        criteria: "Evaluate if a third shape has been added in the same style, and all three shapes have been adjusted in size and aligned accordingly.",
        focusAreas: [
            "Third shape has been added",
            "Third shape matches the style of existing shapes",
            "All three shapes have been resized appropriately",
            "All three shapes are properly aligned",
            "Even spacing between shapes",
        ],
        expectedChanges: [
            "Third shape added in same style",
            "All shapes resized and aligned",
        ],
    },
];
