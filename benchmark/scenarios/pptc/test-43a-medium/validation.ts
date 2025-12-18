import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-43a: Extend the table of contents to points 4-6 (below 1-3).
//
// Initial state: Table of contents with 3 items (01, 02, 03)
// Expected:
// 1. Table of contents should have 6 items total (01-06)
// 2. Items 4-6 should be added below items 1-3
// 3. New items should follow the same pattern (number + group + description)
// 4. Items should be consistently spaced and aligned

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be multiple textbox shapes",
        slideId: 260,
        filter: { shapeType: "textbox" },
        expected: 31, // Title + 6 numbered items + 6 descriptions + empty boxes + other text
    },
    {
        name: "count_shapes",
        description: "There should be multiple group shapes",
        slideId: 260,
        filter: { shapeType: "group" },
        expected: 19, // 6 item groups + decorative groups
    },

    {
        name: "count_shapes",
        description: "There should be exactly 6 numbered items (01-06)",
        slideId: 260,
        filter: { 
            shapeType: "textbox",
            rawTextContains: "0" // Matches all numbered items 01-06
        },
        expected: 6,
    },

    // ============================================
    // SECTION 2: COLUMN ALIGNMENT (NUMBERED ITEMS)
    // ============================================
    // Numbered items (01-06) should be aligned in 3 columns
    // Each column should have 2 items aligned vertically (same X coordinate relative to each other)
    // Column 1: Items "01" and "04" should share the same X coordinate
    {
        name: "filtered_equality",
        description: "Column 1: Items 01 and 04 should be vertically aligned (same X coordinate)",
        slideId: 260,
        filters: [
            { shapeType: "textbox", rawText: "01" },
            { shapeType: "textbox", rawText: "04" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 2, // Not used for multi-filter, but required by schema
    },
    // Column 2: Items "02" and "05" should share the same X coordinate
    {
        name: "filtered_equality",
        description: "Column 2: Items 02 and 05 should be vertically aligned (same X coordinate)",
        slideId: 260,
        filters: [
            { shapeType: "textbox", rawText: "02" },
            { shapeType: "textbox", rawText: "05" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },
    // Column 3: Items "03" and "06" should share the same X coordinate
    {
        name: "filtered_equality",
        description: "Column 3: Items 03 and 06 should be vertically aligned (same X coordinate)",
        slideId: 260,
        filters: [
            { shapeType: "textbox", rawText: "03" },
            { shapeType: "textbox", rawText: "06" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 2,
    },

    // ============================================
    // SECTION 3: ROW ALIGNMENT (NUMBERED ITEMS)
    // ============================================
    // Numbered items should be aligned in rows horizontally
    // Each row should have 3 items aligned horizontally (same Y coordinate relative to each other)
    // Row 1: Items "01", "02", "03" should share the same Y coordinate
    {
        name: "filtered_equality",
        description: "Row 1: Items 01, 02, and 03 should be horizontally aligned (same Y coordinate)",
        slideId: 260,
        filters: [
            { shapeType: "textbox", rawText: "01" },
            { shapeType: "textbox", rawText: "02" },
            { shapeType: "textbox", rawText: "03" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },
    // Row 2: Items "04", "05", "06" should share the same Y coordinate
    {
        name: "filtered_equality",
        description: "Row 2: Items 04, 05, and 06 should be horizontally aligned (same Y coordinate)",
        slideId: 260,
        filters: [
            { shapeType: "textbox", rawText: "04" },
            { shapeType: "textbox", rawText: "05" },
            { shapeType: "textbox", rawText: "06" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // ============================================
    // SECTION 4: DESCRIPTION TEXTBOXES ALIGNMENT
    // ============================================
    // Description textboxes should also be aligned in rows
    // They should align horizontally with their corresponding numbered items
    {
        name: "filtered_equality",
        description: "Description textboxes should be horizontally aligned in rows (at least 3 descriptions share same Y coordinate)",
        slideId: 260,
        filter: { 
            shapeType: "textbox",
            rawTextContains: "Amazing announcement" // Filter for description textboxes
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 description textboxes should be aligned horizontally
        // Note: This will catch description textboxes in each row
    },

    // ============================================
    // SECTION 5: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Presence of items 4-6 below items 1-3
    // - Consistent formatting and layout
    // - Proper spacing and alignment
    {
        name: "llm_judge",
        description: "LLM evaluation of table of contents extension",
        slideId: 260,
        autoGenerate: true,
        criteria: "Evaluate if the table of contents has been extended to include items 4-6 below items 1-3, with consistent formatting, spacing, and alignment.",
        focusAreas: [
            "Table of contents contains 6 numbered items (01, 02, 03, 04, 05, 06)",
            "Items 4-6 are positioned below items 1-3",
            "All items follow the same pattern (number + group + description textbox)",
            "All 3 columns of numbered items (01/04, 02/05, 03/06) are consistently aligned vertically (same X coordinate relative to each other)",
            "All 2 rows of numbered items (01-03, 04-06) are consistently aligned horizontally (same Y coordinate relative to each other)",
            "Description textboxes for items 4-6 are present and properly formatted",
            "Overall layout maintains visual consistency with the original 3 items",
        ],
        expectedChanges: [
            "Items 04, 05, and 06 added to the table of contents",
            "New items positioned below existing items 01-03",
            "Consistent formatting and spacing maintained across all 6 items",
            "Proper vertical alignment of numbered items in all 3 columns",
            "Proper horizontal alignment of numbered items in both rows",
        ],
    },
];

