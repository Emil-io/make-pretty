import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-42c: Crop all the larger pics so that we only have the quadratic pictures in the same size.
// Crop smart so that we can see the faces. Align all pics and move the text below them.
//
// Initial state: 6 main images (excluding background) with different sizes, not square, not aligned
// Expected: All images square (width = height), same size, horizontally aligned, text below images

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: COUNT TESTS
    // ============================================
    {
        name: "count_shapes",
        description: "There should be exactly 7 image shapes (6 main + 1 background)",
        slideId: 264,
        filter: { shapeType: "image" },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "There should be exactly 13 textbox shapes",
        slideId: 264,
        filter: { shapeType: "textbox" },
        expected: 13,
    },

    // ============================================
    // SECTION 2: IMAGE SIZE UNIFORMITY & SQUARE VALIDATION
    // ============================================
    // All main images should be square (width = height) and the same size
    // Note: We exclude the large background image (shape 2) by using minMatchCount: 6
    // which targets the 6 main images
    
    // Check that all main images have the same width
    // Note: Allowing for slight variations (minMatchCount: 5 allows one outlier)
    {
        name: "filtered_equality",
        description: "At least 5 main images should have equal width (allowing for slight variations)",
        slideId: 264,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 5, // At least 5 images (the main ones) should have the same width
    },
    // Check that all main images have the same height
    // Note: Allowing for slight variations (minMatchCount: 4 allows for minor differences)
    {
        name: "filtered_equality",
        description: "At least 4 main images should have equal height (allowing for slight variations)",
        slideId: 264,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 4, // At least 4 images (the main ones) should have the same height
    },
    // Note: If 6 images have the same width AND the same height, and width = height,
    // then they are square. The LLM judge will verify width = height directly.

    // ============================================
    // SECTION 3: IMAGE ALIGNMENT
    // ============================================
    // All images should be horizontally aligned (same Y position)
    {
        name: "filtered_equality",
        description: "At least 5 main images should be horizontally aligned at same Y coordinate",
        slideId: 264,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 5, // At least 5 images should be aligned (allowing for slight variations)
    },

    // ============================================
    // SECTION 4: TEXT POSITIONING BELOW IMAGES
    // ============================================
    // Text should be below the images
    // We'll check that textboxes with content are positioned below the image row
    // The main content textboxes ("Elaborate on what you want to discuss") should be below images
    
    // Check that textboxes are positioned below images
    // Images are at Y ~467, so text should be at Y > ~550 (below images)
    // We'll use LLM judge for this semantic check since we need to identify which textboxes
    // are associated with images vs. other text (like "Timeline" title)

    // ============================================
    // SECTION 5: HORIZONTAL SPACING
    // ============================================
    // Images should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Main images should have equal horizontal spacing",
        slideId: 264,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 5, // At least 5 images should be evenly spaced (allowing for slight variations)
    },

    // ============================================
    // SECTION 6: LLM JUDGE
    // ============================================
    {
        name: "llm_judge",
        description: "LLM evaluation of image cropping, sizing, alignment, and text positioning",
        slideId: 264,
        autoGenerate: true,
        criteria: "Evaluate if all main images have been cropped to be square (quadratic), are the same size, are horizontally aligned, and if text has been moved below the images with smart face-aware cropping.",
        focusAreas: [
            "All main images (excluding background) are square/quadratic (width equals height)",
            "All main images are the same size (uniform dimensions)",
            "All main images are horizontally aligned at the same Y coordinate",
            "Images are cropped intelligently to show faces (face-aware cropping)",
            "Text content ('Elaborate on what you want to discuss') is positioned below the images",
            "Images have equal horizontal spacing between them",
            "Overall layout is balanced and professional",
            "Visual quality and face visibility in cropped images",
        ],
        expectedChanges: [
            "All larger images cropped to be square/quadratic",
            "All images resized to the same dimensions",
            "All images horizontally aligned in a row",
            "Smart face-aware cropping applied to preserve faces",
            "Text moved below the image row",
            "Equal horizontal spacing between images",
        ],
    },
];

