import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // === DELETION TEST ===
    // Top right image (615) should be deleted
    {
        name: "count_shapes",
        description: "Should have 3 images remaining (1 large + 2 right side images after deleting top)",
        slideId: 281,
        filter: { shapeType: "image" },
        expected: 3,
    },

    // === LAYOUT: THREE EQUAL-WIDTH SECTIONS ===
    // After restructuring, the slide should have 3 sections, each 1/3 of slide width

    // The two remaining right-side images should have equal width
    {
        name: "filtered_equality",
        description: "The 2 remaining right images should have equal width (1/3 of slide)",
        slideId: 281,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 2,
    },

    // === VERTICAL ALIGNMENT ===
    // The two right images should be vertically aligned (same X position)
    {
        name: "filtered_equality",
        description: "The 2 right images should be vertically aligned at same X coordinate",
        slideId: 281,
        filter: { shapeType: "image" },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // === HEIGHT: IMAGES FILL THEIR SECTION ===
    // The two remaining right images should have equal height (each fills half the section height)
    {
        name: "filtered_equality",
        description: "The 2 right images should have equal height",
        slideId: 281,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 2,
    },

    // === VERTICAL SPACING ===
    // Right images should be evenly distributed vertically
    {
        name: "filtered_spacing",
        description: "The 2 right images should have consistent vertical spacing",
        slideId: 281,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 2,
    },

    // === LLM JUDGE FOR SEMANTIC VALIDATION ===
    {
        name: "llm_judge",
        description: "LLM evaluation of three-section layout and image deletion",
        slideId: 281,
        autoGenerate: true,
        criteria: "Verify the slide is divided into 3 equal-width sections and top image was deleted",
        focusAreas: [
            "Top right image has been deleted (originally 3 stacked images, now 2)",
            "Slide is divided into three equal-width sections (each ~1/3 of slide width)",
            "The two remaining right images fill the entire height of their section",
            "Text content section maintains proper layout on the left",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Top right image deleted",
            "Three sections of equal width created",
            "Remaining two images expanded to fill section height",
        ],
    },
];
