import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
// Import common schemas
import { AlignAddedShapeBase, AlignUpdatedShapeBase } from "./common.js";
extendZodWithOpenApi(z);
// Textbox shape schema
export var AlignAddedTextboxShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("textbox"),
}).openapi("AlignAddedTextboxShape");
export var AlignUpdatedTextboxShape = AlignUpdatedShapeBase.extend({
    shapeType: z.literal("textbox"),
}).openapi("AlignUpdatedTextboxShape");
