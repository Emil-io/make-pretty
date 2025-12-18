import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Bottom boxes aligned at bottom edge",
        objects: [
            { slideId: 257, shapeId: 111, key: "pos.bottomRight[1]" },
            { slideId: 257, shapeId: 108, key: "pos.bottomRight[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 257,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 257,
        autoGenerate: true,
        criteria: "Verify that the box on the bottom right is resized so that its bottom edge aligns with the bottom of the left box, and the text box inside is aligned with the text box above",
    },
];
