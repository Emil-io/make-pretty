import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify 6 agenda textboxes exist (5 original + 1 new)
    {
        name: "count_shapes",
        description: "There should be 6 agenda textboxes after adding a new agenda point",
        slideId: 258,
        filter: { shapeType: "textbox", rawTextContains: "agenda" },
        expected: 6,
    },

    // Vertical alignment - all agenda textboxes should be left-aligned (same X)
    {
        name: "filtered_equality",
        description: "All agenda textboxes should be left-aligned at same X coordinate",
        slideId: 258,
        filter: { shapeType: "textbox", rawTextContains: "agenda" },
        key: "pos.topLeft[0]",
        minMatchCount: 6,
    },

    // Equal width - all agenda textboxes should have the same width
    {
        name: "filtered_equality",
        description: "All agenda textboxes should have equal width",
        slideId: 258,
        filter: { shapeType: "textbox", rawTextContains: "agenda" },
        key: "size.w",
        minMatchCount: 6,
    },

    // Equal height - all agenda textboxes should have the same height
    {
        name: "filtered_equality",
        description: "All agenda textboxes should have equal height",
        slideId: 258,
        filter: { shapeType: "textbox", rawTextContains: "agenda" },
        key: "size.h",
        minMatchCount: 6,
    },

    // Vertical spacing - agenda items should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Agenda textboxes should have equal vertical spacing",
        slideId: 258,
        filter: { shapeType: "textbox", rawTextContains: "agenda" },
        direction: "vertical",
        minMatchCount: 6,
    },

    // Boundary test - all shapes should fit within the slide after moving up
    {
        name: "within_boundaries",
        description: "All shapes should fit within the slide boundaries after repositioning",
        slideId: 258,
        minMargin: 0,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of agenda point addition and repositioning",
        slideId: 258,
        autoGenerate: true,
        criteria:
            "Evaluate if a new agenda point was added and all items were moved up appropriately to fit within the slide",
        focusAreas: [
            "A 6th agenda point has been added with consistent styling (bullet icon + text)",
            "All agenda items have been moved up to accommodate the new item",
            "All 6 agenda items fit within the slide boundaries",
            "Vertical spacing between agenda items is consistent and balanced",
            "Left alignment of all agenda items is maintained",
            "Overall layout maintains visual hierarchy and professional appearance",
        ],
        expectedChanges: [
            "New agenda point added below existing 5 items",
            "All agenda items repositioned upward to fit the 6th item",
            "Consistent spacing maintained between all agenda items",
        ],
    },
];
