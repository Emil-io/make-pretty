import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Verify the instruction textbox was deleted
    {
        name: "count_shapes",
        description: "Instruction textbox should be deleted (was shapeId 2)",
        slideId: 290,
        filter: { shapeType: "textbox", rawTextContains: "@AI" },
        expected: 0,
    },

    // Count verification - ensure key content textboxes still exist
    {
        name: "count_shapes",
        description: "There should be 3 header textboxes (GOOGLE SLIDES, POWERPOINT, CANVA)",
        slideId: 290,
        filter: { shapeType: "textbox", rawTextContains: "SLIDES" },
        expected: 1,
    },

    // Alignment tests for the 3 column headers
    {
        name: "filtered_equality",
        description: "Column headers should be horizontally aligned at same Y coordinate",
        slideId: 290,
        filters: [
            { shapeType: "textbox", rawText: "GOOGLE SLIDES" },
            { shapeType: "textbox", rawText: "POWERPOINT" },
            { shapeType: "textbox", rawText: "CANVA" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Verify bullet list textboxes are properly positioned
    {
        name: "filtered_equality",
        description: "Bullet list textboxes should be horizontally aligned at same Y coordinate",
        slideId: 290,
        filters: [
            { shapeType: "textbox", rawTextContains: "Click on the \"Google Slides\"" },
            { shapeType: "textbox", rawTextContains: "Click on the \"PowerPoint\"" },
            { shapeType: "textbox", rawTextContains: "Click on the \"Canva\"" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Size consistency for column headers
    {
        name: "filtered_equality",
        description: "Column headers should have equal height",
        slideId: 290,
        filters: [
            { shapeType: "textbox", rawText: "GOOGLE SLIDES" },
            { shapeType: "textbox", rawText: "POWERPOINT" },
            { shapeType: "textbox", rawText: "CANVA" },
        ],
        key: "size.h",
        minMatchCount: 3,
    },

    // Spacing tests for columns
    {
        name: "filtered_spacing",
        description: "Groups/boxes should have equal horizontal spacing",
        slideId: 290,
        filter: { shapeType: "group" },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary test - text should be within slide
    {
        name: "within_boundaries",
        description: "All shapes should respect slide boundaries",
        slideId: 290,
        minMargin: 0,
    },

    // LLM Judge for overall quality
    {
        name: "llm_judge",
        description: "LLM evaluation of text alignment fix",
        slideId: 290,
        autoGenerate: true,
        criteria: "Evaluate if the text alignment in the first column (Google Slides section) was properly fixed and the instruction textbox was deleted.",
        focusAreas: [
            "Text elements in the Google Slides column are properly aligned within their container",
            "The instruction textbox (@AI pls fix...) has been deleted",
            "Text alignment is consistent with the other columns (PowerPoint and Canva)",
            "Visual balance and professional appearance across all three columns",
        ],
        expectedChanges: [
            "Text in the Google Slides column aligned properly",
            "Instruction textbox deleted",
            "Consistent alignment across all columns",
        ],
    },
];
