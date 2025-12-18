import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count the main point headings (4 groups with "ADD A MAIN POINT")
    {
        name: "count_shapes",
        description: "There should be 4 groups containing point headings",
        slideId: 270,
        filter: { shapeType: "group" },
        expected: 10, // Total groups
    },

    // Count timeline dots (4 small groups)
    {
        name: "count_shapes",
        description: "There should be 4 timeline marker groups",
        slideId: 270,
        filter: { shapeType: "group" },
        expected: 10,
    },

    // Lines connecting timeline points
    {
        name: "count_shapes",
        description: "There should be 6 connecting lines in the timeline",
        slideId: 270,
        filter: { shapeType: "line" },
        expected: 6,
    },

    // LLM judge for alignment validation
    {
        name: "llm_judge",
        description: "LLM evaluation of point headings and text alignment with yellow boxes",
        slideId: 270,
        autoGenerate: true,
        criteria: "Evaluate if the point headings ('ADD A MAIN POINT') and the description text below ('Elaborate on what you want to discuss.') are properly aligned with the yellow boxes/timeline markers.",
        focusAreas: [
            "The 4 'ADD A MAIN POINT' headings are horizontally centered above their respective yellow timeline boxes",
            "The 4 description texts ('Elaborate on what you want to discuss.') are horizontally centered above their respective yellow boxes",
            "Consistent vertical spacing between headings and their corresponding yellow boxes",
            "Consistent vertical spacing between description texts and their corresponding yellow boxes",
            "All text elements maintain proper alignment with the timeline structure",
            "Visual coherence and professional appearance of the timeline layout"
        ],
        expectedChanges: [
            "Point headings repositioned to center above yellow timeline boxes",
            "Description texts repositioned to align with yellow boxes",
            "Improved visual alignment throughout the timeline"
        ],
    },
];
