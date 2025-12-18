import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 6 boxes (6 rows)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 6 circles (6 rows)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 6,
    },

    // Box equality tests
    {
        name: "filtered_equality",
        description: "All 6 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 6,
    },
    {
        name: "filtered_equality",
        description: "All 6 boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 6,
    },

    // Circle equality tests
    {
        name: "filtered_equality",
        description: "All 6 circles should have equal width (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 6,
    },
    {
        name: "filtered_equality",
        description: "All 6 circles should have equal height (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 6,
    },

    // Vertical spacing tests
    {
        name: "filtered_spacing",
        description: "All 6 boxes should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 6,
    },
    {
        name: "filtered_spacing",
        description: "All 6 circles should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "vertical",
        minMatchCount: 6,
    },

    // Vertical alignment tests (columns)
    {
        name: "filtered_equality",
        description: "All 6 circles should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 6,
    },
    {
        name: "filtered_equality",
        description: "All 6 boxes should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 6,
    },

    // Corner radius equality for boxes
    {
        name: "filtered_equality",
        description: "All 6 boxes should have equal corner radius",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 6,
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
        description: "LLM evaluation of circle and box duplication",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the circle and box have been copied to create a total of 6 rows.",
        focusAreas: [
            "Circle and box have been copied",
            "Total of 6 rows created",
            "Proper vertical alignment within each row",
            "Even vertical spacing between rows",
            "Consistent sizing across all rows",
            "Visual balance of the 6-row layout",
        ],
        expectedChanges: [
            "Circle and box copied",
            "6 rows created",
            "Proper alignment and spacing",
        ],
    },
];
