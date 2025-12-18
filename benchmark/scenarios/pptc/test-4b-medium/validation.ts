import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-4b: Move girl image to right, text to left, and ensure symbols aren't hidden
// SlideId: 270 | Key shapes: 272 (large girl area), 293/294 (textboxes), various small symbols

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "2 textboxes preserved", slideId: 270, filter: { shapeType: "textbox" }, expected: 2 },
    { name: "count_shapes", description: "AutoShapes preserved (symbols + decorations)", slideId: 270, filter: { shapeType: "autoShape" }, expected: 22 },

    // Text should be on the LEFT side of the slide (X < center ~960)
    {
        name: "less_than",
        description: "'Hello there!' text should be on the left side (X < 960)",
        slideId: 270,
        shapeId: 293,
        key: "pos.center[0]",
        expected: 960,
    },
    {
        name: "less_than",
        description: "'I'm Flower...' text should be on the left side (X < 960)",
        slideId: 270,
        shapeId: 294,
        key: "pos.center[0]",
        expected: 960,
    },

    // Main image/girl area (272) should be on the RIGHT side (X > center ~960)
    {
        name: "greater_than",
        description: "Girl image area should be on the right side (X > 960)",
        slideId: 270,
        shapeId: 272,
        key: "pos.center[0]",
        expected: 960,
    },

    // Text vertical alignment - both textboxes should still be aligned vertically
    {
        name: "filtered_equality",
        description: "Textboxes should have similar horizontal center (same column)",
        slideId: 270,
        filter: { shapeType: "textbox" },
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Boundary check - all visible elements within slide
    { name: "within_boundaries", description: "Main content within slide", slideId: 270, minMargin: 0 },

    // LLM Judge for overall layout and symbol visibility
    {
        name: "llm_judge",
        description: "LLM evaluation of layout swap and symbol visibility",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if the girl image is now on the right, text is on the left, and decorative symbols remain visible and not hidden by the moved image.",
        focusAreas: [
            "Girl/main image is positioned on the right side of the slide",
            "Text ('Hello there!' and description) is positioned on the left side",
            "Small decorative symbols (yellow, blue) are visible and not hidden by the image",
            "Layout maintains visual balance and professional appearance",
            "Elements don't overlap in an unintended way",
        ],
        expectedChanges: [
            "Girl image moved to the right side of the slide",
            "Text elements moved to the left side",
            "Decorative symbols repositioned to remain visible",
        ],
    },
];
