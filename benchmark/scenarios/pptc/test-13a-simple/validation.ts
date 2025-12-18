import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Test-13a: Delete all text that overflows outside the purple boxes
// Task: Keep text size identical, delete only overflowing text content
// Initial state: Multiple text columns where some text overflows below the purple box boundaries
// Expected: Text content trimmed to fit within purple boxes, everything else unchanged

export const Test: TChangesetTestProtocol = [
    // Count tests - verify purple boxes are preserved
    {
        name: "count_shapes",
        description: "There should be 4 purple rectangle boxes (autoShape rect)",
        slideId: 289,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 6, // 4 purple rects + 2 other rects
    },

    // Title labels should remain
    {
        name: "count_shapes",
        description: "Title textboxes should be preserved",
        slideId: 289,
        filter: { shapeType: "textbox" },
        expected: 14, // Titles + text columns
    },

    // Title alignment - all titles should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Title labels (Blue, Yellow, Orange, Brown) should be horizontally aligned",
        slideId: 289,
        filters: [
            { shapeType: "textbox", rawText: "Blue" },
            { shapeType: "textbox", rawText: "Yellow" },
            { shapeType: "textbox", rawText: "Orange" },
            { shapeType: "textbox", rawText: "Brown" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Boundary check - all shapes should respect slide boundaries
    {
        name: "within_boundaries",
        description: "All content should be within slide boundaries",
        slideId: 289,
        minMargin: 0,
    },

    // LLM Judge for semantic validation of overflow removal
    {
        name: "llm_judge",
        description: "LLM evaluation of text overflow deletion",
        slideId: 289,
        autoGenerate: true,
        criteria: "Evaluate if the overflowing text has been properly deleted while keeping all text that fits within the purple boxes intact.",
        focusAreas: [
            "All text content that extends beyond the purple boxes has been removed",
            "Text that was originally within the purple box boundaries is preserved",
            "Text size and formatting remain identical (not shrunk or changed)",
            "Purple boxes maintain their original size and position",
            "Overall visual appearance is clean without overflow",
        ],
        expectedChanges: [
            "Overflowing text entries deleted from each column",
            "Text within purple box boundaries remains unchanged",
            "No changes to text size, font, or formatting",
        ],
    },
];
