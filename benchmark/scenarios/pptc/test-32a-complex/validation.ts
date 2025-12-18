import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-32a: Put icons in circles and align headings
//
// Initial state: Icons separate from circles, headings misaligned
// Expected: Icons placed inside circles, headings aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Icons should be placed inside circles",
        slideId: 288,
        criteria: "Each icon should be positioned within (inside) its corresponding circle, centered both horizontally and vertically",
        expectedChanges: ["Move icons into circles", "Center icons"],
        focusAreas: ["icon placement", "centering"],
    },
    {
        name: "llm_judge",
        description: "Headings should be aligned",
        slideId: 288,
        criteria: "All heading textboxes should be aligned in a consistent pattern (same Y position or grid alignment)",
        focusAreas: ["alignment", "positioning"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 288,
        minMargin: 10,
    },
];
