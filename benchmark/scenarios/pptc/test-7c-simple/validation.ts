import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify original shapes exist
    {
        name: "count_shapes",
        description: "Should have 2 images",
        slideId: 279,
        filter: { shapeType: "image" },
        expected: 2,
    },

    // Alignment tests - textboxes should be aligned with top of images
    // Images have topLeft Y = 471.8, textboxes should move to match
    {
        name: "filtered_equality",
        description: "Images should have same Y position (top-aligned horizontally)",
        slideId: 279,
        filter: { shapeType: "image" },
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Check that EXAMPLE textboxes are aligned with image tops
    {
        name: "filtered_equality",
        description: "EXAMPLE textboxes should be top-aligned with images",
        slideId: 279,
        filters: [
            { shapeType: "image" },
            { shapeType: "textbox", rawText: "EXAMPLE" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // Horizontal spacing - images should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Images should have consistent horizontal spacing",
        slideId: 279,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 2,
    },

    // LLM judge for overall quality
    {
        name: "llm_judge",
        description: "LLM evaluation of text height-alignment task",
        slideId: 279,
        autoGenerate: true,
        criteria: "Evaluate if text formatting was changed to be height-aligned with the top of the images.",
        focusAreas: [
            "Text top position matches the top of the images",
            "Both EXAMPLE titles are aligned with image tops",
            "Description text follows appropriate positioning below titles",
            "Overall layout maintains visual balance",
        ],
        expectedChanges: [
            "Textboxes moved up to align with image top edges",
            "Text top Y position matches image top Y position (~471.8px)",
        ],
    },
];
