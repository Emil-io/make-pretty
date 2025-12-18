import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
// Import common schemas
import { AlignAddedShapeBase } from "./common.js";
extendZodWithOpenApi(z);
// Chart shape schema
export var AlignAddedChartShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("chart"),
}).openapi("AlignAddedChartShape");
