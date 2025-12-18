import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "greater_than",
        description: "Blue box increased in height",
        slideId: 270,
        shapeId: 108,
        key: "size.h",
        expected: 300,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 270,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 270,
        autoGenerate: true,
        criteria: "Verify that the blue box has been made bigger (higher) and the text inside has been resized accordingly to fit the larger box",
    },
];
