import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

// Import common schemas
import { AlignAddedShapeBase } from "./common.js";

extendZodWithOpenApi(z);

// Icon shape schema
export const AlignAddedIconShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("icon"),
    iconName: z.string().optional(),
}).openapi("AlignAddedIconShape");
