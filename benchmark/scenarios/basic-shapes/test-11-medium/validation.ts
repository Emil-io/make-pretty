import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test
    {
        name: "count_shapes",
        description: "There should be exactly 3 boxes (roundRect shapes)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3,
    },

    // Size equality tests
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal width",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal height",
        slideId: 268,
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
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Corner radius equality
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal corner radius (matching leftmost box)",
        slideId: 268,
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
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Style tests - transparent fill (no fill color)
    {
        name: "filtered_equality",
        description: "All 3 boxes should have no fill color (transparent)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "style.fill.color",
        minMatchCount: 3,
    },

    // Text color tests - all text should be black
    {
        name: "filtered_equality",
        description: "All 3 boxes should have black text color",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "text.fontInfo.color",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 268,
        minMargin: 10,
    },

    // Slide fill distribution
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide horizontally",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 60,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of style adjustment and alignment",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if the three shapes have been adjusted to match the style of the leftmost shape, aligned so all 3 fit on the slide, boxes have transparent fill, and text inside is black.",
        focusAreas: [
            "All three shapes match the style of the leftmost shape",
            "Shapes are aligned and fit on the slide",
            "Boxes have transparent fill (no fill color)",
            "Text inside boxes is black",
            "Visual consistency across all shapes",
        ],
        expectedChanges: [
            "Shapes styled to match leftmost",
            "Transparent fill applied",
            "Black text color",
        ],
    },
];
