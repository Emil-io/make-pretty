import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-26c: Delete the man in the pink shirt from the team slide and arrange the others accordingly
//
// Initial state: 4 team members displayed horizontally with photos, names, and titles
// Each member has an image (542-545), name textbox, and "Title or Position" textbox
// Expected: 1 team member deleted, remaining 3 redistributed evenly across the slide

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT VERIFICATION
    // ============================================
    {
        name: "count_shapes",
        description: "Should have 3 team member images (down from 4)",
        slideId: 278,
        filter: {
            shapeType: "image",
            "source.filePath": "pptx://image.jpeg",
        },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "Should have 3 name textboxes (down from 4)",
        slideId: 278,
        filter: {
            shapeType: "textbox",
            "rawText": " Name",
        },
        expected: 3,
    },
    {
        name: "count_shapes",
        description: "Should have 3 title/position textboxes (down from 4)",
        slideId: 278,
        filter: {
            shapeType: "textbox",
            "rawText": "Title or Position",
        },
        expected: 3,
    },

    // ============================================
    // SECTION 2: REMAINING IMAGES VERTICAL ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All remaining team member images should be vertically aligned",
        slideId: 278,
        filter: {
            shapeType: "image",
            "source.filePath": "pptx://image.jpeg",
        },
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 3: REMAINING NAMES VERTICAL ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All remaining name textboxes should be at same vertical position",
        slideId: 278,
        filter: {
            shapeType: "textbox",
            "rawText": " Name",
        },
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 4: REMAINING TITLES VERTICAL ALIGNMENT
    // ============================================
    {
        name: "filtered_equality",
        description: "All remaining title textboxes should be at same vertical position",
        slideId: 278,
        filter: {
            shapeType: "textbox",
            "rawText": "Title or Position",
        },
        key: "pos.topLeft[1]",
    },

    // ============================================
    // SECTION 5: IMAGE SIZES PRESERVED
    // ============================================
    {
        name: "filtered_equality",
        description: "All remaining team member images should maintain consistent width",
        slideId: 278,
        filter: {
            shapeType: "image",
            "source.filePath": "pptx://image.jpeg",
        },
        key: "size.w",
    },
    {
        name: "filtered_equality",
        description: "All remaining team member images should maintain consistent height",
        slideId: 278,
        filter: {
            shapeType: "image",
            "source.filePath": "pptx://image.jpeg",
        },
        key: "size.h",
    },

    // ============================================
    // SECTION 6: HORIZONTAL DISTRIBUTION
    // ============================================
    {
        name: "slide_fill_distribution",
        description: "Three remaining team members should be distributed across the slide",
        slideId: 278,
        minFillPercentage: 70,
    },

    // ============================================
    // SECTION 7: LAYOUT TESTS
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 278,
        minMargin: 10,
    },

    // ============================================
    // SECTION 8: LLM JUDGE FOR SEMANTIC VALIDATION
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of team member deletion and redistribution",
        slideId: 278,
        autoGenerate: true,
        criteria: "Evaluate if the team member in the pink shirt has been deleted and the remaining 3 team members are properly redistributed evenly across the slide.",
        focusAreas: [
            "Team member in pink shirt has been removed",
            "Remaining 3 team members are present and properly displayed",
            "Even spacing between the 3 remaining team members",
            "Proper alignment of names and titles beneath each image",
            "Visual balance of the 3-person layout",
            "All team member cards maintain consistent styling and sizing",
            "Horizontal distribution fills the slide appropriately",
        ],
        expectedChanges: [
            "Pink shirt team member deleted",
            "Remaining 3 members redistributed evenly",
            "Equal spacing between team members",
            "Proper alignment maintained",
        ],
    },
];
