import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
// Import common schemas
import { AIConnectionPointSchema } from "../../../../../../../api/server/src/schemas/common/connection-point.js";
import { AICoordinate } from "../../../../../../../api/server/src/schemas/common/shape.js";
import { AlignAddedShapeBase, AlignUpdatedShapeBase } from "./common.js";
extendZodWithOpenApi(z);
// Main line shape schema with discriminated union
export var AlignAddedLineShape = AlignAddedShapeBase.omit({
    pos: true,
    size: true,
})
    .extend({
    shapeType: z.literal("line"),
    lineWidth: z.number().optional(),
    inheritStylesFrom: z.string().optional(), // ID of shape to inherit from
    startFrom: AIConnectionPointSchema.optional(), // Connect to shape
    startPos: AICoordinate.optional(), // Or explicit position
    endFrom: AIConnectionPointSchema.optional(), // Connect to shape
    endPos: AICoordinate.optional(), // Or explicit position
})
    .openapi("AlignAddedLineShape");
// Update line shape schema
export var AlignUpdatedLineShape = AlignUpdatedShapeBase.omit({
    size: true,
    pos: true,
})
    .extend({
    shapeType: z.literal("line"),
    lineWidth: z.number().optional(),
    startFrom: AIConnectionPointSchema.optional(), // Connect to shape
    startPos: AICoordinate.optional(), // Or explicit position
    endFrom: AIConnectionPointSchema.optional(), // Connect to shape
    endPos: AICoordinate.optional(), // Or explicit position
})
    .openapi("AlignUpdatedLineShape");
