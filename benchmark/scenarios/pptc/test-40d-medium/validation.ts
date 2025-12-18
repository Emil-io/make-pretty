import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Top row headings should be horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "Service One and Service Two headings should be at same Y position",
        objects: [
            { slideId: 271, shapeId: 1184, key: "pos.topLeft[1]" }, // "Service One"
            { slideId: 271, shapeId: 1199, key: "pos.topLeft[1]" }, // "Service Two"
        ],
    },

    // Bottom row headings should be horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "Service Three and Service Four headings should be at same Y position",
        objects: [
            { slideId: 271, shapeId: 1192, key: "pos.topLeft[1]" }, // "Service Three"
            { slideId: 271, shapeId: 1206, key: "pos.topLeft[1]" }, // "Service Four"
        ],
    },

    // Left column headings should be vertically aligned (same X)
    {
        name: "all_are_equal",
        description: "Service One and Service Three headings should be at same X position",
        objects: [
            { slideId: 271, shapeId: 1184, key: "pos.topLeft[0]" }, // "Service One"
            { slideId: 271, shapeId: 1192, key: "pos.topLeft[0]" }, // "Service Three"
        ],
    },

    // Right column headings should be vertically aligned (same X)
    {
        name: "all_are_equal",
        description: "Service Two and Service Four headings should be at same X position",
        objects: [
            { slideId: 271, shapeId: 1199, key: "pos.topLeft[0]" }, // "Service Two"
            { slideId: 271, shapeId: 1206, key: "pos.topLeft[0]" }, // "Service Four"
        ],
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of heading alignment in the 4 boxes",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if the headings (Service One, Service Two, Service Three, Service Four) in the 4 boxes are properly aligned.",
        focusAreas: [
            "Service One and Service Two headings are horizontally aligned (same row)",
            "Service Three and Service Four headings are horizontally aligned (same row)",
            "Service One and Service Three headings are vertically aligned (same column)",
            "Service Two and Service Four headings are vertically aligned (same column)",
            "Consistent positioning of headings within their respective boxes",
            "Professional and balanced appearance"
        ],
        expectedChanges: [
            "Headings aligned horizontally within rows",
            "Headings aligned vertically within columns",
            "Consistent visual layout across all 4 boxes"
        ],
    },
];
