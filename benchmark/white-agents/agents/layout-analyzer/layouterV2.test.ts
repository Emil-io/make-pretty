import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { AITChangesetSchema } from "../../../../api/server/src/schemas/changeset/schemas/changeset.js";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum.js";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "__generated__");
// Use the test PowerPoint file from the PowerPoint service directory
const TEST_PPTX =
    "/Users/paulostarek/Desktop/powerpoint/letmecook/api/python/presentations/firmlearning.pptx";

async function ensureOutputDir(): Promise<void> {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
}


const TEST_PROPOSAL_JSON = path.join(__dirname, "test_proposal.json");
const SAMPLE_JSON = path.join(__dirname, "sample.json");

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

interface ShapeReference {
    id: string;
    topLeft: [number, number];
    size: [number, number];
}

interface Sublayout {
    name: string;
    type: string;
    boundaries: [[number, number], [number, number]];
    sublayouts?: Sublayout[];
    shapes?: ShapeReference[];
}

interface ProposedChange {
    new_type: string;
    updated_sublayouts: Sublayout[];
    notes?: string;
}

interface ProposalData {
    affected_layout: string;
    current_boundaries: [[number, number], [number, number]];
    proposed_change: ProposedChange;
    deleted?: number[];
}

function createTimer() {
    const startTime = Date.now();
    return {
        getDuration: (): number => Date.now() - startTime,
    };
}

/**
 * Recursively collects all shapes from sublayouts
 */
function collectShapesFromSublayouts(
    sublayout: Sublayout,
    collectedShapes: ShapeReference[] = [],
): void {
    // Collect shapes from this sublayout
    if (sublayout.shapes && sublayout.shapes.length > 0) {
        collectedShapes.push(...sublayout.shapes);
    }

    // Recursively collect from nested sublayouts
    if (sublayout.sublayouts && sublayout.sublayouts.length > 0) {
        for (const nestedSublayout of sublayout.sublayouts) {
            collectShapesFromSublayouts(nestedSublayout, collectedShapes);
        }
    }
}

/**
 * Recursively processes a sublayout and creates rectangles for each boundary
 */
function processSublayout(
    sublayout: Sublayout,
    level: number = 1,
    shapes: any[] = [],
): void {
    // Create a rectangle for this sublayout's boundary
    const [topLeft, bottomRight] = sublayout.boundaries;
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
        _id: `proposal-${level}-${shapes.length}-${sublayout.name.replace(/\s+/g, "-")}`,
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

    // Recursively process sublayouts
    if (sublayout.sublayouts && sublayout.sublayouts.length > 0) {
        for (const nestedSublayout of sublayout.sublayouts) {
            processSublayout(nestedSublayout, level + 1, shapes);
        }
    }
}

describe("Proposal Test", () => {
    it("should create rectangles from proposal boundaries and move/resize shapes", async () => {
        const timer = createTimer();
        const service = await createPowerPointServiceWithHealthCheck();

        try {
            // Ensure output directory exists
            await ensureOutputDir();

            // Get the first slide from the test presentation to access existing shapes
            const slide = await service.getSlideByIndex(TEST_PPTX, 2);
            expect(slide).toBeDefined();
            expect(slide.id).toBeDefined();
            expect(slide.shapes).toBeDefined();

            // Create a map of shape ID to shape type from existing slide shapes
            const shapeIdToTypeMap = new Map<number, string>();
            for (const shape of slide.shapes) {
                shapeIdToTypeMap.set(shape.id, shape.shapeType);
            }

            // Log shape types found for debugging
            const shapeTypesFound = new Set(Array.from(shapeIdToTypeMap.values()));
            console.log(
                `Found ${shapeIdToTypeMap.size} shapes on slide with types: ${Array.from(shapeTypesFound).join(", ")}`,
            );

            // Load the proposal JSON file (use sample.json if available, otherwise test_proposal.json)
            let proposalJson: string = await fs.readFile(SAMPLE_JSON, "utf-8");

            const proposalData: ProposalData = JSON.parse(proposalJson);

            // Process the proposal to create rectangles
            const shapes: any[] = [];

            // Add rectangle for current_boundaries (level 1)
            const [topLeft, bottomRight] = proposalData.current_boundaries;
            const [x1, y1] = topLeft;
            const [x2, y2] = bottomRight;
            const width = x2 - x1;
            const height = y2 - y1;

            const currentBoundaryShape = {
                _id: `proposal-0-current-boundary`,
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
                        color: LEVEL_COLORS[0], // Blue for level 1
                    },
                    border: {
                        color: "#000000",
                        width: 2,
                    },
                    transparency: 0.2, // Less transparent for the main boundary
                },
                details: {
                    autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
                },
            };

            shapes.push(currentBoundaryShape);

            // Process all updated_sublayouts
            for (const sublayout of proposalData.proposed_change
                .updated_sublayouts) {
                processSublayout(sublayout, 2, shapes); // Start at level 2
            }

            console.log(
                `Created ${shapes.length} rectangle shapes from proposal (1 current boundary + ${proposalData.proposed_change.updated_sublayouts.length} sublayouts)`,
            );

            // Collect all shapes from the proposal that need to be moved/resized
            const shapesToModify: ShapeReference[] = [];
            for (const sublayout of proposalData.proposed_change
                .updated_sublayouts) {
                collectShapesFromSublayouts(sublayout, shapesToModify);
            }

            // Valid shape types that can be modified (group shapes cannot be modified)
            const validModifiedShapeTypes = new Set([
                "line",
                "autoShape",
                "textbox",
                "image",
                "chart",
                "placeholder",
            ]);

            // Create modified shape objects
            const modifiedShapes: any[] = [];
            for (const shapeRef of shapesToModify) {
                const shapeId = parseInt(shapeRef.id, 10);
                const shapeType = shapeIdToTypeMap.get(shapeId);

                if (!shapeType) {
                    console.warn(
                        `Shape ID ${shapeId} not found in slide. Skipping modification.`,
                    );
                    continue;
                }

                // Skip shapes that cannot be modified (e.g., group shapes)
                if (!validModifiedShapeTypes.has(shapeType)) {
                    console.warn(
                        `Shape ID ${shapeId} has unsupported type "${shapeType}" for modification. Skipping.`,
                    );
                    continue;
                }

                // Create modified shape object
                const modifiedShape: any = {
                    id: shapeId,
                    shapeType: shapeType,
                    pos: {
                        topLeft: shapeRef.topLeft,
                    },
                    size: {
                        w: shapeRef.size[0],
                        h: shapeRef.size[1],
                    },
                };

                modifiedShapes.push(modifiedShape);
            }

            console.log(
                `Found ${shapesToModify.length} shapes to modify, ${modifiedShapes.length} successfully mapped to existing shapes`,
            );

            // Process deleted shapes from the proposal
            const deletedShapes: Array<{ id: number }> = [];
            if (proposalData.deleted && proposalData.deleted.length > 0) {
                for (const deletedId of proposalData.deleted) {
                    deletedShapes.push({ id: Number(deletedId) });
                }
                console.log(
                    `Found ${deletedShapes.length} shapes to delete`,
                );
            }

            // Create changeset
            const changeset: AITChangesetSchema = {
                added: shapes,
                modified: modifiedShapes,
                deleted: deletedShapes.length > 0 ? deletedShapes : undefined,
            };

            // Edit the slide with the changeset
            const outputFile = path.join(OUTPUT_DIR, "test2.pptx");
            const result = await service.editSlide(
                TEST_PPTX,
                slide.id,
                changeset,
                outputFile,
            );

            expect(result).toBeDefined();

            // Verify the output file exists
            const stats = await fs.stat(result);
            expect(stats.size).toBeGreaterThan(0);

            console.log(
                `Successfully created test2.pptx with ${shapes.length} proposal rectangles, ${modifiedShapes.length} modified shapes, and ${deletedShapes.length} deleted shapes (${timer.getDuration()}ms)`,
            );

            // Save the changeset for reference
            const changesetPath = path.join(
                OUTPUT_DIR,
                "proposal_changeset.json",
            );
            await fs.writeFile(
                changesetPath,
                JSON.stringify(changeset, null, 2),
                "utf-8",
            );
        } catch (error) {
            console.error("Error in proposal test:", error);
            if (error instanceof PowerPointServiceError) {
                const errorPath = path.join(OUTPUT_DIR, "proposal_error.json");
                await fs.writeFile(
                    errorPath,
                    JSON.stringify(error.toJSON(), null, 2),
                    "utf-8",
                );
            }
            throw error;
        }
    });
});
