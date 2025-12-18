import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 1 box",
        slideId: 269,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 1,
    },

    // Picture rotation test - should be 0 (upright) or close to 0
    {
        name: "equals",
        description: "Picture should be upright (rotation = 0)",
        slideId: 269,
        shapeId: 12,
        key: "style.rotation",
        expected: 0,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 269,
        minMargin: 10,
    },

    {
        name: "llm_judge",
        description: "LLM evaluation of picture rotation and box alignment",
        slideId: 269,
        autoGenerate: true,
        criteria: "Evaluate if the picture has been turned upright, resized, the shape has been made the same width as the picture, and positioned below the picture.",
        focusAreas: [
            "Picture is upright (properly rotated)",
            "Picture has been resized appropriately",
            "Box width matches picture width",
            "Box is positioned below the picture",
            "Box and picture are horizontally aligned",
            "Visual balance and layout quality",
        ],
        expectedChanges: [
            "Picture rotated upright",
            "Box width matches picture",
            "Box positioned below picture",
        ],
    },
];
