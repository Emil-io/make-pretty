import path from "path";
import {
    AITAddedShapeSchema,
    AITChangesetSchema,
} from "../../../../api/server/src/schemas/changeset/schemas";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint";
import { getOutputDir } from "../../helpers";
import { Layout } from "./types";

// Color palette for different layout levels
// Level 1: blue, Level 2: red, Level 3: green, Level 4: yellow, etc.
const LEVEL_COLORS = [
    "#0000FF", // Level 1: Blue
    "#FF0000", // Level 2: Red
    "#00FF00", // Level 3: Green
    "#FFFF00", // Level 4: Yellow
    "#FF00FF", // Level 5: Magenta
    "#00FFFF", // Level 6: Cyan
    "#FFA500", // Level 7: Orange
    "#800080", // Level 8: Purple
    "#008000", // Level 9: Dark Green
    "#000080", // Level 10: Navy
];

/**
 * Recursively processes a layout and creates rectangles for each boundary
 */
export async function previewLayout(
    processId: string,
    outputName: string,
    pptxPath: string,
    slideId: number,
    layout: Layout,
    level: number = 1,
): Promise<void> {
    try {
        const shapes: AITAddedShapeSchema[] = [];
        recursivelyGetShapes(layout, level, shapes);

        console.log("Shapes", shapes.length);

        console.log(
            `Created ${shapes.length} rectangle shapes from layout tree`,
        );

        // Create changeset
        const changeset: AITChangesetSchema = {
            added: shapes,
            modified: [],
            deleted: [],
        };

        const outputDir = getOutputDir(processId);
        // Edit the slide with the changeset to create a new PPTX with layout boxes
        const outputPptxPath = path.join(outputDir, `${outputName}.pptx`);

        const service = await createPowerPointServiceWithHealthCheck();
        const resultPptx = await service.editSlide(
            pptxPath,
            slideId,
            changeset,
            outputPptxPath,
        );

        console.log(`Saved changeset to ${outputPptxPath}`);
    } catch (error) {
        console.error("Error in saving preview of layout:", error);
        throw error;
    }
}

function recursivelyGetShapes(
    layout: Layout,
    level: number = 1,
    shapes: any[] = [],
) {
    // Handle multi layouts (where b is an array of boundaries)
    if (layout.multi === true && Array.isArray(layout.b)) {
        // For multi layouts, create a rectangle for each boundary in the array
        for (let i = 0; i < layout.b.length; i++) {
            const boundary = layout.b[i];
            const [id, topLeft, bottomRight, shapeIds] = boundary;
            const [x1, y1] = topLeft;
            const [x2, y2] = bottomRight;

            // Calculate width and height
            const width = x2 - x1;
            const height = y2 - y1;

            // Get color for this level (cycle through colors if level exceeds array length)
            const colorIndex = (level - 1) % LEVEL_COLORS.length;
            const color = LEVEL_COLORS[colorIndex];

            // Create rectangle shape
            const shape = {
                _id: `layout-${level}-${shapes.length}-${layout.name.replace(/\s+/g, "-")}-${i}`,
                shapeType: "autoShape" as const,
                pos: {
                    topLeft: [x1, y1],
                },
                size: {
                    w: width,
                    h: height,
                },
                style: {
                    fill: {
                        type: "SOLID" as const,
                        color: color,
                    },
                    border: {
                        color: "#000000",
                        width: 1,
                    },
                    transparency: 0.3, // Make it semi-transparent so we can see overlapping layouts
                },
                details: {
                    autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
                },
            };

            shapes.push(shape);
        }
    } else {
        // Handle single boundary layouts
        const boundary = layout.b as [[number, number], [number, number]];
        const [topLeft, bottomRight] = boundary;
        const [x1, y1] = topLeft;
        const [x2, y2] = bottomRight;

        // Calculate width and height
        const width = x2 - x1;
        const height = y2 - y1;

        // Get color for this level (cycle through colors if level exceeds array length)
        const colorIndex = (level - 1) % LEVEL_COLORS.length;
        const color = LEVEL_COLORS[colorIndex];

        // Create rectangle shape
        const shape = {
            _id: `layout-${level}-${shapes.length}-${layout.name.replace(/\s+/g, "-")}`,
            shapeType: "autoShape" as const,
            pos: {
                topLeft: [x1, y1],
            },
            size: {
                w: width,
                h: height,
            },
            style: {
                fill: {
                    type: "SOLID" as const,
                    color: color,
                },
                border: {
                    color: "#000000",
                    width: 1,
                },
                transparency: 0.3, // Make it semi-transparent so we can see overlapping layouts
            },
            details: {
                autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
            },
        };

        shapes.push(shape);
    }

    // Recursively process sublayouts (sl === sublayouts)
    if (layout.sl && layout.sl.length > 0) {
        for (const sublayout of layout.sl) {
            recursivelyGetShapes(sublayout, level + 1, shapes);
        }
    }
}
