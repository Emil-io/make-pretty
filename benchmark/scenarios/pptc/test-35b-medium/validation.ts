import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "within_boundaries",
        description: "All shapes respect margins including bottom",
        slideId: 265,
        minMargin: 20,
    },
    {
        name: "less_than",
        description: "Bottom boxes moved up from original position",
        slideId: 265,
        shapeId: 121,
        key: "pos.topLeft[1]",
        expected: 800,
    },
    {
        name: "llm_judge",
        slideId: 265,
        autoGenerate: true,
        criteria: "Verify that the three boxes at the bottom have been moved up to fit on the slide with enough spacing to the bottom and heading. Check that spacing inside boxes is reduced or boxes are resized as necessary to maintain proper fit",
    },
];
