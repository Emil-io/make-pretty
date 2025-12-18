import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes are preserved
    {
        name: "count_shapes",
        description: "There should be exactly 1 image shape (pineapple)",
        slideId: 287,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be 6 textboxes",
        slideId: 287,
        filter: { shapeType: "textbox" },
        expected: 6,
    },
    {
        name: "count_shapes",
        description: "There should be 2 autoShapes",
        slideId: 287,
        filter: { shapeType: "autoShape" },
        expected: 2,
    },

    // After swap: Image should be on LEFT side (X < 960, center of 1920)
    // Originally image was at topLeft X=1118.7 (right side)
    {
        name: "filtered_equality",
        description: "Image should now be on the left half of the slide",
        slideId: 287,
        filter: { shapeType: "image" },
        key: "pos.topLeft[0]",
        minMatchCount: 1,
    },

    // After swap: Contact textboxes should be on RIGHT side (X > 960)
    // Originally textboxes had topLeft X around 108-282 (left side)
    {
        name: "filtered_equality",
        description: "Contact info textboxes should be horizontally aligned (same center X)",
        slideId: 287,
        filters: [
            { shapeType: "textbox", rawTextContains: "123 Anywhere" },
            { shapeType: "textbox", rawTextContains: "123-456-7890" },
            { shapeType: "textbox", rawTextContains: "hello@" },
            { shapeType: "textbox", rawTextContains: "@reallygreatsite" },
            { shapeType: "textbox", rawTextContains: "reallygreatsite.com" },
        ],
        key: "pos.center[0]",
        minMatchCount: 5,
    },

    // Textboxes should maintain vertical spacing/order after moving
    {
        name: "filtered_spacing",
        description: "Contact info textboxes should maintain equal vertical spacing",
        slideId: 287,
        filter: { shapeType: "textbox", rawTextContains: "@" },
        direction: "vertical",
        minMatchCount: 2,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of left-right layout exchange",
        slideId: 287,
        autoGenerate: true,
        criteria: "Evaluate if the slide layout has been correctly mirrored/exchanged, with the pineapple image now on the right side and contact info on the left, with the bottle flipped to point in the opposite direction.",
        focusAreas: [
            "Pineapple/ananas image is now positioned on the right side of the slide",
            "Contact Us heading and contact information are now on the left side",
            "Bottle shape has been flipped/mirrored to point in the opposite direction",
            "Overall layout maintains visual balance after the exchange",
            "Text content and alignment is preserved within the contact section",
        ],
        expectedChanges: [
            "Image moved from right to left side",
            "Contact information moved from left to right side",
            "Bottle rotation/direction flipped to mirror original orientation",
            "Layout maintains symmetry and visual coherence",
        ],
    },
];
