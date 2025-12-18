import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count test
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes (roundRect shapes) after adding the 4th",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },

    // Top 3 boxes - size equality tests (at least 3 boxes should have equal width)
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width (the top 3 boxes)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal height (the top 3 boxes)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Top 3 boxes - alignment test
    {
        name: "filtered_equality",
        description: "At least 3 boxes should be horizontally aligned (same Y coordinate)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Corner radius equality for all boxes
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal corner radius",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 4,
    },

    // Spacing test for top 3 boxes
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal horizontal spacing (top row)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 268,
        minMargin: 10,
    },

    // Tests for verifying the 4th box exists and is different from the top 3
    // We check that NOT all boxes have the same Y coordinate (the 4th box should be below)
    {
        name: "filtered_equality",
        description: "Not all 4 boxes should be at same Y position (4th box is below the top 3)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3, // Only 3 boxes should share the same Y (top row), not all 4
    },

    // Check that at least one box (the 4th) has a different width than the top 3
    // (it should be wider, spanning the full width)
    {
        name: "filtered_equality",
        description: "The top 3 boxes share the same width (4th box should be wider)",
        slideId: 268,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3, // Only 3 boxes should share the same width, not all 4
    },

    {
        name: "llm_judge",
        description: "LLM evaluation of fourth box addition with styling",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if a fourth horizontal box has been added underneath with a takeaway summary, has black filling with red borders and white text, and everything is aligned accordingly.",
        focusAreas: [
            "Fourth box has been added underneath the three boxes",
            "Fourth box contains a takeaway summary text",
            "Fourth box has black fill color",
            "Fourth box has red borders",
            "Fourth box has white text color",
            "All boxes are properly aligned",
            "Summary box spans appropriate width",
        ],
        expectedChanges: [
            "Fourth summary box added",
            "Black fill, red border, white text styling",
            "Proper alignment of all boxes",
        ],
    },
];
