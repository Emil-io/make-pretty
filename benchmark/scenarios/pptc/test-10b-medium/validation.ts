import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 5 points exist after adding the new one
    {
        name: "count_shapes",
        description: "There should be 5 'ADD A MAIN POINT' headings after adding the fifth",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "ADD A MAIN POINT",
        },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "There should be 5 'Elaborate' description textboxes",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Elaborate",
        },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "There should be 5 bottom boxes (groups with colored bars)",
        slideId: 273,
        filter: {
            shapeType: "group",
        },
        expected: 12, // 5 main groups + 5 timeline marker groups + 2 corner groups
    },

    // Alignment tests - headings should be horizontally aligned
    {
        name: "filtered_equality",
        description: "All 'ADD A MAIN POINT' headings should be horizontally aligned (same Y)",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "ADD A MAIN POINT",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Alignment tests - description textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "All 'Elaborate' descriptions should be horizontally aligned (same Y)",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Elaborate",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Size tests - headings should have equal width after scaling
    {
        name: "filtered_equality",
        description: "All 'ADD A MAIN POINT' headings should have equal width",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "ADD A MAIN POINT",
        },
        key: "size.w",
        minMatchCount: 5,
    },

    // Size tests - descriptions should have equal width
    {
        name: "filtered_equality",
        description: "All 'Elaborate' descriptions should have equal width",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Elaborate",
        },
        key: "size.w",
        minMatchCount: 5,
    },

    // Spacing tests - horizontal spacing between timeline elements
    {
        name: "filtered_spacing",
        description: "Headings should have equal horizontal spacing",
        slideId: 273,
        filter: {
            shapeType: "textbox",
            rawTextContains: "ADD A MAIN POINT",
        },
        direction: "horizontal",
        minMatchCount: 5,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect slide margins",
        slideId: 273,
        minMargin: 0,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of adding fifth timeline point and scaling",
        slideId: 273,
        autoGenerate: true,
        criteria: "Evaluate if a fifth timeline point was added in red and the slide was properly scaled to accommodate 5 points including the bottom boxes.",
        focusAreas: [
            "A fifth timeline point has been added with red color styling",
            "All 5 timeline points are evenly distributed horizontally across the slide",
            "The bottom boxes have been scaled and repositioned to fit 5 columns",
            "The colored timeline markers (small squares) are properly aligned with their respective sections",
            "Text elements (headings and descriptions) are properly aligned in each column",
            "The new red point follows the same visual pattern as existing points (heading, description, marker, bottom box)",
            "Overall layout maintains balance and professional appearance",
        ],
        expectedChanges: [
            "New fifth timeline point added with red color scheme",
            "All timeline elements scaled down to accommodate 5 points",
            "Bottom boxes resized and redistributed across 5 columns",
            "Horizontal spacing adjusted for even distribution",
        ],
    },
];
