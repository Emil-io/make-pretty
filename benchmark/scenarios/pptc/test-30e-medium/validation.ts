import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-30e: Put blue columns on top of others (making a nice graph)
//
// Initial state: Blue columns separate from other columns
// Expected: Blue columns stacked on top of other columns forming a stacked bar chart

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Blue columns should be stacked on top of other columns",
        slideId: 286,
        criteria: "Blue colored columns should be positioned directly above/on top of the other columns, creating a stacked bar chart effect",
        expectedChanges: ["Stack blue columns", "Align column groups vertically"],
        focusAreas: ["stacking", "alignment", "graph structure"],
    },
    {
        name: "llm_judge",
        description: "Result should form a cohesive stacked bar chart",
        slideId: 286,
        criteria: "The overall layout should resemble a proper stacked bar chart with aligned column groups",
        focusAreas: ["visual coherence", "chart structure"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 286,
        minMargin: 10,
    },
];
