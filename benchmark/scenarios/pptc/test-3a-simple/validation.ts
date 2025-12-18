import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shape counts remain intact
    {
        name: "count_shapes",
        description: "There should be 3 heading textboxes",
        slideId: 257,
        filter: {
            shapeType: "textbox",
        },
        expected: 8, // 3 headings + 3 body texts + 1 title + 1 empty
    },

    {
        name: "count_shapes",
        description: "There should be 3 icon rectangles",
        slideId: 257,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
        expected: 6, // 3 icons + 3 black rectangles
    },

    // Icons should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "The 3 icons should be horizontally aligned at the same Y coordinate",
        slideId: 257,
        filter: {
            shapeType: "autoShape",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Headings should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "The 3 headings should be horizontally aligned at same Y coordinate",
        slideId: 257,
        filters: [
            { shapeType: "textbox", rawText: "Google Slides" },
            { shapeType: "textbox", rawText: "PowerPoint" },
            { shapeType: "textbox", rawText: "Canva" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Column 1: Icon 105 should be above heading "Google Slides" (112)
    {
        name: "less_than",
        description: "Column 1: Icon should be above 'Google Slides' heading (lower Y value)",
        slideId: 257,
        shapeId: 105,
        key: "pos.topLeft[1]",
        expected: 356, // Heading Y position
    },

    // Column 2: Icon 106 should be above heading "PowerPoint" (114)
    {
        name: "less_than",
        description: "Column 2: Icon should be above 'PowerPoint' heading (lower Y value)",
        slideId: 257,
        shapeId: 106,
        key: "pos.topLeft[1]",
        expected: 356, // Heading Y position
    },

    // Column 3: Icon 110 should be above heading "Canva" (116)
    {
        name: "less_than",
        description: "Column 3: Icon should be above 'Canva' heading (lower Y value)",
        slideId: 257,
        shapeId: 110,
        key: "pos.topLeft[1]",
        expected: 356, // Heading Y position
    },

    // Column alignment: Icon center X should match heading center X for each column
    {
        name: "all_are_equal",
        description: "Column 1: Icon and heading should be horizontally centered together",
        objects: [
            { slideId: 257, shapeId: 105, key: "pos.center[0]" },
            { slideId: 257, shapeId: 112, key: "pos.center[0]" },
        ],
    },

    {
        name: "all_are_equal",
        description: "Column 2: Icon and heading should be horizontally centered together",
        objects: [
            { slideId: 257, shapeId: 106, key: "pos.center[0]" },
            { slideId: 257, shapeId: 114, key: "pos.center[0]" },
        ],
    },

    {
        name: "all_are_equal",
        description: "Column 3: Icon and heading should be horizontally centered together",
        objects: [
            { slideId: 257, shapeId: 110, key: "pos.center[0]" },
            { slideId: 257, shapeId: 116, key: "pos.center[0]" },
        ],
    },

    // LLM Judge for semantic evaluation
    {
        name: "llm_judge",
        description: "LLM evaluation of icon repositioning above headings",
        slideId: 257,
        autoGenerate: true,
        criteria:
            "Evaluate if icons have been correctly repositioned to be above their respective headings in each of the three columns.",
        focusAreas: [
            "Icons are positioned above their corresponding headings in all three columns",
            "Icons remain horizontally centered with their column headings",
            "Visual hierarchy shows icons on top, headings below",
            "Layout maintains consistent spacing and professional appearance",
        ],
        expectedChanges: [
            "Icons moved from below headings to above headings in each column",
            "Icons remain horizontally aligned with column centers",
        ],
    },
];
