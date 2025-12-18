import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test - should have 12 boxes for a 4x3 grid
    {
        name: "count_shapes",
        description: "There should be exactly 12 boxes (4x3 grid)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 12,
    },

    // Size equality tests - all boxes should be same size
    {
        name: "filtered_equality",
        description: "All 12 boxes should have equal width",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 12,
    },
    {
        name: "filtered_equality",
        description: "All 12 boxes should have equal height",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 12,
    },

    // Corner radius equality
    {
        name: "filtered_equality",
        description: "All 12 boxes should have equal corner radius",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 12,
    },

    // Horizontal spacing - at least 4 boxes should be equally spaced horizontally (one row)
    {
        name: "filtered_spacing",
        description: "At least 4 boxes should have equal horizontal spacing (one row)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Vertical spacing - at least 3 boxes should be equally spaced vertically (one column)
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal vertical spacing (one column)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 3,
    },

    // Row alignment - at least 4 boxes should share same Y coordinate (one row aligned)
    {
        name: "filtered_equality",
        description: "At least 4 boxes should be horizontally aligned (same Y coordinate, one row)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Column alignment - at least 3 boxes should share same X coordinate (one column aligned)
    {
        name: "filtered_equality",
        description: "At least 3 boxes should be vertically aligned (same X coordinate, one column)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 268,
        minMargin: 10,
    },

    // Slide fill distribution
    {
        name: "slide_fill_distribution",
        description:
            "Boxes should be distributed across the slide horizontally",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        minFillPercentage: 60,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of 4x3 grid creation",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if a nice 4x3 grid has been created with all shapes same sized, evenly spaced, and fitting content has been added to the new row of boxes.",
        focusAreas: [
            "4x3 grid layout created (4 columns, 3 rows)",
            "All shapes have the same size",
            "Even spacing between shapes horizontally and vertically",
            "Fitting content added to the new row of boxes",
            "Proper alignment within the grid",
            "Visual balance and consistency",
        ],
        expectedChanges: [
            "4x3 grid created",
            "Uniform sizing and spacing",
            "Content added to new row",
        ],
    },
];
