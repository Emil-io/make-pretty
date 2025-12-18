import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be fewer boxes after combining two into one",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 5, // Depends on starting count, but 2 merged into 1
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
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
        description: "LLM evaluation of box combination",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the two lower boxes have been combined into one larger box and the text has been added together.",
        focusAreas: [
            "Two lower boxes combined into one",
            "Combined box is larger",
            "Text from both boxes added together",
            "Proper text formatting and organization",
            "Visual balance maintained",
        ],
        expectedChanges: [
            "Two boxes combined",
            "Text merged",
            "Larger box created",
        ],
    },
];
