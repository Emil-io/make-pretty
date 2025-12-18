import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 3 boxes (2 rows + 1 summary box)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 2 circles (2 rows)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 2,
    },

    // Row boxes equality tests (the 2 boxes in rows, not the summary)
    {
        name: "filtered_equality",
        description: "At least 2 boxes should have equal width (the 2 row boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "At least 2 boxes should have equal height (the 2 row boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 2,
    },

    // Circle equality tests
    {
        name: "filtered_equality",
        description: "All 2 circles should have equal width (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "All 2 circles should have equal height (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 2,
    },

    // Vertical spacing for the 2 row boxes
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal vertical spacing (the 2 rows)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Vertical spacing for circles
    {
        name: "filtered_spacing",
        description: "All 2 circles should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Vertical alignment (columns)
    {
        name: "filtered_equality",
        description: "All 2 circles should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "At least 2 boxes should be vertically aligned (same X coordinate, the 2 rows)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Corner radius equality for all boxes (including summary)
    {
        name: "filtered_equality",
        description: "All 3 boxes should have corner radius (including summary box)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 3,
    },

    // Verify summary box is different (different width - should be wider)
    {
        name: "filtered_equality",
        description: "Only 2 boxes share same width (summary box is wider)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 2, // Only 2 boxes should share the same width, not all 3
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },

    {
        name: "llm_judge",
        description: "LLM evaluation of row reduction and summary box addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the layout has been reduced to only two rows, a Summary box has been added with white background, blue corners, spanning the full length, and contains example summary text.",
        focusAreas: [
            "Layout reduced to two rows",
            "Summary box has been added",
            "Summary box has white background",
            "Summary box has blue corners",
            "Summary box spans full length",
            "Summary box contains example summary text",
            "Proper alignment and visual balance",
        ],
        expectedChanges: [
            "Reduced to two rows",
            "Summary box added with specified styling",
            "Summary text included",
        ],
    },
];
