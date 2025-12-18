import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes (roundRect shapes)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 circles (ellipse shapes)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 4,
    },

    // Box equality tests
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal width",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal height",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 boxes should be horizontally aligned (same Y coordinate)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Circle equality tests
    {
        name: "filtered_equality",
        description: "All 4 circles should have equal width (diameter)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 circles should have equal height (diameter)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 circles should be horizontally aligned (same Y coordinate)",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Spacing tests
    {
        name: "filtered_spacing",
        description: "Equal horizontal spacing between the 4 boxes",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },
    {
        name: "filtered_spacing",
        description: "Equal horizontal spacing between the 4 circles",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 264,
        minMargin: 10,
    },

    // Slide fill distribution
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide horizontally",
        slideId: 264,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 60,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box and circle alignment",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if the boxes and circles are aligned with each other, all in same sizes and spaces.",
        focusAreas: [
            "Boxes and circles are aligned with each other",
            "All boxes have the same size",
            "All circles have the same size",
            "Equal spacing between boxes",
            "Equal spacing between circles",
            "Visual alignment between boxes and circles",
        ],
        expectedChanges: [
            "Boxes and circles aligned",
            "Uniform sizes and spacing",
        ],
    },
];
