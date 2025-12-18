import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes exist
    {
        name: "count_shapes",
        description: "There should be 4 groups (1 header group + 3 font category groups)",
        slideId: 288,
        filter: { shapeType: "group" },
        expected: 4,
    },

    // Alignment tests - the 3 font category groups should be horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "Font category groups should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 288, shapeId: 1023, key: "pos.topLeft[1]" },
            { slideId: 288, shapeId: 1026, key: "pos.topLeft[1]" },
            { slideId: 288, shapeId: 1029, key: "pos.topLeft[1]" },
        ],
    },

    // Category labels alignment - "Titles", "Headers", "Body Copy" should be aligned (same Y)
    {
        name: "filtered_equality",
        description: "Category labels (Titles, Headers, Body Copy) should be horizontally aligned",
        slideId: 288,
        filters: [
            { shapeType: "textbox", rawText: "Titles" },
            { shapeType: "textbox", rawText: "Headers" },
            { shapeType: "textbox", rawText: "Body Copy" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Font name labels alignment - all font name labels should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Font name labels should be horizontally aligned",
        slideId: 288,
        filters: [
            { shapeType: "textbox", rawText: "Rokkitt Black" },
            { shapeType: "textbox", rawText: "Asap Regular" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3, // 2 "Rokkitt Black" + 1 "Asap Regular"
    },

    // Black bars (autoShapes in groups) should be horizontally aligned
    {
        name: "all_are_equal",
        description: "Black bar rectangles should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 288, shapeId: 1024, key: "pos.topLeft[1]" },
            { slideId: 288, shapeId: 1027, key: "pos.topLeft[1]" },
            { slideId: 288, shapeId: 1030, key: "pos.topLeft[1]" },
        ],
    },

    // Spacing - groups should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Font category groups should have equal horizontal spacing",
        slideId: 288,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
        groupByPerpendicularPosition: true,
    },

    // Equal sizing - the 3 font groups should have equal dimensions
    {
        name: "all_are_equal",
        description: "Font category groups should have equal width",
        objects: [
            { slideId: 288, shapeId: 1023, key: "size.w" },
            { slideId: 288, shapeId: 1026, key: "size.w" },
            { slideId: 288, shapeId: 1029, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Font category groups should have equal height",
        objects: [
            { slideId: 288, shapeId: 1023, key: "size.h" },
            { slideId: 288, shapeId: 1026, key: "size.h" },
            { slideId: 288, shapeId: 1029, key: "size.h" },
        ],
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of slide layout fix",
        slideId: 288,
        autoGenerate: true,
        criteria: "Evaluate if the slide layout has been fixed with proper alignment of font category boxes and labels",
        focusAreas: [
            "The three font category boxes (Titles, Headers, Body Copy) are horizontally aligned at the same Y position",
            "The font name labels (Rokkitt Black, Rokkitt Black, Asap Regular) are aligned horizontally",
            "The category labels (Titles, Headers, Body Copy) are aligned horizontally",
            "The spacing between the three font boxes appears even and balanced",
            "The overall layout looks clean and professional",
        ],
        expectedChanges: [
            "Third font category box (Body Copy/Asap Regular) moved up to align with others",
            "Font name labels aligned to same baseline",
            "Layout appears symmetrical and well-organized",
        ],
    },
];
