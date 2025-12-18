import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Y-coordinate alignment (horizontal alignment - same row)",
        objects: [
            { slideId: 257, shapeId: 4, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 5, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 6, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Height equality",
        objects: [
            { slideId: 257, shapeId: 4, key: "size.h" },
            { slideId: 257, shapeId: 5, key: "size.h" },
            { slideId: 257, shapeId: 6, key: "size.h" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Width equality",
        objects: [
            { slideId: 257, shapeId: 4, key: "size.w" },
            { slideId: 257, shapeId: 5, key: "size.w" },
            { slideId: 257, shapeId: 6, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Corner radius equality",
        objects: [
            { slideId: 257, shapeId: 4, key: "details.cornerRadius" },
            { slideId: 257, shapeId: 5, key: "details.cornerRadius" },
            { slideId: 257, shapeId: 6, key: "details.cornerRadius" },
        ],
    },
    {
        name: "equal_spacing",
        description: "Equal horizontal spacing",
        slideId: 257,
        shapeIds: [4, 5, 6],
        direction: "horizontal",
    },
    {
        name: "within_boundaries",
        description: "Boundary check - all shapes respect 10px margin",
        slideId: 257,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box alignment and sizing",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the three boxes are properly aligned and have the same size.",
        focusAreas: [
            "All three boxes are aligned horizontally",
            "All three boxes have the same size (width and height)",
            "Proper spacing between boxes",
            "Visual balance and layout quality",
        ],
        expectedChanges: [
            "Boxes aligned in a row",
            "All boxes have uniform size",
            "Even spacing between boxes",
        ],
    },
];
