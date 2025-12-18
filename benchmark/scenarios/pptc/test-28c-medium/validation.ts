import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-28c: Align the middle picture and border with the other two (maybe resize the picture accordingly)
//
// Initial state: 3 pictures with borders, middle one is misaligned
// Expected: Middle picture and border aligned with the other two, possibly resized

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: VERTICAL ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All three pictures should be vertically aligned at same Y position",
        slideId: 260,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 2: SIZE CONSISTENCY
    // ============================================
    {
        name: "filtered_equality",
        description: "All pictures should have consistent height",
        slideId: 260,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 3: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "llm_judge",
        description: "All three pictures should be evenly distributed horizontally",
        slideId: 260,
        criteria: "The three pictures should be spaced evenly across the slide width with equal gaps between them",
    },
];
