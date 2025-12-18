import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify key shapes are preserved
    {
        name: "count_shapes",
        description: "There should be 1 image shape",
        slideId: 259,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be 3 numbered labels (1., 2., 3.)",
        slideId: 259,
        filter: { shapeType: "textbox", rawTextContains: "." },
        expected: 4, // includes the "3." in the group
    },

    // Numbers should be vertically aligned (same X coordinate)
    {
        name: "filtered_equality",
        description: "Number labels (1., 2., 3.) should be vertically aligned",
        slideId: 259,
        filters: [
            { shapeType: "textbox", rawText: "1." },
            { shapeType: "textbox", rawText: "2." },
            { shapeType: "textbox", rawText: "3." },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Instruction textboxes should be vertically aligned (same X coordinate)
    {
        name: "filtered_equality",
        description: "Instruction textboxes should be vertically aligned",
        slideId: 259,
        filters: [
            { shapeType: "textbox", rawTextContains: "Click on the \"Canva\"" },
            { shapeType: "textbox", rawTextContains: "Click on the \"Share\"" },
            { shapeType: "textbox", rawTextContains: "Enter \"Google Drive\"" },
        ],
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Instruction textboxes should have equal vertical spacing
    {
        name: "filtered_spacing",
        description: "Instruction textboxes should have equal vertical spacing",
        slideId: 259,
        filter: { shapeType: "textbox", rawTextContains: "Click on" },
        direction: "vertical",
        minMatchCount: 2,
    },

    // Each number should be horizontally aligned with its instruction
    {
        name: "filtered_equality",
        description: "Number 1. and its instruction should be horizontally aligned",
        slideId: 259,
        filters: [
            { shapeType: "textbox", rawText: "1." },
            { shapeType: "textbox", rawTextContains: "Click on the \"Canva\"" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "Number 2. and its instruction should be horizontally aligned",
        slideId: 259,
        filters: [
            { shapeType: "textbox", rawText: "2." },
            { shapeType: "textbox", rawTextContains: "Click on the \"Share\"" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },
    {
        name: "filtered_equality",
        description: "Number 3. and its instruction should be horizontally aligned",
        slideId: 259,
        filters: [
            { shapeType: "textbox", rawText: "3." },
            { shapeType: "textbox", rawTextContains: "Enter \"Google Drive\"" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 2,
    },

    // LLM judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of layout and cropping",
        slideId: 259,
        autoGenerate: true,
        criteria: "Evaluate if the image was cropped to give text on the right half the slide space, and if the numbers and text are rearranged nicely.",
        focusAreas: [
            "The image on the left is cropped to take up roughly half the slide width",
            "Text content on the right has approximately half the slide space",
            "Numbers (1., 2., 3.) are properly aligned vertically",
            "Each number is horizontally aligned with its corresponding instruction text",
            "Equal spacing between the three instruction steps",
            "Overall layout is balanced and visually appealing",
        ],
        expectedChanges: [
            "Image cropped to approximately half the slide width",
            "Right side content occupies roughly half the slide",
            "Numbers and text rearranged with consistent alignment and spacing",
        ],
    },
];
