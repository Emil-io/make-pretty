import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 5 images total (1 header + 4 circular team images)
    {
        name: "count_shapes",
        description: "There should be 5 image shapes (1 header + 4 team members)",
        slideId: 293,
        filter: { shapeType: "image" },
        expected: 5,
    },

    // Team member images should be horizontally aligned (same Y) - at least 4 images at same Y
    {
        name: "filtered_equality",
        description: "Team member images should be horizontally aligned (same row)",
        slideId: 293,
        filter: { shapeType: "image" },
        key: "pos.center[1]",
        minMatchCount: 4,
    },

    // Images should have equal spacing horizontally
    {
        name: "filtered_spacing",
        description: "Team member images should have equal horizontal spacing",
        slideId: 293,
        filter: { shapeType: "image" },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Images should have equal size (at least 4 with same dimensions)
    {
        name: "filtered_equality",
        description: "Team member images should have equal width",
        slideId: 293,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 4,
    },
    {
        name: "filtered_equality",
        description: "Team member images should have equal height",
        slideId: 293,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 4,
    },

    // Name textboxes should be horizontally aligned (4 "Name" texts)
    {
        name: "filtered_equality",
        description: "Name labels should be horizontally aligned",
        slideId: 293,
        filter: { shapeType: "textbox", rawTextContains: "Name" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Name textboxes should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Name labels should have equal horizontal spacing",
        slideId: 293,
        filter: { shapeType: "textbox", rawTextContains: "Name" },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // Title/Position textboxes should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Title labels should be horizontally aligned",
        slideId: 293,
        filter: { shapeType: "textbox", rawTextContains: "Title" },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Title textboxes should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Title labels should have equal horizontal spacing",
        slideId: 293,
        filter: { shapeType: "textbox", rawTextContains: "Title" },
        direction: "horizontal",
        minMatchCount: 4,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of team members page layout",
        slideId: 293,
        autoGenerate: true,
        criteria: "Evaluate if the 3 images were correctly added as new columns with copied Name/Title texts and proper spacing.",
        focusAreas: [
            "4 team member images arranged in a horizontal row",
            "Each image has a Name label below it",
            "Each image has a Title/Position label below the Name",
            "Horizontal spacing between images is equal",
            "Labels are aligned and properly spaced under each image",
        ],
        expectedChanges: [
            "3 new circular images added as columns to the right",
            "Name and Title texts duplicated under each new image",
            "Equal horizontal spacing between all 4 columns",
        ],
    },
];
