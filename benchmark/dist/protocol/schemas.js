import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { AI_MSO_AUTO_SHAPE_TYPE, AI_MSO_SHAPE_TYPE, } from "../../api/server/src/schemas/common/enum";
extendZodWithOpenApi(z);
// Base schemas
export var SlideIdentifierSchema = z
    .object({
    slideId: z.int().openapi("SlideIdentifierSchema"),
})
    .openapi("SlideIdentifierSchema");
export var ShapeIdentifierSchema = z
    .object({
    slideId: z.int(),
    shapeId: z.int(),
})
    .openapi("ShapeIdentifierSchema");
export var ShapePropertyIdentifierSchema = z
    .object({
    slideId: z.int(),
    shapeId: z.int(),
    key: z.string(),
})
    .openapi("ShapePropertyIdentifierSchema");
export var BaseTestSchema = z
    .object({
    name: z.string(),
    error: z.function().optional(),
})
    .openapi("BaseTestSchema");
// Test schemas
export var ValueTestSchema = BaseTestSchema.extend({
    name: z.enum(["equals", "not equals"]),
    slideId: z.number(),
    shapeId: z.number(),
    key: z.string(),
    expected: z.any(),
}).openapi("ValueTestSchema");
export var NumericalValueTestSchema = BaseTestSchema.extend({
    name: z.enum([
        "greater_than",
        "less_than",
        "greater_than_or_equal",
        "less_than_or_equal",
    ]),
    slideId: z.number(),
    shapeId: z.number(),
    key: z.string(),
    expected: z.number(),
}).openapi("NumericalValueTestSchema");
export var EqualityTestSchema = BaseTestSchema.extend({
    name: z.enum([
        "all_are_equal",
        "some_are_equal",
        "none_are_equal",
        "some_are_unequal",
    ]),
    objects: z.array(ShapePropertyIdentifierSchema),
}).openapi("EqualityTestSchema");
export var IncludesTestSchema = BaseTestSchema.extend({
    name: z.enum(["includes", "not_includes"]),
    slideId: z.number(),
    shapeId: z.number(),
    key: z.string(),
    expected: z.any(),
}).openapi("IncludesTestSchema");
export var CountSlidesTestSchema = BaseTestSchema.extend({
    name: z.literal("count_slides"),
    expected: z.number(),
}).openapi("CountSlidesTestSchema");
export var CountShapesTestSchema = BaseTestSchema.extend({
    name: z.literal("count_shapes"),
    slideId: z.number(),
    filter: z
        .object({
        shapeType: z.enum(AI_MSO_SHAPE_TYPE).optional(),
        autoShapeType: z.enum(AI_MSO_AUTO_SHAPE_TYPE).optional(),
    })
        .optional(),
    expected: z.number(),
}).openapi("CountShapesTestSchema");
export var LlmJugeTestSchema = BaseTestSchema.extend({
    name: z.literal("llm_judge"),
    question: z.string(),
    expectedAnswer: z.string(),
    slideId: z.number(),
}).openapi("LlmJugeTestSchema");
// Discriminated union schema for test protocol
export var ChangesetTestProtocol = z
    .array(z.discriminatedUnion("name", [
    ValueTestSchema,
    NumericalValueTestSchema,
    EqualityTestSchema,
    IncludesTestSchema,
    LlmJugeTestSchema,
    CountSlidesTestSchema,
    CountShapesTestSchema,
]))
    .openapi("ChangesetTestProtocol");
// Shape schema
export var Shape = z
    .object({
    color: z.string(),
    width: z.number(),
    height: z.number(),
})
    .openapi("Shape");
// Test result schemas
export var TestResult = z
    .object({
    testName: z.string(),
    status: z.enum(["passed", "failed"]),
    message: z.string().optional(),
    actual: z.any().optional(),
    expected: z.any().optional(),
    executionTime: z.number().optional(),
})
    .openapi("TestResult");
export var TestSuiteResult = z
    .object({
    totalTests: z.number(),
    passed: z.number(),
    failed: z.number(),
    results: z.array(TestResult),
})
    .openapi("TestSuiteResult");
