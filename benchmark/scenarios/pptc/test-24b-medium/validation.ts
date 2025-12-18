import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be 4 images (1 background + 3 comparison images)",
        slideId: 291,
        filter: { shapeType: "image" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be 7 textboxes (1 title + 3 headers + 3 descriptions)",
        slideId: 291,
        filter: { shapeType: "textbox" },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "There should be 4 lines (dividers)",
        slideId: 291,
        filter: { shapeType: "line" },
        expected: 4,
    },

    // Alignment tests - 3 headers should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 main point headers should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 291, shapeId: 411, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 412, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 413, key: "pos.topLeft[1]" },
        ],
    },

    // 3 description textboxes should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 description textboxes should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 291, shapeId: 414, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 415, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 416, key: "pos.topLeft[1]" },
        ],
    },

    // 3 comparison images should be horizontally aligned (excluding background)
    {
        name: "all_are_equal",
        description: "The 3 comparison images should be horizontally aligned at same Y center",
        objects: [
            { slideId: 291, shapeId: 407, key: "pos.center[1]" },
            { slideId: 291, shapeId: 408, key: "pos.center[1]" },
            { slideId: 291, shapeId: 409, key: "pos.center[1]" },
        ],
    },

    // Size consistency - headers should have equal height
    {
        name: "all_are_equal",
        description: "Header textboxes should have equal height",
        objects: [
            { slideId: 291, shapeId: 411, key: "size.h" },
            { slideId: 291, shapeId: 412, key: "size.h" },
            { slideId: 291, shapeId: 413, key: "size.h" },
        ],
    },

    // Description textboxes should have equal height
    {
        name: "all_are_equal",
        description: "Description textboxes should have equal height",
        objects: [
            { slideId: 291, shapeId: 414, key: "size.h" },
            { slideId: 291, shapeId: 415, key: "size.h" },
            { slideId: 291, shapeId: 416, key: "size.h" },
        ],
    },

    // Spacing - headers should be evenly spaced horizontally
    {
        name: "equal_spacing",
        description: "The 3 header textboxes should have equal horizontal spacing",
        slideId: 291,
        shapeIds: [411, 412, 413],
        direction: "horizontal",
    },

    // Spacing - description textboxes should be evenly spaced
    {
        name: "equal_spacing",
        description: "The 3 description textboxes should have equal horizontal spacing",
        slideId: 291,
        shapeIds: [414, 415, 416],
        direction: "horizontal",
    },

    // Boundary test - all shapes should be within slide
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries (no overflow)",
        slideId: 291,
        minMargin: 0,
    },

    // LLM Judge for content replacement and design quality
    {
        name: "llm_judge",
        description: "LLM evaluation of content replacement and design quality",
        slideId: 291,
        autoGenerate: true,
        criteria: "Evaluate if the template text has been replaced with actual content describing differences between the three images, while maintaining good design and no text overflow.",
        focusAreas: [
            "Title textbox has been replaced with a coherent topic related to the three images",
            "All 3 'ADD A MAIN POINT' headers have been replaced with actual content",
            "All 3 'Briefly elaborate...' descriptions have been replaced with meaningful text",
            "Text content describes differences between the objects shown in the images",
            "No text overflow - all text fits within their respective textboxes",
            "Layout and alignment maintained after content replacement",
            "Professional and coherent slide design",
        ],
        expectedChanges: [
            "Title replaced with topic describing the image comparison",
            "3 headers replaced with main points about each image",
            "3 descriptions replaced with elaboration on the differences",
            "Clean design with no text overflow",
        ],
    },
];
