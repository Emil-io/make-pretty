import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Slide: 277 | Task: Transform vertical bar chart to horizontal, largest bar at top
// Original: 5 vertical stacked bars (3 segments each: green #A2B85E, orange #F9B458, blue #79A1BF)
// Bar order by height: Item5 > Item4 > Item3 > Item2 > Item1

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "1 image preserved", slideId: 277, filter: { shapeType: "image" }, expected: 1 },
    { name: "count_shapes", description: "5 Item labels preserved", slideId: 277, filter: { shapeType: "textbox", rawTextContains: "Item" }, expected: 5 },
    { name: "count_shapes", description: "15 bar segments preserved (5 bars × 3 colors)", slideId: 277, filter: { shapeType: "autoShape", autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, expected: 15 },

    // Item labels alignment (Y-axis labels on left side)
    { name: "filtered_equality", description: "Item labels vertically aligned (same X)", slideId: 277, filter: { shapeType: "textbox", rawTextContains: "Item" }, key: "pos.topLeft[0]", minMatchCount: 5 },
    { name: "filtered_spacing", description: "Item labels equal vertical spacing", slideId: 277, filter: { shapeType: "textbox", rawTextContains: "Item" }, direction: "vertical", minMatchCount: 5 },

    // Horizontal bars alignment - each row of segments should align
    { name: "filtered_spacing", description: "Bar rows evenly spaced vertically", slideId: 277, filter: { shapeType: "autoShape", autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, direction: "vertical", minMatchCount: 5, groupByPerpendicularPosition: true },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 277, minMargin: 0 },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of bar chart transformation",
        slideId: 277,
        autoGenerate: true,
        criteria: "Evaluate if vertical bar chart was transformed to horizontal bars with largest at top.",
        focusAreas: [
            "Bars oriented horizontally (width > height)",
            "Bars ordered by total length: largest at top, smallest at bottom",
            "3 color segments preserved per bar (green, orange, blue)",
            "Item labels positioned as Y-axis labels on left",
            "Value labels repositioned as X-axis at bottom",
        ],
        expectedChanges: [
            "Bars rotated from vertical to horizontal",
            "Bars reordered by size (largest at top)",
            "Axis labels repositioned for horizontal layout",
        ],
    },
];
