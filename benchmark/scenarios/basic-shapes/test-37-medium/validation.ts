import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be 3 boxes in horizontal layout",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },
    {
        name: "filtered_spacing",
        description: "All 3 boxes should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 boxes should be vertically aligned (same X)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
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
        description: "LLM evaluation of layout transformation and line rotation",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the slide has been transformed from vertical layout to horizontal layout (boxes resized to be 3 horizontal boxes above each other - 3 rows), and the lines have been rotated 90° to separate the 3 rows in the middle.",
        focusAreas: [
            "Layout transformed from vertical to horizontal",
            "3 boxes arranged in 3 rows",
            "Boxes properly resized for horizontal layout",
            "Lines rotated 90 degrees",
            "Lines separate the 3 rows in the middle",
            "Proper alignment and spacing",
        ],
        expectedChanges: [
            "Layout transformed to horizontal",
            "Lines rotated 90 degrees",
            "Rows properly separated",
        ],
    },
];
