import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Text boxes aligned below four points",
        objects: [
            { slideId: 281, shapeId: 121, key: "pos.topLeft[1]" },
            { slideId: 281, shapeId: 123, key: "pos.topLeft[1]" },
            { slideId: 281, shapeId: 125, key: "pos.topLeft[1]" },
            { slideId: 281, shapeId: 127, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 281,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 281,
        autoGenerate: true,
        criteria: "Verify that text boxes below the four points are properly aligned horizontally at the same vertical position with consistent spacing",
    },
];
