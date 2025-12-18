import { AI_MSO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "Should have 12 groups (10 existing + 2 new black boxes)",
        slideId: 280,
        filter: {
            shapeType: AI_MSO_SHAPE_TYPE.GROUP,
        },
        expected: 12,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 280,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 280,
        autoGenerate: true,
        criteria: "Verify that black boxes have been added to the 'Strengths' and 'Threats' sections, matching the style, size, and positioning of the black boxes in the 'Weaknesses' and 'Opportunities' quadrants. All 4 SWOT sections should now have black boxes",
    },
];
