import { AI_MSO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "Should have 4 lines (added one)",
        slideId: 275,
        filter: {
            shapeType: AI_MSO_SHAPE_TYPE.LINE,
        },
        expected: 4,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 275,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 275,
        autoGenerate: true,
        criteria: "Verify that a fourth line has been added to the bottom left, and other lines have been moved/reorganized so that all lines fit properly within the layout",
    },
];
