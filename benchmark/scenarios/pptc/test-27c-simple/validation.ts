import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-27c: Align the "flowchart" shapes
//
// Initial state: Multiple flowchart shapes (homePlate autoShapes) with months (JAN-DEC) that are misaligned
// Expected: All flowchart shapes aligned properly (horizontally and/or vertically)

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: VERTICAL ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All flowchart shapes should be vertically aligned at same Y position",
        slideId: 282,
        filter: {
            shapeType: "autoShape",
            otherAutoShapeType: "homePlate",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 13,
    },

    // ============================================
    // SECTION 2: CONSISTENT SIZING
    // ============================================
    {
        name: "filtered_equality",
        description: "All flowchart shapes should have consistent width",
        slideId: 282,
        filter: {
            shapeType: "autoShape",
            otherAutoShapeType: "homePlate",
        },
        key: "size.w",
        minMatchCount: 13,
    },
    {
        name: "filtered_equality",
        description: "All flowchart shapes should have consistent height",
        slideId: 282,
        filter: {
            shapeType: "autoShape",
            otherAutoShapeType: "homePlate",
        },
        key: "size.h",
        minMatchCount: 13,
    },

    // ============================================
    // SECTION 3: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "llm_judge",
        description: "Flowchart shapes should be evenly distributed horizontally with consistent spacing",
        slideId: 282,
        criteria: "The flowchart shapes (homePlate autoShapes containing month labels) should be arranged horizontally with equal spacing between each shape",
    },

    // ============================================
    // SECTION 4: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 282,
        minMargin: 10,
    },
];
