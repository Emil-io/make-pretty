import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-38c: Align the heading and subheading (center it). Also, one picture is off.
//
// Task: Center the heading and subheading horizontally on the slide, and fix the misaligned team member picture
// Initial state: Heading/subheading not centered, one team member image (shape 308) is vertically misaligned
// Expected: Heading and subheading centered horizontally, all 4 team member images aligned at same Y position

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: HEADING AND SUBHEADING PRESERVATION
    // ============================================
    {
        name: "includes",
        description: "Main heading text should be preserved",
        slideId: 270,
        shapeId: 315,
        key: "rawText",
        expected: "ADD A TEAM MEMBERS PAGE",
    },
    {
        name: "includes",
        description: "Subheading text should be preserved",
        slideId: 270,
        shapeId: 316,
        key: "rawText",
        expected: "Elaborate on what you want to discuss.",
    },

    // ============================================
    // SECTION 2: TEAM MEMBER IMAGES ALIGNMENT
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 4 team member images (JPEG format)",
        slideId: 270,
        filter: { shapeType: "image" },
        expected: 8, // 4 team member JPEGs + 4 decorative PNGs
    },
    {
        name: "filtered_equality",
        description: "All 4 main team member images should be horizontally aligned (same Y position)",
        slideId: 270,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]", // Y coordinate
        minMatchCount: 4, // At least 4 images should be at the same Y position
    },
    {
        name: "filtered_equality",
        description: "All 4 main team member images should have equal width",
        slideId: 270,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "All 4 main team member images should have equal height",
        slideId: 270,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 4,
    },

    // ============================================
    // SECTION 3: TEAM MEMBER IMAGES DISTRIBUTION
    // ============================================
    {
        name: "filtered_spacing",
        description: "The 4 team member images should have equal horizontal spacing",
        slideId: 270,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // ============================================
    // SECTION 4: TEAM MEMBER LABELS PRESERVATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 4 team member name/title groups",
        slideId: 270,
        filter: { shapeType: "group" },
        expected: 5, // 1 heading group + 4 team member label groups
    },

    // ============================================
    // SECTION 5: LAYOUT PRESERVATION
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 270,
        minMargin: 10,
    },

    // ============================================
    // SECTION 6: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of heading centering and image alignment",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if the heading and subheading are centered horizontally on the slide, and if all 4 team member images are properly aligned at the same vertical position.",
        focusAreas: [
            "Main heading 'ADD A TEAM MEMBERS PAGE' is horizontally centered on the slide",
            "Subheading 'Elaborate on what you want to discuss.' is horizontally centered on the slide",
            "All 4 team member images (the row of photos above the name labels) are aligned at the same Y-coordinate",
            "The previously misaligned image is now properly aligned with the other 3 team member images",
            "Equal spacing maintained between the 4 team member images",
            "Overall visual balance and professional appearance of the team members section",
        ],
        expectedChanges: [
            "Heading and subheading horizontally centered",
            "Misaligned team member image corrected to match Y-position of other images",
            "All 4 team member images horizontally aligned",
            "Professional and balanced layout maintained",
        ],
    },
];
