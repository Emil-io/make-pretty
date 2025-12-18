import { AITPres } from "../../../api/server/src/schemas/base";
import { TSlideFillDistributionTestSchema, TTestResult } from "../schemas";
import { getShapes, getSlide } from "./utils";

/**
 * Validates that shapes actually fill/cover a percentage of the slide width.
 *
 * This test sums up the actual widths of all matching shapes and checks
 * if the total coverage is at least minFillPercentage of the slide width.
 *
 * Example:
 * - Two 300px boxes on a 1200px slide
 * - Coverage: (300 + 300) / 1200 = 50%
 */
export function validateSlideFillDistributionTest(
    presentation: AITPres,
    test: TSlideFillDistributionTestSchema,
    startTime: number
): TTestResult {
    try {
        const slide = getSlide(presentation, test.slideId);
        const slideWidth = presentation.info.slideWidth;
        const minFillPercentage = test.minFillPercentage ?? 50;

        // Get shapes matching the filter
        let shapes = slide.shapes as any[];
        if (test.filter) {
            if (test.filter.shapeType) {
                shapes = shapes.filter(
                    (s: any) => s.shapeType === test.filter!.shapeType
                );
            }
            if (test.filter.autoShapeType) {
                shapes = shapes.filter(
                    (s: any) =>
                        s.details?.autoShapeType === test.filter!.autoShapeType
                );
            }
        }

        // Filter to shapes with valid size data
        const shapesWithSize = shapes.filter((s: any) => s.size?.w);

        if (shapesWithSize.length === 0) {
            return {
                testName:
                    test.description ||
                    `slide_fill_distribution - Slide ${test.slideId}`,
                status: "failed",
                message: "No shapes with size data found matching the filter",
                executionTime: Date.now() - startTime,
            };
        }

        // Sum up the actual widths of all shapes
        let totalCoverage = 0;
        for (const shape of shapesWithSize) {
            totalCoverage += shape.size.w;
        }

        // Calculate the coverage percentage
        const fillPercentage = (totalCoverage / slideWidth) * 100;
        const passed = fillPercentage >= minFillPercentage;

        return {
            testName:
                test.description ||
                `slide_fill_distribution - Slide ${test.slideId}`,
            status: passed ? "passed" : "failed",
            message: passed
                ? undefined
                : `Shapes cover ${fillPercentage.toFixed(1)}% of slide width (${totalCoverage.toFixed(0)}px / ${slideWidth}px), expected at least ${minFillPercentage}%`,
            actual: {
                fillPercentage: Number(fillPercentage.toFixed(1)),
                totalCoverage: Number(totalCoverage.toFixed(0)),
                slideWidth,
                shapeCount: shapesWithSize.length,
            },
            expected: `At least ${minFillPercentage}% horizontal coverage`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName:
                test.description ||
                `slide_fill_distribution - Slide ${test.slideId}`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}
