import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-32d: Delete guy in white shirt, align remaining pictures and text
//
// Initial state: Multiple people/pictures with associated text
// Expected: One person deleted, remaining pictures and text aligned

export const Test: TChangesetTestProtocol = [
    {
        name: "llm_judge",
        description: "Person in white shirt should be deleted",
        slideId: 292,
        criteria: "The image of the person wearing a white shirt should be completely removed from the slide",
        expectedChanges: ["Delete white shirt person"],
        focusAreas: ["deletion", "content removal"],
    },
    {
        name: "llm_judge",
        description: "Remaining pictures should be aligned",
        slideId: 292,
        criteria: "All remaining pictures/photos should be aligned in a consistent pattern with equal spacing",
        focusAreas: ["alignment", "spacing", "distribution"],
    },
    {
        name: "llm_judge",
        description: "Text should be aligned with pictures",
        slideId: 292,
        criteria: "Text boxes should be properly aligned with their corresponding pictures",
        focusAreas: ["text alignment", "picture-text association"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 292,
        minMargin: 10,
    },
];
