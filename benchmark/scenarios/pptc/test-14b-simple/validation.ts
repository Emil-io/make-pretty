import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "All 3 rectangle shapes should be preserved",
        slideId: 258,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "All textboxes should be preserved",
        slideId: 258,
        filter: { shapeType: "textbox" },
        expected: 10,
    },

    // Rotation test - the middle rect should be upright (rotation = 0)
    {
        name: "equals",
        description: "Middle rectangle should be upright (rotation = 0 or undefined)",
        slideId: 258,
        shapeId: 121,
        key: "style.rotation",
        expected: 0,
    },

    // Alignment tests - all 3 rectangles should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "All 3 rectangles should be horizontally aligned (same Y)",
        slideId: 258,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // All 3 rectangles should have equal size
    {
        name: "filtered_equality",
        description: "All 3 rectangles should have equal width",
        slideId: 258,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 rectangles should have equal height",
        slideId: 258,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.h",
        minMatchCount: 3,
    },

    // Rectangles should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Rectangles should have equal horizontal spacing",
        slideId: 258,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Title textboxes should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Title textboxes should be horizontally aligned",
        slideId: 258,
        filters: [
            { shapeType: "textbox", rawText: "Introduction" },
            { shapeType: "textbox", rawText: "Our Process" },
            { shapeType: "textbox", rawText: "About Us" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Number labels should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Number labels (01, 02, 03) should be horizontally aligned",
        slideId: 258,
        filters: [
            { shapeType: "textbox", rawText: "01" },
            { shapeType: "textbox", rawText: "02" },
            { shapeType: "textbox", rawText: "03" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of rotation correction",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the middle rectangle (shape 121) has been correctly rotated to be upright, matching the orientation of the other two rectangles.",
        focusAreas: [
            "Middle rectangle is now upright (no rotation)",
            "Rectangle matches the upright orientation of the other two rectangles",
            "Overall layout and alignment of the slide is preserved",
        ],
        expectedChanges: [
            "Middle rectangle rotation changed from ~37 degrees to 0 degrees (upright)",
            "No other shapes modified",
        ],
    },
];
