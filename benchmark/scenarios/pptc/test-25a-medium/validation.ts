import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-25a: Delete the Line and text on the right and align and distribute
// the three "columns" of content ("Powerpoint" column in the center) so that they fill the slide.
//
// Task: Delete right column (PAGE NUMBER, PROJECT TIMELINE) and vertical line,
//       then align and distribute the 3 remaining columns to fill the slide
// Initial state: 3 content columns + 1 right column with metadata
// Expected: Only 3 columns remain, evenly distributed across the slide

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION VERIFICATION
    // ============================================
    // Note: Group shape will be deleted, so we can't directly test for group count
    // Instead, verify that the text elements within the group are gone
    {
        name: "count_shapes",
        description: "Vertical line separator should be deleted (reduced from 4 to 3 lines)",
        slideId: 257,
        filter: { shapeType: "line" },
        expected: 3, // Originally had 4 lines, delete the vertical line
    },

    // ============================================
    // SECTION 2: PRESERVATION OF 3 COLUMNS
    // ============================================
    {
        name: "count_shapes",
        description: "Should still have 3 column icons",
        slideId: 257,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "includes",
        description: "CANVA column title should remain",
        slideId: 257,
        shapeId: 102,
        key: "rawText",
        expected: "CANVA",
    },
    {
        name: "includes",
        description: "POWERPOINT column title should remain",
        slideId: 257,
        shapeId: 104,
        key: "rawText",
        expected: "POWERPOINT",
    },
    {
        name: "includes",
        description: "GOOGLE SLIDES column title should remain",
        slideId: 257,
        shapeId: 105,
        key: "rawText",
        expected: "GOOGLE SLIDES",
    },

    // ============================================
    // SECTION 3: ALIGNMENT TESTS
    // ============================================
    {
        name: "filtered_equality",
        description: "The 3 column icons should be horizontally aligned",
        slideId: 257,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]", // Y coordinate
        minMatchCount: 3,
    },
    // Column titles alignment - test with specific shape IDs
    {
        name: "filtered_equality",
        description: "CANVA and POWERPOINT titles should be horizontally aligned",
        slideId: 257,
        filter: { shapeType: "textbox" },
        key: "pos.topLeft[1]", // Y coordinate
        minMatchCount: 2, // At least 2 of the 3 titles should align
    },
    {
        name: "filtered_equality",
        description: "The 3 decorative lines should be horizontally aligned",
        slideId: 257,
        filter: { shapeType: "line" },
        key: "startPos[1]", // Y coordinate of line start
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 4: DISTRIBUTION TESTS
    // ============================================
    {
        name: "filtered_spacing",
        description: "The 3 column icons should have equal horizontal spacing",
        slideId: 257,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 3,
    },
    {
        name: "slide_fill_distribution",
        description: "Content should fill at least 70% of slide width",
        slideId: 257,
        filter: { shapeType: "image" },
        minFillPercentage: 70,
    },

    // ============================================
    // SECTION 5: LAYOUT PRESERVATION
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
        description: "LLM evaluation of deletion and distribution task",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the right column content (PAGE NUMBER, PROJECT TIMELINE) and vertical line have been deleted, and the remaining 3 columns are properly aligned and distributed to fill the slide.",
        focusAreas: [
            "Right column content (PAGE NUMBER, PROJECT TIMELINE text) has been deleted",
            "Vertical line separator on the right has been removed",
            "Three content columns (CANVA, POWERPOINT, GOOGLE SLIDES) remain intact",
            "Columns are evenly distributed horizontally across the slide",
            "Proper alignment maintained across all column elements (icons, titles, descriptions, lines)",
            "Content fills the slide width appropriately without crowding",
        ],
        expectedChanges: [
            "Right column group and vertical line deleted",
            "Three columns redistributed to fill slide width",
            "Equal spacing between the three columns",
            "Horizontal alignment maintained across all elements",
        ],
    },
];
