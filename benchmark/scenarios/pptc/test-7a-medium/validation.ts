import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - should still have 3 circles (groups with freeforms)
    {
        name: "count_shapes",
        description: "Should still have 3 circle groups",
        slideId: 277,
        filter: { shapeType: "group" },
        expected: 4, // 3 circle groups + 1 text group on the right
    },

    {
        name: "count_shapes",
        description: "Should still have 3 percent textboxes inside circles",
        slideId: 277,
        filter: { shapeType: "textbox", rawTextContains: "%" },
        expected: 3,
    },

    // Verify text content changes - 78% should become 60%
    {
        name: "count_shapes",
        description: "Should have 0 textboxes with 78% (should be changed to 60%)",
        slideId: 277,
        filter: { shapeType: "textbox", rawText: "78%" },
        expected: 0,
    },

    {
        name: "count_shapes",
        description: "Should have 1 textbox with 60% (the biggest circle)",
        slideId: 277,
        filter: { shapeType: "textbox", rawText: "60%" },
        expected: 1,
    },

    // Verify text content changes - 21% should become 40%
    {
        name: "count_shapes",
        description: "Should have 0 textboxes with 21% (should be changed to 40%)",
        slideId: 277,
        filter: { shapeType: "textbox", rawText: "21%" },
        expected: 0,
    },

    {
        name: "count_shapes",
        description: "Should have 1 textbox with 40% (the smallest circle)",
        slideId: 277,
        filter: { shapeType: "textbox", rawText: "40%" },
        expected: 1,
    },

    // 53% should remain unchanged (middle circle)
    {
        name: "count_shapes",
        description: "Should still have 1 textbox with 53% (middle circle unchanged)",
        slideId: 277,
        filter: { shapeType: "textbox", rawText: "53%" },
        expected: 1,
    },

    // LLM judge for proportional resizing and overall layout
    {
        name: "llm_judge",
        description: "LLM evaluation of text changes and proportional circle resizing",
        slideId: 277,
        autoGenerate: true,
        criteria: "Evaluate if the percent values were correctly changed (78%→60%, 21%→40%) and circles were resized proportionally to match the new percentages.",
        focusAreas: [
            "The biggest circle now shows 60% instead of 78%",
            "The smallest circle now shows 40% instead of 21%",
            "The middle circle (53%) remains unchanged",
            "Circle sizes are proportional to their percentage values (60% largest, 53% medium, 40% smallest)",
            "Text labels remain centered within their respective circles",
            "Overall visual coherence and layout is maintained",
        ],
        expectedChanges: [
            "Text '78%' changed to '60%' in the largest circle",
            "Text '21%' changed to '40%' in the smallest circle",
            "Circles resized proportionally based on new percentage values",
            "Layout and positioning of circles adjusted appropriately",
        ],
    },
];
