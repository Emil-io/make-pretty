import { AITPres } from "../../../api/server/src/schemas/base";
import { TCountSlidesTestSchema, TTestResult } from "../schemas";

export function validateCountSlidesTest(
    presentation: AITPres,
    test: TCountSlidesTestSchema,
    startTime: number
): TTestResult {
    const actual = presentation.slides.length;
    const passed = actual === test.expected;
    
    return {
        testName: `count_slides`,
        status: passed ? "passed" : "failed",
        message: passed ? undefined : `Expected ${test.expected} slides, got ${actual}`,
        actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
