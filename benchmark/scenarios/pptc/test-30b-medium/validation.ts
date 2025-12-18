import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-30b: Align the circles that are off
//
// Initial state: Multiple circles with some misaligned
// Expected: All circles properly aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "All circles should be properly aligned",
        slideId: 283,
        criteria: "All circular shapes on the slide should be aligned in a consistent pattern (same vertical or horizontal position)",
        focusAreas: ["alignment", "positioning"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 283,
        minMargin: 10,
    },
];
