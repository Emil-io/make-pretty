import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count main textboxes (statistics and descriptions)
    {
        name: "count_shapes",
        description: "There should be 9 textboxes total",
        slideId: 271,
        filter: { shapeType: "textbox" },
        expected: 9,
    },

    // Count groups (colored boxes)
    {
        name: "count_shapes",
        description: "There should be 6 groups containing the colored boxes",
        slideId: 271,
        filter: { shapeType: "group" },
        expected: 6,
    },

    // Verify "2 out of 5" text is on the left (X < 640)
    {
        name: "includes",
        description: "'2 out of 5' textbox should be positioned on the left side",
        slideId: 271,
        shapeId: 17,
        key: "pos.topLeft[0]",
        expected: (x: number) => x < 640, // Left third of slide (1920/3 = 640)
    },

    // Verify "12 million" text is on the right (X > 1280)
    {
        name: "includes",
        description: "'12 million' textbox should be positioned on the right side",
        slideId: 271,
        shapeId: 19,
        key: "pos.topLeft[0]",
        expected: (x: number) => x > 1280, // Right third of slide (2*1920/3 = 1280)
    },

    // Verify "95%" remains centered or appropriately positioned
    {
        name: "includes",
        description: "'95%' textbox should be in the center area",
        slideId: 271,
        shapeId: 21,
        key: "pos.center[0]",
        expected: (x: number) => x > 640 && x < 1280, // Middle third of slide
    },

    // Check Y-coordinate alignment for the three large statistic texts (IDs 17, 21, 19)
    {
        name: "all_are_equal",
        description: "The three main statistics ('2 out of 5', '95%', '12 million') should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 271, shapeId: 17, key: "pos.topLeft[1]" }, // "2 out of 5"
            { slideId: 271, shapeId: 21, key: "pos.topLeft[1]" }, // "95%"
            { slideId: 271, shapeId: 19, key: "pos.topLeft[1]" }, // "12 million"
        ],
    },

    // Check Y-coordinate alignment for the three description texts (IDs 16, 20, 18)
    {
        name: "all_are_equal",
        description: "The three description texts should be horizontally aligned at same Y coordinate",
        objects: [
            { slideId: 271, shapeId: 16, key: "pos.topLeft[1]" }, // Left description
            { slideId: 271, shapeId: 20, key: "pos.topLeft[1]" }, // Center description
            { slideId: 271, shapeId: 18, key: "pos.topLeft[1]" }, // Right description
        ],
    },

    // LLM judge for horizontal layout transformation
    {
        name: "llm_judge",
        description: "LLM evaluation of horizontal layout transformation",
        slideId: 271,
        autoGenerate: true,
        criteria: "Evaluate if the slide has been transformed to a horizontal layout with '2 out of 5' (or '2/5') positioned on the left and '12 million' (or '12m') on the right, with proper alignment and transformed blue/yellow boxes.",
        focusAreas: [
            "The '2 out of 5' (or '2/5') statistic is positioned on the left side of the slide",
            "The '12 million' (or '12m') statistic is positioned on the right side of the slide",
            "The central '95%' statistic remains in the middle or is appropriately positioned",
            "All three main statistics and their description texts are horizontally aligned at similar Y-coordinates",
            "Blue and yellow boxes are transformed and aligned horizontally to match the new layout",
            "Equal or balanced horizontal spacing between the three statistic sections",
            "Overall horizontal flow and visual balance of the layout",
            "Professional appearance with clear left-to-right reading pattern"
        ],
        expectedChanges: [
            "Layout transformed from vertical to horizontal orientation",
            "'2 out of 5' moved to left third of slide",
            "'12 million' moved to right third of slide",
            "'95%' positioned in center third",
            "All statistics aligned horizontally at similar heights",
            "Blue/yellow boxes repositioned for horizontal layout",
            "Balanced spacing between the three sections"
        ],
    },
];
