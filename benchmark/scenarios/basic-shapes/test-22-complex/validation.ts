import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be exactly 7 boxes (2x2 grid + 3 wider boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 7,
    },
    {
        name: "filtered_equality",
        description: "At least 4 boxes should have equal width (2x2 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "At least 4 boxes should have equal height (2x2 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 4,
    },
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal horizontal spacing (one row of 2x2)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 2,
    },
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal vertical spacing (one column of 2x2)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 2,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box repositioning and grid creation",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the two boxes on the right have been moved to the left side below the other two boxes, resized to a nice 2x2 grid, and three wider boxes have been added on the right hand side.",
        focusAreas: [
            "Two right boxes moved to left side below other boxes",
            "2x2 grid created with proper alignment",
            "Three wider boxes added on the right side",
            "Proper spacing and visual balance",
            "Layout organization and clarity",
        ],
        expectedChanges: [
            "Boxes repositioned to left",
            "2x2 grid created",
            "Three wider boxes added on right",
        ],
    },
];
