import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify expected shapes
    {
        name: "count_shapes",
        description: "There should be 3 option box rectangles",
        slideId: 291,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 6, // 3 option boxes + colored background + 2 decorative rects
    },

    // The 3 option boxes should be horizontally aligned (same Y coordinate)
    {
        name: "all_are_equal",
        description: "Option boxes should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 291, shapeId: 816, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 817, key: "pos.topLeft[1]" },
            { slideId: 291, shapeId: 818, key: "pos.topLeft[1]" },
        ],
    },

    // Option boxes should have equal size
    {
        name: "all_are_equal",
        description: "Option boxes should have equal width",
        objects: [
            { slideId: 291, shapeId: 816, key: "size.w" },
            { slideId: 291, shapeId: 817, key: "size.w" },
            { slideId: 291, shapeId: 818, key: "size.w" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Option boxes should have equal height",
        objects: [
            { slideId: 291, shapeId: 816, key: "size.h" },
            { slideId: 291, shapeId: 817, key: "size.h" },
            { slideId: 291, shapeId: 818, key: "size.h" },
        ],
    },

    // Option labels should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Option labels (01, 02, 03) should be horizontally aligned",
        slideId: 291,
        filters: [
            { shapeType: "textbox", rawText: "Option 01" },
            { shapeType: "textbox", rawText: "Option 02" },
            { shapeType: "textbox", rawText: "Option 03" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Elaborate textboxes should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Elaborate textboxes should be horizontally aligned",
        slideId: 291,
        filter: { shapeType: "textbox", rawTextContains: "Elaborate" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Option labels should be centered above their boxes (same center X)
    {
        name: "all_are_equal",
        description: "Option 01 label should be centered above box 1",
        objects: [
            { slideId: 291, shapeId: 820, key: "pos.center[0]" },
            { slideId: 291, shapeId: 816, key: "pos.center[0]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Option 02 label should be centered above box 2",
        objects: [
            { slideId: 291, shapeId: 821, key: "pos.center[0]" },
            { slideId: 291, shapeId: 817, key: "pos.center[0]" },
        ],
    },
    {
        name: "all_are_equal",
        description: "Option 03 label should be centered above box 3",
        objects: [
            { slideId: 291, shapeId: 822, key: "pos.center[0]" },
            { slideId: 291, shapeId: 818, key: "pos.center[0]" },
        ],
    },

    // Horizontal spacing - option boxes should be evenly spaced
    {
        name: "equal_spacing",
        description: "Option boxes should have equal horizontal spacing between them",
        slideId: 291,
        shapeIds: [816, 817, 818],
        direction: "horizontal",
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal alignment within colored box",
        slideId: 291,
        autoGenerate: true,
        criteria: "Evaluate if content is horizontally aligned within the colored box with equal spacing between columns and to box borders",
        focusAreas: [
            "Space between columns equals space to box border on both sides",
            "Option boxes are evenly distributed horizontally within the colored container",
            "Labels and description textboxes are centered above/below their respective boxes",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Content repositioned with equal horizontal spacing",
            "Gap between columns equals margin to left and right borders",
        ],
    },
];
