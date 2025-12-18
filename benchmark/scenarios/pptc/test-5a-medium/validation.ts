import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide 293: Timeline with 12 months (JAN-DEC) as homePlate autoShapes
// Task: Remove November and December, realign remaining 10 months to fit the space
// Also move text comments and connecting lines with them

export const Test: TChangesetTestProtocol = [
    // Count tests - verify NOV and DEC removed
    {
        name: "count_shapes",
        description: "Should have 10 month shapes after removing NOV and DEC (was 12)",
        slideId: 293,
        filter: { shapeType: "autoShape" },
        expected: 11, // 10 months + 1 header shape (id 441)
    },

    // Horizontal alignment - all month shapes should remain aligned in a row
    {
        name: "filtered_equality",
        description: "All month shapes should be horizontally aligned (same Y coordinate)",
        slideId: 293,
        filter: { shapeType: "autoShape" },
        key: "pos.topLeft[1]",
        minMatchCount: 10,
    },

    // Equal height - month shapes should have consistent height
    {
        name: "filtered_equality",
        description: "Month shapes should have equal height",
        slideId: 293,
        filter: { shapeType: "autoShape" },
        key: "size.h",
        minMatchCount: 10,
    },

    // Horizontal spacing - months should be evenly spaced after realignment
    {
        name: "filtered_spacing",
        description: "Month shapes should have equal horizontal spacing after realignment",
        slideId: 293,
        filter: { shapeType: "autoShape" },
        direction: "horizontal",
        minMatchCount: 10,
    },

    // Lines alignment - top row of lines (above timeline) should be vertically aligned
    {
        name: "filtered_equality",
        description: "Top lines should have same Y start position",
        slideId: 293,
        filter: { shapeType: "line" },
        key: "startPos[1]",
        minMatchCount: 5,
    },

    // Textboxes - top row should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Top textboxes should be horizontally aligned",
        slideId: 293,
        filter: { shapeType: "textbox" },
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Equal textbox sizes
    {
        name: "filtered_equality",
        description: "Textboxes should have equal height",
        slideId: 293,
        filter: { shapeType: "textbox" },
        key: "size.h",
        minMatchCount: 10,
    },

    // Slide fill distribution - shapes should fill slide width after realignment
    {
        name: "slide_fill_distribution",
        description: "Month shapes should fill at least 80% of slide width after realignment",
        slideId: 293,
        filter: { shapeType: "autoShape" },
        minFillPercentage: 80,
    },

    // Boundary check
    {
        name: "within_boundaries",
        description: "All shapes should remain within slide boundaries",
        slideId: 293,
        minMargin: 0,
    },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline modification",
        slideId: 293,
        autoGenerate: true,
        criteria: "Evaluate if November and December were removed and the remaining months realigned to fit the space, with their associated text comments and connecting lines moved appropriately.",
        focusAreas: [
            "November (NOV) and December (DEC) month shapes are removed",
            "Remaining 10 months (JAN-OCT) are evenly distributed across the timeline",
            "Text comments associated with NOV and DEC are removed",
            "Connecting lines for NOV and DEC are removed",
            "Remaining text comments and lines are properly aligned with their months",
            "Timeline fills the available horizontal space appropriately",
        ],
        expectedChanges: [
            "NOV and DEC month shapes deleted",
            "Associated text comments and lines for NOV/DEC removed",
            "Remaining months repositioned to fill the space evenly",
            "Text comments and lines realigned with their respective months",
        ],
    },
];
