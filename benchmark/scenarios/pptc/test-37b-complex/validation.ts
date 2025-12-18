import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be image boxes for the SWOT grid",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        expected: 7, // 4 SWOT quadrant boxes + 3 other decorative images
    },

    {
        name: "count_shapes",
        description: "There should be exactly 12 textboxes (4 letters + 4 titles + 4 descriptions)",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        expected: 12,
    },

    // Image box alignment - top row boxes (should be horizontally aligned)
    {
        name: "filtered_equality",
        description: "At least 2 image boxes in top row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Image box alignment - bottom row boxes (should be horizontally aligned)
    {
        name: "filtered_equality",
        description: "At least 2 image boxes in bottom row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Image box size equality - the 4 SWOT boxes should have equal dimensions
    {
        name: "filtered_equality",
        description: "At least 4 image boxes should have equal width",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 4,
    },

    {
        name: "filtered_equality",
        description: "At least 4 image boxes should have equal height",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Image box vertical alignment - left column
    {
        name: "filtered_equality",
        description: "At least 2 image boxes should be vertically aligned (same X coordinate) for left column",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Image box vertical alignment - right column
    {
        name: "filtered_equality",
        description: "At least 2 image boxes should be vertically aligned (same X coordinate) for right column",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Text alignment - top row letter headings (S and O should be at same Y)
    {
        name: "filtered_equality",
        description: "At least 2 letter headings in top row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Text alignment - bottom row letter headings (W and T should be at same Y)
    {
        name: "filtered_equality",
        description: "At least 2 letter headings in bottom row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Text alignment - top row titles (STRENGTHS and OPPORTUNITIES)
    {
        name: "filtered_equality",
        description: "At least 2 titles in top row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Text alignment - bottom row titles (WEAKNESSES and THREATS)
    {
        name: "filtered_equality",
        description: "At least 2 titles in bottom row should be horizontally aligned at same Y coordinate",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Text vertical alignment - left column
    {
        name: "filtered_equality",
        description: "At least 2 textboxes in left column should be vertically aligned (same X coordinate)",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Text vertical alignment - right column
    {
        name: "filtered_equality",
        description: "At least 2 textboxes in right column should be vertically aligned (same X coordinate)",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Text centering - horizontally centered within boxes
    {
        name: "filtered_equality",
        description: "At least 2 textboxes should share the same center X coordinate (centered in their columns)",
        slideId: 275,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Spacing - horizontal spacing between columns
    {
        name: "filtered_spacing",
        description: "Image boxes should have consistent horizontal spacing between columns",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 2,
    },

    // Spacing - vertical spacing between rows
    {
        name: "filtered_spacing",
        description: "Image boxes should have consistent vertical spacing between rows",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 275,
        minMargin: 10,
    },

    // Distribution test
    {
        name: "slide_fill_distribution",
        description: "SWOT boxes should fill at least 50% of slide width",
        slideId: 275,
        filter: {
            shapeType: "image",
        },
        minFillPercentage: 50,
    },

    // LLM Judge test for text alignment quality and overall coherence
    {
        name: "llm_judge",
        description: "LLM evaluation of text centering and alignment in SWOT grid",
        slideId: 275,
        autoGenerate: true,
        criteria: "Evaluate if text in the 4 SWOT boxes is properly centered horizontally within their quadrants. The task asks to 'align the text in the 4 boxes.'",
        focusAreas: [
            "All text elements (letters, titles, descriptions) are centered horizontally within their boxes",
            "Text in the same row is horizontally aligned across boxes",
            "Text in the same column is vertically aligned across boxes",
            "Visual symmetry and professional appearance of the SWOT grid"
        ],
        expectedChanges: [
            "All text centered horizontally within the 4 SWOT quadrants",
            "Consistent alignment across rows and columns",
            "Improved visual balance and symmetry"
        ],
    },
];
