import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-47a: Pls align.
//
// Initial state: Timeline/table of contents elements are not aligned
// Expected:
// 1. Yellow boxes (timeline markers) should be horizontally aligned by row
// 2. Numbers (01, 02, 03, 04, 05, 06) should be horizontally aligned by row
// 3. Description textboxes should be horizontally aligned by row
//
// Structure:
// - Yellow boxes (fill #F8E175): 134, 138, 141 (top row), 144, 147, 150 (bottom row)
// - Numbers: 136 "01", 140 "02", 143 "03" (top row), 146 "04", 149 "05", 152 "06" (bottom row)
// - Descriptions: Multiple "Amazing announcement..." textboxes

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 6 yellow boxes (fill color #F8E175) as timeline markers",
        slideId: 259,
        filter: { fillColor: "#F8E175" },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 6 number textboxes (01, 02, 03, 04, 05, 06)",
        slideId: 259,
        filter: { rawText: "01" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '02' textbox",
        slideId: 259,
        filter: { rawText: "02" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '03' textbox",
        slideId: 259,
        filter: { rawText: "03" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '04' textbox",
        slideId: 259,
        filter: { rawText: "04" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '05' textbox",
        slideId: 259,
        filter: { rawText: "05" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '06' textbox",
        slideId: 259,
        filter: { rawText: "06" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS - TOP ROW
    // ============================================
    // Test that top row yellow boxes are horizontally aligned
    {
        name: "all_are_equal",
        description: "Top row yellow boxes should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 259, shapeId: 134, key: "pos.topLeft[1]" }, // First yellow box
            { slideId: 259, shapeId: 141, key: "pos.topLeft[1]" }, // Third yellow box
        ],
    },
    // Test that top row numbers are horizontally aligned
    {
        name: "all_are_equal",
        description: "Top row numbers (01, 02, 03) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 259, shapeId: 136, key: "pos.topLeft[1]" }, // "01"
            { slideId: 259, shapeId: 140, key: "pos.topLeft[1]" }, // "02"
            { slideId: 259, shapeId: 143, key: "pos.topLeft[1]" }, // "03"
        ],
    },

    // ============================================
    // SECTION 3: ALIGNMENT TESTS - BOTTOM ROW
    // ============================================
    // Test that bottom row yellow boxes are horizontally aligned
    {
        name: "all_are_equal",
        description: "Bottom row yellow boxes should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 259, shapeId: 144, key: "pos.topLeft[1]" }, // Fourth yellow box
            { slideId: 259, shapeId: 150, key: "pos.topLeft[1]" }, // Sixth yellow box
        ],
    },
    // Test that bottom row numbers are horizontally aligned
    {
        name: "all_are_equal",
        description: "Bottom row numbers (04, 05, 06) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 259, shapeId: 146, key: "pos.topLeft[1]" }, // "04"
            { slideId: 259, shapeId: 149, key: "pos.topLeft[1]" }, // "05"
            { slideId: 259, shapeId: 152, key: "pos.topLeft[1]" }, // "06"
        ],
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All timeline elements are properly aligned
    // - Yellow boxes, numbers, and descriptions are aligned by row
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline/table of contents alignment",
        slideId: 259,
        autoGenerate: true,
        criteria: "Evaluate if all timeline/table of contents elements are properly aligned. The yellow boxes (fill color #F8E175, shapes 134, 138, 141 for top row and 144, 147, 150 for bottom row) should be horizontally aligned within each row (same Y coordinate). The numbers (01, 02, 03 for top row and 04, 05, 06 for bottom row) should be horizontally aligned within each row. The description textboxes should also be aligned within each row. All elements should form clear, organized rows with consistent alignment.",
        focusAreas: [
            "Yellow boxes are horizontally aligned within each row (top row: 134, 138, 141; bottom row: 144, 147, 150)",
            "Numbers (01-06) are horizontally aligned within each row",
            "Description textboxes are horizontally aligned within each row",
            "Visual consistency and organization of timeline elements",
            "Overall layout and alignment of all timeline components",
        ],
        expectedChanges: [
            "Yellow boxes are aligned within each row",
            "Numbers are aligned within each row",
            "Descriptions are aligned within each row",
            "Improved visual organization and alignment of all timeline elements",
        ],
    },
];

