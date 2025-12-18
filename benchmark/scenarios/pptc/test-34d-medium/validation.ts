import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Four pictures aligned in one row",
        objects: [
            { slideId: 276, shapeId: 108, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 114, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 117, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 276,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 276,
        autoGenerate: true,
        criteria: "Verify that four pictures are aligned in one horizontal row above the text boxes, with consistent alignment and spacing. Pictures should be resized if necessary to maintain proper layout",
    },
];
