/**
 * Mapping function from AlignChangesetSchema to AIChangesetSchema
 *
 * NOTE: Some fields may not map perfectly - marked with comments for manual fixes.
 */

import type { z } from "zod";

import type {
    AIAddedShapeSchema,
    AIChangesetSchema,
    AIDeletedShapeSchema,
    AIUpdatedShapeSchema,
} from "../../../../../../api/server/src/schemas/changeset/schemas/changeset.js";

import { AIAddedAutoShape } from "../../../../../../api/server/src/schemas/changeset/schemas/autoshape.js";
import { AITAddedChartShape } from "../../../../../../api/server/src/schemas/changeset/schemas/chart.js";
import { AIAddedGroupShape } from "../../../../../../api/server/src/schemas/changeset/schemas/group.js";
import { AIAddedIconShape } from "../../../../../../api/server/src/schemas/changeset/schemas/icon.js";
import { AIAddedLineShape } from "../../../../../../api/server/src/schemas/changeset/schemas/line.js";
import { AIAddedTextboxShape } from "../../../../../../api/server/src/schemas/changeset/schemas/textbox.js";
import { AIAutoShapeTypeSchema } from "../../../../../../api/server/src/schemas/common/autoshape-details.js";
import {
    AI_MSO_AUTO_SHAPE_TYPE,
    AIAutoShapeType,
    AIConnectorType,
} from "../../../../../../api/server/src/schemas/common/enum.js";
import { ALIGN_MSO_AUTO_SHAPE_TYPE } from "../changeset/schemas/autoshape.js";
import type {
    AlignAddedShapeSchema,
    AlignChangesetSchema,
    AlignDeletedShapeSchema,
    AlignUpdatedShapeSchema,
} from "../changeset/schemas/changeset.js";

// Infer types from schemas
type AIChangeset = z.infer<typeof AIChangesetSchema>;
type AIAddedShape = z.infer<typeof AIAddedShapeSchema>;
type AIUpdatedShape = z.infer<typeof AIUpdatedShapeSchema>;
type AIDeletedShape = z.infer<typeof AIDeletedShapeSchema>;

type AlignChangeset = z.infer<typeof AlignChangesetSchema>;
type AlignAddedShape = z.infer<typeof AlignAddedShapeSchema>;
type AlignUpdatedShape = z.infer<typeof AlignUpdatedShapeSchema>;
type AlignDeletedShape = z.infer<typeof AlignDeletedShapeSchema>;

/**
 * Maps AlignChangesetSchema to AIChangesetSchema
 *
 * Key differences:
 * - Align schema doesn't have 'content' and 'style' fields (will be set to undefined)
 * - Align schema has 'pos' and 'size' in UpdatedShapeBase (mapped appropriately)
 * - AutoShape types may differ between schemas
 */
export function alignChangesetToAiChangeset(
    alignChangeset: AlignChangeset,
): AIChangeset {
    return {
        added: alignChangeset.added?.map(alignAddedShapeToAiAddedShape),
        modified: alignChangeset.modified?.map(
            alignUpdatedShapeToAiUpdatedShape,
        ),
        deleted: alignChangeset.deleted?.map(alignDeletedShapeToAiDeletedShape),
    };
}

// ==================== Added Shapes Mapping ====================

function alignAddedShapeToAiAddedShape(
    alignShape: AlignAddedShape,
): AIAddedShape {
    switch (alignShape.shapeType) {
        case "image":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                style: {
                    rotation: alignShape.rotation,
                },
            } satisfies AIAddedShape;

        case "autoShape":
            // TODO: Fix - ALIGN_MSO_AUTO_SHAPE_TYPE incompatible with AI_MSO_AUTO_SHAPE_TYPE

            let details: AIAutoShapeTypeSchema;
            switch (alignShape.autoShapeType) {
                case ALIGN_MSO_AUTO_SHAPE_TYPE.RECTANGLE:
                    details = {
                        autoShapeType: AIAutoShapeType.enum.RECTANGLE,
                    };
                    break;

                case ALIGN_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE:
                    details = {
                        autoShapeType: AIAutoShapeType.enum.ROUNDED_RECTANGLE,
                    };
                    break;

                case ALIGN_MSO_AUTO_SHAPE_TYPE.OVAL:
                    details = {
                        autoShapeType: AIAutoShapeType.enum.OVAL,
                    };
                    break;

                case ALIGN_MSO_AUTO_SHAPE_TYPE.RIGHT_ARROW:
                    details = {
                        autoShapeType: AIAutoShapeType.enum.RIGHT_ARROW,
                    };
                    break;
                default:
                    details = {
                        autoShapeType: "OTHER",
                        otherAutoShapeType:
                            alignShape.autoShapeType as unknown as AI_MSO_AUTO_SHAPE_TYPE,
                    };
            }

            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                style: {
                    rotation: alignShape.rotation,
                },
                details: details,
                inheritStylesFrom: alignShape.inheritStylesFrom,
            } satisfies AIAddedAutoShape;

        case "textbox":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                style: {
                    rotation: alignShape.rotation,
                },
            } satisfies AIAddedTextboxShape;

        case "chart":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
            } satisfies AITAddedChartShape;

        case "icon":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                iconName: alignShape.iconName,
            } satisfies AIAddedIconShape;

        case "line":
            // TODO: Fix - AI schema expects 'lineType' not 'lineWidth', and uses 'style' object
            return {
                _id: alignShape._id,
                inheritStylesFrom: alignShape.inheritStylesFrom,
                shapeType: alignShape.shapeType,
                style: {
                    lineType: AIConnectorType.enum.STRAIGHT,
                    width: alignShape.lineWidth,
                },
                startFrom: alignShape.startFrom,
                startPos: alignShape.startPos,
                endFrom: alignShape.endFrom,
                endPos: alignShape.endPos,
            } satisfies AIAddedLineShape;

        case "group":
            return {
                _id: alignShape._id,
                items: alignShape.items,
                shapeType: alignShape.shapeType,
            } satisfies AIAddedGroupShape;

        default:
            throw new Error(
                `Unknown shape type: ${JSON.stringify(alignShape)}`,
            );
    }
}

// ==================== Updated Shapes Mapping ====================

function alignUpdatedShapeToAiUpdatedShape(
    alignShape: AlignUpdatedShape,
): AIUpdatedShape {
    const baseMapping = {
        id: alignShape.id,
        inheritStylesFrom: alignShape.inheritStylesFrom,
        shapeType: alignShape.shapeType,
    };

    // NOTE: Align has pos/size at base level, AI expects them per shape type

    switch (alignShape.shapeType) {
        case "line":
            // TODO: Fix - AI schema expects 'style' object with width, not direct lineWidth
            return {
                ...baseMapping,
                lineWidth: (alignShape as any).lineWidth, // TODO: Map to style.width
                startFrom: (alignShape as any).startFrom,
                startPos: (alignShape as any).startPos,
                endFrom: (alignShape as any).endFrom,
                endPos: (alignShape as any).endPos,
            } as AIUpdatedShape;

        case "autoShape":
            // TODO: Fix - ALIGN_MSO_AUTO_SHAPE_TYPE incompatible with AI_MSO_AUTO_SHAPE_TYPE
            return {
                ...baseMapping,
                pos: (alignShape as any).pos,
                size: (alignShape as any).size,
                rotation: (alignShape as any).rotation,
                autoShapeType: (alignShape as any).autoShapeType,
                background: mapAlignFillToAiFill(
                    (alignShape as any).background,
                ),
            } as AIUpdatedShape;

        case "textbox":
            return {
                ...baseMapping,
                pos: (alignShape as any).pos,
                size: (alignShape as any).size,
                rotation: (alignShape as any).rotation,
            } as AIUpdatedShape;

        case "image":
            // TODO: Fix - AI image schema missing pos/size/rotation properties
            return {
                ...baseMapping,
                pos: (alignShape as any).pos,
                size: (alignShape as any).size,
                rotation: (alignShape as any).rotation,
            } as AIUpdatedShape;

        default:
            // NOTE: Unknown shape type - return as-is
            return alignShape as any;
    }
}

// ==================== Deleted Shapes Mapping ====================

function alignDeletedShapeToAiDeletedShape(
    alignShape: AlignDeletedShape,
): AIDeletedShape {
    // Both schemas support simple { id: number } structure
    if ("id" in alignShape) {
        return { id: alignShape.id };
    }

    // Handle group deletion
    // TODO: Fix - check actual group deletion schema structure in both schemas
    if ((alignShape as any).shapeType === "group") {
        return {
            shapeType: "group",
            ids: (alignShape as any).ids, // TODO: Verify field name
        } as unknown as AIDeletedShape;
    }

    return alignShape as any;
}

// ==================== Fill Type Mapping ====================

function mapAlignFillToAiFill(alignFill: any): any {
    if (!alignFill) return undefined;

    // Align fill types are a subset of AI fill types
    // Direct mapping is possible

    switch (alignFill.type) {
        case "PICTURE":
            return { type: "PICTURE" };

        case "SOLID":
            return {
                type: "SOLID",
                color: alignFill.color,
            };

        case "GROUP":
            return { type: "GROUP" };

        default:
            // NOTE: Unknown fill type - return as-is
            return alignFill;
    }
}
