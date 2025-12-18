import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be 8 boxes (4x2 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 8,
    },
    {
        name: "filtered_equality",
        description: "All 8 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 8,
    },
    {
        name: "filtered_equality",
        description: "All 8 boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 8,
    },
    {
        name: "filtered_spacing",
        description: "At least 4 boxes should have equal horizontal spacing (one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of grid creation and line styling",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the boxes have been aligned in a nice 4x2 grid (same sizes, same spaces), the line has been made thicker, dotted, and red, aligned to perfectly divide the grid into two 2x2 grids, then copied, rotated 90°, and aligned to create a cross with the other line, perfectly splitting the rows horizontally (creating 4 quadrants with 2 boxes each).",
        focusAreas: [
            "4x2 grid created with uniform sizing and spacing",
            "Line made thicker, dotted, and red",
            "Line perfectly divides grid into two 2x2 sections",
            "Line copied and rotated 90 degrees",
            "Cross pattern created splitting rows horizontally",
            "4 quadrants created with 2 boxes each",
            "Perfect alignment and visual balance",
        ],
        expectedChanges: [
            "4x2 grid created",
            "Line styled and positioned",
            "Cross pattern created",
            "4 quadrants formed",
        ],
    },
];
