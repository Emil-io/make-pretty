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
        name: "filtered_equality",
        description: "All boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
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
        description: "LLM evaluation of box border extension",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the left border of the boxes has been extended closer to the circles, shortening the space to match the space currently between each circle.",
        focusAreas: [
            "Left border of boxes extended closer to circles",
            "Space between boxes and circles matches space between circles",
            "Proper alignment maintained",
            "Visual consistency",
        ],
        expectedChanges: [
            "Box borders extended",
            "Spacing adjusted to match circle spacing",
        ],
    },
];
