import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes (roundRect shapes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 circles (ellipse shapes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 4,
    },

    // Box equality tests
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

    // Circle equality tests
    {
        name: "filtered_equality",
        description: "All 4 circles should have equal width (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 circles should have equal height (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Vertical spacing tests
    {
        name: "filtered_spacing",
        description: "Equal vertical spacing between the 4 boxes",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 4,
    },
    {
        name: "filtered_spacing",
        description: "Equal vertical spacing between the 4 circles",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "vertical",
        minMatchCount: 4,
    },

    // Vertical alignment tests (circles should be vertically aligned with each other)
    {
        name: "filtered_equality",
        description: "All 4 circles should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 boxes should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 4,
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
        description: "LLM evaluation of fourth row addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if a fourth row of the same objects has been added and alignment has been adjusted accordingly.",
        focusAreas: [
            "Fourth row has been added",
            "All rows contain the same type of objects",
            "Proper alignment across all rows",
            "Even vertical spacing between rows",
            "Consistent sizing within each row",
            "Visual balance of the multi-row layout",
        ],
        expectedChanges: [
            "Fourth row added",
            "Alignment adjusted for all rows",
        ],
    },
];
