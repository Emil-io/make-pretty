import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-45b: Please adjust the bars according to the percentages.
//
// Initial state: Bars are not correctly sized according to the percentages
// Expected:
// 1. Purple bar for 90% should be 90% of the background bar width
// 2. Purple bar for 10% should be 10% of the background bar width
// 3. Purple bar for 30% should be 30% of the background bar width
//
// Structure:
// - 90% bar: Background (shape 278, width 337.5), Purple bar (shape 279, color #D19CFF)
// - 10% bar: Background (shape 281, width 337.5), Purple bar (shape 282, color #D19CFF)
// - 30% bar: Background (shape 284, width 336.8), Purple bar (shape 285, color #D19CFF)
//
// Expected widths:
// - 90%: 337.5 * 0.90 = 303.75 (tolerance: ±5px)
// - 10%: 337.5 * 0.10 = 33.75 (tolerance: ±5px)
// - 30%: 336.8 * 0.30 = 101.04 (tolerance: ±5px)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 purple bars (autoShape with fill color #D19CFF)",
        slideId: 268,
        filter: { fillColor: "#D19CFF" },
        expected: 3, // The 3 purple bars (shapes 279, 282, 285)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 white background bars (autoShape with fill color #FFFFFF, width ~337px)",
        slideId: 268,
        filter: { fillColor: "#FFFFFF" },
        expected: 3, // The 3 background bars (shapes 278, 281, 284)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 percentage textboxes (90%, 10%, 30%)",
        slideId: 268,
        filter: { rawTextContains: "%" },
        expected: 3, // The 3 percentage textboxes (shapes 290, 291, 292)
    },

    // ============================================
    // SECTION 2: PERCENTAGE TESTS
    // ============================================
    // Test that each purple bar has the correct width as a percentage of its background bar
    // This dynamically calculates the background width and checks the percentage ratio
    {
        name: "bar_percentage",
        description: "90% purple bar (shape 279) should be 90% of its background bar width",
        slideId: 268,
        barShapeId: 279,
        backgroundFilter: { fillColor: "#FFFFFF" },
        expectedPercentage: 90,
        percentageTolerance: 5, // ±5% tolerance
    },
    {
        name: "bar_percentage",
        description: "10% purple bar (shape 282) should be 10% of its background bar width",
        slideId: 268,
        barShapeId: 282,
        backgroundFilter: { fillColor: "#FFFFFF" },
        expectedPercentage: 10,
        percentageTolerance: 5, // ±5% tolerance
    },
    {
        name: "bar_percentage",
        description: "30% purple bar (shape 285) should be 30% of its background bar width",
        slideId: 268,
        barShapeId: 285,
        backgroundFilter: { fillColor: "#FFFFFF" },
        expectedPercentage: 30,
        percentageTolerance: 5, // ±5% tolerance
    },

    // ============================================
    // SECTION 3: POSITION TESTS
    // ============================================
    // Test that purple bars start at the same X position as their background bars
    {
        name: "all_are_equal",
        description: "90% purple bar (shape 279) should start at the same X position as background (shape 278)",
        objects: [
            { slideId: 268, shapeId: 279, key: "pos.topLeft[0]" }, // Purple bar left
            { slideId: 268, shapeId: 278, key: "pos.topLeft[0]" }, // Background left
        ],
    },
    {
        name: "all_are_equal",
        description: "10% purple bar (shape 282) should start at the same X position as background (shape 281)",
        objects: [
            { slideId: 268, shapeId: 282, key: "pos.topLeft[0]" }, // Purple bar left
            { slideId: 268, shapeId: 281, key: "pos.topLeft[0]" }, // Background left
        ],
    },
    {
        name: "all_are_equal",
        description: "30% purple bar (shape 285) should start at the same X position as background (shape 284)",
        objects: [
            { slideId: 268, shapeId: 285, key: "pos.topLeft[0]" }, // Purple bar left
            { slideId: 268, shapeId: 284, key: "pos.topLeft[0]" }, // Background left
        ],
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All 3 purple bars are correctly sized according to their percentages
    // - Purple bars are properly aligned with their background bars
    // - Overall visual correctness of the progress bars
    {
        name: "llm_judge",
        description: "LLM evaluation of purple bars adjusted according to percentages",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if the 3 purple progress bars (shapes 279, 282, 285, fill color #D19CFF) are correctly adjusted according to the shown percentages (90%, 10%, 30%). Each purple bar should be proportionally sized to match its percentage relative to its background bar (shapes 278, 281, 284, widths 337.5, 337.5, 336.8). The 90% bar should be approximately 90% of the background width, the 10% bar should be approximately 10%, and the 30% bar should be approximately 30%.",
        focusAreas: [
            "90% purple bar (shape 279) is correctly sized at approximately 90% of background bar width",
            "10% purple bar (shape 282) is correctly sized at approximately 10% of background bar width",
            "30% purple bar (shape 285) is correctly sized at approximately 30% of background bar width",
            "Purple bars are properly aligned with their background bars (same starting X position)",
            "Overall visual correctness of the progress bars matches the displayed percentages",
        ],
        expectedChanges: [
            "Purple bars are adjusted to match the shown percentages (90%, 10%, 30%)",
            "90% bar is approximately 90% of background width",
            "10% bar is approximately 10% of background width",
            "30% bar is approximately 30% of background width",
            "Purple bars are properly aligned with their background bars",
        ],
    },
];

