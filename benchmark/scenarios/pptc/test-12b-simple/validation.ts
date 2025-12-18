import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count test - verify 3 colored boxes exist
    {
        name: "count_shapes",
        description: "There should be exactly 3 colored rectangle boxes",
        slideId: 272,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        expected: 3,
    },

    // Main task: All 3 boxes should have equal height
    {
        name: "filtered_equality",
        description: "All 3 colored boxes should have the same height",
        slideId: 272,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Layout preservation: Boxes should maintain equal width
    {
        name: "filtered_equality",
        description: "All 3 boxes should maintain equal width",
        slideId: 272,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },

    // Alignment: Boxes should be horizontally aligned (same top Y)
    {
        name: "filtered_equality",
        description: "All 3 boxes should be horizontally aligned at the same top position",
        slideId: 272,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Spacing: Boxes should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "The 3 boxes should have equal horizontal spacing",
        slideId: 272,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of equal height transformation",
        slideId: 272,
        autoGenerate: true,
        criteria: "Evaluate if the three colored pricing boxes have been made the same height while maintaining the overall layout.",
        focusAreas: [
            "All three colored boxes (pink, yellow, green) have identical heights",
            "Box widths remain equal and unchanged",
            "Horizontal alignment of boxes is preserved",
            "Content within boxes (prices, labels, feature lists) remains intact and visible",
        ],
        expectedChanges: [
            "All three colored boxes adjusted to have the same height",
            "Layout and spacing between boxes preserved",
        ],
    },
];
