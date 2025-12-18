import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-49b: Delete the second point and distribute evenly
//
// Initial state: There are 4 timeline points, including a "Second" point
// Expected:
// 1. The "Second" point (shapes 228, 229) should be deleted
// 2. The remaining 3 points should be evenly distributed horizontally
// 3. The main point titles should be aligned horizontally
// 4. The descriptions should be aligned horizontally

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS
    // ============================================
    // Verify that the "Second" point has been deleted
    {
        name: "count_shapes",
        description: "There should be 0 shapes with 'Second' text (the second point should be deleted)",
        slideId: 263,
        filter: { rawTextContains: "Second" },
        expected: 0,
    },
    {
        name: "count_shapes",
        description: "There should be 0 shapes with 'This was the second point' text (description of deleted point)",
        slideId: 263,
        filter: { rawTextContains: "This was the second point" },
        expected: 0,
    },
    // Verify that there are 3 main points remaining
    {
        name: "count_shapes",
        description: "There should be exactly 3 main point titles remaining (after deleting the second point)",
        slideId: 263,
        filter: { rawTextContains: "Add a main point" },
        expected: 3,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // The remaining 3 main point titles should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 remaining main point titles should be horizontally aligned",
        objects: [
            { slideId: 263, shapeId: 226, key: "pos.topLeft[1]" }, // First point
            { slideId: 263, shapeId: 232, key: "pos.topLeft[1]" }, // Third point (was fourth, now third)
            { slideId: 263, shapeId: 230, key: "pos.topLeft[1]" }, // Fourth point (was fifth, now fourth)
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },
    // The descriptions should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 remaining descriptions should be horizontally aligned",
        objects: [
            { slideId: 263, shapeId: 227, key: "pos.topLeft[1]" }, // Description for first point
            { slideId: 263, shapeId: 233, key: "pos.topLeft[1]" }, // Description for third point
            { slideId: 263, shapeId: 231, key: "pos.topLeft[1]" }, // Description for fourth point
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },

    // ============================================
    // SECTION 3: SPACING TESTS
    // ============================================
    // The 3 remaining main point titles should be evenly distributed
    {
        name: "equal_spacing",
        description: "The 3 remaining main point titles should have equal horizontal spacing",
        slideId: 263,
        shapeIds: [226, 232, 230], // The 3 remaining main point titles (sorted by X position)
        direction: "horizontal",
        // Tolerance: 5px (defined in spacing.test.ts)
        // Expected spacing: ~675px between consecutive points
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - The second point has been deleted
    // - The remaining 3 points are evenly distributed
    // - Overall visual balance and professional appearance
    {
        name: "llm_judge",
        description: "LLM evaluation of deletion and distribution",
        slideId: 263,
        autoGenerate: true,
        criteria: "Evaluate if the second point has been deleted and the remaining 3 points are evenly distributed horizontally. The main point titles and descriptions should be properly aligned.",
        focusAreas: [
            "The 'Second' point (title and description) has been deleted",
            "Exactly 3 timeline points remain",
            "The 3 remaining points are evenly distributed horizontally with equal spacing",
            "The main point titles are horizontally aligned",
            "The descriptions are horizontally aligned",
            "Visual balance and professional appearance of the timeline",
        ],
        expectedChanges: [
            "Second point deleted (both title and description)",
            "Remaining 3 points evenly distributed with equal spacing",
            "Improved visual balance and professional appearance",
        ],
    },
];

