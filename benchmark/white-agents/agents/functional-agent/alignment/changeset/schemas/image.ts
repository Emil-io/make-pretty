import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

// Import common schemas
import { AlignAutoShapeType } from "./autoshape.js";
import { AlignAddedShapeBase, AlignUpdatedShapeBase } from "./common.js";

extendZodWithOpenApi(z);

// Image shape schema
export const AlignAddedImageShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("image"),

    // An array with exactly four numbers
    autoShapeType: AlignAutoShapeType.optional(),
}).openapi("AlignAddedImageShape");

export const AlignUpdatedImageShape = AlignUpdatedShapeBase.extend({
    shapeType: z.literal("image"),
    autoShapeType: AlignAutoShapeType.optional(),
}).openapi("AlignUpdatedImageShape");
