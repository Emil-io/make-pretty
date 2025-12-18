import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-26b: Add a 3rd row (2x3 grid) to the services - copy Services 3 and 4, make all smaller to fit, change to "Service Five" and "Service Six"
//
// Initial state: 2x2 grid with Service One, Two, Three, Four
// Each service has title, description, and image
// Expected: 2x3 grid with 6 services total, all resized to fit the slide

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 6 service title textboxes (up from 4)",
        slideId: 265,
        filter: {
            shapeType: "textbox",
            "size.h": 49.0,
        },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "Should have 6 service description textboxes (up from 4)",
        slideId: 265,
        filter: {
            shapeType: "textbox",
            "rawText": "Elaborate on what\nyou want to discuss.",
        },
        expected: 6,
    },

    // ============================================
    // SECTION 2: NEW SERVICES TEXT CONTENT
    // ============================================
    {
        name: "includes",
        description: "Should have 'Service Five' title added",
        slideId: 265,
        filter: {
            shapeType: "textbox",
        },
        key: "rawText",
        expected: "Service Five",
    },
    {
        name: "includes",
        description: "Should have 'Service Six' title added",
        slideId: 265,
        filter: {
            shapeType: "textbox",
        },
        key: "rawText",
        expected: "Service Six",
    },

    // ============================================
    // SECTION 3: EXISTING SERVICES PRESERVED
    // ============================================
    {
        name: "includes",
        description: "Service One should remain",
        slideId: 265,
        shapeId: 285,
        key: "rawText",
        expected: "Service One",
    },
    {
        name: "includes",
        description: "Service Two should remain",
        slideId: 265,
        shapeId: 286,
        key: "rawText",
        expected: "Service Two",
    },
    {
        name: "includes",
        description: "Service Three should remain",
        slideId: 265,
        shapeId: 287,
        key: "rawText",
        expected: "Service Three",
    },
    {
        name: "includes",
        description: "Service Four should remain",
        slideId: 265,
        shapeId: 288,
        key: "rawText",
        expected: "Service Four",
    },

    // ============================================
    // SECTION 4: RESIZING - SERVICES MADE SMALLER
    // ============================================
    {
        name: "less_than",
        description: "Service One should be positioned lower (Y increased) to make room for 3 rows",
        slideId: 265,
        shapeId: 285,
        key: "pos.topLeft[1]",
        expected: 927, // Originally at 416.4, should move down
    },
    {
        name: "less_than",
        description: "Service Three should be positioned lower to accommodate 3-row layout",
        slideId: 265,
        shapeId: 287,
        key: "pos.topLeft[1]",
        expected: 1080, // Originally at 772.0, needs to move down significantly
    },

    // ============================================
    // SECTION 5: GRID ALIGNMENT - ROW 1
    // ============================================
    {
        name: "all_are_equal",
        description: "Row 1 service titles should be vertically aligned",
        slideId: 265,
        shapeIds: [285, 286],
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 6: GRID ALIGNMENT - ROW 2
    // ============================================
    {
        name: "all_are_equal",
        description: "Row 2 service titles should be vertically aligned",
        slideId: 265,
        shapeIds: [287, 288],
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 7: COLUMN ALIGNMENT
    // ============================================
    {
        name: "all_are_equal",
        description: "Left column service titles should be horizontally aligned",
        slideId: 265,
        filter: {
            shapeType: "textbox",
            "rawText": ["Service One", "Service Three"],
        },
        key: "pos.topLeft[0]",
    },
    {
        name: "all_are_equal",
        description: "Right column service titles should be horizontally aligned",
        slideId: 265,
        filter: {
            shapeType: "textbox",
            "rawText": ["Service Two", "Service Four"],
        },
        key: "pos.topLeft[0]",
    },

    // ============================================
    // SECTION 8: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 265,
        minMargin: 10,
    },

    // ============================================
    // SECTION 9: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of 3rd row addition and grid layout",
        slideId: 265,
        autoGenerate: true,
        criteria: "Evaluate if a 3rd row has been added to create a 2x3 grid with 6 services total, including new Service Five and Service Six, and all services are appropriately resized to fit the slide.",
        focusAreas: [
            "Service Five and Service Six have been added to the grid",
            "All 6 services (One, Two, Three, Four, Five, Six) are present",
            "Proper 2x3 grid layout with equal row heights",
            "Service Five and Six positioned in bottom row",
            "Even spacing between all 6 service boxes",
            "All services appropriately resized to fit within slide",
            "Consistent styling across all 6 services",
            "Proper alignment within rows and columns",
        ],
        expectedChanges: [
            "3rd row added with Service Five and Service Six",
            "Grid expanded from 2x2 to 2x3 layout",
            "All services resized to accommodate 6 items",
            "Even distribution and spacing maintained",
        ],
    },
];
