import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "all_are_equal",
        description: "Y-coordinate alignment (all shapes in same row)",
        objects: [
            { slideId: 257, shapeId: 4, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 5, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 6, key: "pos.topLeft[1]" },
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
        name: "all_are_equal",
        description: "Second and third shapes have same fill color (light blue)",
        objects: [
            { slideId: 257, shapeId: 5, key: "style.fill.color" },
            { slideId: 257, shapeId: 6, key: "style.fill.color" },
        ],
    },
    {
        name: "none_are_equal",
        description: "First shape has different fill color than second shape",
        objects: [
            { slideId: 257, shapeId: 4, key: "style.fill.color" },
            { slideId: 257, shapeId: 5, key: "style.fill.color" },
        ],
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of shape alignment and highlighting",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if all shapes are aligned, and the first shape is highlighted (light blue) while others are light grey.",
        focusAreas: [
            "All shapes are properly aligned",
            "First shape has light blue fill color (highlighted)",
            "Second and third shapes have light grey fill color",
            "Visual distinction between highlighted and non-highlighted shapes",
        ],
        expectedChanges: [
            "Shapes aligned",
            "First shape highlighted in light blue",
            "Other shapes in light grey",
        ],
    },
];
