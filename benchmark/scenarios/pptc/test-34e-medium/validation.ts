import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "Should have 3 points after deletion (was 4)",
        slideId: 279,
        filter: {
            autoShapeType: "rect",
        },
        expected: 3,
    },
    {
        name: "slide_fill_distribution",
        description: "Remaining 3 points distributed to fill layout",
        slideId: 279,
        minFillPercentage: 70,
    },
    {
        name: "within_boundaries",
        description: "All shapes respect margins",
        slideId: 279,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        slideId: 279,
        autoGenerate: true,
        criteria: "Verify that the third (dark green) point/column has been deleted, and the remaining three points are evenly distributed and stretched to fill the layout with proper spacing",
    },
];
