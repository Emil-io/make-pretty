import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes still exist (content should be edited, not deleted)
    {
        name: "count_shapes",
        description: "There should still be 4 placeholder shapes",
        slideId: 299,
        filter: { shapeType: "placeholder" },
        expected: 4,
    },

    // Verify inappropriate words are removed from title
    {
        name: "not_includes",
        description: "Title should not contain 'stupid'",
        slideId: 299,
        shapeId: 120,
        key: "rawText",
        expected: "stupid",
    },

    // Verify inappropriate words are removed from Yellow description
    {
        name: "not_includes",
        description: "Yellow description should not contain 'wtf'",
        slideId: 299,
        shapeId: 121,
        key: "rawText",
        expected: "wtf",
    },

    // Verify correct content is preserved - Yellow section still has main content
    {
        name: "includes",
        description: "Yellow section should still contain 'Yellow'",
        slideId: 299,
        shapeId: 121,
        key: "rawText",
        expected: "Yellow",
    },

    // Verify correct content is preserved - Blue section unchanged
    {
        name: "includes",
        description: "Blue section should still contain its description",
        slideId: 299,
        shapeId: 122,
        key: "rawText",
        expected: "Blue",
    },

    // Verify correct content is preserved - Red section unchanged
    {
        name: "includes",
        description: "Red section should still contain its description",
        slideId: 299,
        shapeId: 123,
        key: "rawText",
        expected: "Red",
    },

    // Alignment tests - 3 body columns should remain horizontally aligned
    {
        name: "all_are_equal",
        description: "Three body columns should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 299, shapeId: 121, key: "pos.topLeft[1]" },
            { slideId: 299, shapeId: 122, key: "pos.topLeft[1]" },
            { slideId: 299, shapeId: 123, key: "pos.topLeft[1]" },
        ],
    },

    // Equal sizing - columns should maintain equal dimensions
    {
        name: "all_are_equal",
        description: "Body columns should have equal width",
        objects: [
            { slideId: 299, shapeId: 121, key: "size.w" },
            { slideId: 299, shapeId: 122, key: "size.w" },
            { slideId: 299, shapeId: 123, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Body columns should have equal height",
        objects: [
            { slideId: 299, shapeId: 121, key: "size.h" },
            { slideId: 299, shapeId: 122, key: "size.h" },
            { slideId: 299, shapeId: 123, key: "size.h" },
        ],
    },

    // Spacing - columns should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Body columns should have equal horizontal spacing",
        slideId: 299,
        filter: { shapeType: "placeholder" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of inappropriate content removal",
        slideId: 299,
        autoGenerate: true,
        criteria: "Evaluate if inappropriate/unprofessional words have been removed while preserving all correct content.",
        focusAreas: [
            "The word 'stupid' has been removed from the title",
            "The abbreviation 'wtf' has been removed from the Yellow description",
            "All factual content about Yellow, Blue, and Red colors is preserved",
            "The slide remains professional and appropriate for a client presentation",
        ],
        expectedChanges: [
            "Title cleaned of inappropriate language ('stupid' removed)",
            "Yellow description cleaned of inappropriate language ('wtf' removed)",
            "All educational content about colors preserved intact",
        ],
    },
];
