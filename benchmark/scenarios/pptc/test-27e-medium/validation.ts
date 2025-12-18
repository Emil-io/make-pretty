import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-27e: Align the text boxes so that they are centered and evenly spaced
//
// Initial state: Multiple textboxes that are misaligned
// Expected: All textboxes centered and evenly spaced

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: HORIZONTAL CENTERING
    // ============================================
    {
        name: "llm_judge",
        description: "All textboxes should be horizontally centered on the slide",
        slideId: 271,
        criteria: "All textbox elements should be centered horizontally, with their center X coordinates aligned around the slide center (480px)",
    },

    // ============================================
    // SECTION 2: VERTICAL SPACING
    // ============================================
    {
        name: "llm_judge",
        description: "Textboxes should be evenly spaced vertically",
        slideId: 271,
        criteria: "The vertical spacing between consecutive textboxes should be consistent and equal",
    },

    // ============================================
    // SECTION 3: ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All textboxes should be aligned at same horizontal center position",
        slideId: 271,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.center[0]",
        minMatchCount: 7,
    },

    // ============================================
    // SECTION 4: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 271,
        minMargin: 10,
    },
];
