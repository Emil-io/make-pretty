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
        expected: 4,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have similar width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box width adjustment",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the right box has been made wider to be approximately the same width as the boxes on the left, and the others on the left have been adjusted accordingly.",
        focusAreas: [
            "Right box width increased",
            "Right box width matches left boxes",
            "Left boxes adjusted appropriately",
            "Proper alignment maintained",
            "Visual balance",
        ],
        expectedChanges: [
            "Right box widened",
            "Left boxes adjusted",
            "Consistent widths achieved",
        ],
    },
];
