import { TChangesetTestProtocol } from "../../../evaluation/schemas";

// Slide: 1920x1080 | Task: left=1/3 (640px), right=2/3 (1280px), preserve text line breaks

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes preserved
    { name: "count_shapes", description: "5 images preserved", slideId: 260, filter: { shapeType: "image" }, expected: 5 },
    { name: "count_shapes", description: "2 textboxes preserved", slideId: 260, filter: { shapeType: "textbox" }, expected: 2 },
    { name: "count_shapes", description: "2 dividing lines preserved", slideId: 260, filter: { shapeType: "line" }, expected: 2 },

    // Dividing lines at 1/3 mark (~640px)
    { name: "greater_than", description: "Line 144 X > 600", slideId: 260, shapeId: 144, key: "startPos[0]", expected: 600 },
    { name: "less_than", description: "Line 144 X < 700", slideId: 260, shapeId: 144, key: "startPos[0]", expected: 700 },
    { name: "greater_than", description: "Line 145 X > 600", slideId: 260, shapeId: 145, key: "startPos[0]", expected: 600 },
    { name: "less_than", description: "Line 145 X < 700", slideId: 260, shapeId: 145, key: "startPos[0]", expected: 700 },

    // Right image (143) spans 2/3 of slide
    { name: "greater_than", description: "Right image starts after 600px", slideId: 260, shapeId: 143, key: "pos.topLeft[0]", expected: 600 },
    { name: "less_than", description: "Right image starts before 700px", slideId: 260, shapeId: 143, key: "pos.topLeft[0]", expected: 700 },
    { name: "greater_than_or_equal", description: "Right image extends to right edge", slideId: 260, shapeId: 143, key: "pos.bottomRight[0]", expected: 1900 },

    // Left content within 1/3 section
    { name: "less_than", description: "Left image (142) within left section", slideId: 260, shapeId: 142, key: "pos.bottomRight[0]", expected: 700 },
    { name: "less_than", description: "Title textbox within left section", slideId: 260, shapeId: 149, key: "pos.bottomRight[0]", expected: 700 },
    { name: "less_than", description: "Description textbox within left section", slideId: 260, shapeId: 150, key: "pos.bottomRight[0]", expected: 700 },

    // Lines should be vertical
    { name: "line_validation", description: "Dividing lines are vertical", slideId: 260, filter: { shapeType: "line" }, checkVerticality: true, checkEqualLength: false, checkDividesTextboxes: false },

    // Boundary check
    { name: "within_boundaries", description: "All shapes within slide", slideId: 260, minMargin: 0 },

    // LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of 1/3-2/3 layout",
        slideId: 260,
        autoGenerate: true,
        criteria: "Evaluate if the slide correctly implements 1/3 left and 2/3 right section split while preserving text line breaks.",
        focusAreas: [
            "Right section occupies ~2/3 width (1280px)",
            "Left section occupies ~1/3 width (640px)",
            "Dividing lines at ~640px from left edge",
            "Text line breaks preserved (not reflowed)",
        ],
        expectedChanges: [
            "Right section resized to 2/3 width",
            "Left section resized to 1/3 width",
            "Dividing lines repositioned to 1/3 boundary",
        ],
    },
];
