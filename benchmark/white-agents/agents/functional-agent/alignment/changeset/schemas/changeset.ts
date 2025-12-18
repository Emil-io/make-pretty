import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { AlignAddedAutoShape, AlignUpdatedAutoShape } from "./autoshape.js";
import { AlignAddedChartShape } from "./chart.js";
import { AlignDeletedShapeBase } from "./common.js";
import { AlignAddedGroupShape, AlignDeleteGroupShape } from "./group.js";
import { AlignAddedIconShape } from "./icon.js";
import { AlignAddedImageShape, AlignUpdatedImageShape } from "./image.js";
import { AlignAddedLineShape, AlignUpdatedLineShape } from "./line.js";
import { AlignAddedTextboxShape, AlignUpdatedTextboxShape } from "./textbox.js";

extendZodWithOpenApi(z);

// Main discriminated union for all added shapes
export const AlignAddedShapeSchema = z
    .discriminatedUnion("shapeType", [
        AlignAddedImageShape,
        AlignAddedAutoShape,
        AlignAddedTextboxShape,
        AlignAddedChartShape,
        AlignAddedIconShape,
        AlignAddedLineShape,
        AlignAddedGroupShape,
    ])
    .openapi("AlignAddedShapeSchema");

// Modified shape schema
export const AlignUpdatedShapeSchema = z
    .discriminatedUnion("shapeType", [
        AlignUpdatedLineShape,
        AlignUpdatedAutoShape,
        AlignUpdatedTextboxShape,
        AlignUpdatedImageShape,
    ])
    .openapi("AlignUpdatedShapeSchema");

export const AlignDeletedShapeSchema = z
    .union([AlignDeleteGroupShape, AlignDeletedShapeBase])
    .openapi("AlignDeletedShapeSchema");

// Main changeset schema
export const AlignChangesetSchema = z
    .object({
        added: z.array(AlignAddedShapeSchema).optional(),
        modified: z.array(AlignUpdatedShapeSchema).optional(),
        deleted: z.array(AlignDeletedShapeSchema).optional(),
    })
    .openapi("AlignChangesetSchema");

export type AlignChangesetSchema = z.infer<typeof AlignChangesetSchema>;
