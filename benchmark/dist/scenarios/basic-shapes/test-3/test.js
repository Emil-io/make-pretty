export var Test = [
    // All shapes must be aligned by their left (y) coordinate
    {
        name: "all_are_equal",
        objects: [
            { slideId: 257, shapeId: 4, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 5, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 6, key: "pos.topLeft[1]" },
        ],
    },
    // All shapes must be aligned by their width
    {
        name: "all_are_equal",
        objects: [
            { slideId: 257, shapeId: 4, key: "size.w" },
            { slideId: 257, shapeId: 5, key: "size.w" },
            { slideId: 257, shapeId: 6, key: "size.w" },
        ],
    },
    // All shapes must be aligned by their height
    {
        name: "all_are_equal",
        objects: [
            { slideId: 257, shapeId: 4, key: "size.h" },
            { slideId: 257, shapeId: 5, key: "size.h" },
            { slideId: 257, shapeId: 6, key: "size.h" },
        ],
    },
    // First shape should be light blue (e.g., fill color "#ADD8E6" or semantic "lightBlue")
    {
        name: "all_are_equal",
        objects: [
            { slideId: 257, shapeId: 5, key: "fill.color" },
            { slideId: 257, shapeId: 6, key: "fill.color" },
        ],
    },
    {
        name: "none_are_equal",
        objects: [
            { slideId: 257, shapeId: 4, key: "fill.color" },
            { slideId: 257, shapeId: 5, key: "fill.color" },
        ],
    }
];
