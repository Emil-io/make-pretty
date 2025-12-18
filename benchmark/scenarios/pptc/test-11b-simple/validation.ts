import { TChangesetTestProtocol } from "../../../evaluation/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify shapes are preserved (nothing deleted)
    {
        name: "count_shapes",
        description: "All textboxes should be preserved",
        slideId: 257,
        filter: { shapeType: "textbox" },
        expected: 8,
    },
    {
        name: "count_shapes",
        description: "All ellipses should be preserved",
        slideId: 257,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL },
        expected: 5,
    },
    {
        name: "count_shapes",
        description: "All lines should be preserved",
        slideId: 257,
        filter: { shapeType: "line" },
        expected: 2,
    },

    // Alignment tests - section headers should remain horizontally aligned
    {
        name: "filtered_equality",
        description: "Section headers (Google Slides, PowerPoint, Canva) should be horizontally aligned",
        slideId: 257,
        filters: [
            { shapeType: "textbox", rawText: "Google Slides" },
            { shapeType: "textbox", rawText: "PowerPoint" },
            { shapeType: "textbox", rawText: "Canva" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Body text blocks should be horizontally aligned
    {
        name: "filtered_equality",
        description: "Body text blocks should be horizontally aligned at same Y",
        slideId: 257,
        filters: [
            { shapeType: "textbox", rawTextContains: "Click on the \"Google Slides\"" },
            { shapeType: "textbox", rawTextContains: "Click on the \"PowerPoint\"" },
            { shapeType: "textbox", rawTextContains: "Click on the \"Canva\"" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Right-side ellipses should remain vertically aligned
    {
        name: "filtered_equality",
        description: "Right-side ellipse decorations should be vertically aligned",
        slideId: 257,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL },
        key: "pos.center[0]",
        minMatchCount: 4,
    },

    // Right ellipses should have equal width
    {
        name: "filtered_equality",
        description: "Right-side ellipses should have equal width",
        slideId: 257,
        filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL },
        key: "size.w",
        minMatchCount: 4,
    },

    // Spacing: ellipses should be evenly spaced vertically
    {
        name: "equal_spacing",
        description: "Right-side ellipses should have consistent vertical spacing",
        slideId: 257,
        shapeIds: [112, 113, 114, 115],
        direction: "vertical",
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of content moved up while preserving layout",
        slideId: 257,
        autoGenerate: true,
        criteria: "Evaluate if the slide content has been moved up appropriately while preserving the outer border and maintaining proper layout relationships.",
        focusAreas: [
            "Main content (title, text sections) has moved up from the bottom-heavy position",
            "The outer border lines remain in their original positions",
            "Relative alignment between section headers and body text is preserved",
            "The three-column layout (Google Slides, PowerPoint, Canva) maintains consistent alignment",
            "Visual balance is improved with content no longer narrow to the bottom",
        ],
        expectedChanges: [
            "Title and text content moved up on the slide",
            "Better vertical distribution of content",
            "Outer border unchanged",
        ],
    },
];
