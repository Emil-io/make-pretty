import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-31b: Align 4 SWOT headings with each other and belonging textboxes
//
// Initial state: SWOT quadrant headings and textboxes misaligned
// Expected: Headings aligned, textboxes aligned with their headings

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Four SWOT headings should be aligned with each other",
        slideId: 277,
        criteria: "The 4 SWOT quadrant headings (S, W, O, T or Strengths, Weaknesses, Opportunities, Threats) should be aligned in a 2x2 grid pattern",
        focusAreas: ["grid alignment", "heading positioning"],
    },
    {
        name: "llm_judge",
        description: "Textboxes should be aligned with their respective headings",
        slideId: 277,
        criteria: "Each textbox should be properly aligned within its SWOT quadrant, positioned consistently relative to its heading",
        focusAreas: ["alignment", "quadrant consistency"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 277,
        minMargin: 10,
    },
];
