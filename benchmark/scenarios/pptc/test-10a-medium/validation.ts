import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - Item 5 should be removed, leaving 4 items
    {
        name: "count_shapes",
        description: "There should be 4 item label textboxes after removing Item 5",
        slideId: 266,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Item",
        },
        expected: 4,
    },

    // Verify Item 5 is gone by checking remaining items contain "25%"
    {
        name: "count_shapes",
        description: "There should be 4 textboxes showing 25%",
        slideId: 266,
        filter: {
            shapeType: "textbox",
            rawTextContains: "25%",
        },
        expected: 4,
    },

    // The 4 remaining item labels should have equal sizes
    {
        name: "filtered_equality",
        description: "All 4 item labels should have equal width",
        slideId: 266,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Item",
        },
        key: "size.w",
        minMatchCount: 4,
    },

    {
        name: "filtered_equality",
        description: "All 4 item labels should have equal height",
        slideId: 266,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Item",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 266,
        minMargin: 0,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of pie chart modification",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if Item 5 was removed from the pie chart and all remaining 4 items now show 25% with proper chart composition reflecting equal distribution.",
        focusAreas: [
            "Item 5 has been completely removed from the chart (both label and pie slice)",
            "All 4 remaining items (Item 1-4) display 25% in their labels",
            "The pie chart visually shows 4 equal segments of 25% each",
            "Labels remain properly positioned around the chart",
            "Chart maintains visual balance and professional appearance",
        ],
        expectedChanges: [
            "Item 5 label and corresponding pie slice removed",
            "Text values changed from 20% to 25% for Items 1-4",
            "Pie chart composition updated to show 4 equal 25% segments",
        ],
    },
];
