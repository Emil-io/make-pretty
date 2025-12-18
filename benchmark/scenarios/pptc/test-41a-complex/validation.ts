import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Box 1 width should match text block 151 width (253.9)
    {
        name: "all_are_equal",
        description: "First box width should match its text block width below",
        objects: [
            { slideId: 257, shapeId: 140, key: "size.w" }, // Box 1
            { slideId: 257, shapeId: 151, key: "size.w" }, // Text block below
        ],
    },

    // Box 2 width should match text block 156 width (269.9)
    {
        name: "all_are_equal",
        description: "Second box width should match its text block width below",
        objects: [
            { slideId: 257, shapeId: 143, key: "size.w" }, // Box 2
            { slideId: 257, shapeId: 156, key: "size.w" }, // Text block below
        ],
    },

    // Box 3 width should match text block 154 width (249.2)
    {
        name: "all_are_equal",
        description: "Third box width should match its text block width below",
        objects: [
            { slideId: 257, shapeId: 146, key: "size.w" }, // Box 3
            { slideId: 257, shapeId: 154, key: "size.w" }, // Text block below
        ],
    },

    // Boxes should be horizontally aligned with their text blocks (same X center)
    {
        name: "all_are_equal",
        description: "First box should be horizontally centered with its text block",
        objects: [
            { slideId: 257, shapeId: 140, key: "pos.center[0]" },
            { slideId: 257, shapeId: 151, key: "pos.center[0]" },
        ],
    },

    {
        name: "all_are_equal",
        description: "Second box should be horizontally centered with its text block",
        objects: [
            { slideId: 257, shapeId: 143, key: "pos.center[0]" },
            { slideId: 257, shapeId: 156, key: "pos.center[0]" },
        ],
    },

    {
        name: "all_are_equal",
        description: "Third box should be horizontally centered with its text block",
        objects: [
            { slideId: 257, shapeId: 146, key: "pos.center[0]" },
            { slideId: 257, shapeId: 154, key: "pos.center[0]" },
        ],
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of box resizing and heading alignment",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the three colored boxes have been resized to match the width of their respective text blocks below, and if the headings inside are centered/aligned.",
        focusAreas: [
            "First box (Google Slides) width matches the text block width below it",
            "Second box (PowerPoint) width matches the text block width below it",
            "Third box (Canva) width matches the text block width below it",
            "Each box is horizontally aligned/centered with its text block below",
            "The headings (Google Slides, PowerPoint, Canva) are centered inside their boxes",
            "Overall visual balance and professional appearance"
        ],
        expectedChanges: [
            "Boxes resized to match text block widths",
            "Boxes horizontally aligned with text blocks below",
            "Headings centered inside boxes"
        ],
    },
];
