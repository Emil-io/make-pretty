import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify chart structure is preserved
    {
        name: "count_shapes",
        description: "Chart should have bar rectangles",
        slideId: 281,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        expected: 21, // 15 bars (5 items × 3 series) + 6 gridlines
    },

    // Y-axis labels should be vertically aligned (same X position)
    {
        name: "filtered_equality",
        description: "Y-axis labels (0, 10, 20, 30, 40, 50) should be vertically aligned",
        slideId: 281,
        filters: [
            { shapeType: "textbox", rawTextContains: "0 " },
            { shapeType: "textbox", rawTextContains: "10 " },
            { shapeType: "textbox", rawTextContains: "20 " },
            { shapeType: "textbox", rawTextContains: "30 " },
            { shapeType: "textbox", rawTextContains: "40 " },
            { shapeType: "textbox", rawTextContains: "50 " },
        ],
        key: "pos.bottomRight[0]",
        minMatchCount: 6,
    },

    // Item labels should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "Item labels (Item 1-5) should be horizontally aligned",
        slideId: 281,
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

    // Bars should have equal width across series
    {
        name: "filtered_equality",
        description: "Bars should have equal width",
        slideId: 281,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 15,
    },

    // Bars should be aligned at bottom baseline
    {
        name: "filtered_equality",
        description: "Bars should share a common bottom baseline",
        slideId: 281,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "pos.bottomRight[1]",
        minMatchCount: 15,
    },

    // Horizontal spacing - bars within each item group should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Bars should have consistent horizontal spacing",
        slideId: 281,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 5,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic evaluation
    {
        name: "llm_judge",
        description: "LLM evaluation of chart correction",
        slideId: 281,
        autoGenerate: true,
        criteria: "Evaluate if the chart has been corrected properly with accurate data representation and proper visual layout.",
        focusAreas: [
            "Chart bars correctly represent the data values",
            "Bar heights correspond to Y-axis scale (0-50)",
            "Bars are properly aligned with their respective item labels",
            "Visual consistency in bar colors for each series",
            "Overall chart readability and professional appearance",
        ],
        expectedChanges: [
            "Chart data corrected to show accurate values",
            "Bars properly sized according to data",
            "Maintained consistent visual styling",
        ],
    },
];
