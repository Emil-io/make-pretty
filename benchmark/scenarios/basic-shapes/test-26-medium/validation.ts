import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be boxes after adding one on the right",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4, // 3 original + 1 new on right
    },
    {
        name: "filtered_equality",
        description: "At least 2 boxes should have equal width (top two shortened boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 2,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box resizing and addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the width of the top two shapes has been shortened and one box in similar design has been added on the right half that takes up the free space over the two rows.",
        focusAreas: [
            "Top two shapes width shortened",
            "New box added on right half",
            "New box matches the design style",
            "New box spans over the two rows",
            "Proper alignment and spacing",
        ],
        expectedChanges: [
            "Top shapes shortened",
            "New box added on right",
            "Box spans two rows",
        ],
    },
];
