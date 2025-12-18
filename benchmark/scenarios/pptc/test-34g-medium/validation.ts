import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "SWOT headings aligned",
        objects: [
            { slideId: 280, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 280, shapeId: 114, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "SWOT text boxes aligned",
        objects: [
            { slideId: 280, shapeId: 117, key: "pos.topLeft[1]" },
            { slideId: 280, shapeId: 120, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 280,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 280,
        autoGenerate: true,
        criteria: "Verify that SWOT text boxes are properly aligned with headings aligned horizontally and text boxes aligned horizontally in their respective rows",
    },
];
