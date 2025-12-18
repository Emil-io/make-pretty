import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-45c: Pls align the text of the SWOT.
//
// Initial state: Text elements in the SWOT are not properly aligned
// Expected:
// 1. All letters (S, O, W, T) should be horizontally aligned (same Y coordinate)
// 2. All titles (Strengths, Opportunities, Weaknesses, Threats) should be horizontally aligned
// 3. All descriptions should be horizontally aligned
//
// Structure:
// - S (Strengths): Letter (357), Title (358), Description (359)
// - O (Opportunities): Letter (362), Title (363), Description (364)
// - W (Weaknesses): Letter (368), Title (369), Description (370)
// - T (Threats): Letter (365), Title (372), Description (371)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 4 letter textboxes (S, O, W, T)",
        slideId: 271,
        filter: { rawText: "S" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 O textbox",
        slideId: 271,
        filter: { rawText: "O" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 W textbox",
        slideId: 271,
        filter: { rawText: "W" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 T textbox",
        slideId: 271,
        filter: { rawText: "T" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 title textboxes (Strengths, Opportunities, Weaknesses, Threats)",
        slideId: 271,
        filter: { rawTextContains: "Strengths" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 Opportunities textbox",
        slideId: 271,
        filter: { rawTextContains: "Opportunities" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 Weaknesses textbox",
        slideId: 271,
        filter: { rawTextContains: "Weaknesses" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 Threats textbox",
        slideId: 271,
        filter: { rawTextContains: "Threats" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that all letters (S, O, W, T) are horizontally aligned
    {
        name: "all_are_equal",
        description: "All SWOT letters (S, O, W, T) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 271, shapeId: 357, key: "pos.topLeft[1]" }, // S
            { slideId: 271, shapeId: 362, key: "pos.topLeft[1]" }, // O
            { slideId: 271, shapeId: 368, key: "pos.topLeft[1]" }, // W
            { slideId: 271, shapeId: 365, key: "pos.topLeft[1]" }, // T
        ],
    },
    // Test that all titles are horizontally aligned
    {
        name: "all_are_equal",
        description: "All SWOT titles (Strengths, Opportunities, Weaknesses, Threats) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 271, shapeId: 358, key: "pos.topLeft[1]" }, // Strengths
            { slideId: 271, shapeId: 363, key: "pos.topLeft[1]" }, // Opportunities
            { slideId: 271, shapeId: 369, key: "pos.topLeft[1]" }, // Weaknesses
            { slideId: 271, shapeId: 372, key: "pos.topLeft[1]" }, // Threats
        ],
    },
    // Test that all descriptions are horizontally aligned
    {
        name: "all_are_equal",
        description: "All SWOT descriptions should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 271, shapeId: 359, key: "pos.topLeft[1]" }, // Strengths description
            { slideId: 271, shapeId: 364, key: "pos.topLeft[1]" }, // Opportunities description
            { slideId: 271, shapeId: 370, key: "pos.topLeft[1]" }, // Weaknesses description
            { slideId: 271, shapeId: 371, key: "pos.topLeft[1]" }, // Threats description
        ],
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All SWOT text elements are properly aligned
    // - Letters, titles, and descriptions form clear horizontal rows
    // - Overall visual organization of the SWOT
    {
        name: "llm_judge",
        description: "LLM evaluation of SWOT text alignment",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if all text elements in the SWOT analysis are properly aligned. The letters (S, O, W, T) should be horizontally aligned at the same Y coordinate. The titles (Strengths, Opportunities, Weaknesses, Threats) should be horizontally aligned. The descriptions should be horizontally aligned. All text should form clear, organized rows within the SWOT structure.",
        focusAreas: [
            "All SWOT letters (S, O, W, T) are horizontally aligned",
            "All SWOT titles (Strengths, Opportunities, Weaknesses, Threats) are horizontally aligned",
            "All SWOT descriptions are horizontally aligned",
            "Text elements form clear, organized rows",
            "Overall visual organization and alignment of the SWOT",
        ],
        expectedChanges: [
            "SWOT letters are aligned into a horizontal row",
            "SWOT titles are aligned into a horizontal row",
            "SWOT descriptions are aligned into a horizontal row",
            "Improved visual organization and alignment of all SWOT text",
        ],
    },
];

