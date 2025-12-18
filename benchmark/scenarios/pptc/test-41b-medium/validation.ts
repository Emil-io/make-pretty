import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // 39% text should be horizontally centered within circle 1
    {
        name: "all_are_equal",
        description: "39% text should be horizontally centered within its circle",
        objects: [
            { slideId: 265, shapeId: 308, key: "pos.center[0]" }, // "39%" text
            { slideId: 265, shapeId: 307, key: "pos.center[0]" }, // Circle group
        ],
    },

    // 39% text should be vertically centered within circle 1
    {
        name: "all_are_equal",
        description: "39% text should be vertically centered within its circle",
        objects: [
            { slideId: 265, shapeId: 308, key: "pos.center[1]" }, // "39%" text
            { slideId: 265, shapeId: 307, key: "pos.center[1]" }, // Circle group
        ],
    },

    // 83% text should be horizontally centered within circle 2
    {
        name: "all_are_equal",
        description: "83% text should be horizontally centered within its circle",
        objects: [
            { slideId: 265, shapeId: 313, key: "pos.center[0]" }, // "83%" text
            { slideId: 265, shapeId: 312, key: "pos.center[0]" }, // Circle group
        ],
    },

    // 83% text should be vertically centered within circle 2
    {
        name: "all_are_equal",
        description: "83% text should be vertically centered within its circle",
        objects: [
            { slideId: 265, shapeId: 313, key: "pos.center[1]" }, // "83%" text
            { slideId: 265, shapeId: 312, key: "pos.center[1]" }, // Circle group
        ],
    },

    // 67% text should be horizontally centered within circle 3
    {
        name: "all_are_equal",
        description: "67% text should be horizontally centered within its circle",
        objects: [
            { slideId: 265, shapeId: 318, key: "pos.center[0]" }, // "67%" text
            { slideId: 265, shapeId: 317, key: "pos.center[0]" }, // Circle group
        ],
    },

    // 67% text should be vertically centered within circle 3
    {
        name: "all_are_equal",
        description: "67% text should be vertically centered within its circle",
        objects: [
            { slideId: 265, shapeId: 318, key: "pos.center[1]" }, // "67%" text
            { slideId: 265, shapeId: 317, key: "pos.center[1]" }, // Circle group
        ],
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of percentage centering within circles",
        slideId: 265,
        autoGenerate: true,
        criteria: "Evaluate if the three percentage texts (39%, 83%, 67%) are properly centered within their respective circles.",
        focusAreas: [
            "39% text is horizontally and vertically centered within its circle",
            "83% text is horizontally and vertically centered within its circle",
            "67% text is horizontally and vertically centered within its circle",
            "All percentage texts maintain consistent positioning relative to their circles",
            "Visual balance and professional appearance"
        ],
        expectedChanges: [
            "39% repositioned to center of its circle",
            "83% repositioned to center of its circle",
            "67% repositioned to center of its circle"
        ],
    },
];
