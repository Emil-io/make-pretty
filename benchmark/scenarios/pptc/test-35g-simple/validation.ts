import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Right box bottom matches left box bottom",
        objects: [
            { slideId: 277, shapeId: 108, key: "pos.bottomRight[1]" },
            { slideId: 277, shapeId: 111, key: "pos.bottomRight[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 277,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 277,
        autoGenerate: true,
        criteria: "Verify that the box on the right has been resized so that its bottom border matches the bottom border of the left box",
    },
];
