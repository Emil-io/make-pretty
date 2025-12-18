import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-31e: Make a 3x2 grid with 6 blue boxes, keep contents together
//
// Initial state: 6 blue boxes with contents, not in proper grid
// Expected: 3x2 grid layout with contents preserved within boxes

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Six blue boxes should form a 3x2 grid",
        slideId: 287,
        criteria: "The 6 blue boxes should be arranged in a 3-column by 2-row grid with consistent spacing",
        expectedChanges: ["Arrange in 3x2 grid", "Equal spacing between boxes"],
        focusAreas: ["grid layout", "spacing", "alignment"],
    },
    {
        name: "llm_judge",
        description: "Box contents should remain with their boxes",
        slideId: 287,
        criteria: "All content (text, icons, etc.) should remain properly positioned within their respective blue boxes after grid rearrangement",
        focusAreas: ["content preservation", "relative positioning"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 287,
        minMargin: 10,
    },
];
