import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "X-coordinate alignment (vertical alignment - same column)",
        objects: [
            { slideId: 257, shapeId: 4, key: "pos.topLeft[0]" },
            { slideId: 257, shapeId: 5, key: "pos.topLeft[0]" },
            { slideId: 257, shapeId: 6, key: "pos.topLeft[0]" },
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
        description: "Height equality",
        objects: [
            { slideId: 257, shapeId: 4, key: "size.h" },
            { slideId: 257, shapeId: 5, key: "size.h" },
            { slideId: 257, shapeId: 6, key: "size.h" },
        ],
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of vertical layout transformation",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the three shapes have been arranged in three rows (vertical layout).",
        focusAreas: [
            "Shapes are arranged in three separate rows",
            "Proper vertical alignment within each row",
            "Even vertical spacing between rows",
            "Visual balance of the vertical layout",
        ],
        expectedChanges: [
            "Shapes arranged vertically in three rows",
            "Proper alignment and spacing",
        ],
    },
];
