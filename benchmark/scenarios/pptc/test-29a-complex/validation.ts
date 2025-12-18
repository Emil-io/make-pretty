import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-29a: Align the 6 Text boxes
//
// Initial state: 6 textboxes in 3 columns, misaligned
// - 3 "Add a main point" titles: shapes 303 (left), 305 (center), 300 (right)
// - 3 "Briefly elaborate..." descriptions: shapes 304 (left), 306 (center), 301 (right)
//
// Current Y positions:
// - Titles: 352.4, 305.9, 318.9 (misaligned)
// - Descriptions: 388.2, 363.5, 388.2 (misaligned)
//
// Expected:
// - All 3 title textboxes should be horizontally aligned (same Y)
// - All 3 description textboxes should be horizontally aligned (same Y)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: TITLE ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "All 3 'Add a main point' titles should be horizontally aligned at same Y",
        objects: [
            { slideId: 261, shapeId: 303, key: "pos.topLeft[1]" }, // Left title
            { slideId: 261, shapeId: 305, key: "pos.topLeft[1]" }, // Center title
            { slideId: 261, shapeId: 300, key: "pos.topLeft[1]" }, // Right title
        ],
    },

    // ============================================
    // SECTION 2: DESCRIPTION ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "All 3 description textboxes should be horizontally aligned at same Y",
        objects: [
            { slideId: 261, shapeId: 304, key: "pos.topLeft[1]" }, // Left description
            { slideId: 261, shapeId: 306, key: "pos.topLeft[1]" }, // Center description
            { slideId: 261, shapeId: 301, key: "pos.topLeft[1]" }, // Right description
        ],
    },

    // ============================================
    // SECTION 3: WIDTH CONSISTENCY
    // ============================================
    {
        name: "all_are_equal",
        description: "All title textboxes should have equal width",
        objects: [
            { slideId: 261, shapeId: 303, key: "size.w" },
            { slideId: 261, shapeId: 305, key: "size.w" },
            { slideId: 261, shapeId: 300, key: "size.w" },
        ],
    },

    // ============================================
    // SECTION 4: LLM JUDGE - OVERALL ASSESSMENT
    // ============================================
    {
        name: "llm_judge",
        description: "Evaluate overall textbox alignment and visual layout",
        slideId: 261,
        criteria: "Evaluate if the 6 textboxes are properly aligned in a clean 3-column layout",
        focusAreas: [
            "Title textboxes ('Add a main point') are aligned in a horizontal row",
            "Description textboxes are aligned in a horizontal row below titles",
            "Each column (title + description) is vertically aligned",
            "Overall visual balance and consistent spacing between columns",
        ],
        expectedChanges: [
            "All 3 titles aligned at same Y position",
            "All 3 descriptions aligned at same Y position",
            "Clean, organized 3-column layout",
        ],
    },
];
