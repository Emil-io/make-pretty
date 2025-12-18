import z from "zod";
export var LayoutType;
(function (LayoutType) {
    LayoutType["ROW"] = "row";
    LayoutType["COLUMN"] = "column";
    LayoutType["GRID"] = "grid";
    LayoutType["GROUP"] = "group";
})(LayoutType || (LayoutType = {}));
// Schemas
export var SingleBoundarySchema = z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
]);
export var MultiBoundaryWithoutShapesSchema = z.array(z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
]));
export var MultiBoundaryWithShapesSchema = z.array(z.tuple([
    z.string(), // id of layout
    z.tuple([z.number(), z.number()]), // topLeft of layout
    z.tuple([z.number(), z.number()]), // bottomRight of layout
    z.array(z.union([z.string(), z.number()])), // shape ids
]));
export var ShapesSchema = z.array(z.union([z.string(), z.number()]));
export var LayoutTypeSchema = z.enum(LayoutType);
export var LayoutSchema = z.discriminatedUnion("multi", [
    // Multi layout without sublayouts (leaf) - shapes in boundary array
    z.object({
        id: z.string(),
        name: z.string(),
        type: LayoutTypeSchema,
        multi: z.literal(true),
        b: MultiBoundaryWithShapesSchema,
        sl: z.array(z.lazy(function () { return LayoutSchema; })).optional(), // sl === sublayouts (required for non-leaf)
    }),
    // Single layout with sublayouts (non-leaf)
    z.object({
        id: z.string(),
        name: z.string(),
        type: LayoutTypeSchema,
        multi: z.literal(false),
        b: SingleBoundarySchema,
        sl: z.array(z.lazy(function () { return LayoutSchema; })).optional(), // sl === sublayouts (required for non-leaf)
        s: ShapesSchema.optional(),
    }),
]);
export var ImageMapping = z
    .record(z.string(), z.string())
    .describe('Maps each image shape ID to a concise name/description (in the form: "(img-type) name/very concise description"), where image type is one of: icon, image, logo, profile.');
export var LayoutAnalyzerOutputSchema = z.object({
    layout: LayoutSchema,
    imgMapping: ImageMapping.optional(),
});
