import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all 3 images are preserved
    {
        name: "count_shapes",
        description: "All 3 image shapes should be preserved",
        slideId: 257,
        filter: {
            shapeType: "image",
        },
        expected: 3,
    },

    // Images should be horizontally aligned (same Y coordinate)
    {
        name: "filtered_equality",
        description: "All 3 images should be horizontally aligned at the same Y coordinate",
        slideId: 257,
        filter: {
            shapeType: "image",
        },
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Images should have equal width
    {
        name: "filtered_equality",
        description: "All images should have equal width",
        slideId: 257,
        filter: {
            shapeType: "image",
        },
        key: "size.w",
        minMatchCount: 3,
    },

    // Images should have equal height
    {
        name: "filtered_equality",
        description: "All images should have equal height",
        slideId: 257,
        filter: {
            shapeType: "image",
        },
        key: "size.h",
        minMatchCount: 3,
    },

    // Images should be evenly spaced horizontally
    {
        name: "filtered_spacing",
        description: "Images should have equal horizontal spacing",
        slideId: 257,
        filter: {
            shapeType: "image",
        },
        direction: "horizontal",
        minMatchCount: 3,
    },

    // LLM Judge for semantic validation of positioning
    {
        name: "llm_judge",
        description: "LLM evaluation of image repositioning between headings and text",
        slideId: 257,
        autoGenerate: true,
        criteria:
            "Evaluate if the images have been repositioned to be between the section headings (Google Slides, PowerPoint, Canva) and their respective descriptive text below.",
        focusAreas: [
            "Each image is positioned below its corresponding heading (Google Slides, PowerPoint, Canva)",
            "Each image is positioned above its corresponding descriptive text",
            "Images maintain horizontal alignment with their respective content columns",
            "Visual hierarchy flows correctly: heading → image → text",
            "Professional appearance and balanced layout is maintained",
        ],
        expectedChanges: [
            "Images moved from below the text to between the headings and text",
            "Images vertically positioned between heading and description for each section",
            "Consistent vertical positioning across all three image placements",
        ],
    },
];
