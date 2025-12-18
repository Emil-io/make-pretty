import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-44d: Pls align the 4 pics.
//
// Initial state: 4 pictures are not properly aligned
// Expected:
// 1. The 4 pictures should be aligned horizontally (same Y coordinate)
// 2. Pictures should have equal spacing between them
//
// Note: The 4 pictures are autoShape rectangles (290.4 x 290.4) that were FREEFORM shapes
//       saved as "rect". They are shapes 235, 239, 243, and 247.

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    // Note: The 4 pictures are autoShape rectangles (290.4 x 290.4) that were FREEFORM shapes
    //       saved as "rect". We test alignment using specific shapeIds (235, 239, 243, 247).
    {
        name: "count_shapes",
        description: "There should be exactly 10 autoShape shapes (includes the 4 pictures and other shapes)",
        slideId: 263,
        filter: { shapeType: "autoShape" },
        expected: 10, // All autoShapes including the 4 pictures (shapes 235, 239, 243, 247)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 6 group shapes (including nested groups)",
        slideId: 263,
        filter: { shapeType: "group" },
        expected: 6, // All groups including nested ones
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that all 4 pictures are horizontally aligned (same Y coordinate)
    // The 4 pictures are shapes 235, 239, 243, and 247
    {
        name: "all_are_equal",
        description: "All 4 pictures should be horizontally aligned (same Y coordinate - topLeft[1])",
        objects: [
            { slideId: 263, shapeId: 235, key: "pos.topLeft[1]" }, // First picture
            { slideId: 263, shapeId: 239, key: "pos.topLeft[1]" }, // Second picture
            { slideId: 263, shapeId: 243, key: "pos.topLeft[1]" }, // Third picture
            { slideId: 263, shapeId: 247, key: "pos.topLeft[1]" }, // Fourth picture
        ],
    },

    // Alternative: Test using filtered_equality to find pictures by size
    // All 4 pictures are square (290.4 x 290.4), so we can filter by size
    // Note: We can't filter by size directly, so we use the specific shapeIds above

    // ============================================
    // SECTION 3: SPACING TESTS
    // ============================================
    // Test that pictures have equal spacing between them horizontally
    {
        name: "equal_spacing",
        description: "Pictures should have equal spacing between them (horizontal direction)",
        slideId: 263,
        shapeIds: [235, 239, 243, 247], // The 4 pictures
        direction: "horizontal",
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All 4 pictures are properly aligned horizontally
    // - Pictures have equal spacing
    // - Overall visual alignment and organization
    {
        name: "llm_judge",
        description: "LLM evaluation of 4 pictures alignment",
        slideId: 263,
        autoGenerate: true,
        criteria: "Evaluate if the 4 circular pictures in the timeline section (the 4 square autoShape rectangles, shapes 235, 239, 243, 247) are properly aligned. They should be horizontally aligned (at the same Y coordinate) and have equal spacing between them. All pictures should be visually aligned and organized in a row.",
        focusAreas: [
            "All 4 pictures are aligned horizontally (same Y coordinate)",
            "Equal spacing between the 4 pictures",
            "Pictures are arranged in a consistent row",
            "Overall visual alignment and organization",
        ],
        expectedChanges: [
            "4 pictures are aligned horizontally at the same Y coordinate",
            "Equal spacing between pictures",
            "Proper visual alignment and organization",
        ],
    },
];

