import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-29b: Align the photos and text boxes
//
// Initial state: Photos and textboxes that are misaligned
// Expected: Photos and textboxes properly aligned with each other

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: PHOTO ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All photos should be aligned at same position",
        slideId: 269,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // ============================================
    // SECTION 2: TEXTBOX ALIGNMENT
    // ============================================
    {
        name: "llm_judge",
        description: "Textboxes should be aligned with their corresponding photos",
        slideId: 269,
        criteria: "Each textbox should be properly aligned with its associated photo, creating a consistent layout pattern",
    },

    // ============================================
    // SECTION 3: CONSISTENT SPACING
    // ============================================
    {
        name: "llm_judge",
        description: "Photos and textboxes should have consistent spacing",
        slideId: 269,
        criteria: "The spacing between photo-textbox pairs should be equal throughout the slide",
    },
];
