import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify original shapes are preserved
    {
        name: "count_shapes",
        description: "Should have 1 image (background)",
        slideId: 280,
        filter: { shapeType: "image" },
        expected: 1,
    },

    {
        name: "count_shapes",
        description: "Should have 9 textboxes (series labels + right side text)",
        slideId: 280,
        filter: { shapeType: "textbox" },
        expected: 9,
    },

    // The chart bars are autoShapes (rectangles) - there should be 12 bar segments (4 rows × 3 colors)
    // Plus the legend squares (3) and the chart frame (1)
    {
        name: "count_shapes",
        description: "Should preserve all autoShape rectangles (bar segments + legend + frame)",
        slideId: 280,
        filter: { shapeType: "autoShape" },
        expected: 16,
    },

    // Alignment tests - all bars should end at the same right edge after transformation
    // (currently they all start at same left edge X=108.0)
    // The gray bars (widest in each row) should now define the right edge
    {
        name: "filtered_equality",
        description: "Gray bars (Series 3) should all end at the same X position (right edge)",
        slideId: 280,
        filter: { shapeType: "autoShape", fillColor: "#8F8F8F" },
        key: "pos.bottomRight[0]",
        minMatchCount: 4,
    },

    // All bars in each row should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "All bar segments should maintain equal height",
        slideId: 280,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.h",
        minMatchCount: 12,
    },

    // Vertical spacing - rows should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Bar rows should have consistent vertical spacing",
        slideId: 280,
        filter: { shapeType: "autoShape", fillColor: "#8F8F8F" },
        direction: "vertical",
        minMatchCount: 4,
    },

    // Legend alignment - the 3 series labels should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Series labels (Series 1, 2, 3) should be horizontally aligned",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Series" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // LLM judge for the bar direction flip and segment order inversion
    {
        name: "llm_judge",
        description: "LLM evaluation of bar chart direction flip and segment inversion",
        slideId: 280,
        autoGenerate: true,
        criteria: "Evaluate if the horizontal bar chart was correctly transformed so bars start from the right (instead of left) and the segment order was inverted so largest chunks are now on the right.",
        focusAreas: [
            "All bars now start from the right side of the chart area and extend leftward",
            "The segment order within each bar is inverted (previously left-most segments are now right-most)",
            "The largest/widest segments are now positioned on the right side of each bar",
            "The color order in each bar is reversed (was: light purple → medium purple → gray, now: gray → medium purple → light purple from left to right)",
            "All 4 bar rows maintain consistent right-edge alignment",
            "Bar segment widths are preserved (only positions changed, not sizes)",
            "Legend and series labels remain in place and correctly identify the segments",
            "Overall chart readability and visual coherence is maintained",
        ],
        expectedChanges: [
            "Bars flipped to start from right edge instead of left edge",
            "Segment order inverted so largest chunks appear on the right",
            "Color order reversed within each bar row",
            "Right edges of all bars now aligned at a common X position",
        ],
    },
];
