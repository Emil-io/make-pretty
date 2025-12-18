import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Verify image still exists
    {
        name: "count_shapes",
        description: "There should be exactly 1 image shape",
        slideId: 278,
        filter: { shapeType: "image" },
        expected: 1,
    },

    // Image should have full slide height (1080)
    {
        name: "includes",
        description: "Image height should be 1080 (full slide height)",
        slideId: 278,
        shapeId: 1599,
        key: "size.h",
        expected: (h: number) => Math.abs(h - 1080) < 10,
    },

    // Image width should be slide width minus white box width (1920 - 977.6 = 942.4)
    {
        name: "includes",
        description: "Image width should be approximately 942px (red box width)",
        slideId: 278,
        shapeId: 1599,
        key: "size.w",
        expected: (w: number) => Math.abs(w - 942.4) < 10,
    },

    // Image should start at top-left corner (0, 0)
    {
        name: "includes",
        description: "Image should start at X=0",
        slideId: 278,
        shapeId: 1599,
        key: "pos.topLeft[0]",
        expected: (x: number) => Math.abs(x) < 10,
    },

    {
        name: "includes",
        description: "Image should start at Y=0",
        slideId: 278,
        shapeId: 1599,
        key: "pos.topLeft[1]",
        expected: (y: number) => Math.abs(y) < 10,
    },

    // LLM judge for overall validation
    {
        name: "llm_judge",
        description: "LLM evaluation of image fitting to the red box",
        slideId: 278,
        autoGenerate: true,
        criteria: "Evaluate if the image has been resized to fill the red box area (left side of slide, full height, width up to the white chart area).",
        focusAreas: [
            "The image fills the entire red box area on the left side of the slide",
            "The image has full slide height (1080px)",
            "The image width matches the red box width (approximately 942px)",
            "The image starts at the top-left corner of the slide",
            "The image right edge aligns with the left edge of the white chart area",
            "The overall visual appearance is clean and professional"
        ],
        expectedChanges: [
            "Image resized to full slide height",
            "Image width adjusted to match red box width",
            "Image repositioned to start at (0, 0)",
            "Image fills the red box completely"
        ],
    },
];
