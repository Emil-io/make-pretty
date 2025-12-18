import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-27b: Delete the two textboxes in the middle ("blue") and stretch the others to fill the whole space
//
// Initial state: 2 rows of color description boxes - row 1: Yellow, Blue, Red; row 2: Yellow, Blue, Red
// Each textbox is 193.0 x 161.5 px
// Expected: Delete both "Blue" textboxes (ids 256, 260), stretch remaining boxes to fill space

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS - BLUE TEXTBOXES
    // ============================================
    {
        name: "not_includes",
        description: "First Blue textbox should be deleted",
        slideId: 273,
        shapeId: 256,
        key: "rawText",
        expected: "Blue",
    },
    {
        name: "not_includes",
        description: "Second Blue textbox should be deleted",
        slideId: 273,
        shapeId: 260,
        key: "rawText",
        expected: "Blue",
    },

    // ============================================
    // SECTION 2: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 4 textboxes remaining (down from 6)",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            "rawText": ["Yellow", "Red"],
        },
        expected: 4,
    },

    // ============================================
    // SECTION 3: EXISTING CONTENT PRESERVED
    // ============================================
    {
        name: "includes",
        description: "First Yellow textbox should remain",
        slideId: 273,
        shapeId: 255,
        key: "rawText",
        expected: "Yellow",
    },
    {
        name: "includes",
        description: "First Red textbox should remain",
        slideId: 273,
        shapeId: 257,
        key: "rawText",
        expected: "Red",
    },
    {
        name: "includes",
        description: "Second Yellow textbox should remain",
        slideId: 273,
        shapeId: 259,
        key: "rawText",
        expected: "Yellow",
    },

    // ============================================
    // SECTION 4: STRETCHING - WIDTH INCREASE
    // ============================================
    {
        name: "greater_than",
        description: "First Yellow box should be wider than original 193px",
        slideId: 273,
        shapeId: 255,
        key: "size.w",
        expected: 250, // Originally 193, should be stretched
    },
    {
        name: "greater_than",
        description: "First Red box should be wider than original 193px",
        slideId: 273,
        shapeId: 257,
        key: "size.w",
        expected: 250,
    },
    {
        name: "greater_than",
        description: "Second Yellow box should be wider than original 193px",
        slideId: 273,
        shapeId: 259,
        key: "size.w",
        expected: 250,
    },

    // ============================================
    // SECTION 5: ROW ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "Top row boxes should be vertically aligned",
        slideId: 273,
        shapeIds: [255, 257],
        key: "pos.topLeft[1]",
    },
    {
        name: "all_are_equal",
        description: "Bottom row boxes should be vertically aligned",
        slideId: 273,
        shapeIds: [259],
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 6: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "slide_fill_distribution",
        description: "Remaining boxes should be distributed to fill the slide horizontally",
        slideId: 273,
        minFillPercentage: 60,
    },

    // ============================================
    // SECTION 7: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 273,
        minMargin: 10,
    },

    // ============================================
    // SECTION 8: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of blue textbox deletion and stretching",
        slideId: 273,
        autoGenerate: true,
        criteria: "Evaluate if both Blue textboxes have been deleted and the remaining Yellow and Red textboxes have been stretched to fill the whole space evenly.",
        focusAreas: [
            "Both Blue textboxes (top and bottom row) have been deleted",
            "Remaining Yellow and Red textboxes have been stretched wider",
            "Even distribution of remaining boxes across the slide width",
            "Proper gap/spacing between stretched boxes",
            "Visual balance of the 2-column layout (Yellow, Red in each row)",
            "Top row contains Yellow and Red boxes",
            "Bottom row contains Yellow and Red boxes",
            "All boxes maintain consistent height and styling",
        ],
        expectedChanges: [
            "Both Blue textboxes deleted",
            "Remaining boxes stretched to fill space",
            "Even distribution across slide width",
            "Proper spacing maintained",
        ],
    },
];
