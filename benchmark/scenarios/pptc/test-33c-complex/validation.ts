import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Six boxes aligned in two rows",
        objects: [
            { slideId: 269, shapeId: 108, key: "pos.topLeft[1]" },
            { slideId: 269, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 269, shapeId: 114, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Bottom row boxes aligned",
        objects: [
            { slideId: 269, shapeId: 117, key: "pos.topLeft[1]" },
            { slideId: 269, shapeId: 120, key: "pos.topLeft[1]" },
            { slideId: 269, shapeId: 123, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 269,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 269,
        autoGenerate: true,
        criteria: "Verify that text and numbers in all 6 boxes are properly aligned both horizontally within each row and vertically between rows, with consistent spacing",
    },
];
