import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test 19c: Change the S W O T letters to be the same orange as the texts above them
// SWOT letters: S (183), W (188), O (191), T (196) - originally red (#FC1301)
// Title texts: Strengths (184), Weaknesses (189), Opportunities (192), Threats (197) - orange (#FD9D29/#F79646)
// Expected: Letters should be changed to orange to match titles

export const Test: TChangesetTestProtocol = [
    // Count test - verify textboxes preserved
    {
        name: "count_shapes",
        description: "There should be 12 textboxes (4 letters + 4 titles + 4 description texts)",
        slideId: 282,
        filter: { shapeType: "textbox" },
        expected: 12,
    },

    // Alignment tests - SWOT layout should remain intact
    // S and O letters should be horizontally aligned (top row)
    {
        name: "filtered_equality",
        description: "S and O letters should be horizontally aligned (same Y)",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "S" },
            { shapeType: "textbox", rawText: "O" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // W and T letters should be horizontally aligned (bottom row)
    {
        name: "filtered_equality",
        description: "W and T letters should be horizontally aligned (same Y)",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "W" },
            { shapeType: "textbox", rawText: "T" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // S and W letters should be vertically aligned (left column)
    {
        name: "filtered_equality",
        description: "S and W letters should be vertically aligned (same X)",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "S" },
            { shapeType: "textbox", rawText: "W" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // O and T letters should be vertically aligned (right column)
    {
        name: "filtered_equality",
        description: "O and T letters should be vertically aligned (same X)",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "O" },
            { shapeType: "textbox", rawText: "T" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Title texts should maintain horizontal alignment in their rows
    {
        name: "filtered_equality",
        description: "Strengths and Opportunities titles should be horizontally aligned",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "Strengths" },
            { shapeType: "textbox", rawText: "Opportunities" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    {
        name: "filtered_equality",
        description: "Weaknesses and Threats titles should be horizontally aligned",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "Weaknesses" },
            { shapeType: "textbox", rawText: "Threats" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // LLM Judge for color change validation
    {
        name: "llm_judge",
        description: "LLM evaluation of SWOT letter color change",
        slideId: 282,
        autoGenerate: true,
        criteria: "Evaluate if the S, W, O, T letters have been changed to orange color to match their corresponding title texts (Strengths, Weaknesses, Opportunities, Threats).",
        focusAreas: [
            "S letter color matches Strengths title orange color",
            "W letter color matches Weaknesses title orange color",
            "O letter color matches Opportunities title orange color",
            "T letter color matches Threats title orange color",
            "All four SWOT letters are now orange (no longer red)",
            "SWOT layout and positioning remain unchanged",
        ],
        expectedChanges: [
            "S, W, O, T letters changed from red (#FC1301) to orange to match titles",
            "Letter colors now consistent with their corresponding title text colors",
        ],
    },
];
