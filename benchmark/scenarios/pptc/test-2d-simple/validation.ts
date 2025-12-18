import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 284 (960x540) | Task: Increase height of grey boxes (#D9D9D9) to match images/purple boxes
// Grey boxes current height: ~47.8 | Images height: ~63.8

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "8 images preserved", slideId: 284, filter: { shapeType: "image" }, expected: 8 },
    { name: "count_shapes", description: "6 grey boxes preserved", slideId: 284, filter: { shapeType: "autoShape", fillColor: "#D9D9D9" }, expected: 6 },

    // Height equality - grey boxes should match image height after change
    {
        name: "filtered_equality",
        description: "All grey boxes should have equal height",
        slideId: 284,
        filter: { shapeType: "autoShape", fillColor: "#D9D9D9" },
        key: "size.h",
        minMatchCount: 6,
    },
    {
        name: "filtered_equality",
        description: "All images should have equal height",
        slideId: 284,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 7, // Excluding background image (full slide)
    },

    // Grey boxes height should now be >= 60 (close to image height ~63.8)
    {
        name: "greater_than_or_equal",
        description: "Grey box 562 height increased to match images",
        slideId: 284,
        shapeId: 562,
        key: "size.h",
        expected: 60,
    },
    {
        name: "greater_than_or_equal",
        description: "Grey box 564 height increased to match images",
        slideId: 284,
        shapeId: 564,
        key: "size.h",
        expected: 60,
    },
    {
        name: "greater_than_or_equal",
        description: "Grey box 566 height increased to match images",
        slideId: 284,
        shapeId: 566,
        key: "size.h",
        expected: 60,
    },

    // Width should remain unchanged
    {
        name: "filtered_equality",
        description: "Grey boxes width unchanged",
        slideId: 284,
        filter: { shapeType: "autoShape", fillColor: "#D9D9D9" },
        key: "size.w",
        minMatchCount: 6,
    },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 284, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of height adjustment",
        slideId: 284,
        autoGenerate: true,
        criteria: "Evaluate if the grey boxes (name/job title containers) have been resized to match the height of the images/purple boxes.",
        focusAreas: [
            "Grey boxes (#D9D9D9) now have the same height as images",
            "Height increased from ~47.8 to ~63.8 to match images",
            "Vertical alignment and positioning maintained",
            "Visual consistency between grey boxes and images",
        ],
        expectedChanges: [
            "Grey boxes height increased to match image height",
            "All 6 grey boxes have equal height",
            "Layout maintains proper alignment",
        ],
    },
];
