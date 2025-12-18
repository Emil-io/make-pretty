import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-47b: Align the agenda bullets.
//
// Initial state: Agenda bullets (yellow shapes) and their text are not aligned
// Expected:
// 1. Yellow bullet shapes should be horizontally aligned (same Y coordinate)
// 2. Agenda textboxes should be horizontally aligned (same Y coordinate)
// 3. Each bullet should align with its corresponding text
//
// Structure:
// - Yellow bullets (fill #F8E175): 223, 226, 227, 228 (should be vertically aligned at same X)
// - Agenda textboxes: 4 textboxes with "Write an agenda here." (each should align with corresponding bullet at same Y)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 4 yellow bullet shapes (fill color #F8E175)",
        slideId: 261,
        filter: { fillColor: "#F8E175" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 agenda textboxes (Write an agenda here.)",
        slideId: 261,
        filter: { rawTextContains: "Write an agenda here." },
        expected: 4,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that yellow bullets are vertically aligned (same X coordinate - they form a column)
    {
        name: "all_are_equal",
        description: "All yellow bullet shapes should be vertically aligned (same X coordinate - center[0], 5px tolerance)",
        objects: [
            { slideId: 261, shapeId: 223, key: "pos.center[0]" }, // First bullet
            { slideId: 261, shapeId: 226, key: "pos.center[0]" }, // Second bullet
            { slideId: 261, shapeId: 227, key: "pos.center[0]" }, // Third bullet
            { slideId: 261, shapeId: 228, key: "pos.center[0]" }, // Fourth bullet
        ],
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Yellow bullets are aligned horizontally
    // - Agenda textboxes are aligned horizontally
    // - Bullets align with their corresponding text
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of agenda bullets alignment",
        slideId: 261,
        autoGenerate: true,
        criteria: "Evaluate if all agenda bullets (yellow shapes with fill color #F8E175) are properly aligned. The bullets should be vertically aligned at the same X coordinate (forming a vertical column). Each bullet should be horizontally aligned with its corresponding 'Write an agenda here.' textbox at the same Y coordinate. All elements should form a well-organized, aligned list where bullets form a vertical column and each bullet aligns horizontally with its corresponding text.",
        focusAreas: [
            "All yellow bullet shapes (fill color #F8E175) are vertically aligned (same X coordinate, forming a column)",
            "Each bullet is horizontally aligned with its corresponding 'Write an agenda here.' textbox (same Y coordinate)",
            "There are 4 yellow bullets that form a vertical column",
            "Each of the 4 agenda textboxes aligns with its corresponding bullet",
            "Visual consistency and organization of agenda items",
            "Overall layout and alignment of bullets and text",
        ],
        expectedChanges: [
            "Yellow bullets are vertically aligned (same X coordinate, forming a column)",
            "Each bullet aligns horizontally with its corresponding text (same Y coordinate)",
            "Improved visual organization and alignment of agenda bullets",
        ],
    },
];

