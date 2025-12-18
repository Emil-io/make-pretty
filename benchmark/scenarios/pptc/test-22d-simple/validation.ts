import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all shapes still exist
    {
        name: "count_shapes",
        description: "There should be 1 image shape (phone content)",
        slideId: 303,
        filter: { shapeType: "image" },
        expected: 1,
    },
    {
        name: "count_shapes",
        description: "There should be 1 group shape (phone frame)",
        slideId: 303,
        filter: { shapeType: "group" },
        expected: 1,
    },

    // Alignment tests - image should remain horizontally centered with phone frame
    {
        name: "all_are_equal",
        description: "Image center X should align with phone frame group center X",
        objects: [
            { slideId: 303, shapeId: 271, key: "pos.center[0]" },
            { slideId: 303, shapeId: 266, key: "pos.center[0]" },
        ],
    },

    // Image should remain vertically centered in the phone frame
    {
        name: "all_are_equal",
        description: "Image center Y should align with phone frame group center Y",
        objects: [
            { slideId: 303, shapeId: 271, key: "pos.center[1]" },
            { slideId: 303, shapeId: 266, key: "pos.center[1]" },
        ],
    },

    // LLM Judge - validate the resize was done correctly
    {
        name: "llm_judge",
        description: "LLM evaluation of phone image resize",
        slideId: 303,
        autoGenerate: true,
        criteria: "Check if the phone image height was reduced to match the outer edges of the horizontal white lines on the phone frame.",
        focusAreas: [
            "Phone image height is smaller than before (was shrunk, not cropped)",
            "Image top edge aligns with the upper horizontal white line",
            "Image bottom edge aligns with the lower horizontal white line",
            "Image remains centered horizontally within the phone frame",
            "Image proportions are preserved (not stretched or distorted)",
        ],
        expectedChanges: [
            "Phone image height reduced to match the horizontal white lines",
            "Image remains properly centered in the phone frame",
        ],
    },
];
