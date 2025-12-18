import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify slide structure is preserved
    {
        name: "count_shapes",
        description: "There should be 4 shapes on the slide (title + 2 body placeholders + slide number)",
        slideId: 296,
        expected: 4,
    },

    // Alignment tests - body placeholders should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Body placeholders should be horizontally aligned at same Y coordinate",
        slideId: 296,
        filter: { shapeType: "placeholder" },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Body placeholders should have equal width
    {
        name: "filtered_equality",
        description: "Body placeholders should have equal width",
        slideId: 296,
        filter: { shapeType: "placeholder" },
        key: "size.w",
        minMatchCount: 2,
    },

    // Body placeholders should have equal height
    {
        name: "filtered_equality",
        description: "Body placeholders should have equal height",
        slideId: 296,
        filter: { shapeType: "placeholder" },
        key: "size.h",
        minMatchCount: 2,
    },

    // LLM Judge - validate content correctness (primary test for this scenario)
    {
        name: "llm_judge",
        description: "LLM evaluation of content error correction",
        slideId: 296,
        autoGenerate: true,
        criteria: "Check if logical/content errors in the text descriptions have been corrected. The original slide had swapped descriptions - Black was described as white and White was described as black.",
        focusAreas: [
            "Black section should describe black color (dark, ebony, outer space, elegance, solemnity)",
            "White section should describe white color (milk, snow, combination of visible spectrum colors)",
            "Headings should match their descriptions correctly",
            "No other content errors introduced",
        ],
        expectedChanges: [
            "Description under 'Black' heading should now correctly describe black color properties",
            "Description under 'White' heading should now correctly describe white color properties",
        ],
    },
];
