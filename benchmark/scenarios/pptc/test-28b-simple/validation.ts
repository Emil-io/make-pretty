import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-28b: Align the text boxes
//
// Initial state: Multiple textboxes with instructions for Google Slides, PowerPoint, and Canva
// - 3 title textboxes: "Google Slides" (186), "PowerPoint" (189), "Canva" (169)
// - 3 description textboxes with instructions (185, 188, 168)
// - Main title "How to Use This Presentation" (183)
//
// Expected:
// - Title textboxes should be horizontally aligned (same Y position)
// - Description textboxes should be horizontally aligned (same Y position)
// - Consistent spacing between the 3 columns

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have textboxes on the slide",
        slideId: 257,
        filter: {
            shapeType: "textbox",
        },
        expected: 10,
    },

    // ============================================
    // SECTION 2: TITLE ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "Title textboxes (Google Slides, PowerPoint, Canva) should be horizontally aligned at same Y",
        objects: [
            { slideId: 257, shapeId: 186, key: "pos.topLeft[1]" }, // "Google Slides"
            { slideId: 257, shapeId: 189, key: "pos.topLeft[1]" }, // "PowerPoint"
            { slideId: 257, shapeId: 169, key: "pos.topLeft[1]" }, // "Canva"
        ],
    },

    // ============================================
    // SECTION 3: DESCRIPTION ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "Description textboxes should be horizontally aligned at same Y",
        objects: [
            { slideId: 257, shapeId: 185, key: "pos.topLeft[1]" }, // Google Slides description
            { slideId: 257, shapeId: 188, key: "pos.topLeft[1]" }, // PowerPoint description
            { slideId: 257, shapeId: 168, key: "pos.topLeft[1]" }, // Canva description
        ],
    },

    // ============================================
    // SECTION 4: WIDTH CONSISTENCY
    // ============================================
    {
        name: "all_are_equal",
        description: "Description textboxes should have equal width",
        objects: [
            { slideId: 257, shapeId: 185, key: "size.w" },
            { slideId: 257, shapeId: 188, key: "size.w" },
            { slideId: 257, shapeId: 168, key: "size.w" },
        ],
    },

    // ============================================
    // SECTION 5: LLM JUDGE - OVERALL ASSESSMENT
    // ============================================
    {
        name: "llm_judge",
        description: "Evaluate overall textbox alignment and visual consistency",
        slideId: 257,
        criteria: "Evaluate if the textboxes are properly aligned to create a clean, organized layout",
        focusAreas: [
            "Three instruction columns (Google Slides, PowerPoint, Canva) are evenly distributed horizontally",
            "Title textboxes within each column are aligned with their descriptions",
            "Text content is readable and well-spaced",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Textboxes aligned horizontally by row (titles together, descriptions together)",
            "Consistent spacing between the three columns",
            "Clean, organized instructional layout",
        ],
    },
];
