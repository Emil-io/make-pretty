import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "less_than",
        description: "Text boxes moved up closer to heading",
        slideId: 268,
        shapeId: 121,
        key: "pos.topLeft[1]",
        expected: 800,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 268,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 268,
        autoGenerate: true,
        criteria: "Verify that the middle box and icon are properly aligned, and the three text boxes at the bottom have been moved up closer to the heading with appropriate spacing",
    },
];
