import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-26a: Delete the introduction column and make "Services" and "About us" take half of the space each
//
// Initial state: 3 columns - Introduction (left), Our Services (center), About Us (right)
// Each column has a title, description, and image
// Expected: Introduction column deleted, Services and About Us columns expanded to each take 50% of slide width

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS - INTRODUCTION COLUMN
    // ============================================
    {
        name: "not_includes",
        description: "Introduction title should be deleted",
        slideId: 258,
        shapeId: 156,
        key: "rawText",
        expected: "Introduction",
    },
    {
        name: "not_includes",
        description: "Introduction description should be deleted",
        slideId: 258,
        shapeId: 157,
        key: "rawText",
        expected: "Elaborate on what\n you want to discuss.",
    },

    // ============================================
    // SECTION 2: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 2 main column groups remaining (down from 3)",
        slideId: 258,
        filter: {
            shapeType: "group",
            "size.w": 640.0,
            "size.h": 803.2,
        },
        expected: 2,
    },
    {
        name: "count_shapes",
        description: "Should have 2 large images remaining (down from 3)",
        slideId: 258,
        filter: {
            shapeType: "image",
            "size.h": 305.5,
        },
        expected: 2,
    },

    // ============================================
    // SECTION 3: SERVICES COLUMN - LEFT POSITION
    // ============================================
    {
        name: "less_than",
        description: "Services title should move left from original center position",
        slideId: 258,
        shapeId: 154,
        key: "pos.topLeft[0]",
        expected: 400, // Originally at 786.5, should move significantly left
    },
    {
        name: "includes",
        description: "Services title text should remain unchanged",
        slideId: 258,
        shapeId: 154,
        key: "rawText",
        expected: "Our Services",
    },
    {
        name: "equal",
        description: "Services image should maintain original size",
        slideId: 258,
        shapeId: 137,
        key: "size.w",
        expected: 305.1,
    },

    // ============================================
    // SECTION 4: ABOUT US COLUMN - RIGHT POSITION
    // ============================================
    {
        name: "greater_than",
        description: "About Us title should move right from original position",
        slideId: 258,
        shapeId: 158,
        key: "pos.topLeft[0]",
        expected: 1500, // Originally at 1398.8, should move right to fill space
    },
    {
        name: "includes",
        description: "About Us title text should remain unchanged",
        slideId: 258,
        shapeId: 158,
        key: "rawText",
        expected: "About Us",
    },
    {
        name: "equal",
        description: "About Us image should maintain original size",
        slideId: 258,
        shapeId: 141,
        key: "size.w",
        expected: 305.3,
    },

    // ============================================
    // SECTION 5: TWO-COLUMN ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "Both column titles should be at same vertical position",
        slideId: 258,
        shapeIds: [154, 158],
        key: "pos.topLeft[1]",
    },
    {
        name: "all_are_equal",
        description: "Both column descriptions should be at same vertical position",
        slideId: 258,
        shapeIds: [155, 159],
        key: "pos.topLeft[1]",
    },
    {
        name: "all_are_equal",
        description: "Both column images should be at same vertical position",
        slideId: 258,
        shapeIds: [137, 141],
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 6: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "slide_fill_distribution",
        description: "Two columns should be distributed across full slide width",
        slideId: 258,
        minFillPercentage: 75,
    },

    // ============================================
    // SECTION 7: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 258,
        minMargin: 10,
    },

    // ============================================
    // SECTION 8: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of column deletion and redistribution",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the Introduction column has been deleted and the remaining two columns (Our Services and About Us) are properly expanded to each take 50% of the slide width.",
        focusAreas: [
            "Introduction column content has been completely deleted",
            "Our Services and About Us columns remain intact",
            "Two columns are evenly distributed, each taking approximately 50% of slide width",
            "Equal spacing between the two columns",
            "Proper centering of each column in its half of the slide",
            "Visual balance of the 2-column layout",
            "All column elements (titles, descriptions, images) are properly aligned",
        ],
        expectedChanges: [
            "Introduction column deleted",
            "Services and About Us columns expanded to fill space",
            "Two columns evenly distributed across slide width",
            "Proper alignment and spacing maintained",
        ],
    },
];
