import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-28a: "Your marketing Presentation" text overflows, make it not overflow
//
// Initial state: Text "YOUR MARKETING PRESENTATION" overflows its container
// Expected: Text resized, repositioned, or container adjusted so text no longer overflows

export const Test: TChangesetTestProtocol = [
    // ============================================
    // SECTION 1: TEXT PRESERVATION
    // ============================================
    {
        name: "includes",
        description: "Marketing presentation text should still be present",
        slideId: 256,
        shapeId: 142,
        key: "rawText",
        expected: "YOUR MARKETING PRESENTATION",
    },

    // ============================================
    // SECTION 2: NO OVERFLOW
    // ============================================
    {
        name: "llm_judge",
        description: "Text should not overflow its container",
        slideId: 256,
        criteria: "The 'YOUR MARKETING PRESENTATION' text should fit completely within its textbox boundaries without overflow. The text size, textbox size, or both should be adjusted to prevent overflow",
    },

    // ============================================
    // SECTION 3: READABILITY
    // ============================================
    {
        name: "llm_judge",
        description: "Text should remain readable after adjustments",
        slideId: 256,
        criteria: "The text should maintain adequate font size and spacing to remain legible while fitting within boundaries",
    },

    // ============================================
    // SECTION 4: LAYOUT TEST
    // ============================================
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 256,
        minMargin: 10,
    },
];
