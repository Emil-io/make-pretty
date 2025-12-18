import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of trapeze editing and pyramid creation",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the two trapezes have been edited so the slope of their sides matches the triangle on top, and the trapezes have been resized to align with the triangle and create a pyramid.",
        focusAreas: [
            "Trapeze sides slope matches triangle",
            "Trapezes resized appropriately",
            "Trapezes aligned with triangle",
            "Pyramid shape created",
            "Visual consistency and geometric accuracy",
        ],
        expectedChanges: [
            "Trapeze slopes adjusted",
            "Pyramid shape created",
            "Proper alignment achieved",
        ],
    },
];
