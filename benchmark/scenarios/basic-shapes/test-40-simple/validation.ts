import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be boxes including 3 small boxes in rightmost column",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 5, // Original count varies, but should have 3 small boxes on right
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width (rightmost column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal height (rightmost column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal vertical spacing (rightmost column)",
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
        description: "LLM evaluation of box resizing and duplication",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the rightmost box has been resized to be horizontal (but still same width), and copied so there are three small boxes above each other in the rightmost column.",
        focusAreas: [
            "Rightmost box resized to horizontal orientation",
            "Box width maintained",
            "Box copied to create three boxes",
            "Three boxes arranged vertically in rightmost column",
            "Proper alignment and spacing",
            "Visual consistency maintained",
        ],
        expectedChanges: [
            "Rightmost box resized horizontally",
            "Three boxes created in right column",
            "Proper vertical alignment",
        ],
    },
];
