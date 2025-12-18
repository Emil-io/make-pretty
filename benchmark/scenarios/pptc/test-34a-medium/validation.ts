import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 265,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 265,
        autoGenerate: true,
        criteria: "Verify that flower images are properly centered inside their respective circles, with consistent alignment and positioning across all circle-flower pairs",
    },
];
