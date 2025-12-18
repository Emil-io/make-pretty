import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-47d: Pls align the bottom text.
//
// Initial state: Bottom text elements are not aligned (different Y coordinates)
// Expected:
// 1. All bottom text elements should be horizontally aligned (same Y coordinate)
//
// Structure:
// - Top text: "Add a main point" textboxes (591, 593, 594, 595)
// - Bottom text: "Elaborate on what you want to discuss." textboxes (592, 596, 597, 598)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: ALIGNMENT TESTS
    // ============================================
    // Test that all top text elements ("Add a main point") are horizontally aligned
    {
        name: "all_are_equal",
        description: "All top text elements (Add a main point) should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 271, shapeId: 591, key: "pos.topLeft[1]" }, // First top text
            { slideId: 271, shapeId: 593, key: "pos.topLeft[1]" }, // Second top text
            { slideId: 271, shapeId: 594, key: "pos.topLeft[1]" }, // Third top text
            { slideId: 271, shapeId: 595, key: "pos.topLeft[1]" }, // Fourth top text
        ],
    },
    // Test that all bottom text elements are horizontally aligned (same Y coordinate)
    {
        name: "all_are_equal",
        description: "All bottom text elements should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 271, shapeId: 592, key: "pos.topLeft[1]" }, // First bottom text
            { slideId: 271, shapeId: 596, key: "pos.topLeft[1]" }, // Second bottom text
            { slideId: 271, shapeId: 597, key: "pos.topLeft[1]" }, // Third bottom text
            { slideId: 271, shapeId: 598, key: "pos.topLeft[1]" }, // Fourth bottom text
        ],
    },

    // ============================================
    // SECTION 2: SPACING TESTS
    // ============================================
    // Test that top text elements have equal spacing between them horizontally
    {
        name: "equal_spacing",
        description: "Top text elements (Add a main point) should have equal spacing between them (horizontal direction)",
        slideId: 271,
        shapeIds: [591, 593, 594, 595], // The 4 top text elements
        direction: "horizontal",
    },
    // Test that bottom text elements have equal spacing between them horizontally
    {
        name: "equal_spacing",
        description: "Bottom text elements should have equal spacing between them (horizontal direction)",
        slideId: 271,
        shapeIds: [592, 596, 597, 598], // The 4 bottom text elements
        direction: "horizontal",
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All bottom text elements are horizontally aligned
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of bottom text alignment",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if all text elements in the timeline are properly aligned and spaced. The top text elements ('Add a main point', shapes 591, 593, 594, 595) should be horizontally aligned at the same Y coordinate and have equal spacing between them. The bottom text elements ('Elaborate on what you want to discuss.', shapes 592, 596, 597, 598) should also be horizontally aligned at the same Y coordinate and have equal spacing between them. Both rows should form horizontal rows with consistent alignment and equal spacing.",
        focusAreas: [
            "All top text elements ('Add a main point') are horizontally aligned (same Y coordinate)",
            "All bottom text elements are horizontally aligned (same Y coordinate)",
            "Equal spacing between top text elements",
            "Equal spacing between bottom text elements",
            "Top and bottom text elements form consistent horizontal rows",
            "Visual consistency and organization of timeline text",
            "Overall layout and alignment of the timeline text sections",
        ],
        expectedChanges: [
            "Top text elements ('Add a main point') are aligned horizontally",
            "Bottom text elements are aligned horizontally",
            "Equal spacing between top text elements",
            "Equal spacing between bottom text elements",
            "Improved visual organization and alignment of timeline text",
        ],
    },
];

