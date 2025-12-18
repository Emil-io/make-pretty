import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Test-27f: Delete the middle bar columns (golden ones), and add a 5th group with 2 columns
//
// Initial state: Bar chart with 4 groups, each group has 3 columns (colors: #E2AB30, #D8CA7E, #BB584C)
// Expected: Delete middle golden columns (#D8CA7E), add 5th group with 2 columns

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION - GOLDEN MIDDLE COLUMNS
    // ============================================
    {
        name: "count_shapes",
        description: "Should have no middle golden columns (#D8CA7E)",
        slideId: 274,
        filter: {
            shapeType: "autoShape",
            fillColor: "#D8CA7E",
        },
        expected: 0,
    },

    // ============================================
    // SECTION 2: COUNT - 5 GROUPS WITH 2 COLUMNS
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 10 bar columns total (5 groups × 2 columns)",
        slideId: 274,
        filter: {
            shapeType: "autoShape",
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        expected: 10,
    },

    // ============================================
    // SECTION 3: GROUP ADDITION
    // ============================================
    {
        name: "llm_judge",
        description: "Should have 5 distinct groups of bars with 2 columns each",
        slideId: 274,
        criteria: "The bar chart should have 5 groups arranged horizontally, each group containing exactly 2 bar columns",
    },

    // ============================================
    // SECTION 4: ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All bars should be aligned at same baseline",
        slideId: 274,
        filter: {
            shapeType: "autoShape",
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        key: "pos.bottomRight[1]",
        minMatchCount: 10,
    },

    // ============================================
    // SECTION 5: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 274,
        minMargin: 10,
    },
];
