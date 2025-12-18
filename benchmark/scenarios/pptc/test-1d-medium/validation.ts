import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide: 1920x1080 | Task: Delete lowest row icons, realign remaining icons to fill space
// Original: ~50 images across ~7 rows, lowest row (Y~960) contains ~8 icons to delete
// Shape IDs in lowest row: 569, 570, 571, 572, 578, 581 and groups 588

export const Test: TChangesetTestProtocol = [
    // Count test - verify some images were deleted (original ~50, should be fewer)
    {
        name: "count_shapes",
        description: "Images should be fewer after deleting lowest row (~42 expected)",
        slideId: 277,
        filter: { shapeType: "image" },
        expected: 42,
    },

    // Alignment tests - remaining icons should be aligned in rows (same Y)
    {
        name: "filtered_equality",
        description: "Icons in rows should be horizontally aligned (same Y)",
        slideId: 277,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 4,
    },

    // Spacing tests - icons should have consistent horizontal spacing within rows
    {
        name: "filtered_spacing",
        description: "Icons should have equal horizontal spacing within rows",
        slideId: 277,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // Vertical distribution - rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Icon rows should have consistent vertical spacing",
        slideId: 277,
        filter: { shapeType: "image" },
        direction: "vertical",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // Boundary test - all shapes should stay within slide
    {
        name: "within_boundaries",
        description: "All icons should remain within slide bounds",
        slideId: 277,
        minMargin: 0,
    },

    // Fill distribution - icons should fill slide width after realignment
    {
        name: "slide_fill_distribution",
        description: "Icons should fill at least 50% of slide width after realignment",
        slideId: 277,
        filter: { shapeType: "image" },
        minFillPercentage: 50,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of icon deletion and realignment",
        slideId: 277,
        autoGenerate: true,
        criteria: "Evaluate if the lowest row of icons was deleted and remaining icons were properly realigned to fill the available space.",
        focusAreas: [
            "All icons from the lowest/bottom row have been deleted",
            "Remaining icons are realigned to fill the vertical space evenly",
            "Icons maintain horizontal alignment within their rows",
            "Consistent spacing between icons both horizontally and vertically",
            "Overall visual balance and professional appearance preserved",
        ],
        expectedChanges: [
            "Bottom row icons deleted",
            "Remaining icons redistributed vertically to fill space",
            "Consistent alignment and spacing maintained",
        ],
    },
];
