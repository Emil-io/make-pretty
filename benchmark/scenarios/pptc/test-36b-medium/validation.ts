import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "filtered_equality",
        description: "At least 4 triangles should be aligned horizontally",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RIGHT_TRIANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },
    {
        name: "filtered_spacing",
        description: "At least 4 triangles should have equal horizontal spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RIGHT_TRIANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins and fit on slide",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 266,
        autoGenerate: true,
        criteria: "Verify that a fourth blue triangle (like the second one) has been added to the right with accompanying text, and all 4 triangles are realigned and evenly spaced to fit the slide",
    },
];
