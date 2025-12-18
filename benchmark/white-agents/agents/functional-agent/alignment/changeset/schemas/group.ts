import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

// Import common schemas
import { AlignAddedShapeBase } from "./common.js";

extendZodWithOpenApi(z);

// Group shape schema
export const AlignAddedGroupShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("group"),
    items: z.array(z.string()),
}).openapi("AlignAddedGroupShape");

// Delete group shape schema
export const AlignDeleteGroupShape = z
    .object({
        id: z.int(),

        shapeType: z.literal("group"),
        unloadItems: z.boolean().default(true),
    })
    .openapi("AlignDeleteGroupShape");
