import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 6 boxes (3x2 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "There should be 0 circles (all deleted)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 0,
    },

    // Size equality tests
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

    // Corner radius equality
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

    // Horizontal spacing - at least 3 boxes should be equally spaced (one row)
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal horizontal spacing (one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Vertical spacing - at least 2 boxes should be equally spaced (one column)
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal vertical spacing (one column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Row alignment - at least 3 boxes should share same Y (one row)
    {
        name: "filtered_equality",
        description: "At least 3 boxes should be horizontally aligned (same Y coordinate, one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Column alignment - at least 2 boxes should share same X (one column)
    {
        name: "filtered_equality",
        description: "At least 2 boxes should be vertically aligned (same X coordinate, one column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },

    // Slide fill distribution
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide horizontally",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 60,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of circle deletion and grid creation",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the circles have been deleted and a 3x2 grid has been created with the boxes, properly aligned and resized if needed.",
        focusAreas: [
            "Circles have been deleted",
            "3x2 grid created with boxes (3 columns, 2 rows)",
            "Boxes are properly aligned within the grid",
            "Boxes have been resized appropriately to fit the grid",
            "Even spacing between boxes horizontally and vertically",
            "Visual balance of the grid layout",
        ],
        expectedChanges: [
            "Circles deleted",
            "3x2 grid created",
            "Boxes aligned and resized",
        ],
    },
];
