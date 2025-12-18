import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-43b: Align the text and lines!
//
// Initial state: Statistics textboxes and lines are misaligned
// Expected:
// 1. Statistics textboxes ("2 out of 5", "95%", "12 million") should be VISUALLY aligned
//    NOTE: These textboxes have different heights and center-anchored text, so their
//    box coordinates differ even when text appears aligned. Visual alignment is verified by LLM judge.
// 2. Description textboxes ("Elaborate on the featured statistic.") should be horizontally aligned
// 3. Lines should be vertical (each line's startPos[0] == endPos[0])
//    NOTE: The two separator lines are at DIFFERENT X positions (intentionally)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 2 line shapes (separators between statistics)",
        slideId: 270,
        filter: { shapeType: "line" },
        expected: 2,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 3 description textboxes",
        slideId: 270,
        filter: { 
            shapeType: "textbox",
            rawTextContains: "Elaborate" // Matches all description textboxes
        },
        expected: 3,
    },

    // ============================================
    // SECTION 2: STATISTICS TEXTBOXES ALIGNMENT
    // ============================================
    // Statistics should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "Statistics textboxes should be horizontally aligned (same Y coordinate)",
        slideId: 270,
        filters: [
            { shapeType: "textbox", rawTextContains: "out of" }, // "2 out of 5"
            { shapeType: "textbox", rawText: "95%" }, // "95%"
            { shapeType: "textbox", rawTextContains: "million" }, // "12 million"
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 3: DESCRIPTION TEXTBOXES ALIGNMENT
    // ============================================
    // Description textboxes should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "Description textboxes should be horizontally aligned (same Y coordinate)",
        slideId: 270,
        filter: { 
            shapeType: "textbox",
            rawTextContains: "Elaborate" // All description textboxes
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 4: LINES VALIDATION
    // ============================================
    // Lines should be:
    // 1. Perfectly vertical (each line's startPos[0] == endPos[0] within tolerance)
    // 2. Same length (both lines have equal height)
    // 3. Properly divide the 3 description textboxes
    {
        name: "line_validation",
        description: "Lines should be vertical, have equal length, and divide description textboxes",
        slideId: 270,
        filter: { shapeType: "line" }, // Filter for lines
        checkVerticality: true, // Check that each line is vertical
        checkEqualLength: true, // Check that all lines have equal length
        checkDividesTextboxes: true, // Check that lines divide textboxes
        textboxFilter: {
            shapeType: "textbox",
            rawTextContains: "Elaborate", // Description textboxes
        },
    },

    // ============================================
    // SECTION 5: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Statistics alignment
    // - Description alignment
    // - Line alignment with statistics
    // - Overall visual consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of text and line alignment",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if the text elements (statistics and descriptions) and lines are properly aligned to create a clean, organized layout.",
        focusAreas: [
            "All three statistics textboxes ('2 out of 5', '95%', '12 million') are horizontally aligned at the same Y coordinate",
            "All three description textboxes ('Elaborate on the featured statistic.') are horizontally aligned at the same Y coordinate",
            "Lines are vertical (startPos X equals endPos X) and properly aligned",
            "Lines connect appropriately to their corresponding statistics",
            "Overall layout is visually balanced and professional",
            "Text readability and visual hierarchy are maintained",
        ],
        expectedChanges: [
            "Statistics textboxes aligned horizontally",
            "Description textboxes aligned horizontally",
            "Lines aligned vertically and connected to statistics",
            "Consistent alignment throughout the layout",
        ],
    },
];

