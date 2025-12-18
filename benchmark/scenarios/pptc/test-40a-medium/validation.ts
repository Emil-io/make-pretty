import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count the three numbered circle textboxes
    {
        name: "count_shapes",
        description: "There should be 3 numbered circle textboxes (01, 02, 03)",
        slideId: 258,
        filter: { shapeType: "textbox" },
        expected: 22, // Total textboxes
    },

    // Count groups (circles and bullet sections)
    {
        name: "count_shapes",
        description: "There should be multiple groups",
        slideId: 258,
        filter: { shapeType: "group" },
        expected: 11,
    },

    // Check horizontal alignment (X-coordinate) between circle "01" text and "ABOUT US" section
    {
        name: "all_are_equal",
        description: "Circle '01' text should be horizontally aligned with the 'ABOUT US' section",
        objects: [
            { slideId: 258, shapeId: 221, key: "pos.center[0]" }, // "01" text
            { slideId: 258, shapeId: 232, key: "pos.center[0]" }, // "ABOUT US" group
        ],
    },

    // Check horizontal alignment (X-coordinate) between circle "02" text and "OUR PROJECTS" section
    {
        name: "all_are_equal",
        description: "Circle '02' text should be horizontally aligned with the 'OUR PROJECTS' section",
        objects: [
            { slideId: 258, shapeId: 224, key: "pos.center[0]" }, // "02" text
            { slideId: 258, shapeId: 235, key: "pos.center[0]" }, // "OUR PROJECTS" group
        ],
    },

    // Check horizontal alignment (X-coordinate) between circle "03" text and "STATS & NUMBERS" section
    {
        name: "all_are_equal",
        description: "Circle '03' text should be horizontally aligned with the 'STATS & NUMBERS' section",
        objects: [
            { slideId: 258, shapeId: 227, key: "pos.center[0]" }, // "03" text
            { slideId: 258, shapeId: 238, key: "pos.center[0]" }, // "STATS & NUMBERS" group
        ],
    },

    // Verify all three numbered circles are vertically aligned with each other
    {
        name: "all_are_equal",
        description: "All three numbered circles should be vertically aligned (same Y-center)",
        objects: [
            { slideId: 258, shapeId: 221, key: "pos.center[1]" }, // "01" text
            { slideId: 258, shapeId: 224, key: "pos.center[1]" }, // "02" text
            { slideId: 258, shapeId: 227, key: "pos.center[1]" }, // "03" text
        ],
    },

    // Verify text "01" is centered within its parent group (circle) - only one that's grouped
    {
        name: "all_are_equal",
        description: "Text '01' should be horizontally centered within its circle group",
        objects: [
            { slideId: 258, shapeId: 221, key: "pos.center[0]" }, // "01" text
            { slideId: 258, shapeId: 219, key: "pos.center[0]" }, // Parent group
        ],
    },

    {
        name: "all_are_equal",
        description: "Text '01' should be vertically centered within its circle group",
        objects: [
            { slideId: 258, shapeId: 221, key: "pos.center[1]" }, // "01" text
            { slideId: 258, shapeId: 219, key: "pos.center[1]" }, // Parent group
        ],
    },

    // LLM judge for overall alignment validation
    {
        name: "llm_judge",
        description: "LLM evaluation of circle and text alignment with bullet sections",
        slideId: 258,
        autoGenerate: true,
        criteria: "Evaluate if the 3 numbered circles (including the text 01, 02, 03 within them) are properly aligned with their corresponding bullet sections (ABOUT US, OUR PROJECTS, STATS & NUMBERS).",
        focusAreas: [
            "Circle containing '01' and its text are horizontally centered above or aligned with the 'ABOUT US' section",
            "Circle containing '02' and its text are horizontally centered above or aligned with the 'OUR PROJECTS' section",
            "Circle containing '03' and its text are horizontally centered above or aligned with the 'STATS & NUMBERS' section",
            "All three circles (with their text) maintain consistent vertical positioning relative to each other",
            "The text within each circle remains properly centered within the circle shape",
            "Visual balance and professional appearance of the alignment",
            "Clear visual connection between each numbered circle and its corresponding section"
        ],
        expectedChanges: [
            "Circles (including text) repositioned to align horizontally with their sections",
            "Circle '01' with text aligned with 'ABOUT US'",
            "Circle '02' with text aligned with 'OUR PROJECTS'",
            "Circle '03' with text aligned with 'STATS & NUMBERS'",
            "Text remains centered within each circle",
            "Improved visual hierarchy and organization"
        ],
    },
];
