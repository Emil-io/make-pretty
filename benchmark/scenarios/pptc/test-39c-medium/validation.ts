import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count percentage textboxes (3 percentages: 61%, 29%, 70%)
    {
        name: "count_shapes",
        description: "There should be 3 percentage textboxes",
        slideId: 268,
        filter: { shapeType: "textbox" },
        expected: 13, // Total textboxes
    },

    // Count groups containing the half-pie-charts
    {
        name: "count_shapes",
        description: "There should be 3 main groups with pie charts",
        slideId: 268,
        filter: { shapeType: "group" },
        expected: 8, // Total groups
    },

    // LLM judge for percentage centering validation
    {
        name: "llm_judge",
        description: "LLM evaluation of percentage centering in half-pie-charts",
        slideId: 268,
        autoGenerate: true,
        criteria: "Evaluate if the percentage values (61%, 29%, 70%) are centered in the middle of their respective half-pie-charts.",
        focusAreas: [
            "The 61% text is centered horizontally in the first (left) half-pie-chart",
            "The 29% text is centered horizontally in the second (middle) half-pie-chart",
            "The 70% text is centered horizontally in the third (right) half-pie-chart",
            "All percentages are vertically positioned appropriately within their half-pie-charts",
            "Visual balance and professional appearance of the percentage placements"
        ],
        expectedChanges: [
            "Percentage textboxes repositioned to center horizontally within their half-pie-charts",
            "Improved visual alignment and centering",
            "Better integration of text with chart graphics"
        ],
    },
];
