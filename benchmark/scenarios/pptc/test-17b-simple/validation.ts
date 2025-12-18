import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - verify both headings exist
    {
        name: "count_shapes",
        description: "There should be 2 heading textboxes",
        slideId: 256,
        filter: {
            shapeType: "textbox",
            rawTextContains: "Climate",
        },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be 1 subtitle textbox",
        slideId: 256,
        filter: {
            shapeType: "textbox",
            rawTextContains: "SCIENCE SUBJECT",
        },
        expected: 1,
    },

    // Both headings should be centered horizontally on the slide (center X ~960px for 1920px slide)
    // Check that main title center X is approximately at slide center
    {
        name: "greater_than",
        description: "Main heading 'Climate & Weather' center X should be greater than 900px (near slide center)",
        slideId: 256,
        shapeId: 100,
        key: "pos.center[0]",
        expected: 900,
    },
    {
        name: "less_than",
        description: "Main heading 'Climate & Weather' center X should be less than 1020px (near slide center)",
        slideId: 256,
        shapeId: 100,
        key: "pos.center[0]",
        expected: 1020,
    },

    // Check that subtitle center X is approximately at slide center
    {
        name: "greater_than",
        description: "Subtitle 'SCIENCE SUBJECT...' center X should be greater than 900px (near slide center)",
        slideId: 256,
        shapeId: 101,
        key: "pos.center[0]",
        expected: 900,
    },
    {
        name: "less_than",
        description: "Subtitle 'SCIENCE SUBJECT...' center X should be less than 1020px (near slide center)",
        slideId: 256,
        shapeId: 101,
        key: "pos.center[0]",
        expected: 1020,
    },

    // Both headings should have same center X (aligned with each other)
    {
        name: "all_are_equal",
        description: "Both headings should be centered at the same horizontal position",
        objects: [
            { slideId: 256, shapeId: 100, key: "pos.center[0]" },
            { slideId: 256, shapeId: 101, key: "pos.center[0]" },
        ],
    },

    // Boundary test - shapes should stay within slide margins
    {
        name: "within_boundaries",
        description: "All shapes should respect slide margins",
        slideId: 256,
        minMargin: 0,
    },

    // LLM Judge for visual quality assessment
    {
        name: "llm_judge",
        description: "LLM evaluation of heading centering",
        slideId: 256,
        autoGenerate: true,
        criteria: "Evaluate if both headings are properly centered horizontally on the slide.",
        focusAreas: [
            "Main title 'Climate & Weather' is horizontally centered on the slide",
            "Subtitle 'SCIENCE SUBJECT FOR MIDDLE SCHOOL' is horizontally centered on the slide",
            "Both headings are aligned with each other (same horizontal center)",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Both headings repositioned to be horizontally centered",
            "Headings aligned with each other at slide center",
        ],
    },
];
