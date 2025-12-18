import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - one column removed, should have 3 of each
    {
        name: "count_shapes",
        description: "After removing one column, there should be 3 image shapes",
        slideId: 288,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "After removing one column, there should be 2 vertical lines",
        slideId: 288,
        filter: { shapeType: "line" },
        expected: 2,
    },

    // Image alignment - remaining 3 images should be horizontally aligned
    {
        name: "filtered_equality",
        description: "The 3 remaining images should be horizontally aligned (same Y)",
        slideId: 288,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Images should have equal width
    {
        name: "filtered_equality",
        description: "Images should have equal width",
        slideId: 288,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 3,
    },

    // Images should have equal height
    {
        name: "filtered_equality",
        description: "Images should have equal height",
        slideId: 288,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 3,
    },

    // Images should have equal horizontal spacing after respacing
    {
        name: "filtered_spacing",
        description: "Images should have equal horizontal spacing",
        slideId: 288,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // "Add a main point" textboxes alignment
    {
        name: "filtered_equality",
        description: "Main point headings should be horizontally aligned (same Y)",
        slideId: 288,
        filter: { shapeType: "textbox", rawText: "Add a main point" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // "Elaborate" textboxes alignment
    {
        name: "filtered_equality",
        description: "Elaborate textboxes should be horizontally aligned (same Y)",
        slideId: 288,
        filter: { shapeType: "textbox", rawTextContains: "Elaborate" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Equal horizontal spacing for main point textboxes
    {
        name: "filtered_spacing",
        description: "Main point textboxes should have equal horizontal spacing",
        slideId: 288,
        filter: { shapeType: "textbox", rawText: "Add a main point" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of column removal and respacing",
        slideId: 288,
        autoGenerate: true,
        criteria: "Evaluate if one column was removed from the timeline and remaining elements were properly respaced to look balanced.",
        focusAreas: [
            "One complete column (image, indicator, and text elements) has been removed",
            "Remaining 3 columns are evenly distributed across the slide",
            "All elements in each column are vertically aligned with each other",
            "Horizontal spacing between columns is consistent",
            "Overall layout maintains visual balance and professional appearance",
        ],
        expectedChanges: [
            "One column of timeline elements removed",
            "Remaining elements redistributed with even horizontal spacing",
            "Visual balance maintained across the slide",
        ],
    },
];
