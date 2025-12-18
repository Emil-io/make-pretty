import z from "zod";

export enum LayoutType {
    ROW = "row",
    COLUMN = "column",
    GRID = "grid",
    GROUP = "group",
}

export type ShapeId = string | number;
export type LayoutId = string;

export type LayoutBase = {
    id: LayoutId; // optional id of layout
    name: string; // human readable name/description of layout
    type: LayoutType; // describes how the layout arranges its sublayouts
};

export type SingleLayout = LayoutBase & {
    id: LayoutId;
    b: [[number, number], [number, number]]; // single layout, i.e., [[x1,y1],[x2,y2] <-- boundaries of layout]
    multi: false; // if false, "b" is a single boundary
    sl?: Layout[];
    s?: ShapeId[]; // s === shapes (only for leaf layouts without multi)
};

export type MultiLayout = LayoutBase & {
    id: LayoutId;
    b: Array<[LayoutId, [number, number], [number, number], ShapeId[]]>; // multi layout with shapes, i.e., [[[x1,y1],[x2,y2] <-- boundaries of layout, [id1, id2, ...] <-- shapes in layout]
    multi: true; // if true, "b" is an array of boundaries for repetitive sublayouts
    sl?: Layout[]; // sl === sublayouts
    s?: ShapeId[]; // s === shapes (only for leaf layouts without multi)
};

export type Layout = SingleLayout | MultiLayout;

// Schemas
export const SingleBoundarySchema = z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
]);

export const MultiBoundaryWithoutShapesSchema = z.array(
    z.tuple([
        z.tuple([z.number(), z.number()]),
        z.tuple([z.number(), z.number()]),
    ]),
);

export const MultiBoundaryWithShapesSchema = z.array(
    z.tuple([
        z.string(), // id of layout
        z.tuple([z.number(), z.number()]), // topLeft of layout
        z.tuple([z.number(), z.number()]), // bottomRight of layout
        z.array(z.union([z.string(), z.number()])), // shape ids
    ]),
);

export const ShapesSchema = z.array(z.union([z.string(), z.number()]));

export const LayoutTypeSchema = z.enum(LayoutType);

export const LayoutSchema: z.ZodType<Layout> = z.discriminatedUnion("multi", [
    // Multi layout without sublayouts (leaf) - shapes in boundary array
    z.object({
        id: z.string(),
        name: z.string(),
        type: LayoutTypeSchema,
        multi: z.literal(true),
        b: MultiBoundaryWithShapesSchema,
        sl: z.array(z.lazy(() => LayoutSchema) as z.ZodType<Layout>).optional(), // sl === sublayouts (required for non-leaf)
    }),
    // Single layout with sublayouts (non-leaf)
    z.object({
        id: z.string(),
        name: z.string(),
        type: LayoutTypeSchema,
        multi: z.literal(false),
        b: SingleBoundarySchema,
        sl: z.array(z.lazy(() => LayoutSchema) as z.ZodType<Layout>).optional(), // sl === sublayouts (required for non-leaf)
        s: ShapesSchema.optional(),
    }),
]);

export const ImageMapping = z
    .record(z.string(), z.string())
    .describe(
        'Maps each image shape ID to a concise name/description (in the form: "(img-type) name/very concise description"), where image type is one of: icon, image, logo, profile.',
    );

export const LayoutAnalyzerOutputSchema = z.object({
    layout: LayoutSchema,
    imgMapping: ImageMapping.optional(),
});

// Type exports
export type LayoutAnalyzerOutput = z.infer<typeof LayoutAnalyzerOutputSchema>;
