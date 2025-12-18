import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Slide 286: Transform 2x2 grid to 4 rows, headings left + content right, rose to top right
// Original: 4 images (285-288), 1 rect "rose" (289), 4 service headings, 4 descriptions, 1 title

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "4 images", slideId: 286, filter: { shapeType: "image" }, expected: 4 },
    { name: "count_shapes", description: "4 service headings", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Service" }, expected: 4 },
    { name: "count_shapes", description: "4 descriptions", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Elaborate" }, expected: 4 },
    { name: "count_shapes", description: "1 rose rect", slideId: 286, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, expected: 1 },

    // 4 rows layout - images should have 4 distinct Y positions (vertical alignment in columns)
    { name: "filtered_equality", description: "Images vertically aligned (same X)", slideId: 286, filter: { shapeType: "image" }, key: "pos.topLeft[0]", minMatchCount: 4 },
    { name: "filtered_spacing", description: "Images evenly spaced vertically", slideId: 286, filter: { shapeType: "image" }, direction: "vertical", minMatchCount: 4 },

    // Size consistency
    { name: "filtered_equality", description: "Images equal width", slideId: 286, filter: { shapeType: "image" }, key: "size.w", minMatchCount: 4 },
    { name: "filtered_equality", description: "Images equal height", slideId: 286, filter: { shapeType: "image" }, key: "size.h", minMatchCount: 4 },

    // Headings alignment - should be in column on left
    { name: "filtered_equality", description: "Headings vertically aligned", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Service" }, key: "pos.topLeft[0]", minMatchCount: 4 },
    { name: "filtered_spacing", description: "Headings evenly spaced vertically", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Service" }, direction: "vertical", minMatchCount: 4 },

    // Descriptions alignment - should be in column on right
    { name: "filtered_equality", description: "Descriptions vertically aligned", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Elaborate" }, key: "pos.topLeft[0]", minMatchCount: 4 },
    { name: "filtered_spacing", description: "Descriptions evenly spaced vertically", slideId: 286, filter: { shapeType: "textbox", rawTextContains: "Elaborate" }, direction: "vertical", minMatchCount: 4 },

    // Rose moved to top right - X should be in right portion of slide (>960)
    { name: "greater_than", description: "Rose X in right half", slideId: 286, shapeId: 289, key: "pos.topLeft[0]", expected: 960 },
    { name: "less_than", description: "Rose Y near top", slideId: 286, shapeId: 289, key: "pos.topLeft[1]", expected: 300 },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 286, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of grid to 4-row transformation",
        slideId: 286,
        autoGenerate: true,
        criteria: "Evaluate if 2x2 grid was transformed to 4 rows with headings on left, content on right, and rose moved to top right.",
        focusAreas: [
            "Layout changed from 2x2 grid to 4 horizontal rows",
            "Service headings positioned on left side of each row",
            "Content/images positioned on right side of each row",
            "Rose shape moved to top right corner of slide",
            "Rows evenly spaced vertically",
            "Visual balance and professional appearance",
        ],
        expectedChanges: [
            "4 rows instead of 2x2 grid",
            "Headings aligned on left",
            "Content aligned on right",
            "Rose repositioned to top right",
        ],
    },
];
