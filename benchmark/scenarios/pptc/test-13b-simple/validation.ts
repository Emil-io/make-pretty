import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Alignment: The 3 groups (boxes) should be horizontally aligned (same Y)
    // Groups 512 and 515 are at Y ~449, group 509 should be aligned with them
    {
        name: "filtered_equality",
        description: "All 3 box groups should be horizontally aligned at the same Y coordinate",
        slideId: 291,
        filter: { shapeType: "group" },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // The category labels (Titles, Headers, Body Copy) should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Category labels should be horizontally aligned",
        slideId: 291,
        filters: [
            { shapeType: "textbox", rawText: "Titles" },
            { shapeType: "textbox", rawText: "Headers" },
            { shapeType: "textbox", rawText: "Body Copy" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // The font name labels (Caveat, Inter) should be on one line each
    // Caveat textbox 526 should have small height (single line)
    // Caveat textbox 527 (overflow issue) should have small height after fix
    // Inter textbox 528 should have small height
    {
        name: "filtered_equality",
        description: "Font name labels should have equal height (single line each)",
        slideId: 291,
        filters: [
            { shapeType: "textbox", rawText: "Caveat" },
            { shapeType: "textbox", rawText: "Inter" },
        ],
        key: "size.h",
        minMatchCount: 3,
    },

    // Bottom text (ID 522) should be centered horizontally on slide
    // Slide center X is 960 (1920/2), so text center should be near 960
    {
        name: "greater_than",
        description: "Bottom text center X should be greater than 900px (near slide center)",
        slideId: 291,
        shapeId: 522,
        key: "pos.center[0]",
        expected: 900,
    },
    {
        name: "less_than",
        description: "Bottom text center X should be less than 1020px (near slide center)",
        slideId: 291,
        shapeId: 522,
        key: "pos.center[0]",
        expected: 1020,
    },

    // The purple rectangles inside groups should be aligned
    {
        name: "filtered_equality",
        description: "Purple rectangles should have equal height",
        slideId: 291,
        filter: { fillColor: "#D8BDE7" },
        key: "size.h",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of layout fixes",
        slideId: 291,
        autoGenerate: true,
        criteria: "Evaluate if the slide fixes were applied correctly: left box aligned, text overflow fixed, and bottom text centered.",
        focusAreas: [
            "The leftmost box (with 'Titles' label) is horizontally aligned with the other two boxes",
            "The 'Caveat' and 'Inter' font labels are each on a single line without overflow",
            "The bottom text 'You can find these fonts online too.' is horizontally centered on the slide",
            "All three boxes maintain consistent spacing and visual balance",
            "Overall design maintains professional appearance",
        ],
        expectedChanges: [
            "Left box repositioned to align horizontally with other boxes",
            "Text boxes widened or font adjusted to fit Caveat and Inter on single lines",
            "Bottom text centered horizontally on the slide",
        ],
    },
];
