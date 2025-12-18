import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify only 4 people remain
    {
        name: "count_shapes",
        description: "There should be exactly 4 image shapes with ellipse autoShapeType (the 4 profile pictures)",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        expected: 4, // Ashley, Sarah, Timon, Gertrud profile pictures
    },
    {
        name: "count_shapes",
        description: "There should be exactly 8 textboxes (4 names + 4 titles)",
        slideId: 277,
        filter: {
            shapeType: "textbox",
        },
        expected: 8, // 4 names + 4 "Title or Position" texts (excluding the page title)
    },

    // Horizontal alignment for the 4 profile images - should all be in one row
    {
        name: "filtered_equality",
        description: "All 4 profile images should be horizontally aligned at same Y coordinate (in one row)",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Width equality for the 4 profile images
    {
        name: "filtered_equality",
        description: "All 4 profile images should have equal width",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 4,
    },

    // Height equality for the 4 profile images
    {
        name: "filtered_equality",
        description: "All 4 profile images should have equal height",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Horizontal spacing between profile images
    {
        name: "filtered_spacing",
        description: "The 4 profile images should have equal horizontal spacing",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Horizontal alignment for the 4 name textboxes
    {
        name: "filtered_equality",
        description: "At least 4 name textboxes should be horizontally aligned at same Y coordinate",
        slideId: 277,
        filter: {
            shapeType: "textbox",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 277,
        minMargin: 10,
    },

    // Distribution test - ensure profile images are well distributed across slide
    {
        name: "slide_fill_distribution",
        description: "Profile images should fill at least 50% of slide width",
        slideId: 277,
        filter: {
            shapeType: "image",
        },
        minFillPercentage: 50,
    },

    // LLM Judge test for overall coherence, design, and task success
    {
        name: "llm_judge",
        description: "LLM evaluation of whether Ashley, Sarah, Timon, and Gertrud are arranged in one row with their text, and others are deleted",
        slideId: 277,
        autoGenerate: true,
        criteria: "Evaluate if the slide successfully completes the requested task: arranging Ashley, Sarah, Timon, and Gertrud in one horizontal row with their associated text (names and titles), while deleting all other people/profiles from the slide.",
        focusAreas: [
            "Only 4 profile pictures remain on the slide (Ashley, Sarah, Timon, Gertrud)",
            "All 4 profile pictures are arranged in a single horizontal row with consistent alignment",
            "Each person's name text is properly positioned below their profile picture",
            "Each person's title/position text is properly positioned below their name",
            "Equal spacing between the 4 profiles creates visual balance",
            "All other profiles and their associated text have been removed from the slide",
            "The layout maintains professional appearance and visual coherence"
        ],
        expectedChanges: [
            "Removal of extra profiles (keeping only Ashley, Sarah, Timon, Gertrud)",
            "Repositioning of the 4 remaining profiles into a single horizontal row",
            "Alignment of associated text (names and titles) with their respective profiles",
            "Equal spacing distribution across the row"
        ],
    },
];
