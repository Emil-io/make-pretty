import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-42d: Align the layout with all the icons and text below it!
//
// Initial state: Icons (images/groups) at various Y positions, text scattered
// Expected: Icons aligned horizontally, text positioned below icons

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 5 image shapes",
        slideId: 271,
        filter: { shapeType: "image" },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 8 group shapes",
        slideId: 271,
        filter: { shapeType: "group" },
        expected: 8,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 20 textbox shapes",
        slideId: 271,
        filter: { shapeType: "textbox" },
        expected: 20,
    },

    // ============================================
    // SECTION 2: ICON ALIGNMENT
    // ============================================
    // Icons (images and icon groups) should be horizontally aligned
    // Note: Some groups may be header/footer elements, so we allow for some outliers
    
    // Check that icon groups are horizontally aligned
    // Most icon groups should be aligned, but some may be header/footer elements
    {
        name: "filtered_equality",
        description: "Most icon groups should be horizontally aligned at same Y coordinate",
        slideId: 271,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 icon groups should be aligned (allowing for header/footer outliers)
    },

    // Check that images (icons) are horizontally aligned
    // Most icon images should be aligned horizontally
    {
        name: "filtered_equality",
        description: "Most icon images should be horizontally aligned at same Y coordinate",
        slideId: 271,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // At least 3 images should be aligned (allowing for slight variations)
    },

    // ============================================
    // SECTION 3: TEXT POSITIONING BELOW ICONS
    // ============================================
    // Text should be positioned below the icons
    // The step textboxes ("Step 1", "Step 2", etc.) should be below the icon row
    // We'll use LLM judge to verify this semantic requirement since we need to
    // identify which textboxes are associated with icons vs. other text

    // ============================================
    // SECTION 4: HORIZONTAL SPACING
    // ============================================
    // Icon images should be evenly spaced horizontally
    // Note: Test images, not groups - groups include containers and aren't evenly spaced
    {
        name: "filtered_spacing",
        description: "Icon images should have equal horizontal spacing",
        slideId: 271,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 4, // At least 4 icon images should be evenly spaced
    },

    // ============================================
    // SECTION 5: LLM JUDGE
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of icon alignment and text positioning",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if all icons (images and icon groups) are horizontally aligned and if text content (Step labels and descriptions) is positioned below the icons.",
        focusAreas: [
            "All icon groups are horizontally aligned at the same Y coordinate",
            "All icon images are horizontally aligned with the icon groups",
            "Text labels ('Step 1', 'Step 2', etc.) are positioned below the icon row",
            "Text descriptions ('Elaborate on the step here') are positioned below their corresponding icons",
            "Icons have equal horizontal spacing between them",
            "Overall layout is balanced with icons on top and text below",
            "Visual hierarchy is clear with icons above text",
            "Professional appearance and consistent alignment",
        ],
        expectedChanges: [
            "All icons aligned horizontally at the same Y coordinate",
            "Text content repositioned below the icon row",
            "Equal horizontal spacing between icons",
            "Clear visual hierarchy with icons above text",
            "Consistent alignment throughout the layout",
        ],
    },
];

