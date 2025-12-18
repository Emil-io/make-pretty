import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // All 4 circles should be at the same Y position (straight line)
    {
        name: "all_are_equal",
        description: "All 4 circles should be horizontally aligned (same Y center)",
        objects: [
            { slideId: 271, shapeId: 390, key: "pos.center[1]" }, // Circle 1
            { slideId: 271, shapeId: 393, key: "pos.center[1]" }, // Circle 2
            { slideId: 271, shapeId: 396, key: "pos.center[1]" }, // Circle 3
            { slideId: 271, shapeId: 399, key: "pos.center[1]" }, // Circle 4
        ],
    },

    // Text boxes should be horizontally centered with their circles
    {
        name: "all_are_equal",
        description: "Text box 1 should be centered with circle 1",
        objects: [
            { slideId: 271, shapeId: 407, key: "pos.center[0]" }, // "Add a main point" text 1
            { slideId: 271, shapeId: 390, key: "pos.center[0]" }, // Circle 1
        ],
    },

    {
        name: "all_are_equal",
        description: "Text box 2 should be centered with circle 2",
        objects: [
            { slideId: 271, shapeId: 409, key: "pos.center[0]" }, // "Add a main point" text 2
            { slideId: 271, shapeId: 393, key: "pos.center[0]" }, // Circle 2
        ],
    },

    {
        name: "all_are_equal",
        description: "Text box 3 should be centered with circle 3",
        objects: [
            { slideId: 271, shapeId: 413, key: "pos.center[0]" }, // "Add a main point" text 3
            { slideId: 271, shapeId: 396, key: "pos.center[0]" }, // Circle 3
        ],
    },

    {
        name: "all_are_equal",
        description: "Text box 4 should be centered with circle 4",
        objects: [
            { slideId: 271, shapeId: 411, key: "pos.center[0]" }, // "Add a main point" text 4
            { slideId: 271, shapeId: 399, key: "pos.center[0]" }, // Circle 4
        ],
    },

    // Line 1 (402) should be horizontal - startPos Y equals endPos Y
    {
        name: "all_are_equal",
        description: "Line 1 should be horizontal (start Y equals end Y)",
        objects: [
            { slideId: 271, shapeId: 402, key: "startPos[1]" },
            { slideId: 271, shapeId: 402, key: "endPos[1]" },
        ],
    },

    // Line 2 (403) should be horizontal
    {
        name: "all_are_equal",
        description: "Line 2 should be horizontal (start Y equals end Y)",
        objects: [
            { slideId: 271, shapeId: 403, key: "startPos[1]" },
            { slideId: 271, shapeId: 403, key: "endPos[1]" },
        ],
    },

    // Line 3 (404) should be horizontal
    {
        name: "all_are_equal",
        description: "Line 3 should be horizontal (start Y equals end Y)",
        objects: [
            { slideId: 271, shapeId: 404, key: "startPos[1]" },
            { slideId: 271, shapeId: 404, key: "endPos[1]" },
        ],
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline straightening and alignment",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if the 4 timeline points are in a straight horizontal line with properly aligned text boxes beneath them.",
        focusAreas: [
            "All 4 circles are aligned on the same horizontal line (same Y position)",
            "The connecting lines between circles are now straight/horizontal",
            "Each text box pair is horizontally centered beneath its circle",
            "The timeline flows smoothly from left to right",
            "Visual balance and professional appearance"
        ],
        expectedChanges: [
            "Circles repositioned to same Y level",
            "Lines straightened to be horizontal",
            "Text boxes aligned beneath their respective circles"
        ],
    },
];
