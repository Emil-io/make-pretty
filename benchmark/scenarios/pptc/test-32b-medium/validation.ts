import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Test-32b: Align 3 circled pictures - same size and within their columns
//
// Initial state: 3 pictures in circles with inconsistent sizes and alignment
// Expected: All pictures same size, aligned within their respective columns

export const Test: TChangesetTestProtocol = [
    {
        name: "filtered_equality",
        description: "All circled pictures should have same size",
        slideId: 290,
        filter: { shapeType: "image" },
        key: "size.w",
        minMatchCount: 3,
    },
    {
        name: "filtered_equality",
        description: "All circled pictures should have same height",
        slideId: 290,
        filter: { shapeType: "image" },
        key: "size.h",
        minMatchCount: 3,
    },
    {
        name: "llm_judge",
        description: "Pictures should be aligned within their columns",
        slideId: 290,
        criteria: "Each circled picture should be centered or consistently positioned within its respective column",
        focusAreas: ["column alignment", "centering"],
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 290,
        minMargin: 10,
    },
];
