import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-49c: Align the text and move "Market Research" to the right so that the right border aligns with the box below
//
// Initial state: "Market Research" textbox (shape 468) has right border at 1574.9px
// Expected:
// 1. "Market Research" should be moved to the right so its right border aligns with the description box below (shape 469)
// 2. The description box below has right border at 1843.1px
// 3. Text elements should be aligned (titles and descriptions in the same rows should be horizontally aligned)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 'Market Research' textbox",
        slideId: 271,
        filter: { rawText: "Market Research" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: RIGHT BORDER ALIGNMENT
    // ============================================
    // "Market Research" right border should align with the description box below
    {
        name: "all_are_equal",
        description: "\"Market Research\" right border should align with the description box below",
        objects: [
            { slideId: 271, shapeId: 468, key: "pos.bottomRight[0]" }, // Market Research right border
            { slideId: 271, shapeId: 469, key: "pos.bottomRight[0]" }, // Description box below right border
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
        // Expected: Both should be at ~1843.1px
    },

    // ============================================
    // SECTION 3: TEXT ALIGNMENT
    // ============================================
    // Text in the same rows should be horizontally aligned
    // Row 1: "Example" textboxes (shapes 470, 466) - both at Y=148.5
    {
        name: "all_are_equal",
        description: "Top row 'Example' textboxes should be horizontally aligned",
        objects: [
            { slideId: 271, shapeId: 470, key: "pos.topLeft[1]" },
            { slideId: 271, shapeId: 466, key: "pos.topLeft[1]" },
        ],
        // Tolerance: 5px
    },
    // Row 3: "Example" textboxes (shapes 474, 472) - both at Y=379.1
    {
        name: "all_are_equal",
        description: "Third row 'Example' textboxes should be horizontally aligned",
        objects: [
            { slideId: 271, shapeId: 474, key: "pos.topLeft[1]" },
            { slideId: 271, shapeId: 472, key: "pos.topLeft[1]" },
        ],
        // Tolerance: 5px
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - "Market Research" has been moved to the right and its right border aligns with the box below
    // - Text elements are properly aligned
    // - Overall visual balance and professional appearance
    {
        name: "llm_judge",
        description: "LLM evaluation of text alignment and Market Research positioning",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if the text has been aligned and 'Market Research' has been moved to the right so that its right border aligns with the description box below it. Text elements in the same rows should be horizontally aligned.",
        focusAreas: [
            "'Market Research' textbox has been moved to the right",
            "The right border of 'Market Research' aligns with the right border of the description box below it",
            "Text elements in the same rows are horizontally aligned (same Y coordinate)",
            "Overall visual balance and professional appearance",
            "Proper spacing and alignment throughout the slide",
        ],
        expectedChanges: [
            "'Market Research' moved to the right to align with the box below",
            "Text elements aligned horizontally within their rows",
            "Improved visual balance and professional appearance",
        ],
    },
];

