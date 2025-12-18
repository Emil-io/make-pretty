import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-48d: Add yellow lines as the existing one to all 4 points
//
// Initial state: There is 1 short vertical yellow line (shape 1038) at X=240.8
// Expected:
// 1. There should be 4 short vertical yellow lines total (1 existing + 3 added)
// 2. All lines should be vertical (startPos[0] == endPos[0] within tolerance)
// 3. All lines should have equal length (approximately 173.3px based on original)
// 4. All lines should have the same yellow color (#FFD525) and style
// 5. Lines should be positioned at the 4 points (verified by LLM judge)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    // Count all lines to verify lines exist (note: we can't filter by color, so this includes all lines)
    {
        name: "count_shapes",
        description: "There should be lines present on the slide",
        slideId: 275,
        filter: {
            shapeType: "line",
        },
        expected: 23, // Original had 20 yellow lines, groundtruth has 23 (3 new short yellow lines added)
        // Note: This counts all lines, not just yellow ones, since we can't filter by color.
        // The specific tests below verify the 4 short vertical yellow lines.
    },

    // ============================================
    // SECTION 2: LINE LENGTH VALIDATION
    // ============================================
    // Verify that the 4 short vertical yellow lines have equal length
    // The 4 short vertical yellow lines (shapes 1038, 1039, 1040, 1041) should all have the same length (~173.3px)
    {
        name: "all_are_equal",
        description: "The 4 short vertical yellow lines should have equal length (~173.3px)",
        objects: [
            { slideId: 275, shapeId: 1038, key: "calculated.length" }, // Existing line
            { slideId: 275, shapeId: 1039, key: "calculated.length" }, // Added line 1
            { slideId: 275, shapeId: 1040, key: "calculated.length" }, // Added line 2
            { slideId: 275, shapeId: 1041, key: "calculated.length" }, // Added line 3
        ],
        // Note: calculated.length uses √((endX-startX)² + (endY-startY)²) to compute line length dynamically
        // Tolerance is 5px (NUMERIC_TOLERANCE in equality.test.ts)
    },

    // ============================================
    // SECTION 3: LINE SPACING VALIDATION
    // ============================================
    // Verify that the 4 short vertical yellow lines have consistent horizontal spacing
    // Using specific shape IDs to check spacing between the 4 lines
    // Note: The actual spacing in the groundtruth is: 469.5px, 469.6px, 426.1px
    // The first two gaps are equal (within 5px tolerance), but the third gap (426.1px) is significantly
    // different from the first two (469.5px), indicating the points aren't perfectly evenly spaced.
    // This test verifies spacing consistency - it will fail if spacing isn't equal, which is correct.
    {
        name: "equal_spacing",
        description: "The 4 short vertical yellow lines should have consistent horizontal spacing",
        slideId: 275,
        shapeIds: [1038, 1039, 1040, 1041], // The 4 short vertical yellow lines (sorted by X position)
        direction: "horizontal", // Check horizontal spacing (X coordinates of startPos)
        // Tolerance: 5px (defined in spacing.test.ts)
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - 4 short vertical yellow lines exist (matching the existing one)
    // - Lines are positioned at the 4 points
    // - Lines have the same yellow color (#FFD525) and style as the existing line
    // - Visual consistency and proper placement
    {
        name: "llm_judge",
        description: "LLM evaluation of yellow lines added to 4 points",
        slideId: 275,
        autoGenerate: true,
        criteria: "Evaluate if 4 short vertical yellow lines have been added to all 4 points, matching the style of the existing yellow line. Each line should be vertical, have the same yellow color (#FFD525), same width (approximately 2.65px), same dash style (solid), and similar length (approximately 173px). The lines should be positioned at the 4 points where they were requested to be added.",
        focusAreas: [
            "Exactly 4 short vertical yellow lines exist (in addition to any existing lines)",
            "All lines match the existing yellow line style (color #FFD525, width ~2.65px, solid dash style)",
            "All lines are vertical (startPos X coordinate equals endPos X coordinate)",
            "All 4 lines have equal length (approximately 173px, matching the original line)",
            "Lines are positioned at the 4 points as requested",
            "Visual consistency with the existing line style",
        ],
        expectedChanges: [
            "4 short vertical yellow lines added to 4 points",
            "Lines match the existing yellow line style (color, width, dash style)",
            "All lines are vertical and have equal length",
            "Lines are properly positioned at the requested points",
        ],
    },
];

