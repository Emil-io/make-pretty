import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify Option 4 was added
    {
        name: "count_shapes",
        description: "There should be 4 option textboxes after adding Option 4",
        slideId: 261,
        filter: {
            shapeType: "textbox",
            rawTextContains: "OPTION",
        },
        expected: 4,
    },

    // Verify 4 images exist (symbols for each option)
    {
        name: "count_shapes",
        description: "There should be 4 images/symbols for the 4 options",
        slideId: 261,
        filter: {
            shapeType: "image",
        },
        expected: 4,
    },

    // Horizontal alignment - all option boxes should be at same Y position
    {
        name: "filtered_equality",
        description: "All option textboxes should be horizontally aligned (same Y)",
        slideId: 261,
        filter: {
            shapeType: "textbox",
            rawTextContains: "OPTION",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Equal width for option textboxes (after scaling)
    {
        name: "filtered_equality",
        description: "All option textboxes should have equal width after scaling",
        slideId: 261,
        filter: {
            shapeType: "textbox",
            rawTextContains: "OPTION",
        },
        key: "size.w",
        minMatchCount: 4,
    },

    // Equal height for option textboxes
    {
        name: "filtered_equality",
        description: "All option textboxes should have equal height",
        slideId: 261,
        filter: {
            shapeType: "textbox",
            rawTextContains: "OPTION",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Horizontal spacing between options should be equal
    {
        name: "filtered_spacing",
        description: "Options should have equal horizontal spacing",
        slideId: 261,
        filter: {
            shapeType: "textbox",
            rawTextContains: "OPTION",
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Images should be horizontally aligned
    {
        name: "filtered_equality",
        description: "All symbol images should be horizontally aligned (same Y)",
        slideId: 261,
        filter: {
            shapeType: "image",
        },
        key: "pos.center[1]",
        minMatchCount: 4,
    },

    // Images should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Symbol images should have equal horizontal spacing",
        slideId: 261,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of Option 4 addition and scaling",
        slideId: 261,
        autoGenerate: true,
        criteria: "Evaluate if Option 4 was added in dark green with a sun symbol, and all options were properly scaled and aligned.",
        focusAreas: [
            "Option 4 exists with 'OPTION 4' label and description text",
            "Option 4 has a dark green color for its background",
            "A sun symbol/icon is present for Option 4",
            "All 4 options are evenly distributed horizontally across the slide",
            "Options 1-3 were scaled down proportionally to accommodate Option 4",
            "Consistent styling and alignment across all 4 options",
        ],
        expectedChanges: [
            "New Option 4 added with dark green background",
            "Sun symbol added for Option 4",
            "Existing options scaled down to fit 4 options in the layout",
            "Equal spacing maintained between all options",
        ],
    },
];
