import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be boxes including encircling box and new vertical box",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6, // Original + encircling + vertical
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of encircling box and vertical box addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the two rows in the middle have been encircled with a new box (white filling, red border) sent to the background, the width of all horizontal boxes has been reduced, and a new vertical box has been added to the right with the same styling (red border).",
        focusAreas: [
            "Middle rows encircled with new box",
            "Encircling box has white fill and red border",
            "Box is in the background",
            "Horizontal boxes width reduced",
            "New vertical box added on right",
            "Vertical box has red border matching encircling box",
            "Proper alignment and spacing",
        ],
        expectedChanges: [
            "Encircling box added",
            "Box widths reduced",
            "Vertical box added on right",
        ],
    },
];
