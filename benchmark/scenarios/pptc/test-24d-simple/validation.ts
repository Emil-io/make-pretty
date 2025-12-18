import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be 2 images",
        slideId: 292,
        filter: { shapeType: "image" },
        expected: 2,
    },
    {
        name: "count_shapes",
        description: "There should be 3 horizontal lines",
        slideId: 292,
        filter: { shapeType: "line" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "There should be at least 14 textboxes",
        slideId: 292,
        filter: { shapeType: "textbox" },
        expected: 14,
    },

    // Tier 1 (20$/MONTHLY) feature textboxes alignment - same X coordinate
    {
        name: "all_are_equal",
        description: "Tier 1 feature textboxes should be vertically aligned (same X)",
        objects: [
            { slideId: 292, shapeId: 510, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 511, key: "pos.topLeft[0]" },
        ],
    },

    // Tier 2 (30$/MONTHLY) feature textboxes alignment - same X coordinate
    {
        name: "all_are_equal",
        description: "Tier 2 feature textboxes should be vertically aligned (same X)",
        objects: [
            { slideId: 292, shapeId: 520, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 521, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 522, key: "pos.topLeft[0]" },
        ],
    },

    // Tier 3 (300$/YEARLY) feature textboxes alignment - same X coordinate
    {
        name: "all_are_equal",
        description: "Tier 3 feature textboxes should be vertically aligned (same X)",
        objects: [
            { slideId: 292, shapeId: 514, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 515, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 516, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 517, key: "pos.topLeft[0]" },
        ],
    },

    // Pricing labels alignment - all price textboxes should be vertically aligned (same X)
    {
        name: "all_are_equal",
        description: "Pricing amounts should be vertically aligned (same X)",
        objects: [
            { slideId: 292, shapeId: 509, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 519, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 513, key: "pos.topLeft[0]" },
        ],
    },

    // Tier labels (MONTHLY/YEARLY) alignment - same X coordinate
    {
        name: "all_are_equal",
        description: "Tier labels (MONTHLY/YEARLY) should be vertically aligned (same X)",
        objects: [
            { slideId: 292, shapeId: 508, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 518, key: "pos.topLeft[0]" },
            { slideId: 292, shapeId: 512, key: "pos.topLeft[0]" },
        ],
    },

    // Feature textboxes should have consistent width
    {
        name: "filtered_equality",
        description: "Feature textboxes should have equal width",
        slideId: 292,
        filter: { shapeType: "textbox", rawTextContains: "feature" },
        key: "size.w",
        minMatchCount: 2,
    },

    // LLM Judge for semantic content validation
    {
        name: "llm_judge",
        description: "LLM evaluation of pricing tier content creation",
        slideId: 292,
        autoGenerate: true,
        criteria: "Evaluate if the pricing tiers slide has been properly populated with home robot features and a meaningful heading",
        focusAreas: [
            "The dummy heading 'ADD A PRICING PAGE' has been replaced with an appropriate title for home robot pricing",
            "Each pricing tier contains relevant home robot features",
            "Higher tiers include all features from lower tiers plus additional features",
            "The features are realistic and relevant for a home robot product (e.g., cleaning, voice control, AI features)",
            "The text is professional and concise",
            "Layout and visual structure is preserved",
        ],
        expectedChanges: [
            "Heading replaced with meaningful pricing-related title",
            "Feature placeholder text replaced with actual home robot features",
            "Tier 1 (20$/monthly) has basic features",
            "Tier 2 (30$/monthly) includes Tier 1 features plus additional ones",
            "Tier 3 (300$/yearly) includes all features from lower tiers plus premium features",
        ],
    },
];
