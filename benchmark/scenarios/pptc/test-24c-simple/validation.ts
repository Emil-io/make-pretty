import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be 5 images (1 background + 4 content images)",
        slideId: 265,
        filter: { shapeType: "image" },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "There should be 5 textboxes (1 heading + 4 description boxes)",
        slideId: 265,
        filter: { shapeType: "textbox" },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "There should be 4 horizontal lines",
        slideId: 265,
        filter: { shapeType: "line" },
        expected: 4,
    },

    // Alignment tests - 4 description textboxes should be vertically aligned (same X)
    {
        name: "all_are_equal",
        description: "The 4 description textboxes should be vertically aligned at same X coordinate",
        objects: [
            { slideId: 265, shapeId: 240, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 241, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 242, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 243, key: "pos.topLeft[0]" },
        ],
    },

    // 4 content images should be vertically aligned (same X)
    {
        name: "all_are_equal",
        description: "The 4 content images should be vertically aligned at same X coordinate",
        objects: [
            { slideId: 265, shapeId: 244, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 245, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 246, key: "pos.topLeft[0]" },
            { slideId: 265, shapeId: 247, key: "pos.topLeft[0]" },
        ],
    },

    // Size consistency - content images should have equal width
    {
        name: "all_are_equal",
        description: "Content images should have equal width",
        objects: [
            { slideId: 265, shapeId: 244, key: "size.w" },
            { slideId: 265, shapeId: 245, key: "size.w" },
            { slideId: 265, shapeId: 246, key: "size.w" },
            { slideId: 265, shapeId: 247, key: "size.w" },
        ],
    },

    // Content images should have equal height
    {
        name: "all_are_equal",
        description: "Content images should have equal height",
        objects: [
            { slideId: 265, shapeId: 244, key: "size.h" },
            { slideId: 265, shapeId: 245, key: "size.h" },
            { slideId: 265, shapeId: 246, key: "size.h" },
            { slideId: 265, shapeId: 247, key: "size.h" },
        ],
    },

    // Description textboxes should have equal width
    {
        name: "all_are_equal",
        description: "Description textboxes should have equal width",
        objects: [
            { slideId: 265, shapeId: 240, key: "size.w" },
            { slideId: 265, shapeId: 241, key: "size.w" },
            { slideId: 265, shapeId: 242, key: "size.w" },
            { slideId: 265, shapeId: 243, key: "size.w" },
        ],
    },

    // Lines should have equal length
    {
        name: "all_are_equal",
        description: "The 4 horizontal lines should have equal length",
        objects: [
            { slideId: 265, shapeId: 248, key: "calculated.length" },
            { slideId: 265, shapeId: 249, key: "calculated.length" },
            { slideId: 265, shapeId: 250, key: "calculated.length" },
            { slideId: 265, shapeId: 251, key: "calculated.length" },
        ],
    },

    // Spacing - content images should be evenly spaced vertically
    {
        name: "equal_spacing",
        description: "The 4 content images should have equal vertical spacing",
        slideId: 265,
        shapeIds: [244, 245, 246, 247],
        direction: "vertical",
    },

    // Spacing - description textboxes should be evenly spaced vertically
    {
        name: "equal_spacing",
        description: "The 4 description textboxes should have equal vertical spacing",
        slideId: 265,
        shapeIds: [240, 241, 242, 243],
        direction: "vertical",
    },

    // Boundary test - all shapes should be within slide
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 265,
        minMargin: 0,
    },

    // LLM Judge for content quality and coherence
    {
        name: "llm_judge",
        description: "LLM evaluation of content replacement and story coherence",
        slideId: 265,
        autoGenerate: true,
        criteria: "Evaluate if the dummy text and heading were replaced with actual content that matches the images and tells a coherent story or fact.",
        focusAreas: [
            "The heading 'WRITE YOUR IDEA' has been replaced with a meaningful title",
            "The 4 'Briefly elaborate' placeholders have been replaced with actual descriptive content",
            "The text content matches and relates to the images on the slide",
            "The content tells a coherent story or presents related facts",
            "Text maintains professional appearance and readability",
            "Layout alignment and structure are preserved",
        ],
        expectedChanges: [
            "Heading replaced with meaningful title matching the slide theme",
            "All 4 description textboxes replaced with relevant content",
            "Content relates to and explains the images",
            "Cohesive narrative or factual presentation across all elements",
        ],
    },
];
