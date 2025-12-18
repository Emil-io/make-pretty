import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes (2x2 grid)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },

    // Box size equality tests
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal width",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal height",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 4,
    },

    // Corner radius equality
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal corner radius",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 4,
    },

    // Grid alignment - 2 boxes should share same Y (one row)
    {
        name: "filtered_equality",
        description: "At least 2 boxes should be horizontally aligned (same Y coordinate, one row)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Grid alignment - 2 boxes should share same X (one column)
    {
        name: "filtered_equality",
        description: "At least 2 boxes should be vertically aligned (same X coordinate, one column)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // Horizontal spacing
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal horizontal spacing (one row)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 2,
    },

    // Vertical spacing
    {
        name: "filtered_spacing",
        description: "At least 2 boxes should have equal vertical spacing (one column)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 268,
        minMargin: 10,
    },

    {
        name: "llm_judge",
        description: "LLM evaluation of grid creation and picture cropping",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if shapes have been resized and aligned to a nice 2x2 grid, the picture has been cropped to 1:1 ratio, and resized to have the same outer borders as the 2x2 grid.",
        focusAreas: [
            "2x2 grid layout created with proper alignment",
            "Picture cropped to 1:1 ratio (width equals height)",
            "Picture resized to match outer borders of the 2x2 grid",
            "Picture position aligns with grid boundaries",
            "Visual balance between grid and picture",
        ],
        expectedChanges: [
            "2x2 grid created",
            "Picture cropped to 1:1 ratio",
            "Picture sized to match grid borders",
        ],
    },
];
