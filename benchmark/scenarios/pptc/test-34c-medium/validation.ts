import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "All 3 point headings aligned horizontally",
        objects: [
            { slideId: 268, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 268, shapeId: 114, key: "pos.topLeft[1]" },
            { slideId: 268, shapeId: 117, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 268,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 268,
        autoGenerate: true,
        criteria: "Verify that point headings are positioned closer to the text below them (reduced vertical spacing), and all 3 points are aligned in one horizontal row with consistent spacing",
    },
];
