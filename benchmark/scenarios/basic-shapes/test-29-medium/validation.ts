import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be more boxes after replacing middle with 3 rows",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6, // Original count varies, but should have 3 new boxes replacing 1
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width (the 3 replacement boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal height (the 3 replacement boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
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
        description: "LLM evaluation of middle box replacement",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the middle box has been replaced with 3 rows of boxes in the same style.",
        focusAreas: [
            "Middle box replaced with 3 rows of boxes",
            "New boxes match the same style",
            "Proper vertical alignment",
            "Even spacing between the 3 rows",
            "Visual consistency maintained",
        ],
        expectedChanges: [
            "Middle box replaced",
            "3 rows of boxes added",
            "Style consistency maintained",
        ],
    },
];
