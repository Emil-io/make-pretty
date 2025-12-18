import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify textboxes are present
    {
        name: "count_shapes",
        description: "There should be 12 textbox shapes (4 letters + 4 headings + 4 descriptions)",
        slideId: 271,
        filter: { shapeType: "textbox" },
        expected: 12,
    },

    // S quadrant (top-left): Letter, heading, and description should be horizontally centered (same center X)
    {
        name: "filtered_equality",
        description: "S quadrant: Letter S, Strengts heading, and description should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "S" },
            { shapeType: "textbox", rawText: "Strengts" },
            { shapeType: "textbox", rawTextContains: "What are you doing well" },
        ],
        key: "pos.center[0]",
        minMatchCount: 3,
    },

    // W quadrant (top-right): Letter, heading, and description should be horizontally centered
    {
        name: "filtered_equality",
        description: "W quadrant: Letter W, Weaknesses heading, and description should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "W" },
            { shapeType: "textbox", rawText: "Weaknesses" },
            { shapeType: "textbox", rawTextContains: "Where do you need to improve" },
        ],
        key: "pos.center[0]",
        minMatchCount: 3,
    },

    // O quadrant (bottom-left): Letter, heading, and description should be horizontally centered
    {
        name: "filtered_equality",
        description: "O quadrant: Letter O, Opportunities heading, and description should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "O" },
            { shapeType: "textbox", rawText: "Opportunities" },
            { shapeType: "textbox", rawTextContains: "What are your goals" },
        ],
        key: "pos.center[0]",
        minMatchCount: 3,
    },

    // T quadrant (bottom-right): Letter, heading, and description should be horizontally centered
    {
        name: "filtered_equality",
        description: "T quadrant: Letter T, Threats heading, and description should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "T" },
            { shapeType: "textbox", rawText: "Threats" },
            { shapeType: "textbox", rawTextContains: "What are the blockers" },
        ],
        key: "pos.center[0]",
        minMatchCount: 3,
    },

    // Top row: S and W headings should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Top row headings (Strengts, Weaknesses) should be at same Y position",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "Strengts" },
            { shapeType: "textbox", rawText: "Weaknesses" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Bottom row: O and T headings should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Bottom row headings (Opportunities, Threats) should be at same Y position",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "Opportunities" },
            { shapeType: "textbox", rawText: "Threats" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Left column: S and O letters should be vertically aligned (same center X)
    {
        name: "filtered_equality",
        description: "Left column letters (S, O) should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "S" },
            { shapeType: "textbox", rawText: "O" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Right column: W and T letters should be vertically aligned (same center X)
    {
        name: "filtered_equality",
        description: "Right column letters (W, T) should have same center X",
        slideId: 271,
        filters: [
            { shapeType: "textbox", rawText: "W" },
            { shapeType: "textbox", rawText: "T" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal centering within SWOT quadrants",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if all text and headings are horizontally centered within each SWOT quadrant.",
        focusAreas: [
            "Each quadrant's letter (S, W, O, T), heading, and description are horizontally centered within that quadrant",
            "Text in the same quadrant shares the same horizontal center point",
            "Visual symmetry between left and right quadrants",
            "Professional appearance of the centered SWOT grid layout",
        ],
        expectedChanges: [
            "All text elements horizontally centered within their respective SWOT quadrants",
            "Consistent center alignment for letter, heading, and description in each quadrant",
            "Improved visual balance and symmetry across the SWOT diagram",
        ],
    },
];
