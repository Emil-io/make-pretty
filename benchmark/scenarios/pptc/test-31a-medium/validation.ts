import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-31a: Align 5 grey circles (with icons inside) and textboxes below
//
// Initial state: 5 grey circles with icons misaligned, textboxes misaligned
// Expected: Circles aligned with centered icons, textboxes aligned below

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Five grey circles should be aligned horizontally",
        slideId: 276,
        criteria: "All 5 grey circles should be aligned at the same vertical Y position, forming a horizontal row",
        focusAreas: ["horizontal alignment", "positioning"],
    },
    {
        name: "llm_judge",
        description: "Icons should be centered within their circles",
        slideId: 276,
        criteria: "Each icon should be horizontally and vertically centered within its respective grey circle",
        focusAreas: ["centering", "icon placement"],
    },
    {
        name: "llm_judge",
        description: "Textboxes should be aligned below circles",
        slideId: 276,
        criteria: "Textboxes should be positioned below their corresponding circles and aligned horizontally with each other",
        focusAreas: ["vertical alignment", "positioning"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 276,
        minMargin: 10,
    },
];
