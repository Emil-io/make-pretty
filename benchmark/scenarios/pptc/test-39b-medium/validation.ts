import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count flowchart boxes (groups with icons)
    {
        name: "count_shapes",
        description: "There should be 5 flowchart groups with icons",
        slideId: 266,
        filter: { shapeType: "group" },
        expected: 8, // Total groups
    },

    // Count images (icons)
    {
        name: "count_shapes",
        description: "There should be 5 icon images in the flowchart",
        slideId: 266,
        filter: { shapeType: "image" },
        expected: 5,
    },

    // Step labels should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Step labels (Step 1-5) should remain horizontally aligned",
        slideId: 266,
        key: "pos.topLeft[1]",
        minMatchCount: 5,
    },

    // Step labels should have equal horizontal spacing
    {
        name: "filtered_spacing",
        description: "Step labels should have equal horizontal spacing",
        slideId: 266,
        direction: "horizontal",
        minMatchCount: 5,
    },

    // Equal width for step labels
    {
        name: "filtered_equality",
        description: "Step labels should have equal width",
        slideId: 266,
        key: "size.w",
        minMatchCount: 5,
    },

    // LLM judge for alignment validation
    {
        name: "llm_judge",
        description: "LLM evaluation of flowchart alignment with even spacing",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the flowchart boxes are aligned with even spacing that matches the text labels (Step 1-5).",
        focusAreas: [
            "The 5 flowchart boxes with icons are aligned with their respective step labels",
            "Even horizontal spacing between all flowchart boxes",
            "Flowchart boxes are centered horizontally relative to their step labels",
            "Visual balance and consistent spacing throughout the entire flowchart",
            "Professional appearance with symmetric layout"
        ],
        expectedChanges: [
            "Flowchart boxes repositioned to align with step labels",
            "Equal spacing between all boxes",
            "Boxes centered under their labels"
        ],
    },
];
