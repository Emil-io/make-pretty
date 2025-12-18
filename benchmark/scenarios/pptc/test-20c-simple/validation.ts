import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 286: "Key Metrics" slide with three purple columns
// Task: Center all text and headings within the three columns
// Column centers: ~338 (left), ~960 (middle), ~1582 (right)
// Text elements:
//   - Column 1: "Key Metric 1" (322), description (321)
//   - Column 2: "Key Metric 2" (324), description (323)
//   - Column 3: "Key Metric 2" (326), description (325)
//   - Main heading: "Key Metrics" (320)

export const Test: TChangesetTestProtocol = [
    // Count tests - verify text elements exist
    {
        name: "count_shapes",
        description: "Should have 3 'Key Metric' heading textboxes",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "Key Metric" },
        expected: 4, // includes main "Key Metrics" heading
    },
    {
        name: "count_shapes",
        description: "Should have 3 description textboxes",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "Write the measure" },
        expected: 3,
    },

    // Column 1 centering - heading and description should share same center X
    {
        name: "all_are_equal",
        description: "Column 1: heading and description should be centered at same X",
        objects: [
            { slideId: 286, shapeId: 322, key: "pos.center[0]" },
            { slideId: 286, shapeId: 321, key: "pos.center[0]" },
        ],
    },

    // Column 2 centering - heading and description should share same center X
    {
        name: "all_are_equal",
        description: "Column 2: heading and description should be centered at same X",
        objects: [
            { slideId: 286, shapeId: 324, key: "pos.center[0]" },
            { slideId: 286, shapeId: 323, key: "pos.center[0]" },
        ],
    },

    // Column 3 centering - heading and description should share same center X
    {
        name: "all_are_equal",
        description: "Column 3: heading and description should be centered at same X",
        objects: [
            { slideId: 286, shapeId: 326, key: "pos.center[0]" },
            { slideId: 286, shapeId: 325, key: "pos.center[0]" },
        ],
    },

    // All three column headings should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "All 3 Key Metric headings should be at same Y position",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "Key Metric" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // All three descriptions should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "All 3 description textboxes should be at same Y position",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "Write the measure" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Horizontal spacing between columns should be equal
    {
        name: "filtered_spacing",
        description: "Description textboxes should have equal horizontal spacing",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "Write the measure" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should remain within slide boundaries",
        slideId: 286,
        minMargin: 0,
    },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of text centering in three columns",
        slideId: 286,
        autoGenerate: true,
        criteria: "Evaluate if all text and headings in the three columns are properly centered within their respective columns.",
        focusAreas: [
            "Each column's heading is horizontally centered within its purple box",
            "Each column's description text is horizontally centered within its purple box",
            "Heading and description within each column share the same center X",
            "All three columns maintain consistent alignment and spacing",
            "Overall visual balance and professional appearance"
        ],
        expectedChanges: [
            "Text in column 1 centered horizontally within the purple box",
            "Text in column 2 centered horizontally within the purple box",
            "Text in column 3 centered horizontally within the purple box",
            "Consistent centering across all three columns"
        ],
    },
];
