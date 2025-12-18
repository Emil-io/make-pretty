import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count the three percentage textboxes
    {
        name: "count_shapes",
        description: "There should be 3 percentage textboxes (80%, 50%, 10%)",
        slideId: 272,
        filter: { shapeType: "textbox" },
        expected: 23, // Total textboxes
    },

    // Count groups (people icons and yellow boxes)
    {
        name: "count_shapes",
        description: "There should be multiple groups",
        slideId: 272,
        filter: { shapeType: "group" },
        expected: 17,
    },

    // Check X-coordinate alignment for the three percentages (IDs 51, 52, 53)
    {
        name: "all_are_equal",
        description: "The three percentages (80%, 50%, 10%) should be vertically aligned at same X coordinate",
        objects: [
            { slideId: 272, shapeId: 51, key: "pos.topLeft[0]" }, // "80%"
            { slideId: 272, shapeId: 52, key: "pos.topLeft[0]" }, // "50%"
            { slideId: 272, shapeId: 53, key: "pos.topLeft[0]" }, // "10%"
        ],
    },

    // LLM judge for alignment validation
    {
        name: "llm_judge",
        description: "LLM evaluation of percentage alignment with people icons and yellow boxes",
        slideId: 272,
        autoGenerate: true,
        criteria: "Evaluate if the 3 percentages (80%, 50%, 10%) are aligned in the middle of the people icons and if the back border aligns with the end of the yellow boxes.",
        focusAreas: [
            "The '80%' text is horizontally centered in the middle of its corresponding people icon",
            "The '50%' text is horizontally centered in the middle of its corresponding people icon",
            "The '10%' text is horizontally centered in the middle of its corresponding people icon",
            "All three percentages are vertically positioned appropriately relative to their people icons",
            "The back border of the percentage boxes aligns with the right edge of the yellow boxes",
            "Visual balance and professional appearance of the percentage placements",
            "Consistent alignment pattern across all three percentage-icon pairs"
        ],
        expectedChanges: [
            "Percentage texts repositioned to center horizontally within people icons",
            "Back borders of percentage boxes aligned with yellow box edges",
            "Improved visual integration between percentages and icons",
            "Consistent alignment across all three sections"
        ],
    },
];
