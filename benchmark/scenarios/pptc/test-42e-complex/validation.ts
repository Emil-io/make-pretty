import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-42e: Align the large text so that they all start in the same row. Align the text within their boxes.
// The middle box should match with its top border the right box and with its bottom border the left box.
//
// Initial state: Large text (statistics) at different Y positions, boxes not aligned
// Expected: 
// 1. Large text aligned horizontally (same Y coordinate)
// 2. Text aligned within boxes (left/center/right alignment)
// 3. Middle box top aligns with right box top, middle box bottom aligns with left box bottom

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 1 image shape (background)",
        slideId: 274,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 7 group shapes",
        slideId: 274,
        filter: { shapeType: "group" },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 11 textbox shapes",
        slideId: 274,
        filter: { shapeType: "textbox" },
        expected: 11,
    },

    // ============================================
    // SECTION 2: LARGE TEXT HORIZONTAL ALIGNMENT
    // ============================================
    // The large text (statistics: "2 out of 5", "95%", "12 million") should all start at the same Y coordinate
    // These are textboxes: Shape 15, 18, 21
    // We'll use filtered_equality to check that at least 3 textboxes align
    // Note: This may match other textboxes too, but the LLM judge will verify it's specifically the large text
    {
        name: "filtered_equality",
        description: "Large text statistics (shapes 15, 18, 21) should be horizontally aligned at same Y coordinate",
        slideId: 274,
        filter: { shapeType: "textbox" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 textboxes should be aligned (the large text statistics)
        // Note: The filtered_equality test has a 10px tolerance, so textboxes within 10px will be grouped together
    },

    // ============================================
    // SECTION 3: BOX ALIGNMENT
    // ============================================
    // The middle box should match:
    // - Its top border with the right box's top border
    // - Its bottom border with the left box's bottom border
    
    // Main boxes: left (Group 9), middle (Group 3), right (Group 6)
    // We'll check alignment using ranges with tolerance
    // Right box top is ~263.1, so middle box top should be close to this (within ~20px tolerance)
    {
        name: "greater_than",
        description: "Middle box (Group 3) top should be >= 240px (right box top ~263.1 - tolerance)",
        slideId: 274,
        shapeId: 3,
        key: "pos.topLeft[1]",
        expected: 240,
    },
    {
        name: "less_than",
        description: "Middle box (Group 3) top should be <= 285px (right box top ~263.1 + tolerance)",
        slideId: 274,
        shapeId: 3,
        key: "pos.topLeft[1]",
        expected: 285,
    },
    // Left box bottom is ~776.3, so middle box bottom should be close to this (within ~20px tolerance)
    {
        name: "greater_than",
        description: "Middle box (Group 3) bottom should be >= 755px (left box bottom ~776.3 - tolerance)",
        slideId: 274,
        shapeId: 3,
        key: "pos.bottomRight[1]",
        expected: 755,
    },
    {
        name: "less_than",
        description: "Middle box (Group 3) bottom should be <= 800px (left box bottom ~776.3 + tolerance)",
        slideId: 274,
        shapeId: 3,
        key: "pos.bottomRight[1]",
        expected: 800,
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to evaluate:
    // - Text alignment within boxes (left/center/right)
    // - Overall visual alignment and layout quality
    {
        name: "llm_judge",
        description: "LLM evaluation of text alignment and box positioning",
        slideId: 274,
        autoGenerate: true,
        criteria: "Evaluate if large text elements (textboxes 15, 18, 21) are horizontally aligned, if text is properly aligned within boxes, and if the middle box (Group 3) aligns correctly with the left box (Group 9) and right box (Group 6).",
        focusAreas: [
            "All large text statistics textboxes (Shape IDs 15 '2 out of 5', 18 '95%', 21 '12 million') start at the same Y coordinate (horizontally aligned)",
            "Text within each box is properly aligned (left, center, or right as appropriate)",
            "Middle box (Group 3) top border aligns with the right box (Group 6) top border",
            "Middle box (Group 3) bottom border aligns with the left box (Group 9) bottom border",
            "Overall layout is visually balanced and professional",
            "Text readability and visual hierarchy are maintained",
        ],
        expectedChanges: [
            "Large text statistics (textboxes 15, 18, 21) aligned horizontally at the same Y coordinate",
            "Text properly aligned within each box",
            "Middle box (Group 3) positioned to match right box (Group 6) top and left box (Group 9) bottom",
            "Consistent alignment throughout the layout",
        ],
    },
];

