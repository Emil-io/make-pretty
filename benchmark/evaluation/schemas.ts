import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
    AI_MSO_AUTO_SHAPE_TYPE,
    AI_MSO_SHAPE_TYPE,
} from "../../api/server/src/schemas/common/enum";

extendZodWithOpenApi(z);

// Base schemas
export const SlideIdentifierSchema = z
    .object({
        slideId: z.int().openapi("SlideIdentifierSchema"),
    })
    .openapi("SlideIdentifierSchema");

export const ShapeIdentifierSchema = z
    .object({
        slideId: z.int(),
        shapeId: z.int(),
    })
    .openapi("ShapeIdentifierSchema");

// Filter schema for reuse (defined early so it can be used in other schemas)
const ShapeFilterSchema = z.object({
    // Accept both enum values and datamodel literal strings (camelCase)
    shapeType: z.union([
        z.enum(AI_MSO_SHAPE_TYPE),
        z.enum(["image", "textbox", "autoShape", "line", "placeholder", "table", "group"])
    ]).optional(),
    autoShapeType: z.enum(AI_MSO_AUTO_SHAPE_TYPE).optional(),
    otherAutoShapeType: z.string().optional(), // For filtering shapes with details.otherAutoShapeType (e.g., "homePlate")
    fillColor: z.string().optional(), // For filtering shapes by style.fill.color (e.g., "#D8CA7E")
    rawText: z.string().optional(), // For filtering textboxes by their text content (exact match)
    rawTextContains: z.string().optional(), // For filtering textboxes by text content (substring match)
    pos: z.object({
        // Filter by position (topLeft Y coordinate) - useful for separating rows
        topLeft: z.tuple([z.number(), z.number()]).optional(), // [x, y] - filters shapes with similar Y position (within 50px tolerance)
    }).optional(),
});

export const ShapePropertyIdentifierSchema = z
    .object({
        slideId: z.int(),
        shapeId: z.int().optional(), // Optional if filter is provided
        filter: ShapeFilterSchema.optional(), // Optional filter to find shape by properties
        key: z.string(),
    })
    .openapi("ShapePropertyIdentifierSchema")
    .refine(
        (data) => data.shapeId !== undefined || data.filter !== undefined,
        { message: "Either 'shapeId' or 'filter' must be provided" }
    )
    .refine(
        (data) => !(data.shapeId !== undefined && data.filter !== undefined),
        { message: "Cannot provide both 'shapeId' and 'filter' at the same time" }
    );

export const BaseTestSchema = z
    .object({
        name: z.string(),
        description: z.string().optional(),
        error: z.function().optional(),
    })
    .openapi("BaseTestSchema");

// Test schemas
export const ValueTestSchema = BaseTestSchema.extend({
    name: z.enum(["equals", "not equals"]),
    slideId: z.number(),
    shapeId: z.number().optional(), // Optional if filter is provided
    filter: ShapeFilterSchema.optional(), // Optional filter to find shape by properties
    key: z.string(),
    expected: z.any(),
}).openapi("ValueTestSchema").refine(
    (data) => data.shapeId !== undefined || data.filter !== undefined,
    { message: "Either 'shapeId' or 'filter' must be provided" }
).refine(
    (data) => !(data.shapeId !== undefined && data.filter !== undefined),
    { message: "Cannot provide both 'shapeId' and 'filter' at the same time" }
);

export const NumericalValueTestSchema = BaseTestSchema.extend({
    name: z.enum([
        "greater_than",
        "less_than",
        "greater_than_or_equal",
        "less_than_or_equal",
    ]),
    slideId: z.number(),
    shapeId: z.number().optional(), // Optional if filter is provided
    filter: ShapeFilterSchema.optional(), // Optional filter to find shape by properties (e.g., fillColor)
    key: z.string(),
    expected: z.number(),
}).openapi("NumericalValueTestSchema").refine(
    (data) => data.shapeId !== undefined || data.filter !== undefined,
    { message: "Either 'shapeId' or 'filter' must be provided" }
).refine(
    (data) => !(data.shapeId !== undefined && data.filter !== undefined),
    { message: "Cannot provide both 'shapeId' and 'filter' at the same time" }
);

// Extended shape property identifier that supports filters
const ExtendedShapePropertyIdentifierSchema = ShapePropertyIdentifierSchema.extend({
    filter: ShapeFilterSchema.optional(), // Optional filter to find shape by properties
}).refine(
    (data) => data.shapeId !== undefined || data.filter !== undefined,
    { message: "Either 'shapeId' or 'filter' must be provided" }
).refine(
    (data) => !(data.shapeId !== undefined && data.filter !== undefined),
    { message: "Cannot provide both 'shapeId' and 'filter' at the same time" }
);

export const EqualityTestSchema = BaseTestSchema.extend({
    name: z.enum([
        "all_are_equal",
        "some_are_equal",
        "none_are_equal",
        "some_are_unequal",
    ]),
    objects: z.array(ExtendedShapePropertyIdentifierSchema),
}).openapi("EqualityTestSchema");

export const IncludesTestSchema = BaseTestSchema.extend({
    name: z.enum(["includes", "not_includes"]),
    slideId: z.number(),
    shapeId: z.number().optional(), // Optional if filter is provided
    filter: ShapeFilterSchema.optional(), // Optional filter to find shape by properties
    key: z.string(),
    expected: z.any(),
}).openapi("IncludesTestSchema").refine(
    (data) => data.shapeId !== undefined || data.filter !== undefined,
    { message: "Either 'shapeId' or 'filter' must be provided" }
).refine(
    (data) => !(data.shapeId !== undefined && data.filter !== undefined),
    { message: "Cannot provide both 'shapeId' and 'filter' at the same time" }
);

export const CountSlidesTestSchema = BaseTestSchema.extend({
    name: z.literal("count_slides"),
    expected: z.number(),
}).openapi("CountSlidesTestSchema");

export const CountShapesTestSchema = BaseTestSchema.extend({
    name: z.literal("count_shapes"),
    slideId: z.number(),
    filter: ShapeFilterSchema.optional(),
    expected: z.number(),
}).openapi("CountShapesTestSchema");

export const LlmJudgeTestSchema = BaseTestSchema.extend({
    name: z.literal("llm_judge"),
    slideId: z.number(),
    autoGenerate: z.boolean().optional(), // defaults to true in validation logic
    // Optional context to guide question generation
    criteria: z.string().optional(), // High-level evaluation criteria
    focusAreas: z.array(z.string()).optional(), // Specific aspects to validate
    expectedChanges: z.array(z.string()).optional(), // List of expected transformations
    // Weight for overall score calculation (0-1, default 0.5)
    // Overall score = staticTests * (1 - weight) + llmJudge * weight
    weight: z.number().min(0).max(1).optional(), // defaults to 0.5 in validation logic
}).openapi("LlmJudgeTestSchema");

export const SpacingTestSchema = BaseTestSchema.extend({
    name: z.literal("equal_spacing"),
    slideId: z.number(),
    shapeIds: z.array(z.number()).min(2),
    direction: z.enum(["horizontal", "vertical"]),
}).openapi("SpacingTestSchema");

export const BoundaryTestSchema = BaseTestSchema.extend({
    name: z.literal("within_boundaries"),
    slideId: z.number(),
    minMargin: z.number().default(10),
}).openapi("BoundaryTestSchema");

export const SlideFillDistributionTestSchema = BaseTestSchema.extend({
    name: z.literal("slide_fill_distribution"),
    slideId: z.number(),
    filter: z
        .object({
            // Accept both enum values and datamodel literal strings (camelCase)
            shapeType: z.union([
                z.enum(AI_MSO_SHAPE_TYPE),
                z.enum(["image", "textbox", "autoShape", "line", "placeholder", "table", "group"])
            ]).optional(),
            autoShapeType: z.enum(AI_MSO_AUTO_SHAPE_TYPE).optional(),
        })
        .optional(),
    minFillPercentage: z.number().min(0).max(100).default(50), // Minimum % of horizontal slide width that should be covered
}).openapi("SlideFillDistributionTestSchema");

/**
 * Filtered equality test - finds shapes by filter and validates property equality.
 *
 * Allows for "outlier" shapes: passes if at least `minMatchCount` shapes share the same value.
 * This handles cases where new shapes are added that match the filter but aren't part of
 * the semantic group (e.g., 4 columns + 1 unrelated box, all roundRect).
 *
 * Example:
 * - Filter finds 5 roundRect shapes
 * - Check pos.topLeft[1] (Y-coordinate)
 * - 4 shapes have Y=246, 1 shape has Y=600
 * - minMatchCount=4 → PASS (4 shapes are aligned)
 *
 * When `filters` (array) is provided instead of `filter` (single):
 * - Checks that shapes matching each filter have equal property values
 * - Useful for checking alignment between specific text values (e.g., "01" and "04" have same X)
 * - Example: filters=[{rawText: "01"}, {rawText: "04"}] checks that both have same X coordinate
 */
export const FilteredEqualityTestSchema = BaseTestSchema.extend({
    name: z.literal("filtered_equality"),
    slideId: z.number(),
    filter: ShapeFilterSchema.optional(), // Single filter (for backward compatibility)
    filters: z.array(ShapeFilterSchema).optional(), // Multiple filters (for checking equality between groups)
    key: z.string(), // Property path to compare
    minMatchCount: z.number().min(2), // Minimum number of shapes that must share the same value (only used with single filter)
}).openapi("FilteredEqualityTestSchema").refine(
    (data) => data.filter !== undefined || data.filters !== undefined,
    { message: "Either 'filter' or 'filters' must be provided" }
).refine(
    (data) => !(data.filter !== undefined && data.filters !== undefined),
    { message: "Cannot provide both 'filter' and 'filters' at the same time" }
);

/**
 * Filtered spacing test - finds shapes by filter and validates equal spacing.
 *
 * Similar to filtered equality: passes if at least `minMatchCount` shapes form
 * an equally-spaced group. Outliers are ignored.
 *
 * If `groupByPerpendicularPosition` is true:
 * - For horizontal spacing: groups shapes by similar Y position (same row) first, then checks spacing within each row
 * - For vertical spacing: groups shapes by similar X position (same column) first, then checks spacing within each column
 * This prevents mixing shapes from different rows/columns when checking spacing.
 */
export const FilteredSpacingTestSchema = BaseTestSchema.extend({
    name: z.literal("filtered_spacing"),
    slideId: z.number(),
    filter: ShapeFilterSchema,
    direction: z.enum(["horizontal", "vertical"]),
    minMatchCount: z.number().min(2), // Minimum number of shapes that must be equally spaced
    groupByPerpendicularPosition: z.boolean().optional(), // If true, group by perpendicular position (Y for horizontal, X for vertical) before checking spacing
}).openapi("FilteredSpacingTestSchema");

/**
 * Line validation test - validates line shapes for verticality, equal length, and positioning.
 *
 * Checks:
 * - Each line is vertical (startPos[0] == endPos[0] within tolerance)
 * - All lines have equal length (calculated from startPos/endPos)
 * - Optionally: Lines divide textboxes properly (lines positioned between textboxes)
 */
export const LineValidationTestSchema = BaseTestSchema.extend({
    name: z.literal("line_validation"),
    slideId: z.number(),
    filter: ShapeFilterSchema.optional(), // Filter for lines (defaults to shapeType: "line")
    checkVerticality: z.boolean().default(true), // Check that each line is vertical
    checkEqualLength: z.boolean().default(true), // Check that all lines have equal length
    checkDividesTextboxes: z.boolean().default(false), // Check that lines divide textboxes (requires textboxFilter)
    textboxFilter: ShapeFilterSchema.optional(), // Filter for textboxes to check division (required if checkDividesTextboxes is true)
}).openapi("LineValidationTestSchema").refine(
    (data) => !data.checkDividesTextboxes || data.textboxFilter !== undefined,
    { message: "textboxFilter is required when checkDividesTextboxes is true" }
);

/**
 * Bar percentage test - validates that a bar's width is a specific percentage of its background bar's width.
 *
 * Dynamically finds the background bar by matching X position, then calculates the ratio.
 * This avoids hardcoding background widths and makes validation flexible.
 *
 * Example:
 * - Purple bar (shape 279) at X=192.7, width=287.3px
 * - Background bar (shape 278) at X=192.7, width=337.5px
 * - Ratio: 287.3 / 337.5 = 85.1%
 * - Expected: 90% (with ±5% tolerance) → Check if 85.1% is within 85-95%
 */
export const BarPercentageTestSchema = BaseTestSchema.extend({
    name: z.literal("bar_percentage"),
    slideId: z.number(),
    barShapeId: z.number(), // The bar shape to check (e.g., purple bar)
    backgroundFilter: ShapeFilterSchema, // Filter to find the background bar (e.g., { fillColor: "#FFFFFF" })
    expectedPercentage: z.number().min(0).max(100), // Expected percentage (e.g., 90 for 90%)
    percentageTolerance: z.number().default(5), // Tolerance in percentage points (e.g., 5 means ±5%)
}).openapi("BarPercentageTestSchema");

// Discriminated union schema for test protocol
export const ChangesetTestProtocol = z
    .array(
        z.discriminatedUnion("name", [
            ValueTestSchema,
            NumericalValueTestSchema,
            EqualityTestSchema,
            IncludesTestSchema,
            LlmJudgeTestSchema,
            CountSlidesTestSchema,
            CountShapesTestSchema,
            SpacingTestSchema,
            BoundaryTestSchema,
            SlideFillDistributionTestSchema,
            FilteredEqualityTestSchema,
            FilteredSpacingTestSchema,
            LineValidationTestSchema,
            BarPercentageTestSchema,
        ]),
    )
    .openapi("ChangesetTestProtocol");

// Shape schema
export const Shape = z
    .object({
        color: z.string(),
        width: z.number(),
        height: z.number(),
    })
    .openapi("Shape");

// Test result schemas
export const TestResult = z
    .object({
        testName: z.string(),
        status: z.enum(["passed", "failed"]),
        message: z.string().optional(),
        actual: z.any().optional(),
        expected: z.any().optional(),
        executionTime: z.number().optional(),
    })
    .openapi("TestResult");

export const TestSuiteResult = z
    .object({
        totalTests: z.number(),
        passed: z.number(),
        failed: z.number(),
        results: z.array(TestResult),
        // Weighted overall score (0-100%)
        // Combines static test pass rate with LLM judge scores using configured weights
        weightedScore: z.number().min(0).max(100).optional(),
        // Breakdown of score components
        staticTestScore: z.number().min(0).max(100).optional(), // % of static tests passed
        llmJudgeScore: z.number().min(0).max(100).optional(), // Average LLM judge score
        llmJudgeWeight: z.number().min(0).max(1).optional(), // Weight used for LLM judge
    })
    .openapi("TestSuiteResult");

// Type exports for backward compatibility
export type TSlideIdentifierSchema = z.infer<typeof SlideIdentifierSchema>;
export type TShapeIdentifierSchema = z.infer<typeof ShapeIdentifierSchema>;
export type TShapePropertyIdentifierSchema = z.infer<
    typeof ShapePropertyIdentifierSchema
>;
export type TBaseTestSchema = z.infer<typeof BaseTestSchema>;
export type TValueTestSchema = z.infer<typeof ValueTestSchema>;
export type TNumericalValueTestSchema = z.infer<
    typeof NumericalValueTestSchema
>;
export type TEqualityTestSchema = z.infer<typeof EqualityTestSchema>;
export type TIncludesTestSchema = z.infer<typeof IncludesTestSchema>;
export type TCountSlidesTestSchema = z.infer<typeof CountSlidesTestSchema>;
export type TCountShapesTestSchema = z.infer<typeof CountShapesTestSchema>;
export type TLlmJudgeTestSchema = z.infer<typeof LlmJudgeTestSchema>;
export type TSpacingTestSchema = z.infer<typeof SpacingTestSchema>;
export type TBoundaryTestSchema = z.infer<typeof BoundaryTestSchema>;
export type TSlideFillDistributionTestSchema = z.infer<
    typeof SlideFillDistributionTestSchema
>;
export type TFilteredEqualityTestSchema = z.infer<
    typeof FilteredEqualityTestSchema
>;
export type TFilteredSpacingTestSchema = z.infer<
    typeof FilteredSpacingTestSchema
>;
export type TLineValidationTestSchema = z.infer<
    typeof LineValidationTestSchema
>;
export type TBarPercentageTestSchema = z.infer<typeof BarPercentageTestSchema>;
export type TChangesetTestProtocol = z.infer<typeof ChangesetTestProtocol>;
export type TShape = z.infer<typeof Shape>;
export type TTestResult = z.infer<typeof TestResult>;
export type TTestSuiteResult = z.infer<typeof TestSuiteResult>;
