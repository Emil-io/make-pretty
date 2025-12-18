import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-25b: Add a 5th point to the timeline and fill it with the same placeholder content.
// Resize the text/shapes accordingly.
//
// Initial state: 4 timeline points numbered 01-04
// Expected: 5 timeline points numbered 01-05, with placeholder content, resized to fit

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 5 timeline number labels (01-05)",
        slideId: 261,
        filter: {
            shapeType: "textbox",
        },
        expected: 22, // Increased from 17 (added 5 for new point: number + 2 titles + 2 details)
    },

    // ============================================
    // SECTION 2: NEW CONTENT VERIFICATION
    // ============================================
    // Verify placeholder text "ADD A MAIN POINT" appears 5 times (one per timeline point)
    {
        name: "llm_judge",
        description: "Verify 5th timeline point added with placeholder content 'ADD A MAIN POINT' and detail text",
        slideId: 261,
    },

    // ============================================
    // SECTION 3: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "slide_fill_distribution",
        description: "Five timeline points should be distributed across the slide",
        slideId: 261,
        minFillPercentage: 70,
    },

    // ============================================
    // SECTION 4: GROUP COUNT
    // ============================================
    {
        name: "count_shapes",
        description: "Should have more groups for the 5th timeline point",
        slideId: 261,
        filter: {
            shapeType: "group",
        },
        expected: 10, // Increased from 8 (added 2 groups for new point)
    },

    // ============================================
    // SECTION 5: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 261,
        minMargin: 10,
    },

    // Leave for LLM-as-a-judge:
    // - Verification that 5th point contains placeholder content
    // - Resizing of all points to fit 5 points evenly
    // - Even spacing between all 5 timeline points
    // - Consistency of styling across all 5 points
];
