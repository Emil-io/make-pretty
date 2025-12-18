import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-32c: Align headings "12m" and "2 of 5" with each other and in columns, align textboxes below
//
// Initial state: Two headings and textboxes misaligned
// Expected: Headings aligned with each other and within columns, textboxes aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Headings '12m' and '2 of 5' should be aligned with each other",
        slideId: 291,
        criteria: "The two headings should be at the same vertical Y position, forming a horizontal row",
        focusAreas: ["horizontal alignment"],
    },
    {
        name: "llm_judge",
        description: "Headings should be aligned within their respective columns",
        slideId: 291,
        criteria: "Each heading should be centered or consistently positioned within its column",
        focusAreas: ["column centering", "alignment"],
    },
    {
        name: "llm_judge",
        description: "Textboxes below headings should be aligned",
        slideId: 291,
        criteria: "Textboxes positioned below the headings should be aligned with each other and within their columns",
        focusAreas: ["vertical alignment", "column consistency"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 291,
        minMargin: 10,
    },
];
