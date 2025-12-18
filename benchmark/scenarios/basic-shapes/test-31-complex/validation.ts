import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be one additional encircling box",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4, // Original 3 + 1 encircling box
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of encircling box addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if another box has been added that encircles the existing boxes and circles, has white filling, blue border (copying basic layout from existing boxes), existing shapes have been resized accordingly to fit inside, and the new box is in the background.",
        focusAreas: [
            "Encircling box added around existing shapes",
            "Box has white fill color",
            "Box has blue border matching existing box style",
            "Existing shapes resized to fit inside the encircling box",
            "New box is in the background (z-index)",
            "Proper alignment and visual balance",
        ],
        expectedChanges: [
            "Encircling box added",
            "White fill and blue border applied",
            "Shapes resized to fit inside",
            "Box sent to background",
        ],
    },
];
