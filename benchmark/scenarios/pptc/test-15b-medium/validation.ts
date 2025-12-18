import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 5 team member groups exist
    {
        name: "count_shapes",
        description: "There should be 5 group shapes (team member cards)",
        slideId: 285,
        filter: { shapeType: "group" },
        expected: 5,
    },

    // 5 team member images (one per column)
    {
        name: "count_shapes",
        description: "There should be 5 team member images",
        slideId: 285,
        filter: { shapeType: "image" },
        expected: 6, // 5 team member images + 1 background image
    },

    // 5 NAME textboxes + 5 Title textboxes
    {
        name: "count_shapes",
        description: "There should be 10 NAME/Title textboxes (5 columns x 2)",
        slideId: 285,
        filter: { shapeType: "textbox", rawTextContains: "NAME" },
        expected: 5,
    },

    // 4 vertical dividing lines (between 5 columns)
    {
        name: "count_shapes",
        description: "There should be 4 vertical lines separating 5 columns",
        slideId: 285,
        filter: { shapeType: "line" },
        expected: 5, // 4 vertical dividers + 1 horizontal top line
    },

    // Groups should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "All team member cards should be horizontally aligned at same Y",
        slideId: 285,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Groups should have equal width
    {
        name: "filtered_equality",
        description: "All team member cards should have equal width",
        slideId: 285,
        filter: { shapeType: "group" },
        key: "size.w",
        minMatchCount: 5,
    },

    // Groups should have equal height
    {
        name: "filtered_equality",
        description: "All team member cards should have equal height",
        slideId: 285,
        filter: { shapeType: "group" },
        key: "size.h",
        minMatchCount: 5,
    },

    // Groups should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Team member cards should have equal horizontal spacing",
        slideId: 285,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 5,
    },

    // NAME textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "All NAME labels should be horizontally aligned",
        slideId: 285,
        filter: { shapeType: "textbox", rawTextContains: "NAME" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Title textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "All Title labels should be horizontally aligned",
        slideId: 285,
        filter: { shapeType: "textbox", rawTextContains: "Title" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of adding 5th column with proper respacing",
        slideId: 285,
        autoGenerate: true,
        criteria: "Evaluate if a 5th team member column has been added and all columns are properly respaced with attention to white dividing lines.",
        focusAreas: [
            "A 5th team member card has been added matching the style of existing cards",
            "All 5 columns are evenly distributed across the slide width",
            "The vertical white dividing lines are properly positioned between columns",
            "Equal spacing exists between all adjacent columns",
            "All team member cards remain vertically aligned",
            "The overall layout maintains visual balance and professional appearance",
        ],
        expectedChanges: [
            "5th team member card added with same structure (image, NAME, Title)",
            "All 5 columns respaced to fit properly within the slide",
            "White dividing lines adjusted/added between columns",
            "Consistent spacing maintained throughout",
        ],
    },
];
