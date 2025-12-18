import { AI_MSO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "Should have 4 lines (added one)",
        slideId: 267,
        filter: {
            shapeType: AI_MSO_SHAPE_TYPE.LINE,
        },
        expected: 4,
    },
    {
        name: "all_are_equal",
        description: "All 4 points aligned vertically",
        objects: [
            { slideId: 267, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 267, shapeId: 114, key: "pos.topLeft[1]" },
            { slideId: 267, shapeId: 117, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 267,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 267,
        autoGenerate: true,
        criteria: "Verify that a fourth point (line and text box) has been added, and all 4 points are evenly distributed and aligned horizontally with consistent spacing. Check that elements are resized if necessary to maintain balance",
    },
];
