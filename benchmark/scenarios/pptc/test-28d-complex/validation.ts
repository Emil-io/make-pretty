import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-28d: Align textboxes in 4 quadrants so they don't overflow, match heights, and headings centered in white boxes
//
// Initial state: 4 quadrants with textboxes that overflow, have mismatched heights, and misaligned headings
// Expected: No overflow, matching heights, centered headings

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: NO OVERFLOW
    // ============================================
    {
        name: "llm_judge",
        description: "All textboxes in quadrants should not overflow",
        slideId: 264,
        criteria: "All textbox content should fit within their respective containers without overflow",
    },

    // ============================================
    // SECTION 2: MATCHING HEIGHTS
    // ============================================
    {
        name: "filtered_equality",
        description: "All quadrant textboxes should have matching heights",
        slideId: 264,
        filter: {
            shapeType: "textbox",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // ============================================
    // SECTION 3: CENTERED HEADINGS
    // ============================================
    {
        name: "llm_judge",
        description: "Headings in white boxes should be centered",
        slideId: 264,
        criteria: "All heading textboxes within white boxes should be horizontally and vertically centered within their respective boxes",
    },

    // ============================================
    // SECTION 4: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 264,
        minMargin: 10,
    },
];
