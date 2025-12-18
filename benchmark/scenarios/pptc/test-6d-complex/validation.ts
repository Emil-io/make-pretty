import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 4 columns exist after adding new one
    {
        name: "count_shapes",
        description: "There should be 4 images after adding the beach column",
        slideId: 284,
        filter: { shapeType: "image" },
        expected: 4,
    },

    // Horizontal alignment - all images in same row
    {
        name: "filtered_equality",
        description: "All 4 images should be horizontally aligned at same Y coordinate",
        slideId: 284,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Equal sizing - images should have similar dimensions
    {
        name: "filtered_equality",
        description: "All 4 images should have equal width",
        slideId: 284,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 4,
    },

    {
        name: "filtered_equality",
        description: "All 4 images should have equal height",
        slideId: 284,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 4,
    },

    // Horizontal spacing between images
    {
        name: "filtered_spacing",
        description: "The 4 images should have equal horizontal spacing",
        slideId: 284,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Boundary check - shapes should stay within slide margins
    {
        name: "within_boundaries",
        description: "All shapes should respect slide margins",
        slideId: 284,
        minMargin: 10,
    },

    // LLM judge for semantic validation
    {
        name: "llm_judge",
        description: "Evaluate fourth column addition and layout rescaling",
        slideId: 284,
        autoGenerate: true,
        criteria: "Evaluate if a fourth column with 90% value and beach icon was added and other columns were rescaled properly.",
        focusAreas: [
            "A fourth column has been added to the right with a 90% percentage value",
            "The fourth column contains a beach-themed image/icon similar in style to other icons",
            "All four columns are evenly spaced and fit within the slide",
            "The existing columns were rescaled to accommodate the new column",
            "Visual consistency and professional appearance is maintained",
        ],
        expectedChanges: [
            "New fourth column added to the right with 90% value",
            "Beach-themed icon added to the fourth column",
            "Existing columns rescaled to fit 4 columns in the layout",
            "Even horizontal spacing between all columns",
        ],
    },
];
