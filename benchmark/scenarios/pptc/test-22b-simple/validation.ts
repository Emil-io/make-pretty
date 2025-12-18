import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-22b: "The heading size is too big, it should fit into two rows."
//
// Initial state: Title "This is Your Presentation Title" with font size 66.0
// Expected: Font size reduced or text reformatted to fit into two rows

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: SHAPE PRESERVATION
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 placeholder shape",
        slideId: 256,
        filter: { shapeType: "placeholder" },
        expected: 1,
    },

    // ============================================
    // SECTION 2: TEXT CONTENT PRESERVATION
    // ============================================
    {
        name: "includes",
        description: "Title text should still be present",
        slideId: 256,
        shapeId: 51,
        key: "rawText",
        expected: "This is Your Presentation Title",
    },

    // ============================================
    // SECTION 3: BOUNDARY TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 256,
        minMargin: 0,
    },

    // ============================================
    // SECTION 4: LLM JUDGE - TEXT FITTING
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of heading resized to fit into two rows",
        slideId: 256,
        autoGenerate: true,
        criteria:
            "Evaluate if the heading font size has been reduced so that 'This is Your Presentation Title' fits into two rows within the placeholder.",
        focusAreas: [
            "Heading text is formatted to display on exactly two rows",
            "Font size has been reduced from the original 66pt to fit two rows",
            "Text remains readable and visually proportional",
            "Text stays within the placeholder boundaries",
        ],
        expectedChanges: [
            "Font size reduced to fit text into two rows",
            "Title text reformatted to display on two lines",
        ],
    },
];
