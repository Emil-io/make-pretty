import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Verify 5 images exist (was 4)
    {
        name: "count_shapes",
        description: "There should be 5 images after adding the 5th picture",
        slideId: 266,
        filter: { shapeType: "image" },
        expected: 5,
    },

    // All images should have the same height
    {
        name: "filtered_equality",
        description: "All 5 images should have the same height",
        slideId: 266,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 5,
    },

    // All images should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "All 5 images should be horizontally aligned at same Y coordinate",
        slideId: 266,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Images should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Images should have equal horizontal spacing",
        slideId: 266,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 5,
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of 5th image addition and layout adjustments",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if a 5th image was added in the middle of the sequence, all images cropped to same height with adjusted widths, and text labels properly added and aligned.",
        focusAreas: [
            "5 images are now displayed instead of 4",
            "The new 5th image is positioned in the middle of the sequence",
            "All images have the same height after cropping",
            "Images may have different widths to accommodate 5 in the row",
            "All images are horizontally aligned at the same Y position",
            "Equal spacing between images",
            "A 5th NAME/Title text group is added below the new image",
            "All text groups are aligned with their corresponding images"
        ],
        expectedChanges: [
            "5th image added (copy of first image)",
            "Images cropped to same height",
            "Image widths adjusted to fit 5 in a row",
            "5th NAME/Title text added and aligned",
            "Consistent spacing maintained"
        ],
    },
];
