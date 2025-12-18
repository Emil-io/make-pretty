import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Test-27d: Add a third branch on the tree (one additional node at 2nd level with 2 child nodes on third level)
//
// Initial state: Tree structure with 2 branches at level 2, each with 2 child nodes at level 3
// Expected: 3 branches at level 2, third branch has 2 child nodes at level 3, all nodes aligned in rows

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT VERIFICATION - LEVEL 2
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 3 nodes at level 2 (up from 2)",
        slideId: 267,
        filter: {
            shapeType: "autoShape",
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 7, // 1 root + 3 level-2 + 6 level-3 (was 5 total, now 7)
    },

    // ============================================
    // SECTION 2: ROW ALIGNMENT - LEVEL 2
    // ============================================
    {
        name: "llm_judge",
        description: "All level 2 nodes should be aligned in the same horizontal row",
        slideId: 267,
        criteria: "The second level of the tree (3 nodes) should all be at the same vertical Y position, forming a horizontal row",
    },

    // ============================================
    // SECTION 3: ROW ALIGNMENT - LEVEL 3
    // ============================================
    {
        name: "llm_judge",
        description: "All level 3 nodes should be aligned in the same horizontal row",
        slideId: 267,
        criteria: "The third level of the tree (6 child nodes total) should all be at the same vertical Y position, forming a horizontal row below level 2",
    },

    // ============================================
    // SECTION 4: THIRD BRANCH CHILDREN
    // ============================================
    {
        name: "llm_judge",
        description: "New third branch should have 2 child nodes",
        slideId: 267,
        criteria: "The newly added third branch at level 2 should have exactly 2 child nodes at level 3, matching the pattern of the other branches",
    },

    // ============================================
    // SECTION 5: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 267,
        minMargin: 10,
    },
];
