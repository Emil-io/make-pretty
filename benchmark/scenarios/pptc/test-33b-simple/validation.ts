import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Three text boxes aligned at bottom",
        objects: [
            { slideId: 259, shapeId: 121, key: "pos.topLeft[1]" },
            { slideId: 259, shapeId: 123, key: "pos.topLeft[1]" },
            { slideId: 259, shapeId: 125, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 259,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 259,
        autoGenerate: true,
        criteria: "Verify that the three text boxes at the bottom (Google Slides, PowerPoint, Canva) are properly aligned horizontally at the same vertical position",
    },
];
