import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-44a: The yellow background box is misaligned right now - the spacing should be the same to all sides
//
// Initial state: Yellow background box has unequal spacing from slide edges
// Expected:
// 1. Yellow background box should have equal margins from all slide edges (top, bottom, left, right)
// 2. The box should be properly centered with consistent spacing
//
// Note: The yellow box is shape 109 (autoShape with fill color #F8D941)
//       Shape 108 is the group containing shape 109 (yellow box) and shape 110 (textbox)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    // Verify that the yellow box exists (using fillColor filter)
    {
        name: "count_shapes",
        description: "There should be exactly 1 yellow box (shape with fill color #F8D941)",
        slideId: 257,
        filter: { fillColor: "#F8D941" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 7 group shapes (including the yellow background box group and all nested groups)",
        slideId: 257,
        filter: { shapeType: "group" },
        expected: 7, // All groups including nested ones
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 image shapes (illustrations)",
        slideId: 257,
        filter: { shapeType: "image" },
        expected: 3,
    },

    // ============================================
    // SECTION 2: EQUAL MARGINS TESTS
    // ============================================
    // For equal margins from all sides, we need:
    // - Left margin = Top margin (topLeft[0] == topLeft[1])
    // - The box should be centered (center X = slideWidth/2, center Y = slideHeight/2)
    // - Since we can't directly calculate right/bottom margins without slide dimensions,
    //   we test that left equals top, and use LLM judge for full verification
    
    // Test that left margin equals top margin (necessary condition for equal margins)
    // The yellow box is shape 109 (the actual yellow background box, not the group)
    {
        name: "all_are_equal",
        description: "Yellow box left margin should equal top margin (topLeft[0] == topLeft[1])",
        objects: [
            { slideId: 257, shapeId: 109, key: "pos.topLeft[0]" }, // Left margin
            { slideId: 257, shapeId: 109, key: "pos.topLeft[1]" }, // Top margin
        ],
    },

    // Alternative test using filter to find the yellow box dynamically
    {
        name: "all_are_equal",
        description: "Yellow box (found by fillColor) left margin should equal top margin",
        objects: [
            { slideId: 257, filter: { fillColor: "#F8D941" }, key: "pos.topLeft[0]" }, // Left margin
            { slideId: 257, filter: { fillColor: "#F8D941" }, key: "pos.topLeft[1]" }, // Top margin
        ],
    },

    // Test that the box is horizontally centered (center X should be at slide center)
    // Standard PowerPoint slide width is 1920px, so center should be at 960px
    // Use range check: center X should be between 940 and 980 (960 ± 20px tolerance)
    {
        name: "greater_than",
        description: "Yellow box center X should be greater than 940px (centered, left bound)",
        slideId: 257,
        shapeId: 109,
        key: "pos.center[0]",
        expected: 940,
    },
    {
        name: "less_than",
        description: "Yellow box center X should be less than 980px (centered, right bound)",
        slideId: 257,
        shapeId: 109,
        key: "pos.center[0]",
        expected: 980,
    },

    // Test that the box is vertically centered (center Y should be at slide center)
    // Standard PowerPoint slide height is 1080px, so center should be at 540px
    // Use range check: center Y should be between 520 and 560 (540 ± 20px tolerance)
    {
        name: "greater_than",
        description: "Yellow box center Y should be greater than 520px (centered, top bound)",
        slideId: 257,
        shapeId: 109,
        key: "pos.center[1]",
        expected: 520,
    },
    {
        name: "less_than",
        description: "Yellow box center Y should be less than 560px (centered, bottom bound)",
        slideId: 257,
        shapeId: 109,
        key: "pos.center[1]",
        expected: 560,
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - All four margins (top, bottom, left, right) are exactly equal
    // - The box is properly positioned with consistent spacing
    {
        name: "llm_judge",
        description: "LLM evaluation of yellow background box equal spacing from all sides",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the yellow background box (fill color #F8D941, shape ID 109) has equal spacing (margins) from all slide edges (top, bottom, left, right). The spacing should be exactly the same on all four sides.",
        focusAreas: [
            "Yellow background box has equal margin from the top edge of the slide",
            "Yellow background box has equal margin from the bottom edge of the slide",
            "Yellow background box has equal margin from the left edge of the slide",
            "Yellow background box has equal margin from the right edge of the slide",
            "All four margins (top, bottom, left, right) are exactly equal to each other",
            "The box is properly centered with consistent spacing on all sides",
        ],
        expectedChanges: [
            "Yellow background box repositioned to have equal spacing from all slide edges",
            "Consistent margins on all four sides (top, bottom, left, right)",
            "Properly centered alignment with equal spacing",
        ],
    },
];

