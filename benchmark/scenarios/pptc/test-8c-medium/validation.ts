import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 280: "OUR SERVICES" slide with 2x2 grid of services
// Task: Fix the distorted content back into a grid layout
// Service titles: Service One (442), Service Two (443), Service Three (438), Service Four (439)
// Description texts: 4 textboxes with "Elaborate on what you want to discuss."

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "Should have 3 images",
        slideId: 280,
        filter: { shapeType: "image" },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "Should have textboxes for title, services, and descriptions",
        slideId: 280,
        filter: { shapeType: "textbox" },
        expected: 9,
    },

    // Row 1 alignment: Service One and Service Two should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Service One and Service Two should be in the same row (same Y)",
        slideId: 280,
        filters: [
            { shapeType: "textbox", rawText: "Service One" },
            { shapeType: "textbox", rawText: "Service Two" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Row 2 alignment: Service Three and Service Four should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Service Three and Service Four should be in the same row (same Y)",
        slideId: 280,
        filters: [
            { shapeType: "textbox", rawText: "Service Three" },
            { shapeType: "textbox", rawText: "Service Four" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Column 1 alignment: Service One and Service Three should be vertically aligned
    {
        name: "filtered_equality",
        description: "Service One and Service Three should be in the same column (same X)",
        slideId: 280,
        filters: [
            { shapeType: "textbox", rawText: "Service One" },
            { shapeType: "textbox", rawText: "Service Three" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Column 2 alignment: Service Two and Service Four should be vertically aligned
    {
        name: "filtered_equality",
        description: "Service Two and Service Four should be in the same column (same X)",
        slideId: 280,
        filters: [
            { shapeType: "textbox", rawText: "Service Two" },
            { shapeType: "textbox", rawText: "Service Four" },
        ],
        key: "pos.center[0]",
        minMatchCount: 2,
    },

    // Service titles with "Service" should form a 2x2 grid pattern
    {
        name: "filtered_equality",
        description: "All service titles should have consistent width",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Service" },
        key: "size.w",
        minMatchCount: 2,
    },

    // Horizontal spacing between columns
    {
        name: "filtered_spacing",
        description: "Service titles should have consistent horizontal spacing within rows",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Service" },
        direction: "horizontal",
        minMatchCount: 2,
        groupByPerpendicularPosition: true,
    },

    // Vertical spacing between rows
    {
        name: "filtered_spacing",
        description: "Service titles should have consistent vertical spacing within columns",
        slideId: 280,
        filter: { shapeType: "textbox", rawTextContains: "Service" },
        direction: "vertical",
        minMatchCount: 2,
        groupByPerpendicularPosition: true,
    },

    // Boundary check
    {
        name: "within_boundaries",
        description: "All shapes should remain within slide boundaries",
        slideId: 280,
        minMargin: 0,
    },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of grid layout restoration",
        slideId: 280,
        autoGenerate: true,
        criteria: "Evaluate if the distorted slide content has been properly fixed back into a clean 2x2 grid layout for the services section.",
        focusAreas: [
            "Services are arranged in a proper 2x2 grid layout",
            "Service One and Two are aligned in the top row",
            "Service Three and Four are aligned in the bottom row",
            "Columns are properly aligned vertically",
            "Description texts are positioned consistently below their service titles",
            "Overall visual balance and symmetry is restored",
        ],
        expectedChanges: [
            "Service elements repositioned into a clean 2x2 grid",
            "Row alignment restored for top and bottom service pairs",
            "Column alignment restored for left and right service pairs",
        ],
    },
];
