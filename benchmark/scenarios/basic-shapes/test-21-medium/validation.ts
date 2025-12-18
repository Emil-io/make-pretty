import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 15 circles (3x5 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 15,
    },
    {
        name: "count_shapes",
        description: "There should be 0 boxes (all deleted)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 0,
    },

    // Size equality tests
    {
        name: "filtered_equality",
        description: "All 15 circles should have equal width (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 15,
    },
    {
        name: "filtered_equality",
        description: "All 15 circles should have equal height (diameter)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 15,
    },

    // Horizontal spacing - at least 3 circles should be equally spaced (one row)
    {
        name: "filtered_spacing",
        description: "At least 3 circles should have equal horizontal spacing (one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Vertical spacing - at least 5 circles should be equally spaced (one column)
    {
        name: "filtered_spacing",
        description: "At least 5 circles should have equal vertical spacing (one column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "vertical",
        minMatchCount: 5,
    },

    // Row alignment - at least 3 circles should share same Y (one row)
    {
        name: "filtered_equality",
        description: "At least 3 circles should be horizontally aligned (same Y coordinate, one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Column alignment - at least 5 circles should share same X (one column)
    {
        name: "filtered_equality",
        description: "At least 5 circles should be vertically aligned (same X coordinate, one column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 5,
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
            "Circles should be distributed across the slide horizontally",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        minFillPercentage: 50,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box deletion and circle grid creation",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the boxes have been deleted and a 3x5 grid layout has been created using the circles.",
        focusAreas: [
            "All boxes have been deleted",
            "3x5 grid created with circles (3 columns, 5 rows)",
            "Circles are properly aligned within the grid",
            "Even spacing between circles horizontally and vertically",
            "Visual balance of the grid layout",
        ],
        expectedChanges: [
            "Boxes deleted",
            "3x5 grid created with circles",
            "Proper alignment and spacing",
        ],
    },
];
