import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify all 7 ellipse shapes exist (1 company + 6 competitors)
    {
        name: "count_shapes",
        description: "There should be 7 ellipse shapes (1 company + 6 competitors)",
        slideId: 308,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL },
        expected: 7,
    },

    // Verify "Our company" stays in top-right quadrant (high X, high Y value means lower on slide)
    // Top-right quadrant: X > 480 (center), Y < 270 (center)
    {
        name: "greater_than",
        description: "'Our company' should be on right side (X > 480)",
        slideId: 308,
        shapeId: 587,
        key: "pos.center[0]",
        expected: 480,
    },
    {
        name: "less_than",
        description: "'Our company' should be in top half (Y < 270)",
        slideId: 308,
        shapeId: 587,
        key: "pos.center[1]",
        expected: 270,
    },

    // Verify the competitor that was in top-right (shape 592) moved to bottom-right quadrant
    // Bottom-right: X > 480, Y > 270
    {
        name: "greater_than",
        description: "Moved competitor should be on right side (X > 480)",
        slideId: 308,
        shapeId: 592,
        key: "pos.center[0]",
        expected: 480,
    },
    {
        name: "greater_than",
        description: "Moved competitor should now be in bottom half (Y > 270)",
        slideId: 308,
        shapeId: 592,
        key: "pos.center[1]",
        expected: 270,
    },

    // Verify "Our company" is the only shape in the top-right quadrant
    // This is checked via LLM judge since complex quadrant logic

    // Color checks - all competitors should be light blue (#39B8E3)
    {
        name: "includes",
        description: "Competitor 588 should be light blue",
        slideId: 308,
        shapeId: 588,
        key: "style.fill.color",
        expected: "#39B8E3",
    },
    {
        name: "includes",
        description: "Competitor 589 should be light blue",
        slideId: 308,
        shapeId: 589,
        key: "style.fill.color",
        expected: "#39B8E3",
    },
    {
        name: "includes",
        description: "Competitor 590 should be light blue",
        slideId: 308,
        shapeId: 590,
        key: "style.fill.color",
        expected: "#39B8E3",
    },
    {
        name: "includes",
        description: "Competitor 591 should be light blue",
        slideId: 308,
        shapeId: 591,
        key: "style.fill.color",
        expected: "#39B8E3",
    },
    {
        name: "includes",
        description: "Competitor 592 should be light blue",
        slideId: 308,
        shapeId: 592,
        key: "style.fill.color",
        expected: "#39B8E3",
    },
    {
        name: "includes",
        description: "Competitor 593 should be light blue",
        slideId: 308,
        shapeId: 593,
        key: "style.fill.color",
        expected: "#39B8E3",
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of competitor matrix changes",
        slideId: 308,
        autoGenerate: true,
        criteria: "Evaluate if the competitor matrix correctly positions 'Our company' as the only element in top-right quadrant and all competitors are colored light blue.",
        focusAreas: [
            "'Our company' (red oval) is the only element in the top-right quadrant",
            "The competitor that was previously in top-right has been moved one quadrant down (to bottom-right)",
            "All competitor ovals are colored light blue (#39B8E3)",
            "No other competitor remains in the top-right quadrant with 'Our company'",
            "The overall matrix layout remains coherent and professional",
        ],
        expectedChanges: [
            "One competitor moved from top-right to bottom-right quadrant",
            "All competitors changed to light blue color",
            "'Our company' remains as sole occupant of top-right quadrant",
        ],
    },
];
