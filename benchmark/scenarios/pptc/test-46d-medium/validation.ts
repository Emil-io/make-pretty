import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-46d: Pls evenly distribute and align the timeline incl shapes and text.
//
// Initial state: Timeline shapes and text are not evenly distributed or aligned
// Expected:
// 1. Timeline shapes (orange circles/markers) should be evenly spaced horizontally
// 2. Timeline shapes should be horizontally aligned (same Y coordinate)
// 3. Timeline headings (FIRST, SECOND, THIRD, FORTH) should be horizontally aligned
// 4. Timeline descriptions should be horizontally aligned
//
// Structure:
// - Timeline shapes: 585 (X=372.3), 588 (X=769.2), 591 (X=1150.9), 594 (X=1542.0) - fill #F16610
// - Timeline headings: 597 "FIRST", 599 "SECOND", 601 "THIRD", 603 "FORTH"
// - Timeline descriptions: Multiple "Elaborate on what you want to discuss." textboxes

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 4 timeline shapes (orange markers with fill #F16610)",
        slideId: 274,
        filter: { fillColor: "#F16610" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 timeline headings (FIRST, SECOND, THIRD, FORTH)",
        slideId: 274,
        filter: { rawTextContains: "FIRST" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 SECOND heading",
        slideId: 274,
        filter: { rawTextContains: "SECOND" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 THIRD heading",
        slideId: 274,
        filter: { rawTextContains: "THIRD" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 FORTH heading",
        slideId: 274,
        filter: { rawTextContains: "FORTH" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that timeline shapes are horizontally aligned
    {
        name: "all_are_equal",
        description: "Timeline shapes should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 274, shapeId: 585, key: "pos.topLeft[1]" }, // First timeline shape
            { slideId: 274, shapeId: 588, key: "pos.topLeft[1]" }, // Second timeline shape
            { slideId: 274, shapeId: 591, key: "pos.topLeft[1]" }, // Third timeline shape
            { slideId: 274, shapeId: 594, key: "pos.topLeft[1]" }, // Fourth timeline shape
        ],
    },
    // Test that timeline headings are horizontally aligned
    {
        name: "all_are_equal",
        description: "Timeline headings should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 274, shapeId: 597, key: "pos.topLeft[1]" }, // "FIRST"
            { slideId: 274, shapeId: 599, key: "pos.topLeft[1]" }, // "SECOND"
            { slideId: 274, shapeId: 601, key: "pos.topLeft[1]" }, // "THIRD"
            { slideId: 274, shapeId: 603, key: "pos.topLeft[1]" }, // "FORTH"
        ],
    },

    // ============================================
    // SECTION 3: SPACING TESTS
    // ============================================
    // Test that timeline shapes are evenly spaced horizontally
    {
        name: "equal_spacing",
        description: "Timeline shapes should have equal spacing between them (horizontal direction)",
        slideId: 274,
        shapeIds: [585, 588, 591, 594], // The 4 timeline shapes
        direction: "horizontal",
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Timeline shapes are evenly distributed and aligned
    // - Timeline text (headings and descriptions) are aligned
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline even distribution and alignment",
        slideId: 274,
        autoGenerate: true,
        criteria: "Evaluate if the timeline elements are evenly distributed and aligned. The 4 timeline shapes (orange markers, shapes 585, 588, 591, 594, fill color #F16610) should be evenly spaced horizontally with equal gaps between them. All timeline shapes should be horizontally aligned at the same Y coordinate. The timeline headings (FIRST, SECOND, THIRD, FORTH - textboxes 597, 599, 601, 603) should be horizontally aligned at the same Y coordinate. The timeline descriptions should also be aligned. All elements should form a well-organized, evenly distributed timeline.",
        focusAreas: [
            "4 timeline shapes (orange markers) are evenly spaced horizontally with equal gaps",
            "Timeline shapes are horizontally aligned (same Y coordinate)",
            "Timeline headings (FIRST, SECOND, THIRD, FORTH) are horizontally aligned",
            "Timeline descriptions are aligned",
            "Overall visual organization and even distribution of timeline elements",
        ],
        expectedChanges: [
            "Timeline shapes are evenly distributed with equal spacing",
            "Timeline shapes are aligned horizontally",
            "Timeline headings are aligned horizontally",
            "Timeline descriptions are aligned",
            "Improved visual organization and even distribution of the timeline",
        ],
    },
];

