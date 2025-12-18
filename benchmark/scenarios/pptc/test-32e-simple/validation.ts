import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-32e: Align textboxes at the bottom
//
// Initial state: Multiple textboxes at bottom of slide misaligned
// Expected: All bottom textboxes aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Bottom textboxes should be aligned",
        slideId: 293,
        criteria: "All textboxes positioned at the bottom of the slide should be aligned horizontally (same Y position) or vertically (same X position) depending on their layout",
        focusAreas: ["alignment", "positioning"],
    },
    {
        name: "llm_judge",
        description: "Bottom textboxes should have consistent spacing",
        slideId: 293,
        criteria: "If multiple textboxes are arranged in a row or column, they should have equal spacing between them",
        focusAreas: ["spacing", "distribution"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 293,
        minMargin: 10,
    },
];
