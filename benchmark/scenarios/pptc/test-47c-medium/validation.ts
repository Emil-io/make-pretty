import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-47c: Pls fit the yellow boxes and the large text (same sizes for the boxes).
//
// Initial state: Yellow boxes have different sizes, and large text may not fit properly
// Expected:
// 1. All yellow boxes should have the same size (same width and height)
// 2. Large text should fit within the yellow boxes
//
// Structure:
// - Yellow boxes (fill #F8E175, large boxes): 532, 535, 542 (main content boxes)
// - Large text: "95%" (538), "2 out of 5" (537), "12 million" (544)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 3 main yellow boxes (fill color #F8E175, width > 100, height > 100)",
        slideId: 270,
        filter: {
            fillColor: "#F8E175",
            // Filter for large boxes only (width and height > 100 to exclude small decorative elements)
        },
        expected: 3,
    },

    // ============================================
    // SECTION 2: SIZE TESTS
    // ============================================
    // Test that all yellow boxes have the same width
    {
        name: "all_are_equal",
        description: "All yellow boxes should have the same width (size.w, 5px tolerance)",
        objects: [
            { slideId: 270, shapeId: 532, key: "size.w" }, // First yellow box
            { slideId: 270, shapeId: 535, key: "size.w" }, // Second yellow box
            { slideId: 270, shapeId: 542, key: "size.w" }, // Third yellow box
        ],
    },
    // Test that all yellow boxes have the same height
    {
        name: "all_are_equal",
        description: "All yellow boxes should have the same height (size.h, 5px tolerance)",
        objects: [
            { slideId: 270, shapeId: 532, key: "size.h" }, // First yellow box
            { slideId: 270, shapeId: 535, key: "size.h" }, // Second yellow box
            { slideId: 270, shapeId: 542, key: "size.h" }, // Third yellow box
        ],
    },

    // ============================================
    // SECTION 3: TEXT FITTING TESTS
    // ============================================
    // Test that text fits within boxes (text center should be within box bounds)
    // Note: We check that text is within box boundaries using position and size comparisons
    // Text 538 "95%" should be within box 532 or 535 or 542
    // Text 537 "2 out of 5" should be within a box
    // Text 544 "12 million" should be within box 542

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All yellow boxes have the same size
    // - Large text fits properly within the yellow boxes
    // - Overall visual fitting and organization
    {
        name: "llm_judge",
        description: "LLM evaluation of yellow boxes size uniformity and text fitting",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if all yellow boxes (fill color #F8E175, shapes 532, 535, 542 - the main large boxes with width and height > 100px) have the same size (same width and same height). Also verify that the large text elements ('95%' textbox 538, '2 out of 5' textbox 537, '12 million' textbox 544) fit properly within their corresponding yellow boxes. The text should be fully contained within the box boundaries and properly sized to fit.",
        focusAreas: [
            "All yellow boxes (532, 535, 542) have the same width",
            "All yellow boxes (532, 535, 542) have the same height",
            "Text '95%' (538) fits within its yellow box",
            "Text '2 out of 5' (537) fits within its yellow box",
            "Text '12 million' (544) fits within its yellow box",
            "Large text elements are properly sized to fit within boxes",
            "Overall visual consistency and organization",
        ],
        expectedChanges: [
            "All yellow boxes have uniform size (same width and height)",
            "Large text elements fit properly within their yellow boxes",
            "Improved visual consistency and organization",
        ],
    },
];

