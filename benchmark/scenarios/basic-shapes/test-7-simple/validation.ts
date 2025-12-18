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
        description: "LLM evaluation of object alignment and spacing",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the three objects are aligned with the same size and spacings.",
        focusAreas: [
            "All three objects have the same size",
            "Equal spacing between objects",
            "Proper alignment of all objects",
            "Visual balance and consistency",
        ],
        expectedChanges: [
            "Objects aligned with uniform size",
            "Equal spacing between objects",
        ],
    },
];
