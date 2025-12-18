import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "All 7 autoShape rectangles should be preserved",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "All 3 images should be preserved",
        slideId: 287,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "All 8 textboxes should be preserved",
        slideId: 287,
        filter: { shapeType: "textbox" },
        expected: 8,
    },

    // Rotation tests - the 3 icons should be upright (rotation = 0)
    {
        name: "equals",
        description: "Icon 1 (shape 345) should be upright (rotation = 0)",
        slideId: 287,
        shapeId: 345,
        key: "style.rotation",
        expected: 0,
    },
    {
        name: "equals",
        description: "Icon 2 (shape 346) should be upright (rotation = 0)",
        slideId: 287,
        shapeId: 346,
        key: "style.rotation",
        expected: 0,
    },
    {
        name: "equals",
        description: "Icon 3 (shape 347) should be upright (rotation = 0)",
        slideId: 287,
        shapeId: 347,
        key: "style.rotation",
        expected: 0,
    },

    // Alignment tests - using all_are_equal for specific shapes
    {
        name: "all_are_equal",
        description: "The 3 large boxes should be horizontally aligned (same Y)",
        objects: [
            { slideId: 287, shapeId: 341, key: "pos.topLeft[1]" },
            { slideId: 287, shapeId: 343, key: "pos.topLeft[1]" },
            { slideId: 287, shapeId: 344, key: "pos.topLeft[1]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "The 3 large boxes should have equal width",
        objects: [
            { slideId: 287, shapeId: 341, key: "size.w" },
            { slideId: 287, shapeId: 343, key: "size.w" },
            { slideId: 287, shapeId: 344, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "The 3 large boxes should have equal height",
        objects: [
            { slideId: 287, shapeId: 341, key: "size.h" },
            { slideId: 287, shapeId: 343, key: "size.h" },
            { slideId: 287, shapeId: 344, key: "size.h" },
        ],
    },

    // Large boxes horizontal spacing
    {
        name: "equal_spacing",
        description: "The 3 large boxes should have equal horizontal spacing",
        slideId: 287,
        shapeIds: [341, 343, 344],
        direction: "horizontal",
    },

    // Images should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "The 3 images should be horizontally aligned (same Y)",
        slideId: 287,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Marketing Channel labels should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Marketing Channel labels should be horizontally aligned",
        slideId: 287,
        filter: { shapeType: "textbox", rawTextContains: "Marketing Channel" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of icon rotation correction",
        slideId: 287,
        autoGenerate: true,
        criteria: "Evaluate if the three icons on the slide have been correctly rotated to be upright (no rotation).",
        focusAreas: [
            "All three icons are now upright with no rotation",
            "Icons match a standard upright orientation",
            "Overall layout and alignment of the slide is preserved",
            "Other elements (boxes, images, text) remain unchanged",
        ],
        expectedChanges: [
            "Three icons rotated to 0 degrees (upright)",
            "No other shapes modified",
        ],
    },
];
