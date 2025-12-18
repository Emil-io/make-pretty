import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests
    {
        name: "count_shapes",
        description: "There should be exactly 4 boxes after adding the takeaway box",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 4,
    },
    {
        name: "count_shapes",
        description: "There should still be exactly 3 circles (unchanged)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        expected: 3,
    },

    // Left 3 boxes - size equality tests (they should all have same width/height after resize)
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal width (the left 3 boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "At least 3 boxes should have equal height (the left 3 boxes)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Circle size equality (unchanged)
    {
        name: "filtered_equality",
        description: "All 3 circles should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All 3 circles should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Corner radius equality for all boxes
    {
        name: "filtered_equality",
        description: "All 4 boxes should have equal corner radius (same layout)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "details.cornerRadius",
        minMatchCount: 4,
    },

    // Vertical spacing for left 3 boxes
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal vertical spacing (left column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "vertical",
        minMatchCount: 3,
    },

    // Vertical spacing for circles
    {
        name: "filtered_spacing",
        description: "All 3 circles should have equal vertical spacing",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        direction: "vertical",
        minMatchCount: 3,
    },

    // Vertical alignment for circles
    {
        name: "filtered_equality",
        description: "All 3 circles should be vertically aligned (same X coordinate)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Vertical alignment for left 3 boxes
    {
        name: "filtered_equality",
        description: "At least 3 boxes should be vertically aligned (same X coordinate, left column)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 3,
    },

    // Verify 4th box is different (positioned to the right)
    {
        name: "filtered_equality",
        description: "Only 3 boxes share same X position (4th box is to the right)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "pos.topLeft[0]",
        minMatchCount: 3, // Only 3 boxes should share the same X (left column), not all 4
    },

    // Verify 4th box has different height (should be taller, spanning 3 rows)
    {
        name: "filtered_equality",
        description: "Only 3 boxes share same height (4th box is taller)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 3, // Only 3 boxes should share the same height, not all 4
    },

    // Boundary test
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of takeaway box addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if a 'takeaway' box has been added to the right side of the slide, the length of existing boxes has been adjusted accordingly, and it has the same layout as the existing boxes.",
        focusAreas: [
            "Takeaway box added to the right side",
            "Existing boxes have been resized to accommodate the new box",
            "Takeaway box matches the layout style of existing boxes",
            "Proper alignment and spacing",
            "Visual balance of the layout",
        ],
        expectedChanges: [
            "Takeaway box added on right",
            "Existing boxes resized",
            "Consistent layout maintained",
        ],
    },
];
