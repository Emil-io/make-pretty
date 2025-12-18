import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-30d: Align SWOT letters, fix misaligned lines (wrong size), check text
//
// Initial state: SWOT letters misaligned, lines misaligned with wrong sizes, text issues
// Expected: SWOT aligned, lines corrected, text verified

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "SWOT letters should be aligned",
        slideId: 285,
        criteria: "The letters S, W, O, T should be aligned in a consistent grid pattern",
        focusAreas: ["alignment", "positioning"],
    },
    {
        name: "llm_judge",
        description: "Lines should be aligned and properly sized",
        slideId: 285,
        criteria: "All connecting or separating lines should be aligned and have consistent lengths/widths as appropriate for the SWOT diagram",
        focusAreas: ["alignment", "sizing", "consistency"],
    },
    {
        name: "llm_judge",
        description: "Text content should be correct and aligned",
        slideId: 285,
        criteria: "Text boxes should contain appropriate content and be aligned with their respective SWOT quadrants",
        focusAreas: ["text content", "alignment"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 285,
        minMargin: 10,
    },
];
