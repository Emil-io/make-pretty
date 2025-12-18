import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be boxes plus one encircling box",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3, // 2 rows + 1 encircling
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of encircling box addition for top rows",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if a larger box has been added around the top two rows (including boxes and circles), uses white fill and blue border (same style as existing boxes), current shapes have been resized to fit neatly inside, and the new box is sent to the background.",
        focusAreas: [
            "Larger box added around top two rows",
            "Box has white fill and blue border",
            "Existing shapes resized to fit inside",
            "New box is in the background",
            "Proper alignment and spacing",
        ],
        expectedChanges: [
            "Encircling box added",
            "Shapes resized",
            "Box sent to background",
        ],
    },
];
