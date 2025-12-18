import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify funnel structure
    {
        name: "count_shapes",
        description: "There should be 1 group (funnel)",
        slideId: 305,
        filter: { shapeType: "group" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be 7 horizontal lines connecting to textboxes",
        slideId: 305,
        filter: { shapeType: "line" },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "There should be 7 content textboxes",
        slideId: 305,
        filter: { shapeType: "textbox", rawTextContains: "Insert" },
        expected: 7,
    },

    // Funnel rectangles should be horizontally centered (same center X)
    {
        name: "filtered_equality",
        description: "Funnel rectangles should be horizontally centered",
        slideId: 305,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.center[0]",
        minMatchCount: 6,
    },

    // Lines should be horizontal (same Y start and end)
    {
        name: "line_validation",
        description: "Lines should be horizontal",
        slideId: 305,
        filter: { shapeType: "line" },
        checkVerticality: false,
        checkEqualLength: false,
        checkDividesTextboxes: false,
    },

    // Content textboxes should have equal width
    {
        name: "filtered_equality",
        description: "Content textboxes should have equal width",
        slideId: 305,
        filter: { shapeType: "textbox", rawTextContains: "Insert" },
        key: "size.w",
        minMatchCount: 6,
    },

    // Content textboxes should have equal height
    {
        name: "filtered_equality",
        description: "Content textboxes should have equal height",
        slideId: 305,
        filter: { shapeType: "textbox", rawTextContains: "Insert" },
        key: "size.h",
        minMatchCount: 6,
    },

    // Content textboxes should be vertically aligned (same X coordinate)
    {
        name: "filtered_equality",
        description: "Content textboxes should be vertically aligned",
        slideId: 305,
        filter: { shapeType: "textbox", rawTextContains: "Insert" },
        key: "pos.topLeft[0]",
        minMatchCount: 5,
    },

    // Content textboxes should be evenly spaced vertically
    {
        name: "filtered_spacing",
        description: "Content textboxes should have equal vertical spacing",
        slideId: 305,
        filter: { shapeType: "textbox", rawTextContains: "Insert" },
        direction: "vertical",
        minMatchCount: 5,
    },

    // LLM Judge for overall quality
    {
        name: "llm_judge",
        description: "LLM evaluation of funnel layout fix",
        slideId: 305,
        autoGenerate: true,
        criteria: "Evaluate if the funnel diagram layout has been properly fixed with correct alignment and spacing",
        focusAreas: [
            "Funnel shapes are properly centered and stacked vertically",
            "Horizontal lines connect funnel sections to content textboxes correctly",
            "Content textboxes are aligned and evenly spaced",
            "Overall visual balance and professional appearance",
        ],
        expectedChanges: [
            "Funnel elements properly aligned and centered",
            "Lines correctly positioned between funnel and textboxes",
            "Content textboxes aligned and evenly distributed",
        ],
    },
];
