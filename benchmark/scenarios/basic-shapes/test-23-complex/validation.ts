import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes (1 large merged + 3 right side boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width (right side boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal height (right side boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box merging and text conversion",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the left 4 boxes have been changed into one large box and the text has been converted to 4 bullets inside.",
        focusAreas: [
            "Left 4 boxes merged into one large box",
            "Text from boxes converted to 4 bullet points",
            "Bullet points properly formatted inside the large box",
            "Proper text organization and readability",
            "Visual balance of the layout",
        ],
        expectedChanges: [
            "4 boxes merged into one",
            "Text converted to bullets",
        ],
    },
];
