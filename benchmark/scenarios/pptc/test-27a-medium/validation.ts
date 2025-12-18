import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-27a: Delete the "Edit in Google Slides" Textbox and stretch the powerpoint textbox
// accordingly (maybe then also move the textbox at the bottom a little bit higher).
//
// Initial state:
// - Shape 63 (X=80.3, W=265.8): "EDIT IN GOOGLE SLIDES" textbox (LEFT)
// - Shape 62 (X=383.4, W=265.8): "EDIT IN POWERPOINT" textbox (RIGHT)
// - Shape 64 (Y=413.7): Bottom disclaimer textbox
//
// Expected:
// - Shape 63 deleted
// - Shape 62 stretched (width increased, possibly moved left)
// - Shape 64 moved up (Y position decreased)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS
    // ============================================
    {
        name: "not_includes",
        description: "'EDIT IN GOOGLE SLIDES' text should be deleted",
        slideId: 257,
        shapeId: 63,
        key: "shape.rawText",
        expected: "EDIT IN GOOGLE SLIDES",
    },

    // ============================================
    // SECTION 2: STRETCHING TESTS (PowerPoint textbox)
    // ============================================
    {
        name: "greater_than",
        description: "PowerPoint textbox (62) width should increase beyond original 265.8",
        slideId: 257,
        shapeId: 62,
        key: "shape.size.w",
        expected: 265.8,
    },
    {
        name: "less_than_or_equal",
        description: "PowerPoint textbox (62) should move left or stay (X <= 383.4)",
        slideId: 257,
        shapeId: 62,
        key: "shape.pos.topLeft[0]",
        expected: 383.4,
    },

    // ============================================
    // SECTION 3: VERTICAL MOVEMENT (Bottom textbox)
    // ============================================
    {
        name: "less_than",
        description: "Bottom textbox (64) should move up (Y < 413.7)",
        slideId: 257,
        shapeId: 64,
        key: "shape.pos.topLeft[1]",
        expected: 413.7,
    },

    // ============================================
    // SECTION 4: SHAPE COUNT
    // ============================================
    {
        name: "count_shapes",
        description: "Should have fewer placeholder shapes after deletion",
        slideId: 257,
        filter: {
            shapeType: "placeholder",
        },
        expected: 4, // Reduced from 5 (deleted shape 63)
    },

    // ============================================
    // SECTION 5: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 257,
        minMargin: 10,
    },

    // ============================================
    // SECTION 6: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of textbox deletion and stretching",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the 'EDIT IN GOOGLE SLIDES' textbox has been deleted, the PowerPoint textbox has been stretched to fill the space, and the bottom textbox has been moved up appropriately.",
        focusAreas: [
            "'EDIT IN GOOGLE SLIDES' textbox has been deleted",
            "PowerPoint textbox fills the space left by Google Slides deletion",
            "PowerPoint textbox width has increased appropriately",
            "Bottom disclaimer textbox has been moved up",
            "Visual balance of the updated layout",
            "Appropriate spacing between textboxes",
            "Proper alignment of remaining elements",
        ],
        expectedChanges: [
            "Google Slides textbox deleted",
            "PowerPoint textbox stretched to fill space",
            "Bottom textbox repositioned upward",
            "Layout rebalanced",
        ],
    },
];
