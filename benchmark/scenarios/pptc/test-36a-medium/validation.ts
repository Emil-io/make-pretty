import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Text boxes aligned horizontally",
        objects: [
            { slideId: 265, shapeId: 340, key: "pos.topLeft[1]" },
            { slideId: 265, shapeId: 345, key: "pos.topLeft[1]" },
            { slideId: 265, shapeId: 350, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "less_than",
        description: "Blue box top must be above or at text boxes",
        slideId: 265,
        shapeId: 334,
        key: "pos.topLeft[1]",
        expected: 750,
    },
    {
        name: "greater_than",
        description: "Blue box bottom must be below or at text boxes",
        slideId: 265,
        shapeId: 334,
        key: "pos.bottomRight[1]",
        expected: 920,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 265,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 265,
        autoGenerate: true,
        criteria: "Verify that the blue box has been resized to contain all text boxes, and the text boxes are properly aligned within it",
    },
];
