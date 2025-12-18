import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Slide 264: Add 4th column with water shortage/drought image
// Original: 3 rect boxes (214-216), 3 headings, 3 descriptions, 2 images

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 4th column added
    { name: "count_shapes", description: "4 rectangular boxes", slideId: 264, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, expected: 4 },
    { name: "count_shapes", description: "4 headings", slideId: 264, filter: { shapeType: "textbox", rawTextContains: "ADD A MAIN POINT" }, expected: 4 },
    { name: "count_shapes", description: "4 descriptions", slideId: 264, filter: { shapeType: "textbox", rawTextContains: "Elaborate" }, expected: 4 },

    // Horizontal alignment (same Y) - boxes in one row
    { name: "filtered_equality", description: "Boxes horizontally aligned", slideId: 264, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, key: "pos.topLeft[1]", minMatchCount: 4 },
    { name: "filtered_equality", description: "Headings horizontally aligned", slideId: 264, filter: { shapeType: "textbox", rawTextContains: "ADD A MAIN POINT" }, key: "pos.topLeft[1]", minMatchCount: 4 },
    { name: "filtered_equality", description: "Descriptions horizontally aligned", slideId: 264, filter: { shapeType: "textbox", rawTextContains: "Elaborate" }, key: "pos.topLeft[1]", minMatchCount: 4 },

    // Size equality - consistent column sizes
    { name: "filtered_equality", description: "Boxes equal width", slideId: 264, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, key: "size.w", minMatchCount: 4 },
    { name: "filtered_equality", description: "Boxes equal height", slideId: 264, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, key: "size.h", minMatchCount: 4 },

    // Spacing - even distribution
    { name: "filtered_spacing", description: "Boxes evenly spaced", slideId: 264, filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE }, direction: "horizontal", minMatchCount: 4 },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 264, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of 4th column addition",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if a 4th column with water shortage/drought image was added maintaining visual consistency.",
        focusAreas: [
            "4th column box added right of existing 3",
            "New box contains water shortage/drought image",
            "All 4 boxes aligned and evenly spaced",
            "4th column has heading and description text",
        ],
        expectedChanges: [
            "New rect box as 4th column",
            "Water shortage/drought image added",
            "Corresponding heading and description text",
        ],
    },
];
