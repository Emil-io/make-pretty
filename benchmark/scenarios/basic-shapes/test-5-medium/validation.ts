import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be exactly 2 columns (roundRect shapes) - one deleted",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 2,
    },
    {
        name: "filtered_equality",
        description: "Y-coordinate alignment - 2 columns horizontally aligned",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "No border - all columns should have border width of 0",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "style.border.width",
        minMatchCount: 2,
    },
    {
        name: "filtered_spacing",
        description: "Equal horizontal spacing - 2 columns equally spaced",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 2,
    },
    {
        name: "within_boundaries",
        description: "Boundary check - all shapes respect 10px margin",
        slideId: 257,
        minMargin: 10,
    },
    {
        name: "slide_fill_distribution",
        description:
            "Shapes should be distributed across the slide, not clustered on one side",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 80,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of border removal and column deletion",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if borders have been removed from all boxes, the right box has been deleted, and the remaining boxes are aligned in two columns.",
        focusAreas: [
            "All boxes have no borders (border width is 0)",
            "Right box has been deleted",
            "Remaining boxes are aligned in two columns",
            "Equal spacing between the two columns",
            "Visual balance of the 2-column layout",
        ],
        expectedChanges: [
            "Borders removed from all boxes",
            "Right box deleted",
            "Boxes aligned in two columns",
        ],
    },
];
