import { AI_MSO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "equal_spacing",
        description: "4 triangles evenly spaced horizontally",
        slideId: 279,
        shapeIds: [108, 111, 114, 117],
        direction: "horizontal",
    },
    {
        name: "count_shapes",
        description: "Should have 1 line going through triangles",
        slideId: 279,
        filter: {
            shapeType: AI_MSO_SHAPE_TYPE.LINE,
        },
        expected: 1,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 279,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 279,
        autoGenerate: true,
        criteria: "Verify that the 4 triangles with text are evenly spaced and aligned, and the line goes through all 4 triangles (positioned behind them)",
    },
];
