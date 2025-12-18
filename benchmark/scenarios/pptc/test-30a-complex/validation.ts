import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-30a: Make the table of contents pretty. Need all numbers inside yellow boxes -
// the yellow boxes on the position as at point 2&6. Also make objects/text that belongs
// together in the same size.
//
// Initial state:
// - Numbers 1-6 have inconsistent Y positions: [272.9, 286.7, 320.0, 684.2]
// - Number 4 has different height (138.6) vs others (66.7)
// - Yellow number boxes are not consistently positioned
//
// Expected:
// - All 6 number boxes aligned vertically (same Y within their row)
// - All number boxes have same height
// - Objects/text that belong together have matching sizes

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: VERTICAL ALIGNMENT TESTS
    // ============================================
    {
        name: "all_are_equal",
        description: "Top row numbers (1-3) should be vertically aligned (same Y)",
        objects: [
            { slideId: 259, shapeId: 297, key: "pos.topLeft[1]" }, // Number 1
            { slideId: 259, shapeId: 305, key: "pos.topLeft[1]" }, // Number 2
            { slideId: 259, shapeId: 313, key: "pos.topLeft[1]" }, // Number 3
        ],
    },
    {
        name: "all_are_equal",
        description: "Bottom row numbers (4-6) should be vertically aligned (same Y)",
        objects: [
            { slideId: 259, shapeId: 321, key: "pos.topLeft[1]" }, // Number 4
            { slideId: 259, shapeId: 329, key: "pos.topLeft[1]" }, // Number 5
            { slideId: 259, shapeId: 337, key: "pos.topLeft[1]" }, // Number 6
        ],
    },

    // ============================================
    // SECTION 2: SIZE CONSISTENCY TESTS
    // ============================================
    {
        name: "all_are_equal",
        description: "All 6 number boxes should have equal height",
        objects: [
            { slideId: 259, shapeId: 297, key: "size.h" }, // Number 1
            { slideId: 259, shapeId: 305, key: "size.h" }, // Number 2
            { slideId: 259, shapeId: 313, key: "size.h" }, // Number 3
            { slideId: 259, shapeId: 321, key: "size.h" }, // Number 4
            { slideId: 259, shapeId: 329, key: "size.h" }, // Number 5
            { slideId: 259, shapeId: 337, key: "size.h" }, // Number 6
        ],
    },
    {
        name: "all_are_equal",
        description: "All 6 number boxes should have equal width",
        objects: [
            { slideId: 259, shapeId: 297, key: "size.w" },
            { slideId: 259, shapeId: 305, key: "size.w" },
            { slideId: 259, shapeId: 313, key: "size.w" },
            { slideId: 259, shapeId: 321, key: "size.w" },
            { slideId: 259, shapeId: 329, key: "size.w" },
            { slideId: 259, shapeId: 337, key: "size.w" },
        ],
    },

    // ============================================
    // SECTION 3: POSITION CONSISTENCY (Yellow boxes at position like 2&6)
    // ============================================
    {
        name: "llm_judge",
        description: "Verify yellow number boxes are positioned consistently (like points 2&6)",
        slideId: 259,
    },

    // ============================================
    // SECTION 4: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 259,
        minMargin: 10,
    },

    // Leave for LLM-as-a-judge:
    // - Verification that objects/text belonging together have matching sizes
    // - Yellow box positioning matches reference points 2&6
    // - Overall table of contents is visually balanced and "pretty"
];
