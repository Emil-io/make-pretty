import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 257: "HOW TO USE THIS PRESENTATION" slide
// Task: Fix spacing - move everything up so yellow headings don't flow into purple background
//       and text doesn't overflow. Move top section up more.
// Images: 149, 150 (top section in group 148), 151
// Yellow headings (textboxes): "Canva" (155), "PowerPoint" (153), "Google Slides" (157)
// Description textboxes: 154, 156, 158

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "Should have 3 image shapes",
        slideId: 257,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "Should have 7 textboxes",
        slideId: 257,
        filter: { shapeType: "textbox" },
        expected: 7,
    },

    // Yellow headings should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "Yellow headings (Canva, PowerPoint, Google Slides) should be horizontally aligned",
        slideId: 257,
        filters: [
            { shapeType: "textbox", rawText: "Canva" },
            { shapeType: "textbox", rawText: "PowerPoint" },
            { shapeType: "textbox", rawText: "Google Slides" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Boundary check - all shapes should be within slide boundaries (nothing overflows)
    {
        name: "within_boundaries",
        description: "All shapes should be within slide boundaries (no overflow)",
        slideId: 257,
        minMargin: 0,
    },

    // Yellow headings should be below the slide top edge (not cut off)
    {
        name: "greater_than",
        description: "Canva heading should be below slide top edge",
        slideId: 257,
        shapeId: 155,
        key: "pos.topLeft[1]",
        expected: 0,
    },
    {
        name: "greater_than",
        description: "PowerPoint heading should be below slide top edge",
        slideId: 257,
        shapeId: 153,
        key: "pos.topLeft[1]",
        expected: 0,
    },
    {
        name: "greater_than",
        description: "Google Slides heading should be below slide top edge",
        slideId: 257,
        shapeId: 157,
        key: "pos.topLeft[1]",
        expected: 0,
    },

    // Description textboxes should be within slide (bottom doesn't overflow)
    {
        name: "less_than",
        description: "Canva description should be above slide bottom edge",
        slideId: 257,
        shapeId: 156,
        key: "pos.bottomRight[1]",
        expected: 540, // Standard slide height
    },
    {
        name: "less_than",
        description: "PowerPoint description should be above slide bottom edge",
        slideId: 257,
        shapeId: 154,
        key: "pos.bottomRight[1]",
        expected: 540,
    },
    {
        name: "less_than",
        description: "Google Slides description should be above slide bottom edge",
        slideId: 257,
        shapeId: 158,
        key: "pos.bottomRight[1]",
        expected: 540,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of spacing fixes",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the spacing issues are fixed: yellow headings no longer flow into purple background, text doesn't overflow, and top section is moved up appropriately.",
        focusAreas: [
            "Yellow headings (Canva, PowerPoint, Google Slides) are clearly visible and not overlapping the purple background",
            "All text content is within slide boundaries with no overflow",
            "Top section is moved up creating proper separation from headings",
            "Proper spacing between all elements for readability",
            "Overall layout maintains visual balance and professional appearance"
        ],
        expectedChanges: [
            "All elements moved up to fix overflow issues",
            "Top section moved up more to separate from yellow headings",
            "Yellow headings no longer flow into purple background",
            "All text content remains visible within slide"
        ],
    },
];
