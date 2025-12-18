import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 282: Three content sections at bottom need to be aligned over entire slide width
// Task: Distribute 3 bottom sections horizontally across full slide width (960px)
// Bottom sections: shapes 245-246 (left), group 247 (middle), group 250 (right)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "All textboxes preserved", slideId: 282, filter: { shapeType: "textbox" }, expected: 10 },
    { name: "count_shapes", description: "Groups preserved", slideId: 282, filter: { shapeType: "group" }, expected: 4 },

    // Horizontal alignment - bottom section textboxes should share Y coordinate (same row)
    { name: "filtered_equality", description: "ADD A MAIN POINT headers aligned horizontally", slideId: 282, filter: { shapeType: "textbox", rawTextContains: "A  D  D" }, key: "pos.topLeft[1]", minMatchCount: 3 },
    { name: "filtered_equality", description: "Elaborate descriptions aligned horizontally", slideId: 282, filter: { shapeType: "textbox", rawTextContains: "Briefly elaborate" }, key: "pos.topLeft[1]", minMatchCount: 3 },

    // Equal sizing - sections should have consistent widths
    { name: "filtered_equality", description: "ADD A MAIN POINT headers equal width", slideId: 282, filter: { shapeType: "textbox", rawTextContains: "A  D  D" }, key: "size.w", minMatchCount: 3 },
    { name: "filtered_equality", description: "Elaborate descriptions equal width", slideId: 282, filter: { shapeType: "textbox", rawTextContains: "Briefly elaborate" }, key: "size.w", minMatchCount: 3 },

    // Horizontal spacing - bottom sections should be evenly spaced
    { name: "filtered_spacing", description: "ADD A MAIN POINT headers evenly spaced horizontally", slideId: 282, filter: { shapeType: "textbox", rawTextContains: "A  D  D" }, direction: "horizontal", minMatchCount: 3 },

    // Slide fill distribution - sections should span most of slide width
    { name: "slide_fill_distribution", description: "Bottom sections fill slide width", slideId: 282, filter: { shapeType: "textbox" }, minFillPercentage: 70 },

    // Boundary check - ensure shapes stay within slide
    { name: "within_boundaries", description: "All shapes within slide margins", slideId: 282, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of bottom section alignment",
        slideId: 282,
        autoGenerate: true,
        criteria: "Evaluate if the three bottom content sections have been aligned and distributed over the entire slide width.",
        focusAreas: [
            "Three bottom content sections are spread across the full slide width",
            "Equal horizontal spacing between the three sections",
            "Sections maintain horizontal alignment (same Y position)",
            "Content sections utilize the available slide width appropriately",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Bottom sections repositioned to span full slide width",
            "Even horizontal spacing between sections",
            "Sections horizontally aligned at same Y coordinate",
        ],
    },
];
