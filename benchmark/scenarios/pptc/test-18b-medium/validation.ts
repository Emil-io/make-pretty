import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify icons exist (should be 42 for a 7x6 grid)
    {
        name: "count_shapes",
        description: "There should be 42 rect autoShapes (icons) for a 7x6 grid",
        slideId: 290,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 42,
    },

    // Row alignment tests - shapes in each row should have same Y (center)
    {
        name: "filtered_equality",
        description: "Icons should be horizontally aligned in rows (same center Y)",
        slideId: 290,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.center[1]",
        minMatchCount: 7, // 7 icons per row
    },

    // Column alignment tests - shapes in each column should have same X (center)
    {
        name: "filtered_equality",
        description: "Icons should be vertically aligned in columns (same center X)",
        slideId: 290,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.center[0]",
        minMatchCount: 6, // 6 icons per column
    },

    // Horizontal spacing - icons should be evenly spaced horizontally within rows
    {
        name: "filtered_spacing",
        description: "Icons should have equal horizontal spacing within rows",
        slideId: 290,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "horizontal",
        minMatchCount: 7,
        groupByPerpendicularPosition: true,
    },

    // Vertical spacing - icons should be evenly spaced vertically within columns
    {
        name: "filtered_spacing",
        description: "Icons should have equal vertical spacing within columns",
        slideId: 290,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "vertical",
        minMatchCount: 6,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of 7x6 grid arrangement",
        slideId: 290,
        autoGenerate: true,
        criteria: "Evaluate if icons are properly arranged in a 7x6 grid with correct row-by-row ordering",
        focusAreas: [
            "Icons are arranged in a clean 7 columns by 6 rows grid layout",
            "Icons within each row are horizontally aligned",
            "Icons within each column are vertically aligned",
            "Consistent spacing between icons both horizontally and vertically",
            "Grid maintains a professional, organized appearance",
        ],
        expectedChanges: [
            "Icons rearranged from scattered positions into a 7x6 grid",
            "Consistent horizontal and vertical alignment throughout the grid",
            "Even spacing between all grid elements",
        ],
    },
];
