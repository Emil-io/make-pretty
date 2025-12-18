import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-44b: The green background box is misaligned - same spacing to the bottom as to the sides pls. And also align the contents within!
//
// Initial state: Green background box has unequal spacing (bottom margin different from side margins)
// Expected:
// 1. Green background box should have equal spacing from bottom as from the sides (left/right margins = bottom margin)
// 2. Contents within the green box should be properly aligned
//
// Note: The green box is shape 146 (autoShape with fill color #DFF2A8)
//       Shape 145 is the group containing shape 146 (green box) and shape 147 (textbox content)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    // Verify that the green box exists (using fillColor filter)
    {
        name: "count_shapes",
        description: "There should be exactly 1 green box (shape with fill color #DFF2A8)",
        slideId: 258,
        filter: { fillColor: "#DFF2A8" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 2 group shapes (including the green background box group)",
        slideId: 258,
        filter: { shapeType: "group" },
        expected: 2, // All groups including nested ones
    },

    // ============================================
    // SECTION 2: EQUAL SPACING TESTS (Bottom = Sides)
    // ============================================
    // For equal spacing from bottom as from sides, we need:
    // - Left margin = Bottom margin (topLeft[0] == slideHeight - bottomRight[1])
    // - Right margin = Bottom margin (slideWidth - bottomRight[0] == slideHeight - bottomRight[1])
    // - Since we can't directly calculate margins without slide dimensions in static tests,
    //   we verify basic positioning and use LLM judge for precise margin verification
    // Note: We don't test left == top because the requirement is bottom == sides, not all margins equal

    // Test that the box is horizontally centered (center X should be at slide center)
    // Standard PowerPoint slide width is 1920px, so center should be at 960px
    // Use range check: center X should be between 940 and 980 (960 ± 20px tolerance)
    {
        name: "greater_than",
        description: "Green box center X should be greater than 940px (centered, left bound)",
        slideId: 258,
        shapeId: 146,
        key: "pos.center[0]",
        expected: 940,
    },
    {
        name: "less_than",
        description: "Green box center X should be less than 980px (centered, right bound)",
        slideId: 258,
        shapeId: 146,
        key: "pos.center[0]",
        expected: 980,
    },

    // ============================================
    // SECTION 3: CONTENT ALIGNMENT TESTS
    // ============================================
    // Test that content within the green box (shape 147) is properly aligned
    // Shape 147 is the textbox content inside the green box group
    
    // Test that content is horizontally aligned within the box
    // Content should be positioned relative to the green box, not the slide
    {
        name: "all_are_equal",
        description: "Content within green box should be aligned (test content left position relative to box)",
        objects: [
            { slideId: 258, shapeId: 147, key: "pos.topLeft[0]" }, // Content left position
            { slideId: 258, shapeId: 146, key: "pos.topLeft[0]" }, // Box left position (should be same or offset)
        ],
        // Note: This verifies that content starts at the same left position as the box
        // More precise alignment tests would require calculating relative positions
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Bottom margin equals side margins (left and right)
    // - Contents within the green box are properly aligned
    {
        name: "llm_judge",
        description: "LLM evaluation of green background box equal spacing (bottom = sides) and content alignment",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the green background box (fill color #DFF2A8, shape ID 146) has equal spacing from the bottom edge as from the left and right sides. The bottom margin should be exactly the same as the left and right margins. Also verify that the contents within the green box (shape 147 and any other content) are properly aligned.",
        focusAreas: [
            "Green background box has equal margin from the bottom edge of the slide",
            "Green background box has equal margin from the left edge of the slide",
            "Green background box has equal margin from the right edge of the slide",
            "Bottom margin equals left margin",
            "Bottom margin equals right margin",
            "Contents within the green box are properly aligned",
            "Content positioning is consistent and aligned within the box boundaries",
        ],
        expectedChanges: [
            "Green background box repositioned to have equal spacing from bottom as from sides",
            "Bottom margin equals left and right margins",
            "Contents within the green box are aligned and properly positioned",
        ],
    },
];

