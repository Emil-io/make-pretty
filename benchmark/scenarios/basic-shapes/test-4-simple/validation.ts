import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be exactly 4 columns (roundRect shapes)",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },
    {
        name: "filtered_equality",
        description: "Y-coordinate alignment - at least 4 columns horizontally aligned",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "Height equality - at least 4 columns with equal height",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "Width equality - at least 4 columns with equal width",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "Corner radius equality - at least 4 columns with equal corner radius",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 4,
    },
    {
        name: "filtered_spacing",
        description: "Equal horizontal spacing - at least 4 columns equally spaced",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
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
        minFillPercentage: 60, // At least 60% of horizontal slide space should be utilized
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of fourth column addition",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if a fourth column has been added to the existing columns and all columns are properly aligned.",
        focusAreas: [
            "Fourth column has been added",
            "All four columns are properly aligned horizontally",
            "Equal spacing between all columns",
            "Consistent sizing across all columns",
            "Visual balance of the 4-column layout",
        ],
        expectedChanges: [
            "Fourth column added",
            "All columns aligned and evenly spaced",
        ],
    },
];
