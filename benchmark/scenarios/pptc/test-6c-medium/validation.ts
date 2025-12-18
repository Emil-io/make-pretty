import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify bar shapes are preserved
    {
        name: "count_shapes",
        description: "There should be 15 bar rectangles in the chart",
        slideId: 282,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        expected: 21, // 15 bars + legend rects + background rects
    },

    // After transformation to vertical bars:
    // - Bars should have height > width (vertical orientation)
    // - Bars should start from the same Y baseline (bottom)
    // - Bars should be horizontally spaced

    // Vertical bars should be aligned at the same bottom edge (same bottomRight[1])
    {
        name: "filtered_equality",
        description: "Vertical bars should share a common baseline (bottom Y coordinate)",
        slideId: 282,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "pos.bottomRight[1]",
        minMatchCount: 5, // At least 5 bars share baseline
    },

    // Bars within each series should have equal width
    {
        name: "filtered_equality",
        description: "Bars should have equal width",
        slideId: 282,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 5, // Series bars have equal width
    },

    // Item labels should be horizontally aligned (same Y) along X-axis
    {
        name: "filtered_equality",
        description: "Item labels should be horizontally aligned along the X-axis",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawTextContains: "Item 1" },
            { shapeType: "textbox", rawTextContains: "Item 2" },
            { shapeType: "textbox", rawTextContains: "Item 3" },
            { shapeType: "textbox", rawTextContains: "Item 4" },
            { shapeType: "textbox", rawTextContains: "Item 5" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Numeric axis labels should be vertically aligned (same X) along Y-axis
    {
        name: "filtered_equality",
        description: "Numeric labels (0, 10, 20...) should be vertically aligned along Y-axis",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "0" },
            { shapeType: "textbox", rawText: "10" },
            { shapeType: "textbox", rawText: "20" },
            { shapeType: "textbox", rawText: "30" },
            { shapeType: "textbox", rawText: "40" },
            { shapeType: "textbox", rawText: "50" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 6,
    },

    // Series labels should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Series labels should remain horizontally aligned",
        slideId: 282,
        filters: [
            { shapeType: "textbox", rawText: "Series 1" },
            { shapeType: "textbox", rawText: "Series 2" },
            { shapeType: "textbox", rawText: "Series 3" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal to vertical bar chart transformation",
        slideId: 282,
        autoGenerate: true,
        criteria: "Evaluate if the horizontal bar chart has been correctly transformed to a vertical bar chart with standing bars and properly repositioned axes.",
        focusAreas: [
            "Bars are now vertical (standing) instead of horizontal",
            "The data values are preserved - bar heights correspond to original bar lengths",
            "X-axis now shows Item labels (Item 1, Item 2, etc.)",
            "Y-axis now shows numeric values (0, 10, 20, 30, 40, 50)",
            "Series grouping is maintained with 3 series per item",
            "Legend remains intact with correct series labels and colors",
            "Overall chart proportions and positioning within the slide are appropriate",
        ],
        expectedChanges: [
            "Bars rotated from horizontal to vertical orientation",
            "Axis labels swapped - items on X-axis, numbers on Y-axis",
            "Chart layout adjusted to accommodate vertical bars",
            "Visual proportions maintained for readability",
        ],
    },
];
