import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import {
    AlignAddedShapeBase,
    AlignFill,
    AlignUpdatedShapeBase,
} from "./common.js";

extendZodWithOpenApi(z);

export enum ALIGN_MSO_AUTO_SHAPE_TYPE {
    // Rectangles
    RECTANGLE = "rect",

    ROUNDED_RECTANGLE = "roundRect",
    ROUND_1_RECTANGLE = "round1Rect",
    ROUND_2_DIAG_RECTANGLE = "round2DiagRect",
    ROUND_2_SAME_RECTANGLE = "round2SameRect",
    SNIP_1_RECTANGLE = "snip1Rect",
    SNIP_2_DIAG_RECTANGLE = "snip2DiagRect",
    SNIP_2_SAME_RECTANGLE = "snip2SameRect",
    SNIP_ROUND_RECTANGLE = "snipRoundRect",

    // Oval
    OVAL = "ellipse",

    // Basic Arrows
    RIGHT_ARROW = "rightArrow",
    LEFT_ARROW = "leftArrow",
    UP_ARROW = "upArrow",
    DOWN_ARROW = "downArrow",
    LEFT_RIGHT_ARROW = "leftRightArrow",
    UP_DOWN_ARROW = "upDownArrow",

    // Special Arrows
    BENT_ARROW = "bentArrow",
    BENT_UP_ARROW = "bentUpArrow",
    LEFT_RIGHT_UP_ARROW = "leftRightUpArrow",
    LEFT_UP_ARROW = "leftUpArrow",
    NOTCHED_RIGHT_ARROW = "notchedRightArrow",
    STRIPED_RIGHT_ARROW = "stripedRightArrow",
    U_TURN_ARROW = "uturnArrow",

    // Arrow Callouts
    RIGHT_ARROW_CALLOUT = "rightArrowCallout",
    LEFT_ARROW_CALLOUT = "leftArrowCallout",
    UP_ARROW_CALLOUT = "upArrowCallout",
    DOWN_ARROW_CALLOUT = "downArrowCallout",
    UP_DOWN_ARROW_CALLOUT = "upDownArrowCallout",

    // Callouts
    RECTANGULAR_CALLOUT = "wedgeRectCallout",
    ROUNDED_CALLOUT = "wedgeRoundRectCallout",
    OVAL_CALLOUT = "wedgeEllipseCallout",
    CLOUD_CALLOUT = "cloudCallout",
    LINE_CALLOUT = "borderCallout1",

    // Primitive Shapes
    TRIANGLE = "triangle",
    RIGHT_TRIANGLE = "rtTriangle",
    DIAMOND = "diamond",
    PARALLELOGRAM = "parallelogram",
    TRAPEZOID = "trapezoid",
    PENTAGON = "pentagon",
    HEXAGON = "hexagon",
    HEPTAGON = "heptagon",
    OCTAGON = "octagon",

    // Stars
    STAR_5_POINT = "star5",

    // Math Symbols
    CROSS = "plus",
    MATH_PLUS = "mathPlus",
    MATH_MINUS = "mathMinus",
    MATH_MULTIPLY = "mathMultiply",
    MATH_DIVIDE = "mathDivide",
    MATH_EQUAL = "mathEqual",
    MATH_NOT_EQUAL = "mathNotEqual",
}
export const AlignAutoShapeType = z
    .enum(ALIGN_MSO_AUTO_SHAPE_TYPE)
    .describe(
        "AutoShape type. To create a circle, use OVAL (ellipse) with equal width and height. Most commonly used shapes: rectangles (RECTANGLE, ROUNDED_RECTANGLE), OVAL, and arrow shapes (RIGHT_ARROW, LEFT_ARROW, UP_ARROW, DOWN_ARROW).",
    )
    .openapi("AlignAutoShapeType");

// Complete AddedAutoShape that extends AddedShapeBase
export const AlignAddedAutoShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("autoShape"),

    // Styling
    background: AlignFill.optional(),

    autoShapeType: AlignAutoShapeType,

    inheritStylesFrom: z.string().optional(),
}).openapi("AlignAddedAutoShape");

export const AlignUpdatedAutoShape = AlignUpdatedShapeBase.extend({

    shapeType: z.literal("autoShape"),
    autoShapeType: AlignAutoShapeType.optional(),
    background: AlignFill.optional(),
    inheritStylesFrom: z.string().optional(),
}).openapi("AlignUpdatedAutoShape");
