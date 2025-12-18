import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Boxes aligned horizontally",
        objects: [
            { slideId: 276, shapeId: 3234, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3237, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3240, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3243, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Text boxes aligned vertically (fixed off-position box)",
        objects: [
            { slideId: 276, shapeId: 3246, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3249, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3252, key: "pos.topLeft[1]" },
            { slideId: 276, shapeId: 3255, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Boxes have equal height",
        objects: [
            { slideId: 276, shapeId: 3234, key: "size.h" },
            { slideId: 276, shapeId: 3237, key: "size.h" },
            { slideId: 276, shapeId: 3240, key: "size.h" },
            { slideId: 276, shapeId: 3243, key: "size.h" },
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
        criteria: "Verify that boxes are properly resized and aligned, and the off-position text box (OPPORTUNITIES) has been fixed to align with the other text boxes",
    },
];
