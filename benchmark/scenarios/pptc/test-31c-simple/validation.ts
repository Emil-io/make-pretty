import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-31c: Align "3k" with "95%" and "18k"
//
// Initial state: Three metric textboxes (3k, 95%, 18k) misaligned
// Expected: All three metrics aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "includes",
        description: "Should have '3k' metric",
        slideId: 280,
        filter: { shapeType: "textbox" },
        key: "rawText",
        expected: "3k",
    },
    {
        name: "includes",
        description: "Should have '95%' metric",
        slideId: 280,
        filter: { shapeType: "textbox" },
        key: "rawText",
        expected: "95%",
    },
    {
        name: "includes",
        description: "Should have '18k' metric",
        slideId: 280,
        filter: { shapeType: "textbox" },
        key: "rawText",
        expected: "18k",
    },
    {
        name: "llm_judge",
        description: "Three metrics should be aligned",
        slideId: 280,
        criteria: "The three metric textboxes (3k, 95%, 18k) should be aligned horizontally or vertically in a consistent pattern",
        focusAreas: ["alignment", "positioning"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 280,
        minMargin: 10,
    },
];
