import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-49a: Align the 3 circled pictures and the text
//
// Initial state: 3 square pictures (shapes 118, 119, 120) are misaligned horizontally
// Expected:
// 1. The 3 pictures should be horizontally aligned (same Y coordinate for center or topLeft[1])
// 2. The text titles ("Introduction", "Our Process", "About Us") should be aligned
// 3. The text descriptions should be aligned

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 main pictures (the circled ones)",
        slideId: 258,
        filter: {
            shapeType: "image",
        },
        expected: 6, // Total images (includes 3 main pictures + 3 other decorative images)
        // Note: We can't easily filter for just the 3 circled pictures, so we check total count
        // The alignment tests below verify the specific 3 pictures are aligned
    },

    // ============================================
    // SECTION 2: PICTURE ALIGNMENT
    // ============================================
    // The 3 circled pictures (shapes 118, 119, 120) should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 circled pictures should be horizontally aligned (same Y coordinate)",
        objects: [
            { slideId: 258, shapeId: 118, key: "pos.topLeft[1]" }, // Introduction picture
            { slideId: 258, shapeId: 119, key: "pos.topLeft[1]" }, // Our Process picture
            { slideId: 258, shapeId: 120, key: "pos.topLeft[1]" }, // About Us picture
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },

    // ============================================
    // SECTION 3: TEXT TITLE ALIGNMENT
    // ============================================
    // The text titles ("Introduction", "Our Process", "About Us") should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 text titles should be horizontally aligned",
        objects: [
            { slideId: 258, shapeId: 123, key: "pos.topLeft[1]" }, // "Introduction"
            { slideId: 258, shapeId: 121, key: "pos.topLeft[1]" }, // "Our Process"
            { slideId: 258, shapeId: 125, key: "pos.topLeft[1]" }, // "About Us"
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },

    // ============================================
    // SECTION 4: TEXT DESCRIPTION ALIGNMENT
    // ============================================
    // The text descriptions should be horizontally aligned
    {
        name: "all_are_equal",
        description: "The 3 text descriptions should be horizontally aligned",
        objects: [
            { slideId: 258, shapeId: 124, key: "pos.topLeft[1]" }, // Description for Introduction
            { slideId: 258, shapeId: 122, key: "pos.topLeft[1]" }, // Description for Our Process
            { slideId: 258, shapeId: 126, key: "pos.topLeft[1]" }, // Description for About Us
        ],
        // Tolerance: 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },

    // ============================================
    // SECTION 5: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - The 3 circled pictures are properly aligned horizontally
    // - The text (titles and descriptions) is properly aligned
    // - Overall visual coherence and professional appearance
    {
        name: "llm_judge",
        description: "LLM evaluation of picture and text alignment",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the 3 circled pictures and their associated text are properly aligned. The pictures should be horizontally aligned at the same Y coordinate, and the text titles and descriptions should each be horizontally aligned.",
        focusAreas: [
            "The 3 circled pictures are horizontally aligned (same Y coordinate for their top edges or centers)",
            "The 3 text titles ('Introduction', 'Our Process', 'About Us') are horizontally aligned",
            "The 3 text descriptions are horizontally aligned",
            "Visual coherence and professional appearance of the layout",
            "Proper relationship between pictures and their associated text",
        ],
        expectedChanges: [
            "3 circled pictures aligned horizontally",
            "Text titles aligned horizontally",
            "Text descriptions aligned horizontally",
            "Improved visual balance and professional appearance",
        ],
    },
];

