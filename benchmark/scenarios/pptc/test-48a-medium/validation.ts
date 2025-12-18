import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-48a: Pls align the 4 black boxes and their contents.
//
// Initial state: 4 black boxes and their text contents are not aligned
// Expected:
// 1. The 4 black boxes should be aligned (horizontally or in a grid)
// 2. The contents (text) within each box should be aligned
//
// Structure:
// - Black boxes (fill #000000): 430, 434, 438, 442
// - Text contents: 432 (near 430), 436 (near 434), 440 (near 438), 444 (near 442)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 4 main black boxes (fill color #000000, size ~485.5x168.9)",
        slideId: 262,
        filter: { fillColor: "#000000" },
        expected: 5, // 4 main boxes + 1 large box (447) at bottom
    },

    // ============================================
    // SECTION 2: BOX ALIGNMENT TESTS
    // ============================================
    // Test that boxes are aligned horizontally (same Y coordinate for top row, same Y for bottom row)
    // Boxes appear to be in 2 rows: top row (430, 442) and bottom row (438, 434)
    {
        name: "all_are_equal",
        description: "Top row black boxes should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 262, shapeId: 430, key: "pos.topLeft[1]" }, // Top right box
            { slideId: 262, shapeId: 442, key: "pos.topLeft[1]" }, // Top left box
        ],
    },
    {
        name: "all_are_equal",
        description: "Bottom row black boxes should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 262, shapeId: 438, key: "pos.topLeft[1]" }, // Bottom right box
            { slideId: 262, shapeId: 434, key: "pos.topLeft[1]" }, // Bottom left box
        ],
    },

    // ============================================
    // SECTION 3: CONTENT ALIGNMENT TESTS
    // ============================================
    // Test that text contents within boxes are aligned
    // The text should be aligned relative to their boxes (same relative position within each box)
    // We'll check that text elements have the same Y offset from their box centers or topLeft positions

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - The 4 black boxes are properly aligned (horizontally and/or in a grid)
    // - The text contents within each box are aligned
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of black boxes and contents alignment",
        slideId: 262,
        autoGenerate: true,
        criteria: "Evaluate if the 4 black boxes (fill color #000000, shapes 430, 434, 438, 442) are properly aligned. The boxes should form a grid layout with horizontal and/or vertical alignment. Also verify that the text contents within each box (textboxes 432 near box 430, 436 near box 434, 440 near box 438, 444 near box 442) are aligned consistently - they should have the same relative position within each box (e.g., same vertical offset from the box top or center). All boxes and their contents should form a well-organized, aligned grid.",
        focusAreas: [
            "The 4 black boxes (430, 434, 438, 442) are aligned horizontally in rows",
            "The 4 black boxes are aligned vertically in columns",
            "Text contents within each box have consistent alignment (same relative position)",
            "Text 432 is aligned within box 430",
            "Text 436 is aligned within box 434",
            "Text 440 is aligned within box 438",
            "Text 444 is aligned within box 442",
            "Visual consistency and organization of boxes and contents",
            "Overall grid layout and alignment",
        ],
        expectedChanges: [
            "4 black boxes are aligned in a grid layout",
            "Text contents within each box are aligned consistently",
            "Improved visual organization and alignment of boxes and contents",
        ],
    },
];

