import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify structure is preserved
    {
        name: "count_shapes",
        description: "There should be 7 rectangle autoShapes (image placeholders)",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        expected: 7,
    },
    {
        name: "count_shapes",
        description: "There should be textboxes for names and job titles",
        slideId: 287,
        filter: { shapeType: "textbox" },
        expected: 15,
    },
    {
        name: "count_shapes",
        description: "There should be groups containing name/job pairs",
        slideId: 287,
        filter: { shapeType: "group" },
        expected: 11,
    },

    // Alignment tests - bottom row should be horizontally aligned (same Y)
    {
        name: "filtered_equality",
        description: "Bottom row of 4 image placeholders should be horizontally aligned",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Equal sizing - image placeholders should have equal dimensions
    {
        name: "filtered_equality",
        description: "Image placeholders should have equal width",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.w",
        minMatchCount: 7,
    },
    {
        name: "filtered_equality",
        description: "Image placeholders should have equal height",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        key: "size.h",
        minMatchCount: 7,
    },

    // Horizontal spacing - bottom row should have equal spacing
    {
        name: "filtered_spacing",
        description: "Bottom row image placeholders should have equal horizontal spacing",
        slideId: 287,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE },
        direction: "horizontal",
        minMatchCount: 4,
        groupByPerpendicularPosition: true,
    },

    // LLM Judge for semantic validation (image swap and text updates)
    {
        name: "llm_judge",
        description: "LLM evaluation of image swap and CEO designation",
        slideId: 287,
        autoGenerate: true,
        criteria: "Evaluate if the images of the guy with glasses and the dark-skinned woman have been swapped, and if the guy with glasses now has 'Herry' as name and 'CEO' as job title",
        focusAreas: [
            "The image of the guy with glasses and the dark-skinned woman have been swapped",
            "The name 'Herry' appears in place of the previous name for the guy with glasses",
            "The job title 'CEO' appears for Herry (the guy with glasses)",
            "Overall layout and alignment of team member cards is preserved",
            "Visual consistency and professional appearance maintained",
        ],
        expectedChanges: [
            "Images swapped between the guy with glasses and the dark-skinned woman",
            "Name updated to 'Herry' for the guy with glasses",
            "Job title updated to 'CEO' for Herry",
        ],
    },
];
