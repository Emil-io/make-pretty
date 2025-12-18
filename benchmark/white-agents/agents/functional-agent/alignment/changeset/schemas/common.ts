import z from "zod";
import { AICoordinate } from "../../../../../../../api/server/src/schemas/common/shape";

export const AIPos = z
    .object({
        topLeft: AICoordinate.optional(),
        bottomRight: AICoordinate.optional(),
        center: AICoordinate.optional(),
    })
    .describe(
        "Position of the shape as X/Y coordinates. Starting from the top left corner of the slide. Must provide **only one** of the three anchor points.",
    )
    .openapi("AIPos");

// Size schema for shape dimensions
export const AISize = z
    .object({
        w: z.number(),
        h: z.number(),
    })
    .openapi("AISize");

// Base schema for all added shapes
export const AlignAddedShapeBase = z
    .object({
        _id: z.string(), // Temporary ID for newly added shapes. Not stable!!!
        pos: AIPos,
        size: AISize,
        inheritStylesFrom: z.string().optional(), // id of shape to inherit styles from
        rotation: z.number().optional(),
    })
    .openapi("AlignAddedShapeBase");

// Base schema for all updated shapes
export const AlignUpdatedShapeBase = z
    .object({
        id: z.int(), // Stable ID for existing shapes
        inheritStylesFrom: z.string().optional(), // id of shape to inherit styles from

        size: AISize.optional(),
        pos: AIPos.optional(),
        rotation: z.number().optional(),
    })
    .openapi("AlignUpdatedShapeBase");

export const AlignDeletedShapeBase = z
    .object({
        id: z.int(), // Stable ID for existing shapes
    })
    .openapi("AlignDeletedShapeBase");

export const AlignFillPicture = z
    .object({
        type: z.literal("PICTURE"),
    })
    .openapi("AlignFillPicture");

export const AlignFillSolid = z
    .object({
        type: z.literal("SOLID"),
        color: z.string().describe("HEX").nullish(),
    })
    .openapi("AlignFillSolid");

export const AlignFillGroup = z
    .object({
        type: z.literal("GROUP"),
    })
    .openapi("AlignFillGroup");

export const AlignFill = z
    .discriminatedUnion("type", [
        AlignFillPicture,
        AlignFillSolid,
        AlignFillGroup,
    ])
    .openapi("AlignFill");
