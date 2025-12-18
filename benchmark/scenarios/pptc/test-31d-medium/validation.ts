import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-31d: Align "30$" heading with other two, align middle column line, align feature textboxes in each column
//
// Initial state: 3 pricing columns with misaligned elements
// Expected: Price headings aligned, lines aligned, feature textboxes aligned within columns

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Three price headings should be aligned",
        slideId: 281,
        criteria: "The three pricing headings (including 30$) should be aligned at the same vertical Y position across the three columns",
        focusAreas: ["horizontal alignment", "heading positioning"],
    },
    {
        name: "llm_judge",
        description: "Middle column line should be aligned",
        slideId: 281,
        criteria: "The line in the middle column (below 'monthly') should be aligned with corresponding elements in other columns",
        focusAreas: ["alignment", "visual consistency"],
    },
    {
        name: "llm_judge",
        description: "Feature textboxes within each column should be aligned",
        slideId: 281,
        criteria: "Within each pricing column, all feature textboxes should be left-aligned and vertically stacked consistently",
        focusAreas: ["vertical alignment", "within-column consistency"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 281,
        minMargin: 10,
    },
];
