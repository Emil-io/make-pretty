/**
 * Mapping function from AlignChangesetSchema to AIChangesetSchema
 *
 * NOTE: Some fields may not map perfectly - marked with comments for manual fixes.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { AIAutoShapeType, AIConnectorType, } from "../../../../../../api/server/src/schemas/common/enum.js";
import { ALIGN_MSO_AUTO_SHAPE_TYPE } from "../changeset/schemas/autoshape.js";
/**
 * Maps AlignChangesetSchema to AIChangesetSchema
 *
 * Key differences:
 * - Align schema doesn't have 'content' and 'style' fields (will be set to undefined)
 * - Align schema has 'pos' and 'size' in UpdatedShapeBase (mapped appropriately)
 * - AutoShape types may differ between schemas
 */
export function alignChangesetToAiChangeset(alignChangeset) {
    var _a, _b, _c;
    return {
        added: (_a = alignChangeset.added) === null || _a === void 0 ? void 0 : _a.map(alignAddedShapeToAiAddedShape),
        modified: (_b = alignChangeset.modified) === null || _b === void 0 ? void 0 : _b.map(alignUpdatedShapeToAiUpdatedShape),
        deleted: (_c = alignChangeset.deleted) === null || _c === void 0 ? void 0 : _c.map(alignDeletedShapeToAiDeletedShape),
    };
}
// ==================== Added Shapes Mapping ====================
function alignAddedShapeToAiAddedShape(alignShape) {
    var _a, _b;
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
            };
        case "autoShape":
            // TODO: Fix - ALIGN_MSO_AUTO_SHAPE_TYPE incompatible with AI_MSO_AUTO_SHAPE_TYPE
            var details = void 0;
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
                        otherAutoShapeType: alignShape.autoShapeType,
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
            };
        case "textbox":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                style: {
                    rotation: alignShape.rotation,
                },
            };
        case "chart":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
            };
        case "icon":
            return {
                _id: alignShape._id,
                pos: alignShape.pos,
                size: alignShape.size,
                shapeType: alignShape.shapeType,
                iconName: alignShape.iconName,
            };
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
                startPos: (_a = alignShape.startPos) !== null && _a !== void 0 ? _a : [0, 0],
                endFrom: alignShape.endFrom,
                endPos: (_b = alignShape.endPos) !== null && _b !== void 0 ? _b : [0, 0],
            };
        case "group":
            return {
                _id: alignShape._id,
                items: alignShape.items,
                shapeType: alignShape.shapeType,
            };
        default:
            throw new Error("Unknown shape type: ".concat(JSON.stringify(alignShape)));
    }
}
// ==================== Updated Shapes Mapping ====================
function alignUpdatedShapeToAiUpdatedShape(alignShape) {
    var baseMapping = {
        id: alignShape.id,
        inheritStylesFrom: alignShape.inheritStylesFrom,
        shapeType: alignShape.shapeType,
    };
    // NOTE: Align has pos/size at base level, AI expects them per shape type
    switch (alignShape.shapeType) {
        case "line":
            // TODO: Fix - AI schema expects 'style' object with width, not direct lineWidth
            return __assign(__assign({}, baseMapping), { lineWidth: alignShape.lineWidth, startFrom: alignShape.startFrom, startPos: alignShape.startPos, endFrom: alignShape.endFrom, endPos: alignShape.endPos });
        case "autoShape":
            // TODO: Fix - ALIGN_MSO_AUTO_SHAPE_TYPE incompatible with AI_MSO_AUTO_SHAPE_TYPE
            return __assign(__assign({}, baseMapping), { pos: alignShape.pos, size: alignShape.size, rotation: alignShape.rotation, autoShapeType: alignShape.autoShapeType, background: mapAlignFillToAiFill(alignShape.background) });
        case "textbox":
            return __assign(__assign({}, baseMapping), { pos: alignShape.pos, size: alignShape.size, rotation: alignShape.rotation });
        case "image":
            // TODO: Fix - AI image schema missing pos/size/rotation properties
            return __assign(__assign({}, baseMapping), { pos: alignShape.pos, size: alignShape.size, rotation: alignShape.rotation });
        default:
            // NOTE: Unknown shape type - return as-is
            return alignShape;
    }
}
// ==================== Deleted Shapes Mapping ====================
function alignDeletedShapeToAiDeletedShape(alignShape) {
    // Both schemas support simple { id: number } structure
    if ("id" in alignShape) {
        return { id: alignShape.id };
    }
    // Handle group deletion
    // TODO: Fix - check actual group deletion schema structure in both schemas
    if (alignShape.shapeType === "group") {
        return {
            shapeType: "group",
            ids: alignShape.ids, // TODO: Verify field name
        };
    }
    return alignShape;
}
// ==================== Fill Type Mapping ====================
function mapAlignFillToAiFill(alignFill) {
    if (!alignFill)
        return undefined;
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
