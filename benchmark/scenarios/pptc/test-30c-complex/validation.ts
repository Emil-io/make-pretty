import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-30c: Align icons in center of yellow circles, align circles, lines, and textboxes
//
// Initial state: Icons, circles, lines, and textboxes misaligned
// Expected: Icons centered in circles, all elements aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Icons should be centered within yellow circles",
        slideId: 289,
        criteria: "Each icon should be horizontally and vertically centered within its corresponding yellow circle",
        focusAreas: ["centering", "icon placement"],
    },
    {
        name: "llm_judge",
        description: "All circles, lines, and textboxes should be aligned",
        slideId: 289,
        criteria: "Circles, connecting lines, and textboxes should form a cohesive aligned layout",
        focusAreas: ["alignment", "spacing", "consistency"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 289,
        minMargin: 10,
    },
];
