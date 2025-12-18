import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-46c: Pls align the three boxes and their headings.
//
// Initial state: Three boxes and their headings are not aligned
// Expected:
// 1. The three boxes (groups) should be horizontally aligned (same Y coordinate - topLeft[1])
// 2. The three headings should be horizontally aligned (same Y coordinate - topLeft[1])
//
// Structure:
// - Box 1: Group 348 (center X = 374.8, topLeft Y = 123.0), Heading: "70%" (shape 376, topLeft Y = 193.4)
// - Box 2: Group 355 (center X = 953.5, topLeft Y = 166.5), Heading: "2 OUT OF 5" (shape 378, topLeft Y = 193.4)
// - Box 3: Group 362 (center X = 1537.9, topLeft Y = 72.1), Heading: "12 MILLION" (shape 384, topLeft Y = 177.9)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 main box groups",
        slideId: 265,
        filter: { shapeType: "group" },
        expected: 12, // Total groups (including nested groups)
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 heading textboxes (70%, 2 OUT OF 5, 12 MILLION)",
        slideId: 265,
        filter: { rawTextContains: "70%" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '2 OUT OF 5' heading",
        slideId: 265,
        filter: { rawTextContains: "2 OUT OF 5" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 '12 MILLION' heading",
        slideId: 265,
        filter: { rawTextContains: "12 MILLION" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that the three boxes (main groups) are horizontally aligned
    {
        name: "all_are_equal",
        description: "The three boxes (groups) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 265, shapeId: 348, key: "pos.topLeft[1]" }, // Box 1
            { slideId: 265, shapeId: 355, key: "pos.topLeft[1]" }, // Box 2
            { slideId: 265, shapeId: 362, key: "pos.topLeft[1]" }, // Box 3
        ],
    },
    // Test that the three headings are horizontally aligned
    {
        name: "all_are_equal",
        description: "The three headings should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 265, shapeId: 376, key: "pos.topLeft[1]" }, // "70%"
            { slideId: 265, shapeId: 378, key: "pos.topLeft[1]" }, // "2 OUT OF 5"
            { slideId: 265, shapeId: 384, key: "pos.topLeft[1]" }, // "12 MILLION"
        ],
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Three boxes are aligned horizontally
    // - Three headings are aligned horizontally
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of three boxes and headings alignment",
        slideId: 265,
        autoGenerate: true,
        criteria: "Evaluate if the three boxes (groups 348, 355, 362) and their headings (textboxes 376 '70%', 378 '2 OUT OF 5', 384 '12 MILLION') are properly aligned. The three boxes should be horizontally aligned at the same Y coordinate (same topLeft[1] position). The three headings should also be horizontally aligned at the same Y coordinate. All boxes should form a clear horizontal row, and all headings should form a clear horizontal row. The headings may be positioned inside their respective boxes or above them - what matters is that both the boxes and headings are each aligned horizontally.",
        focusAreas: [
            "Three boxes (groups 348, 355, 362) are horizontally aligned (same Y coordinate)",
            "Three headings (70%, 2 OUT OF 5, 12 MILLION) are horizontally aligned (same Y coordinate)",
            "Visual consistency and organization of the boxes",
            "Visual consistency and organization of the headings",
            "Overall layout and alignment of the three boxes and headings",
            "Headings may be inside or above their boxes - only horizontal alignment matters",
        ],
        expectedChanges: [
            "Three boxes are aligned into a horizontal row",
            "Three headings are aligned into a horizontal row",
            "Improved visual organization and alignment of boxes and headings",
        ],
    },
];

