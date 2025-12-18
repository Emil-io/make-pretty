import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "includes",
        description: "Google Slides heading moved inside orange box",
        slideId: 257,
        shapeId: 122,
        key: "rawText",
        expected: "Google Slides",
    },
    {
        name: "includes",
        description: "PowerPoint heading moved inside orange box",
        slideId: 257,
        shapeId: 124,
        key: "rawText",
        expected: "PowerPoint",
    },
    {
        name: "includes",
        description: "Canva heading moved inside orange box",
        slideId: 257,
        shapeId: 126,
        key: "rawText",
        expected: "Canva",
    },
    {
        name: "all_are_equal",
        description: "Orange boxes aligned horizontally (same top position)",
        objects: [
            { slideId: 257, shapeId: 108, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 111, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 114, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Orange boxes same height",
        objects: [
            { slideId: 257, shapeId: 108, key: "size.h" },
            { slideId: 257, shapeId: 111, key: "size.h" },
            { slideId: 257, shapeId: 114, key: "size.h" },
        ],
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 257,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 257,
        autoGenerate: true,
        criteria: "Verify that the three orange boxes are properly aligned horizontally, evenly distributed, and that the headings (Google Slides, PowerPoint, Canva) are positioned inside their respective boxes with proper text placement",
    },
];
