import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-42b: Move the whole layout (the line, textboxes etc) to the middle - center them.
//
// Initial state: Layout positioned left of center (main group center at ~824px)
// Expected: Layout centered horizontally on slide (center around 960px for 1920px slide)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 image shape",
        slideId: 258,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 10 textbox shapes",
        slideId: 258,
        filter: { shapeType: "textbox" },
        expected: 10,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 4 group shapes",
        slideId: 258,
        filter: { shapeType: "group" },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 1 line shape",
        slideId: 258,
        filter: { shapeType: "line" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: HORIZONTAL CENTERING
    // ============================================
    // Check that the main layout group (shape 10) is centered horizontally
    // Slide width is 1920px, so center should be around 960px
    // Ground truth: center X = 960.0 (perfectly centered)
    {
        name: "greater_than",
        description: "Main layout group center X should be greater than 900px",
        slideId: 258,
        shapeId: 10,
        key: "pos.center[0]",
        expected: 900,
    },
    {
        name: "less_than",
        description: "Main layout group center X should be less than 1020px",
        slideId: 258,
        shapeId: 10,
        key: "pos.center[0]",
        expected: 1020,
    },

    // Check that the horizontal line is centered
    // Ground truth: startPos[0] = 390.6, endPos[0] = 1518.6
    {
        name: "less_than",
        description: "Horizontal line start should be left of center (X < 700)",
        slideId: 258,
        shapeId: 15,
        key: "startPos[0]",
        expected: 700,
    },
    {
        name: "greater_than",
        description: "Horizontal line end should be right of center (X > 1200)",
        slideId: 258,
        shapeId: 15,
        key: "endPos[0]",
        expected: 1200,
    },

    // Verify the three step groups maintain their relative spacing
    // They should still be evenly spaced, just centered as a group
    {
        name: "filtered_spacing",
        description: "The three step groups should maintain equal horizontal spacing",
        slideId: 258,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3, // The three step groups (11, 16, 20)
    },

    // ============================================
    // SECTION 3: VERTICAL ALIGNMENT (should be maintained)
    // ============================================
    // The three step groups should remain at the same Y position
    {
        name: "filtered_equality",
        description: "The three step groups should be aligned at the same Y coordinate",
        slideId: 258,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // Groups 11, 16, 20 should be aligned
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Note: Boundary test omitted - shape 9 (decorative image) intentionally extends
    // beyond slide boundaries in ground truth. LLM judge will assess visual quality.
    {
        name: "llm_judge",
        description: "LLM evaluation of layout centering",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the entire layout (line, textboxes, step groups) has been centered horizontally on the slide, maintaining relative positions and spacing between elements.",
        focusAreas: [
            "The main layout group is horizontally centered on the slide",
            "The horizontal line connecting the steps is centered and spans appropriately across the slide",
            "The three step groups (numbered 1, 2, 3) maintain their relative spacing and are centered as a group",
            "All textboxes maintain their relative positions within the centered layout",
            "The overall layout appears balanced and centered horizontally",
            "Visual symmetry and professional appearance of the centered layout",
        ],
        expectedChanges: [
            "Entire layout moved to center of slide horizontally",
            "Main layout group centered around slide midpoint",
            "Horizontal line repositioned to center",
            "All elements maintain relative positions and spacing",
            "Improved visual balance and symmetry",
        ],
    },
];

