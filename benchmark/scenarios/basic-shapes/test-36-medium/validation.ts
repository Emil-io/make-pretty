import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be 2 boxes after deleting the middle one",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 2,
    },
    {
        name: "filtered_equality",
        description: "Both boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "Both boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 2,
    },
    {
        name: "slide_fill_distribution",
        description: "Boxes should use most of the slide space",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 70,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of box and line deletion",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the middle box and one line have been deleted, the other line now separates the two remaining boxes in the middle, and the two boxes have been resized to use as much space of the slide as possible.",
        focusAreas: [
            "Middle box deleted",
            "One line deleted",
            "Remaining line separates the two boxes",
            "Two boxes resized to maximize slide space",
            "Proper alignment and spacing",
            "Visual balance maintained",
        ],
        expectedChanges: [
            "Middle box and line deleted",
            "Remaining boxes resized",
            "Line properly positioned",
        ],
    },
];
