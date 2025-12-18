import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-45a: Pls align the headings/the text.
//
// Initial state: Headings and/or text are not properly aligned
// Expected:
// 1. All service headings ("Service One", "Service Two", "Service Three", "Service Four") should be aligned (same Y coordinate)
// 2. All description textboxes should be aligned (same Y coordinate)
//
// Structure:
// - Headings: "Service One" (248), "Service Two" (254), "Service Three" (256), "Service Four" (258)
// - Descriptions: "Elaborate on what you want to discuss." (253, 255, 257, 259)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 4 service heading textboxes (Service One, Two, Three, Four)",
        slideId: 266,
        filter: { rawTextContains: "Service " }, // Note: space after "Service" to exclude "Our Services"
        expected: 4, // Service One, Two, Three, Four (excludes "Our Services")
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 description textboxes",
        slideId: 266,
        filter: { rawTextContains: "Elaborate on what" },
        expected: 4, // The 4 description textboxes
    },

    // ============================================
    // SECTION 2: HEADING ALIGNMENT TESTS
    // ============================================
    // Test that all service headings are horizontally aligned (same Y coordinate)
    // Using all_are_equal with 5px tolerance (difference of 1.7px should pass)
    {
        name: "all_are_equal",
        description: "All service headings should be horizontally aligned (same Y coordinate - topLeft[1], 5px tolerance)",
        objects: [
            { slideId: 266, shapeId: 248, key: "pos.topLeft[1]" }, // Service One
            { slideId: 266, shapeId: 254, key: "pos.topLeft[1]" }, // Service Two
            { slideId: 266, shapeId: 256, key: "pos.topLeft[1]" }, // Service Three
            { slideId: 266, shapeId: 258, key: "pos.topLeft[1]" }, // Service Four
        ],
    },

    // ============================================
    // SECTION 3: DESCRIPTION TEXT ALIGNMENT TESTS
    // ============================================
    // Test that all description textboxes are horizontally aligned (same Y coordinate)
    // Using filtered_equality which has 10px tolerance (more appropriate for alignment)
    {
        name: "filtered_equality",
        description: "All description textboxes should have the same Y coordinate (using filter, 10px tolerance)",
        slideId: 266,
        filter: { rawTextContains: "Elaborate on what" },
        key: "pos.topLeft[1]",
        minMatchCount: 4, // All 4 descriptions should share the same Y coordinate (within 10px tolerance)
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All headings are properly aligned
    // - All text/descriptions are properly aligned
    // - Overall visual alignment and organization
    {
        name: "llm_judge",
        description: "LLM evaluation of headings and text alignment",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the service headings ('Service One', 'Service Two', 'Service Three', 'Service Four', shapes 248, 254, 256, 258) and the description textboxes ('Elaborate on what you want to discuss.', shapes 253, 255, 257, 259) are properly aligned. All headings should be at the same Y coordinate (horizontally aligned), and all description textboxes should be at the same Y coordinate (horizontally aligned).",
        focusAreas: [
            "All service headings are horizontally aligned (same Y coordinate)",
            "All description textboxes are horizontally aligned (same Y coordinate)",
            "Headings form a visually consistent row",
            "Description textboxes form a visually consistent row",
            "Overall visual alignment and organization of the service sections",
        ],
        expectedChanges: [
            "Service headings are aligned horizontally at the same Y coordinate",
            "Description textboxes are aligned horizontally at the same Y coordinate",
            "Improved visual organization and alignment of headings and text",
        ],
    },
];

