import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-44c: Pls align the contents on the right.
//
// Initial state: Right-side contents are not properly aligned
// Expected:
// 1. Contents on the right side of the slide should be properly aligned
// 2. Right-side shapes should be aligned in columns or have aligned right edges
//
// Note: The divider line is at x=808-809 (shape 194)
//       Right-side content includes images (192, 193) and textboxes (198, 199, 200, 201)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 group shape",
        slideId: 261,
        filter: { shapeType: "group" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 image shapes on the slide",
        slideId: 261,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 6 textbox shapes on the slide",
        slideId: 261,
        filter: { shapeType: "textbox" },
        expected: 6,
    },

    // ============================================
    // SECTION 2: RIGHT-SIDE ALIGNMENT TESTS
    // ============================================
    // Test that right-side textboxes are aligned in columns
    // Based on datamodel, there appear to be two columns:
    // - Left column: shapes 199, 200 (both at x=848.6)
    // - Right column: shapes 198, 201 (both at x=1368.5)
    
    // Test that left column textboxes are vertically aligned (same X position)
    {
        name: "all_are_equal",
        description: "Left column textboxes should be vertically aligned (same X position)",
        objects: [
            { slideId: 261, shapeId: 199, key: "pos.topLeft[0]" }, // "Who we are?"
            { slideId: 261, shapeId: 200, key: "pos.topLeft[0]" }, // Description textbox
        ],
    },

    // Test that right column textboxes are vertically aligned (same X position)
    {
        name: "all_are_equal",
        description: "Right column textboxes should be vertically aligned (same X position)",
        objects: [
            { slideId: 261, shapeId: 198, key: "pos.topLeft[0]" }, // "What we do? "
            { slideId: 261, shapeId: 201, key: "pos.topLeft[0]" }, // Description textbox
        ],
    },

    // Test that right-side images are properly positioned
    // Images 192 and 193 should be aligned or evenly spaced
    {
        name: "greater_than",
        description: "Right-side images should be positioned to the right of the divider (x > 800)",
        slideId: 261,
        shapeId: 192,
        key: "pos.topLeft[0]",
        expected: 800,
    },
    {
        name: "greater_than",
        description: "Right-side images should be positioned to the right of the divider (x > 800)",
        slideId: 261,
        shapeId: 193,
        key: "pos.topLeft[0]",
        expected: 800,
    },

    // ============================================
    // SECTION 3: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Right-side contents are properly aligned
    // - Textboxes are aligned in columns
    // - Images are properly positioned and aligned
    // - Overall visual alignment and organization
    {
        name: "llm_judge",
        description: "LLM evaluation of right-side content alignment",
        slideId: 261,
        autoGenerate: true,
        criteria: "Evaluate if the contents on the right side of the slide (to the right of the vertical divider line at x=808-809) are properly aligned. The textboxes should be aligned in columns with consistent X positions, and images should be properly positioned and aligned. The overall layout should be visually organized and aligned.",
        focusAreas: [
            "Right-side textboxes are aligned in vertical columns (same X positions for items in the same column)",
            "Right-side images are properly positioned and aligned",
            "Overall visual alignment and organization of right-side content",
            "Consistent spacing and alignment between elements",
            "Right edges of shapes are aligned where appropriate",
        ],
        expectedChanges: [
            "Right-side contents are aligned in columns",
            "Textboxes have consistent X positions within their columns",
            "Images are properly positioned and aligned",
            "Overall visual alignment and organization improved",
        ],
    },
];

