import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be exactly 3 boxes",
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
        description: "All 3 boxes should be vertically aligned (same X coordinate)",
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
        description: "LLM evaluation of box rotation and distribution",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the three boxes have been rotated to be vertical, and distributed/resized/aligned accordingly.",
        focusAreas: [
            "Three boxes rotated to vertical orientation",
            "Boxes properly distributed",
            "Boxes resized appropriately",
            "Boxes aligned vertically",
            "Even spacing between boxes",
        ],
        expectedChanges: [
            "Boxes rotated to vertical",
            "Proper distribution and alignment",
        ],
    },
];
