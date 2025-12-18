import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-48c: Pls delete movie 3 & 9, move the remaining together/align them and adjust the counts inside the descriptions.
//
// Initial state: There are 10 movies (Movie 01-10), including Movie 3 and Movie 9
// Expected:
// 1. Movie 3 and Movie 9 should be deleted (no longer present)
// 2. Remaining movies (1, 2, 4, 5, 6, 7, 8, 10) should be aligned together
// 3. Counts in descriptions should be adjusted (if there are descriptions mentioning the total count)
//
// Structure:
// - Movies: Images and groups with labels "Movie XX"
// - Movie 3: Shape 718 (label), associated image/group
// - Movie 9: Shape 748 (label), associated image/group
// - Remaining movies: 1, 2, 4, 5, 6, 7, 8, 10

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: DELETION TESTS
    // ============================================
    // Test that there are exactly 8 movie labels (Movie 3 and 9 should be deleted)
    {
        name: "count_shapes",
        description: "There should be exactly 8 movie labels remaining (after deleting Movie 3 and Movie 9)",
        slideId: 269,
        filter: { rawTextContains: "Movie 0" }, // Matches "Movie 01", "Movie 02", etc.
        expected: 8,
    },
    // Test that Movie 3 and Movie 9 are deleted
    // After deletion and renaming: "Movie 03" will still exist (old label), but "Movie 09" and "Movie 10" will be missing
    {
        name: "count_shapes",
        description: "There should be 0 shapes with 'Movie 09' text (Movie 9 should be deleted, so Movie 09 label should be missing)",
        slideId: 269,
        filter: { rawTextContains: "Movie 09" },
        expected: 0,
    },
    {
        name: "count_shapes",
        description: "There should be 0 shapes with 'Movie 10' text (After deleting Movie 9, Movie 10 should also be missing after renaming)",
        slideId: 269,
        filter: { rawTextContains: "Movie 10" },
        expected: 0,
    },

    // ============================================
    // SECTION 2: ALIGNMENT TESTS
    // ============================================
    // Test that remaining movies are aligned together
    // Top row movies (01, 02, 04, 05) should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Top row movie images should be horizontally aligned (same Y coordinate)",
        slideId: 269,
        filter: { 
            shapeType: "image",
            // Filter for top row images (Y around 217)
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4, // At least 4 images in top row
    },
    {
        name: "filtered_equality",
        description: "Bottom row movie images should be horizontally aligned (same Y coordinate)",
        slideId: 269,
        filter: { 
            shapeType: "image",
            // Filter for bottom row images (Y around 734)
        },
        key: "pos.topLeft[1]",
        minMatchCount: 4, // At least 4 images in bottom row
    },

    // ============================================
    // SECTION 3: SPACING TESTS
    // ============================================
    // Note: filtered_spacing finds all images (both rows), and the algorithm can mix rows when finding equally-spaced groups.
    // Since we can't filter by Y position, we rely on the algorithm finding 4 equally-spaced images in a row.
    // If the slide is well-distributed, the algorithm should find a group of 4 images that are equally spaced.
    {
        name: "filtered_spacing",
        description: "Top row movie images should have equal spacing between them (at least 4 equally-spaced images)",
        slideId: 269,
        filter: { 
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 4,
        groupByPerpendicularPosition: true, // Group by Y position (same row) before checking spacing
    },
    {
        name: "filtered_spacing",
        description: "Bottom row movie images should have equal spacing between them (at least 4 equally-spaced images)",
        slideId: 269,
        filter: { 
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 4,
        groupByPerpendicularPosition: true, // Group by Y position (same row) before checking spacing
    },

    // ============================================
    // SECTION 4: LLM JUDGE
    // ============================================
    // Use LLM judge to verify:
    // - Movie 3 and Movie 9 are deleted
    // - Remaining movies are aligned together
    // - Counts in descriptions are adjusted (if descriptions exist)
    {
        name: "llm_judge",
        description: "LLM evaluation of movie deletion, alignment, and count adjustment",
        slideId: 269,
        autoGenerate: true,
        criteria: "Evaluate if Movie 3 and Movie 9 have been deleted (textboxes with 'Movie 09' and 'Movie 10' should not exist, after Movie 3 and 9 were deletded and the remaining were renamed accordingly.) Verify that the remaining 8 movies (Movie 01, 02, 04, 05, 06, 07, 08, 10) are aligned together in a grid layout with equal spacing. Check if there are any descriptions or text that mention counts (like '10 movies' or similar) and verify that these counts have been adjusted to reflect the new total of 8 movies.",
        focusAreas: [
            "Movie 3 (label shape 718) has been deleted",
            "Movie 9 (label shape 748) has been deleted",
            "Remaining 8 movies are present and aligned",
            "Movies are arranged in a grid with horizontal alignment in rows",
            "Movies have equal spacing between them",
            "Any descriptions mentioning counts have been adjusted from 10 to 8 movies",
            "Overall visual organization and alignment of remaining movies",
        ],
        expectedChanges: [
            "Movie 3 and Movie 9 are deleted",
            "Remaining movies are aligned together in a grid",
            "Counts in descriptions are adjusted from 10 to 8 movies",
            "Improved visual organization of remaining movies",
        ],
    },
];
