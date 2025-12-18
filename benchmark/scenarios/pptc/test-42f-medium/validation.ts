import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-42f: Align the pricing features. Make the box perfectly surround the word "Pricing".
//
// Initial state: 
// - Feature textboxes ("Add a feature") are not aligned across pricing columns
// - Pricing box (Group 34) is too large and doesn't tightly fit around "Pricing"
// Expected:
// 1. Feature textboxes aligned horizontally across columns (same Y coordinates)
// 2. Pricing box (Group 34) tightly surrounds the word "Pricing" in the title

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 image shape (background)",
        slideId: 275,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 group shapes (3 pricing columns + 1 Pricing box)",
        slideId: 275,
        filter: { shapeType: "group" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be multiple textbox shapes",
        slideId: 275,
        filter: { shapeType: "textbox" },
        expected: 20, // Title + pricing info + features + empty boxes
    },

    // ============================================
    // SECTION 2: PRICING COLUMNS ALIGNMENT
    // ============================================
    // The three pricing columns (Groups 3, 6, 9) should be aligned at the top
    {
        name: "filtered_equality",
        description: "Pricing columns (Groups 3, 6, 9) should be aligned at the same top Y coordinate",
        slideId: 275,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 groups (the pricing columns) should be aligned
    },

    // ============================================
    // SECTION 3: FEATURE TEXTBOXES ALIGNMENT
    // ============================================
    // Feature textboxes ("Add a feature") should be aligned horizontally across columns
    // We'll check that feature textboxes with the same text align within tolerance
    {
        name: "filtered_equality",
        description: "Feature textboxes ('Add a feature') should be horizontally aligned across columns",
        slideId: 275,
        filter: { shapeType: "textbox" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 feature textboxes should be aligned (one per column for the first row)
        // Note: The filtered_equality test has a 10px tolerance, so textboxes within 10px will be grouped together
    },

    // ============================================
    // SECTION 4: PRICING BOX ALIGNMENT
    // ============================================
    // The Pricing box (Group 34) should tightly surround the word "Pricing" in the title
    // Title textbox (33) contains "Add a  Pricing  Page"
    // The box should be adjusted to fit tightly around "Pricing"
    // We'll use LLM judge to evaluate this as it requires semantic understanding of text positioning

    // ============================================
    // SECTION 5: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Feature textboxes alignment across pricing columns
    // - Pricing box tightly surrounding the word "Pricing"
    // - Overall visual alignment and layout quality
    {
        name: "llm_judge",
        description: "LLM evaluation of pricing features alignment and Pricing box positioning",
        slideId: 275,
        autoGenerate: true,
        criteria: "Evaluate if pricing feature textboxes are aligned horizontally across columns, and if the Pricing box (Group 34) tightly and perfectly surrounds the word 'Pricing' in the title.",
        focusAreas: [
            "All 'Add a feature' textboxes are horizontally aligned across the three pricing columns (same Y coordinates)",
            "Feature textboxes in the same row across different columns are aligned",
            "The Pricing box (Group 34) tightly surrounds only the word 'Pricing' in the title textbox (33)",
            "The Pricing box has minimal padding around the word 'Pricing' (not too large or too small)",
            "Overall layout is visually balanced and professional",
            "Pricing columns maintain consistent spacing and alignment",
        ],
        expectedChanges: [
            "Feature textboxes aligned horizontally across pricing columns",
            "Pricing box adjusted to tightly surround the word 'Pricing'",
            "Consistent alignment throughout the pricing layout",
        ],
    },
];

