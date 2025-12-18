import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 259: "About Us" slide with images and 2 textboxes
// Task: Align the text to be centered horizontally
// Textboxes: "ABOUT US" (ID 194), "Elaborate on what you want to discuss." (ID 195)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify textboxes are still present
    {
        name: "count_shapes",
        description: "Should have 2 textboxes",
        slideId: 259,
        filter: { shapeType: "textbox" },
        expected: 2,
    },

    // Horizontal centering - both textboxes should have the same center X coordinate
    {
        name: "filtered_equality",
        description: "Both textboxes should be centered at the same X position",
        slideId: 259,
        filter: { shapeType: "textbox" },
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Verify images are still present (no unintended deletions)
    {
        name: "count_shapes",
        description: "Should still have all image shapes",
        slideId: 259,
        filter: { shapeType: "image" },
        expected: 11,
    },

    // Boundary check - textboxes should remain within slide
    {
        name: "within_boundaries",
        description: "All shapes should remain within slide boundaries",
        slideId: 259,
        minMargin: 0,
    },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal text centering",
        slideId: 259,
        autoGenerate: true,
        criteria: "Evaluate if the two text elements are properly centered horizontally on the slide.",
        focusAreas: [
            "Both textboxes are horizontally centered on the slide",
            "Text elements align vertically with each other (same center X)",
            "Visual balance and symmetry of the layout",
            "No unintended changes to other elements"
        ],
        expectedChanges: [
            "ABOUT US text centered horizontally on the slide",
            "Elaborate text centered horizontally on the slide",
            "Both texts share the same horizontal center alignment"
        ],
    },
];
