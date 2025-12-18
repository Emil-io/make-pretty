import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all 3 groups exist
    {
        name: "count_shapes",
        description: "There should be 3 purple box groups",
        slideId: 257,
        filter: { shapeType: "group" },
        expected: 3,
    },

    // Count purple rectangles
    {
        name: "count_shapes",
        description: "There should be 3 purple rectangle autoShapes",
        slideId: 257,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 3,
    },

    // Alignment tests - all 3 groups should be horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "All 3 groups should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 257, shapeId: 122, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 125, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 128, key: "pos.topLeft[1]" },
        ],
    },

    // Purple rectangles should be horizontally aligned (same Y)
    {
        name: "all_are_equal",
        description: "Purple rectangles should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 257, shapeId: 123, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 126, key: "pos.topLeft[1]" },
            { slideId: 257, shapeId: 129, key: "pos.topLeft[1]" },
        ],
    },

    // Equal sizing - all 3 groups should have equal dimensions
    {
        name: "all_are_equal",
        description: "Groups should have equal width",
        objects: [
            { slideId: 257, shapeId: 122, key: "size.w" },
            { slideId: 257, shapeId: 125, key: "size.w" },
            { slideId: 257, shapeId: 128, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Groups should have equal height",
        objects: [
            { slideId: 257, shapeId: 122, key: "size.h" },
            { slideId: 257, shapeId: 125, key: "size.h" },
            { slideId: 257, shapeId: 128, key: "size.h" },
        ],
    },

    // Purple rectangles should have equal size
    {
        name: "all_are_equal",
        description: "Purple rectangles should have equal width",
        objects: [
            { slideId: 257, shapeId: 123, key: "size.w" },
            { slideId: 257, shapeId: 126, key: "size.w" },
            { slideId: 257, shapeId: 129, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Purple rectangles should have equal height",
        objects: [
            { slideId: 257, shapeId: 123, key: "size.h" },
            { slideId: 257, shapeId: 126, key: "size.h" },
            { slideId: 257, shapeId: 129, key: "size.h" },
        ],
    },

    // Spacing - groups should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Groups should have equal horizontal spacing",
        slideId: 257,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Header labels alignment - "Google Slides", "PowerPoint", "Canva" should be aligned (same Y)
    {
        name: "filtered_equality",
        description: "Header labels should be horizontally aligned",
        slideId: 257,
        filters: [
            { shapeType: "textbox", rawText: "Google Slides" },
            { shapeType: "textbox", rawText: "PowerPoint" },
            { shapeType: "textbox", rawText: "Canva" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of middle purple box fix",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the middle purple box has been fixed to align properly with the other two boxes",
        focusAreas: [
            "The middle purple box (PowerPoint section) is horizontally aligned with the left and right boxes",
            "All three purple boxes are at the same Y position",
            "The spacing between the three boxes appears even and balanced",
            "The overall layout looks clean and symmetrical",
        ],
        expectedChanges: [
            "Middle purple box aligned to match the Y position of the other boxes",
            "Layout appears symmetrical and well-organized",
        ],
    },
];
