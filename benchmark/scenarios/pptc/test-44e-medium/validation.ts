import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-44e: Pls adjust the red bars according to the shown percentages.
//
// Initial state: Red bars are not correctly sized according to the percentages
// Expected:
// 1. Red bar for 75% should be 75% of the background bar width
// 2. Red bar for 25% should be 25% of the background bar width
// 3. Red bar for 100% should be 100% of the background bar width
//
// Structure:
// - 75% bar: Background (shape 371, width 336.8), Red bar (shape 372, color #FA5157)
// - 25% bar: Background (shape 376, width 336.8), Red bar (shape 377, color #FA5157)
// - 100% bar: Background (shape 381, width 336.8), Red bar (shape 382, color #FA5157)
//
// Expected widths:
// - 75%: 336.8 * 0.75 = 252.6 (tolerance: ±5px)
// - 25%: 336.8 * 0.25 = 84.2 (tolerance: ±5px)
// - 100%: 336.8 * 1.0 = 336.8 (tolerance: ±5px)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 red bars (autoShape with fill color #FA5157)",
        slideId: 268,
        filter: { fillColor: "#FA5157" },
        expected: 3, // The 3 red bars (shapes 372, 377, 382)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 black background bars (autoShape with fill color #000000, width 336.8)",
        slideId: 268,
        filter: { fillColor: "#000000" },
        expected: 3, // The 3 background bars (shapes 371, 376, 381)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 percentage textboxes (75%, 25%, 100%)",
        slideId: 268,
        filter: { rawTextContains: "%" },
        expected: 3, // The 3 percentage textboxes (shapes 369, 374, 379)
    },

    // ============================================
    // SECTION 2: WIDTH TESTS
    // ============================================
    // Test that each red bar has the correct width according to its percentage
    {
        name: "greater_than",
        description: "75% red bar (shape 372) width should be at least 247.6px (75% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 372,
        key: "size.w",
        expected: 247.6, // 252.6 - 5 (tolerance)
    },
    {
        name: "less_than",
        description: "75% red bar (shape 372) width should be at most 257.6px (75% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 372,
        key: "size.w",
        expected: 257.6, // 252.6 + 5 (tolerance)
    },
    {
        name: "greater_than",
        description: "25% red bar (shape 377) width should be at least 79.2px (25% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 377,
        key: "size.w",
        expected: 79.2, // 84.2 - 5 (tolerance)
    },
    {
        name: "less_than",
        description: "25% red bar (shape 377) width should be at most 89.2px (25% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 377,
        key: "size.w",
        expected: 89.2, // 84.2 + 5 (tolerance)
    },
    {
        name: "greater_than",
        description: "100% red bar (shape 382) width should be at least 331.8px (100% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 382,
        key: "size.w",
        expected: 331.8, // 336.8 - 5 (tolerance)
    },
    {
        name: "less_than",
        description: "100% red bar (shape 382) width should be at most 341.8px (100% of 336.8, with tolerance)",
        slideId: 268,
        shapeId: 382,
        key: "size.w",
        expected: 341.8, // 336.8 + 5 (tolerance)
    },

    // ============================================
    // SECTION 3: POSITION TESTS
    // ============================================
    // Test that red bars start at the same X position as their background bars
    {
        name: "all_are_equal",
        description: "75% red bar (shape 372) should start at the same X position as background (shape 371)",
        objects: [
            { slideId: 268, shapeId: 372, key: "pos.topLeft[0]" }, // Red bar left
            { slideId: 268, shapeId: 371, key: "pos.topLeft[0]" }, // Background left
        ],
    },
    {
        name: "all_are_equal",
        description: "25% red bar (shape 377) should start at the same X position as background (shape 376)",
        objects: [
            { slideId: 268, shapeId: 377, key: "pos.topLeft[0]" }, // Red bar left
            { slideId: 268, shapeId: 376, key: "pos.topLeft[0]" }, // Background left
        ],
    },
    {
        name: "all_are_equal",
        description: "100% red bar (shape 382) should start at the same X position as background (shape 381)",
        objects: [
            { slideId: 268, shapeId: 382, key: "pos.topLeft[0]" }, // Red bar left
            { slideId: 268, shapeId: 381, key: "pos.topLeft[0]" }, // Background left
        ],
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All 3 red bars are correctly sized according to their percentages
    // - Red bars are properly aligned with their background bars
    // - Overall visual correctness of the progress bars
    {
        name: "llm_judge",
        description: "LLM evaluation of red bars adjusted according to percentages",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if the 3 red progress bars (shapes 372, 377, 382, fill color #FA5157) are correctly adjusted according to the shown percentages (75%, 25%, 100%). Each red bar should be proportionally sized to match its percentage relative to its background bar (shapes 371, 376, 381, width 336.8). The 75% bar should be approximately 75% of the background width, the 25% bar should be approximately 25%, and the 100% bar should be approximately 100%.",
        focusAreas: [
            "75% red bar (shape 372) is correctly sized at approximately 75% of background bar width",
            "25% red bar (shape 377) is correctly sized at approximately 25% of background bar width",
            "100% red bar (shape 382) is correctly sized at approximately 100% of background bar width",
            "Red bars are properly aligned with their background bars (same starting X position)",
            "Overall visual correctness of the progress bars matches the displayed percentages",
        ],
        expectedChanges: [
            "Red bars are adjusted to match the shown percentages (75%, 25%, 100%)",
            "75% bar is approximately 75% of background width",
            "25% bar is approximately 25% of background width",
            "100% bar is approximately 100% of background width",
            "Red bars are properly aligned with their background bars",
        ],
    },
];

