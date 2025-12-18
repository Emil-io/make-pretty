import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-26d-map: Add a 5th location arrow to the location of South Africa/Cape Town
//
// Initial state: Map with 4 destination arrows/pins (ids 401-404), 4 destination titles (One, Two, Three, Four)
// Expected: 5th location arrow added near South Africa/Cape Town position, new "Destination Five" text

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT VERIFICATION - ARROWS
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 5 location arrows/pins (up from 4)",
        slideId: 270,
        filter: {
            shapeType: "image",
            "size.w": 79.6,
            "size.h": 135.4,
        },
        expected: 5,
    },

    // ============================================
    // SECTION 2: COUNT VERIFICATION - DESTINATIONS
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 5 destination title textboxes (up from 4)",
        slideId: 270,
        filter: {
            shapeType: "textbox",
            "size.h": 49.0,
            "rawText": "Destination",
        },
        expected: 5,
    },

    // ============================================
    // SECTION 3: NEW DESTINATION TEXT
    // ============================================
    {
        name: "includes",
        description: "Should have 'Destination Five' title added",
        slideId: 270,
        filter: {
            shapeType: "textbox",
        },
        key: "rawText",
        expected: "Destination Five",
    },

    // ============================================
    // SECTION 4: EXISTING DESTINATIONS PRESERVED
    // ============================================
    {
        name: "includes",
        description: "Destination One should remain",
        slideId: 270,
        shapeId: 405,
        key: "rawText",
        expected: "Destination One",
    },
    {
        name: "includes",
        description: "Destination Two should remain",
        slideId: 270,
        shapeId: 409,
        key: "rawText",
        expected: "Destination Two",
    },
    {
        name: "includes",
        description: "Destination Three should remain",
        slideId: 270,
        shapeId: 406,
        key: "rawText",
        expected: "Destination Three",
    },
    {
        name: "includes",
        description: "Destination Four should remain",
        slideId: 270,
        shapeId: 410,
        key: "rawText",
        expected: "Destination Four",
    },

    // ============================================
    // SECTION 5: ARROW SIZE CONSISTENCY
    // ============================================
    {
        name: "filtered_equality",
        description: "All location arrows should have consistent width",
        slideId: 270,
        filter: {
            shapeType: "image",
            "size.h": 135.4,
        },
        key: "size.w",
    },
    {
        name: "filtered_equality",
        description: "All location arrows should have consistent height",
        slideId: 270,
        filter: {
            shapeType: "image",
            "size.w": 79.6,
        },
        key: "size.h",
    },

    // ============================================
    // SECTION 6: NEW ARROW PLACEMENT
    // ============================================
    {
        name: "llm_judge",
        description: "New location arrow should be positioned in South Africa/Cape Town region on the map",
        slideId: 270,
        criteria: "The 5th location arrow (new addition) should be positioned in the southern region of the map, approximately where South Africa/Cape Town would be located geographically",
    },

    // ============================================
    // SECTION 7: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 270,
        minMargin: 10,
    },

    // Leave for LLM-as-a-judge:
    // - Proper positioning of 5th arrow on South Africa/Cape Town
    // - Appropriate text label for Destination Five
    // - Consistent styling with existing destination labels
    // - Overall map layout balance with 5 destinations
];
