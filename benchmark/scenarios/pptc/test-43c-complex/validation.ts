import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-43c: Align the text within the SWOT
//
// Initial state: Text elements in SWOT quadrants are misaligned
// Expected:
// 1. Text in the same row should be horizontally aligned (same Y coordinate)
//    - Top row: STRENGTHS and WEAKNESSES titles aligned
//    - Top row: S and W letters aligned
//    - Bottom row: OPPORTUNITIES and THREATS titles aligned
//    - Bottom row: O and T letters aligned
// 2. Text in the same column should be vertically aligned (same X coordinate)
//    - Left column: STRENGTHS and OPPORTUNITIES titles aligned
//    - Left column: S and O letters aligned
//    - Right column: WEAKNESSES and THREATS titles aligned
//    - Right column: W and T letters aligned
// 3. Text should be centered horizontally within each quadrant (verified by LLM judge)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    // Note: We don't count textboxes strictly because there are decorative empty textboxes
    // The alignment tests below verify that the correct SWOT textboxes exist
    {
        name: "count_shapes",
        description: "There should be exactly 2 line shapes (vertical and horizontal dividers)",
        slideId: 276,
        filter: { shapeType: "line" },
        expected: 2,
    },

    // ============================================
    // SECTION 2: ROW ALIGNMENT - TITLES
    // ============================================
    // Top row titles: STRENGTHS and WEAKNESSES should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Top row titles (STRENGTHS and WEAKNESSES) should be horizontally aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawText: "STRENGTHS" },
            { shapeType: "textbox", rawText: "WEAKNESSES" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },
    // Bottom row titles: OPPORTUNITIES and THREATS should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Bottom row titles (OPPORTUNITIES and THREATS) should be horizontally aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawText: "OPPORTUNITIES" },
            { shapeType: "textbox", rawText: "THREATS" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // ============================================
    // SECTION 3: ROW ALIGNMENT - LETTERS
    // ============================================
    // Top row letters: S (1614) and W (1620) should be horizontally aligned
    {
        name: "all_are_equal",
        description: "Top row letters (S and W) should be horizontally aligned",
        objects: [
            { slideId: 276, shapeId: 1614, key: "pos.topLeft[1]" }, // S
            { slideId: 276, shapeId: 1620, key: "pos.topLeft[1]" }, // W
        ],
    },
    // Bottom row letters: O (1617) and T (1623) should be horizontally aligned
    {
        name: "all_are_equal",
        description: "Bottom row letters (O and T) should be horizontally aligned",
        objects: [
            { slideId: 276, shapeId: 1617, key: "pos.topLeft[1]" }, // O
            { slideId: 276, shapeId: 1623, key: "pos.topLeft[1]" }, // T
        ],
    },

    // ============================================
    // SECTION 4: COLUMN ALIGNMENT - TITLES
    // ============================================
    // Left column titles: STRENGTHS and OPPORTUNITIES should be vertically aligned
    {
        name: "filtered_equality",
        description: "Left column titles (STRENGTHS and OPPORTUNITIES) should be vertically aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawText: "STRENGTHS" },
            { shapeType: "textbox", rawText: "OPPORTUNITIES" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },
    // Right column titles: WEAKNESSES and THREATS should be vertically aligned
    {
        name: "filtered_equality",
        description: "Right column titles (WEAKNESSES and THREATS) should be vertically aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawText: "WEAKNESSES" },
            { shapeType: "textbox", rawText: "THREATS" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // ============================================
    // SECTION 5: COLUMN ALIGNMENT - LETTERS
    // ============================================
    // Left column letters: S (1614) and O (1617) should be vertically aligned
    {
        name: "all_are_equal",
        description: "Left column letters (S and O) should be vertically aligned",
        objects: [
            { slideId: 276, shapeId: 1614, key: "pos.topLeft[0]" }, // S
            { slideId: 276, shapeId: 1617, key: "pos.topLeft[0]" }, // O
        ],
    },
    // Right column letters: W (1620) and T (1623) should be vertically aligned
    {
        name: "all_are_equal",
        description: "Right column letters (W and T) should be vertically aligned",
        objects: [
            { slideId: 276, shapeId: 1620, key: "pos.topLeft[0]" }, // W
            { slideId: 276, shapeId: 1623, key: "pos.topLeft[0]" }, // T
        ],
    },

    // ============================================
    // SECTION 6: DESCRIPTION TEXT ALIGNMENT
    // ============================================
    // Top row descriptions should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Top row descriptions should be horizontally aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawTextContains: "What are you doing well" }, // STRENGTHS description
            { shapeType: "textbox", rawTextContains: "Where do you need to improve" }, // WEAKNESSES description
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },
    // Bottom row descriptions should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Bottom row descriptions should be horizontally aligned",
        slideId: 276,
        filters: [
            { shapeType: "textbox", rawTextContains: "What are your goals" }, // OPPORTUNITIES description
            { shapeType: "textbox", rawTextContains: "What are the blockers" }, // THREATS description
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // ============================================
    // SECTION 7: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Text centering within each quadrant
    // - Overall visual alignment and coherence
    // - Professional appearance of the SWOT grid
    {
        name: "llm_judge",
        description: "LLM evaluation of text alignment within SWOT quadrants",
        slideId: 276,
        autoGenerate: true,
        criteria: "Evaluate if text elements (letters, titles, and descriptions) are properly aligned within the SWOT quadrants. Text should be centered horizontally within each quadrant, and elements in the same row/column should be aligned consistently.",
        focusAreas: [
            "All text elements (letters, titles, descriptions) are centered horizontally within their respective quadrants",
            "Text in the same row is horizontally aligned across quadrants (top row: STRENGTHS/WEAKNESSES, bottom row: OPPORTUNITIES/THREATS)",
            "Text in the same column is vertically aligned across quadrants (left column: STRENGTHS/OPPORTUNITIES, right column: WEAKNESSES/THREATS)",
            "Letters (S, W, O, T) are aligned consistently within their quadrants",
            "Visual symmetry and professional appearance of the SWOT grid",
            "Text readability and visual hierarchy are maintained",
        ],
        expectedChanges: [
            "Text elements aligned horizontally within rows",
            "Text elements aligned vertically within columns",
            "Text centered horizontally within each quadrant",
            "Consistent alignment throughout the SWOT grid",
        ],
    },
];

