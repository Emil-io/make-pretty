import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 5x7 grid = 35 rect shapes remain
    {
        name: "count_shapes",
        description: "There should be 35 rect autoShapes for a 5x7 grid",
        slideId: 285,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 35,
    },

    // Textboxes on the left side should be preserved
    {
        name: "count_shapes",
        description: "The 2 textboxes on the left should be preserved",
        slideId: 285,
        filter: { shapeType: "textbox" },
        expected: 2,
    },

    // Row alignment - shapes in each row should have same Y (center)
    {
        name: "filtered_equality",
        description: "Shapes should be horizontally aligned in rows (same center Y)",
        slideId: 285,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.center[1]",
        minMatchCount: 5, // 5 items per row
    },

    // Column alignment - shapes in each column should have same X (center)
    {
        name: "filtered_equality",
        description: "Shapes should be vertically aligned in columns (same center X)",
        slideId: 285,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.center[0]",
        minMatchCount: 7, // 7 items per column
    },

    // Horizontal spacing - shapes should be evenly spaced horizontally within rows
    {
        name: "filtered_spacing",
        description: "Shapes should have equal horizontal spacing within rows",
        slideId: 285,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "horizontal",
        minMatchCount: 5,
        groupByPerpendicularPosition: true,
    },

    // Vertical spacing - shapes should be evenly spaced vertically within columns
    {
        name: "filtered_spacing",
        description: "Shapes should have equal vertical spacing within columns",
        slideId: 285,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "vertical",
        minMatchCount: 7,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of 5x7 grid arrangement",
        slideId: 285,
        autoGenerate: true,
        criteria: "Evaluate if shapes on the right side are properly arranged in a 5x7 grid with 5 items per row and 7 rows",
        focusAreas: [
            "Shapes are arranged in a clean 5 columns by 7 rows grid layout",
            "Each row contains exactly 5 shapes (excess shapes removed)",
            "Shapes within each row are horizontally aligned",
            "Shapes within each column are vertically aligned",
            "Consistent spacing between shapes both horizontally and vertically",
            "Left side textboxes remain unchanged and properly positioned",
        ],
        expectedChanges: [
            "Shapes rearranged into a 5x7 grid on the right side",
            "Extra shapes beyond 5 per row have been removed",
            "Consistent horizontal and vertical alignment throughout the grid",
            "Even spacing between all grid elements",
        ],
    },
];
