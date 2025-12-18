import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-29c: Delete the second point (incl node, edges) and connect the first point to the third. Align resulting shape centered
//
// Initial state: 3-point diagram/flowchart with nodes and connecting edges
// Expected: 2-point diagram (first and third), second point deleted, direct connection between remaining points, centered

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: NODE DELETION
    // ============================================
    {
        name: "llm_judge",
        description: "Second node should be deleted",
        slideId: 272,
        criteria: "The middle/second node in the original 3-node diagram should be completely removed",
    },

    // ============================================
    // SECTION 2: CONNECTION
    // ============================================
    {
        name: "llm_judge",
        description: "First point should connect directly to third point",
        slideId: 272,
        criteria: "There should be a direct connection (edge/line) between the first and third nodes, bypassing where the second node was",
    },

    // ============================================
    // SECTION 3: CENTERING
    // ============================================
    {
        name: "llm_judge",
        description: "Resulting diagram should be centered on the slide",
        slideId: 272,
        criteria: "The final 2-node diagram should be centered both horizontally and vertically on the slide",
    },

    // ============================================
    // SECTION 4: COUNT VERIFICATION
    // ============================================
    {
        name: "llm_judge",
        description: "Should have 2 nodes remaining (down from 3)",
        slideId: 272,
        criteria: "The diagram should contain exactly 2 nodes after deletion",
    },

    // ============================================
    // SECTION 5: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 272,
        minMargin: 10,
    },
];
