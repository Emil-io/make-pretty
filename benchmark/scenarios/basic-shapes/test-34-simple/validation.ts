import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "Shape count should remain the same",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of line alignment and styling",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the lines are each in the middle of the boxes, have the same height as the boxes, are thicker, and are dotted.",
        focusAreas: [
            "Lines are centered in the middle of boxes",
            "Lines have the same height as boxes",
            "Lines are thicker than original",
            "Lines have dotted style",
            "Proper alignment and visual consistency",
        ],
        expectedChanges: [
            "Lines centered in boxes",
            "Lines match box height",
            "Lines made thicker and dotted",
        ],
    },
];
