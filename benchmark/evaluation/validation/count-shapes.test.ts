import { AITPres } from "../../../api/server/src/schemas/base";
import { TCountShapesTestSchema, TTestResult } from "../schemas";
import { getShapes } from "./utils";

export function validateCountShapesTest(
    presentation: AITPres,
    test: TCountShapesTestSchema,
    startTime: number
): TTestResult {
    const shapes = getShapes(presentation, test.slideId, test.filter);
    const actual = shapes.length;
    const passed = actual === test.expected;
    
    return {
        testName: `count_shapes - Slide ${test.slideId}${test.filter ? ` (filtered)` : ''}`,
        status: passed ? "passed" : "failed",
        message: passed ? undefined : `Expected ${test.expected} shapes, got ${actual}`,
        actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
