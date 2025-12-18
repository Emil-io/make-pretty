import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-46a: Pls align the pictures in the middle - and use the black circles as "border" of the picutres.
//
// Initial state: Pictures in the middle are not aligned, and black circles are not used as borders
// Expected:
// 1. Pictures in the middle column should be horizontally aligned (same Y coordinate)
// 2. Black circles should be used as borders for the pictures
//
// Structure:
// - Middle groups: 256 (center X = 960.0), 257 (center X = 960.0), 260 (center X = 960.1), 234 (center X = 977.1), 243 (center X = 977.2)
// - Black shapes: 258 (center X = 960.0), 235 (center X = 977.1) - these should be used as borders

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be multiple group shapes (picture containers)",
        slideId: 262,
        filter: { shapeType: "group" },
        expected: 18, // Actual number of groups
    },
    {
        name: "count_shapes",
        description: "There should be black shapes (fill color #000000) that can be used as borders",
        slideId: 262,
        filter: { fillColor: "#000000" },
        expected: 9, // Total black shapes (some should be circular/oval borders)
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that middle groups are horizontally aligned
    // Middle groups are those with center X around 960 (the main middle column)
    // Note: The alignment test uses filtered_equality to allow for some variation
    // and focuses on the main picture groups in the middle column
    {
        name: "filtered_equality",
        description: "Middle picture groups (center X around 960-980) should be horizontally aligned",
        slideId: 262,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 groups should be aligned (allowing for some variation)
    },

    // ============================================
    // SECTION 3: POSITION TESTS
    // ============================================
    // Verify that middle groups are positioned in the center column
    {
        name: "greater_than",
        description: "Middle group 256 center X should be greater than 900 (centered in middle column)",
        slideId: 262,
        shapeId: 256,
        key: "pos.center[0]",
        expected: 900,
    },
    {
        name: "less_than",
        description: "Middle group 256 center X should be less than 1100 (centered in middle column)",
        slideId: 262,
        shapeId: 256,
        key: "pos.center[0]",
        expected: 1100,
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Pictures in the middle are aligned
    // - Black circles are used as borders for the pictures
    // - Overall visual organization and consistency
    {
        name: "llm_judge",
        description: "LLM evaluation of middle pictures alignment and black circle borders",
        slideId: 262,
        autoGenerate: true,
        criteria: "Evaluate if the pictures in the middle column are properly aligned horizontally (same Y coordinate). Also verify that black CIRCULAR or OVAL shapes (autoShapeType ellipse, not rectangles) are used as borders for the pictures. The black circles/ovals should frame or border the circular picture elements, creating a clear visual border effect. Each picture in the middle should have a black circular/oval border around it. The borders must be circular/oval shapes (autoShapeType ellipse) with black fill color (#000000). All middle pictures should be aligned and consistently bordered with black circles/ovals. Check the datamodel for shapes with autoShapeType 'ellipse' and fill color '#000000' to verify the circular borders exist.",
        focusAreas: [
            "Pictures in the middle column are horizontally aligned (same Y coordinate)",
            "Black CIRCULAR or OVAL shapes (autoShapeType ellipse) are used as borders for the pictures",
            "Black circular/oval borders frame the circular picture elements properly",
            "Each picture in the middle has a black circular/oval border",
            "Visual consistency and organization of middle pictures",
            "Overall layout and alignment of the middle column",
        ],
        expectedChanges: [
            "Pictures in the middle are aligned horizontally",
            "Black CIRCULAR or OVAL shapes are used as borders for the pictures (not rectangles)",
            "Black circular/oval borders frame the picture elements effectively",
            "Each picture has a distinct black circular/oval border",
            "Improved visual organization and alignment of middle pictures",
        ],
    },
];

