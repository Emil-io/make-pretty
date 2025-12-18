import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // All numbers should be centered within their circle groups (X-coordinate)
    {
        name: "all_are_equal",
        description: "Number '1' should be horizontally centered in its circle",
        objects: [
            { slideId: 260, shapeId: 12, key: "pos.center[0]" }, // "1" text
            { slideId: 260, shapeId: 7, key: "pos.center[0]" },  // Circle group
        ],
    },

    {
        name: "all_are_equal",
        description: "Number '2' should be horizontally centered in its circle",
        objects: [
            { slideId: 260, shapeId: 21, key: "pos.center[0]" }, // "2" text
            { slideId: 260, shapeId: 16, key: "pos.center[0]" }, // Circle group
        ],
    },

    {
        name: "all_are_equal",
        description: "Number '3' should be horizontally centered in its circle",
        objects: [
            { slideId: 260, shapeId: 30, key: "pos.center[0]" }, // "3" text
            { slideId: 260, shapeId: 25, key: "pos.center[0]" }, // Circle group
        ],
    },

    {
        name: "all_are_equal",
        description: "Number '4' should be horizontally centered in its circle",
        objects: [
            { slideId: 260, shapeId: 39, key: "pos.center[0]" }, // "4" text
            { slideId: 260, shapeId: 34, key: "pos.center[0]" }, // Circle group
        ],
    },

    {
        name: "all_are_equal",
        description: "Number '5' should be horizontally centered in its circle",
        objects: [
            { slideId: 260, shapeId: 48, key: "pos.center[0]" }, // "5" text
            { slideId: 260, shapeId: 43, key: "pos.center[0]" }, // Circle group
        ],
    },

    // All boxes should have the same width
    {
        name: "all_are_equal",
        description: "All 5 rounded rectangle boxes should have the same width",
        objects: [
            { slideId: 260, shapeId: 54, key: "size.w" }, // Box 1
            { slideId: 260, shapeId: 55, key: "size.w" }, // Box 2
            { slideId: 260, shapeId: 56, key: "size.w" }, // Box 3
            { slideId: 260, shapeId: 57, key: "size.w" }, // Box 4
            { slideId: 260, shapeId: 58, key: "size.w" }, // Box 5
        ],
    },

    // All boxes should start at the same X coordinate
    {
        name: "all_are_equal",
        description: "All 5 boxes should start at the same X coordinate",
        objects: [
            { slideId: 260, shapeId: 54, key: "pos.topLeft[0]" }, // Box 1
            { slideId: 260, shapeId: 55, key: "pos.topLeft[0]" }, // Box 2
            { slideId: 260, shapeId: 56, key: "pos.topLeft[0]" }, // Box 3
            { slideId: 260, shapeId: 57, key: "pos.topLeft[0]" }, // Box 4
            { slideId: 260, shapeId: 58, key: "pos.topLeft[0]" }, // Box 5
        ],
    },

    // Lines should connect to boxes (line endPos X should match box topLeft X)
    {
        name: "all_are_equal",
        description: "Line 1 end should connect to box 1 left edge",
        objects: [
            { slideId: 260, shapeId: 10, key: "endPos[0]" },      // Line 1 end X
            { slideId: 260, shapeId: 54, key: "pos.topLeft[0]" }, // Box 1 left X
        ],
    },

    {
        name: "all_are_equal",
        description: "Line 2 end should connect to box 2 left edge",
        objects: [
            { slideId: 260, shapeId: 19, key: "endPos[0]" },      // Line 2 end X
            { slideId: 260, shapeId: 55, key: "pos.topLeft[0]" }, // Box 2 left X
        ],
    },

    {
        name: "all_are_equal",
        description: "Line 3 end should connect to box 3 left edge",
        objects: [
            { slideId: 260, shapeId: 28, key: "endPos[0]" },      // Line 3 end X
            { slideId: 260, shapeId: 56, key: "pos.topLeft[0]" }, // Box 3 left X
        ],
    },

    {
        name: "all_are_equal",
        description: "Line 4 end should connect to box 4 left edge",
        objects: [
            { slideId: 260, shapeId: 37, key: "endPos[0]" },      // Line 4 end X
            { slideId: 260, shapeId: 57, key: "pos.topLeft[0]" }, // Box 4 left X
        ],
    },

    {
        name: "all_are_equal",
        description: "Line 5 end should connect to box 5 left edge",
        objects: [
            { slideId: 260, shapeId: 46, key: "endPos[0]" },      // Line 5 end X
            { slideId: 260, shapeId: 58, key: "pos.topLeft[0]" }, // Box 5 left X
        ],
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of table of contents alignment",
        slideId: 260,
        autoGenerate: true,
        criteria: "Evaluate if the numbers are centered in their circles and the boxes are properly aligned with same width/size, same X start, and connected to their lines.",
        focusAreas: [
            "Numbers 1-5 are centered within their respective circles",
            "All 5 rounded rectangle boxes have the same width",
            "All boxes start at the same X coordinate (left-aligned)",
            "Each line connects from the circle to the left edge of its box",
            "Visual balance and professional appearance of the table of contents"
        ],
        expectedChanges: [
            "Numbers repositioned to center of circles",
            "Boxes resized to same width",
            "Boxes aligned to same X start position",
            "Lines adjusted to connect circles to box edges"
        ],
    },
];
