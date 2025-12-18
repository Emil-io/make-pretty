import { AITPres } from "../../../api/server/src/schemas/base";
import { TBoundaryTestSchema, TTestResult } from "../schemas";
import { getSlide } from "./utils";

export function validateBoundaryTest(
    presentation: AITPres,
    test: TBoundaryTestSchema,
    startTime: number
): TTestResult {
    try {
        const slide = getSlide(presentation, test.slideId);
        const slideWidth = presentation.info.slideWidth;
        const slideHeight = presentation.info.slideHeight;
        const minMargin = test.minMargin;

        const violations: string[] = [];
        const shapes = slide.shapes as any[];

        for (const shape of shapes) {
            // Skip shapes without position data
            if (!shape.pos || !shape.pos.topLeft || !shape.pos.bottomRight) {
                continue;
            }
            const topLeft = shape.pos.topLeft;
            const bottomRight = shape.pos.bottomRight;

            // Check left boundary
            if (topLeft[0] < minMargin) {
                violations.push(`Shape ${shape.id}: left edge (${topLeft[0]}) is too close to left boundary (min: ${minMargin})`);
            }

            // Check right boundary
            if (bottomRight[0] > slideWidth - minMargin) {
                violations.push(`Shape ${shape.id}: right edge (${bottomRight[0]}) is too close to right boundary (max: ${slideWidth - minMargin})`);
            }

            // Check top boundary
            if (topLeft[1] < minMargin) {
                violations.push(`Shape ${shape.id}: top edge (${topLeft[1]}) is too close to top boundary (min: ${minMargin})`);
            }

            // Check bottom boundary
            if (bottomRight[1] > slideHeight - minMargin) {
                violations.push(`Shape ${shape.id}: bottom edge (${bottomRight[1]}) is too close to bottom boundary (max: ${slideHeight - minMargin})`);
            }
        }

        const passed = violations.length === 0;

        return {
            testName: test.description || `within_boundaries - Slide ${test.slideId} (${minMargin}px margin)`,
            status: passed ? "passed" : "failed",
            message: passed ? undefined : `Boundary violations: ${violations.join('; ')}`,
            actual: violations,
            expected: `All shapes within ${minMargin}px of slide edges`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName: test.description || `within_boundaries - Slide ${test.slideId}`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}
