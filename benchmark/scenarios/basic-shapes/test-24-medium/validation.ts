import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be boxes for 5 rows total on the right",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6, // 1 large left box + 5 right boxes
    },
    {
        name: "filtered_equality",
        description: "At least 5 boxes should have equal width (right side boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 5,
    },
    {
        name: "filtered_equality",
        description: "At least 5 boxes should have equal height (right side boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 5,
    },
    {
        name: "filtered_spacing",
        description: "At least 5 boxes should have equal vertical spacing (right column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 5,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of row addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if 2 more rows have been added on the right, creating a total of 5 rows.",
        focusAreas: [
            "2 additional rows added on the right",
            "Total of 5 rows created",
            "Proper vertical alignment within rows",
            "Even vertical spacing between rows",
            "Consistent sizing across rows",
        ],
        expectedChanges: [
            "2 rows added on right",
            "5 total rows created",
            "Proper alignment maintained",
        ],
    },
];
