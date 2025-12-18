import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { AlignAddedShapeBase, AlignFill, AlignUpdatedShapeBase, } from "./common.js";
extendZodWithOpenApi(z);
export var ALIGN_MSO_AUTO_SHAPE_TYPE;
(function (ALIGN_MSO_AUTO_SHAPE_TYPE) {
    // Rectangles
    ALIGN_MSO_AUTO_SHAPE_TYPE["RECTANGLE"] = "rect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["ROUNDED_RECTANGLE"] = "roundRect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["ROUND_1_RECTANGLE"] = "round1Rect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["ROUND_2_DIAG_RECTANGLE"] = "round2DiagRect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["ROUND_2_SAME_RECTANGLE"] = "round2SameRect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["SNIP_1_RECTANGLE"] = "snip1Rect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["SNIP_2_DIAG_RECTANGLE"] = "snip2DiagRect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["SNIP_2_SAME_RECTANGLE"] = "snip2SameRect";
    ALIGN_MSO_AUTO_SHAPE_TYPE["SNIP_ROUND_RECTANGLE"] = "snipRoundRect";
    // Oval
    ALIGN_MSO_AUTO_SHAPE_TYPE["OVAL"] = "ellipse";
    // Basic Arrows
    ALIGN_MSO_AUTO_SHAPE_TYPE["RIGHT_ARROW"] = "rightArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LEFT_ARROW"] = "leftArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["UP_ARROW"] = "upArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["DOWN_ARROW"] = "downArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LEFT_RIGHT_ARROW"] = "leftRightArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["UP_DOWN_ARROW"] = "upDownArrow";
    // Special Arrows
    ALIGN_MSO_AUTO_SHAPE_TYPE["BENT_ARROW"] = "bentArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["BENT_UP_ARROW"] = "bentUpArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LEFT_RIGHT_UP_ARROW"] = "leftRightUpArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LEFT_UP_ARROW"] = "leftUpArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["NOTCHED_RIGHT_ARROW"] = "notchedRightArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["STRIPED_RIGHT_ARROW"] = "stripedRightArrow";
    ALIGN_MSO_AUTO_SHAPE_TYPE["U_TURN_ARROW"] = "uturnArrow";
    // Arrow Callouts
    ALIGN_MSO_AUTO_SHAPE_TYPE["RIGHT_ARROW_CALLOUT"] = "rightArrowCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LEFT_ARROW_CALLOUT"] = "leftArrowCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["UP_ARROW_CALLOUT"] = "upArrowCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["DOWN_ARROW_CALLOUT"] = "downArrowCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["UP_DOWN_ARROW_CALLOUT"] = "upDownArrowCallout";
    // Callouts
    ALIGN_MSO_AUTO_SHAPE_TYPE["RECTANGULAR_CALLOUT"] = "wedgeRectCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["ROUNDED_CALLOUT"] = "wedgeRoundRectCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["OVAL_CALLOUT"] = "wedgeEllipseCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["CLOUD_CALLOUT"] = "cloudCallout";
    ALIGN_MSO_AUTO_SHAPE_TYPE["LINE_CALLOUT"] = "borderCallout1";
    // Primitive Shapes
    ALIGN_MSO_AUTO_SHAPE_TYPE["TRIANGLE"] = "triangle";
    ALIGN_MSO_AUTO_SHAPE_TYPE["RIGHT_TRIANGLE"] = "rtTriangle";
    ALIGN_MSO_AUTO_SHAPE_TYPE["DIAMOND"] = "diamond";
    ALIGN_MSO_AUTO_SHAPE_TYPE["PARALLELOGRAM"] = "parallelogram";
    ALIGN_MSO_AUTO_SHAPE_TYPE["TRAPEZOID"] = "trapezoid";
    ALIGN_MSO_AUTO_SHAPE_TYPE["PENTAGON"] = "pentagon";
    ALIGN_MSO_AUTO_SHAPE_TYPE["HEXAGON"] = "hexagon";
    ALIGN_MSO_AUTO_SHAPE_TYPE["HEPTAGON"] = "heptagon";
    ALIGN_MSO_AUTO_SHAPE_TYPE["OCTAGON"] = "octagon";
    // Stars
    ALIGN_MSO_AUTO_SHAPE_TYPE["STAR_5_POINT"] = "star5";
    // Math Symbols
    ALIGN_MSO_AUTO_SHAPE_TYPE["CROSS"] = "plus";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_PLUS"] = "mathPlus";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_MINUS"] = "mathMinus";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_MULTIPLY"] = "mathMultiply";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_DIVIDE"] = "mathDivide";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_EQUAL"] = "mathEqual";
    ALIGN_MSO_AUTO_SHAPE_TYPE["MATH_NOT_EQUAL"] = "mathNotEqual";
})(ALIGN_MSO_AUTO_SHAPE_TYPE || (ALIGN_MSO_AUTO_SHAPE_TYPE = {}));
export var AlignAutoShapeType = z
    .enum(ALIGN_MSO_AUTO_SHAPE_TYPE)
    .describe("AutoShape type. To create a circle, use OVAL (ellipse) with equal width and height. Most commonly used shapes: rectangles (RECTANGLE, ROUNDED_RECTANGLE), OVAL, and arrow shapes (RIGHT_ARROW, LEFT_ARROW, UP_ARROW, DOWN_ARROW).")
    .openapi("AlignAutoShapeType");
// Complete AddedAutoShape that extends AddedShapeBase
export var AlignAddedAutoShape = AlignAddedShapeBase.extend({
    shapeType: z.literal("autoShape"),
    // Styling
    background: AlignFill.optional(),
    autoShapeType: AlignAutoShapeType,
    inheritStylesFrom: z.string().optional(),
}).openapi("AlignAddedAutoShape");
export var AlignUpdatedAutoShape = AlignUpdatedShapeBase.extend({
    shapeType: z.literal("autoShape"),
    autoShapeType: AlignAutoShapeType.optional(),
    background: AlignFill.optional(),
    inheritStylesFrom: z.string().optional(),
}).openapi("AlignUpdatedAutoShape");
