import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-25c: Delete the 2019 point off the timeline and align/distribute the remaining points accordingly
//
// Initial state: Timeline with 5 points - 2015, 2017, 2019 (top row) and 2016, 2018 (bottom row)
// Each point is a group containing year label, title, and description
// Expected: 2019 group (id 255) and its shapes deleted, remaining 4 points distributed evenly

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS - 2019 GROUP
    // ============================================
    {
        name: "not_includes",
        description: "2019 year label should be deleted",
        slideId: 263,
        shapeId: 256,
        key: "rawText",
        expected: "2019",
    },
    {
        name: "not_includes",
        description: "2019 main point title should be deleted",
        slideId: 263,
        shapeId: 257,
        key: "rawText",
        expected: "ADD A MAIN POINT",
    },
    {
        name: "not_includes",
        description: "2019 description text should be deleted",
        slideId: 263,
        shapeId: 258,
        key: "rawText",
        expected: "Elaborate on what\nyou want to discuss.",
    },

    // ============================================
    // SECTION 2: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 4 timeline point groups remaining (down from 5)",
        slideId: 263,
        filter: {
            shapeType: "group",
        },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "Should have 4 ellipse markers on timeline (down from 5)",
        slideId: 263,
        filter: {
            shapeType: "autoShape",
            "details.autoShapeType": "ellipse",
        },
        expected: 4,
    },

    // ============================================
    // SECTION 3: DISTRIBUTION TESTS - TOP ROW
    // ============================================
    // 2015 (group 247) and 2017 (group 251) should be redistributed on top row
    {
        name: "all_are_equal",
        description: "Top row groups (2015, 2017) should be vertically aligned",
        slideId: 263,
        shapeIds: [247, 251],
        key: "pos.topLeft[1]",
    },
    {
        name: "less_than",
        description: "2015 group should be left of 2017",
        slideId: 263,
        shapeId: 247,
        key: "pos.topLeft[0]",
        compareShapeId: 251,
        compareKey: "pos.topLeft[0]",
    },

    // ============================================
    // SECTION 4: DISTRIBUTION TESTS - BOTTOM ROW
    // ============================================
    {
        name: "all_are_equal",
        description: "Bottom row groups (2016, 2018) should be vertically aligned",
        slideId: 263,
        shapeIds: [259, 263],
        key: "pos.topLeft[1]",
    },
    {
        name: "less_than",
        description: "2016 group should be left of 2018",
        slideId: 263,
        shapeId: 259,
        key: "pos.topLeft[0]",
        compareShapeId: 263,
        compareKey: "pos.topLeft[0]",
    },

    // ============================================
    // SECTION 5: ELLIPSE MARKER ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "All remaining ellipse markers should be on the same Y coordinate (on the timeline)",
        slideId: 263,
        shapeIds: [271, 272, 273, 274], // 4 remaining ellipses
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 6: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "slide_fill_distribution",
        description: "Timeline points should be distributed across the slide horizontally",
        slideId: 263,
        minFillPercentage: 65,
    },

    // ============================================
    // SECTION 7: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 263,
        minMargin: 10,
    },

    // ============================================
    // SECTION 8: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline point deletion and redistribution",
        slideId: 263,
        autoGenerate: true,
        criteria: "Evaluate if the 2019 timeline point has been deleted and the remaining 4 points (2015, 2016, 2017, 2018) are properly aligned and distributed across the timeline.",
        focusAreas: [
            "2019 timeline point group and all its content have been deleted",
            "Remaining 4 timeline points (2015, 2016, 2017, 2018) are properly distributed",
            "Even spacing between timeline points",
            "Proper alignment of year labels with their groups",
            "Visual balance of the timeline layout with 2x2 grid structure",
            "Top row (2015, 2017) and bottom row (2016, 2018) are properly aligned",
        ],
        expectedChanges: [
            "2019 group deleted from timeline",
            "Remaining 4 points redistributed evenly",
            "Equal spacing between all timeline points",
            "Proper alignment maintained across rows",
        ],
    },
];
