import { getShapes } from "../utils";
export function validateCountShapesTest(presentation, test, startTime) {
    var shapes = getShapes(presentation, test.slideId, test.filter);
    var actual = shapes.length;
    var passed = actual === test.expected;
    return {
        testName: "count_shapes - Slide ".concat(test.slideId).concat(test.filter ? " (filtered)" : ''),
        status: passed ? "passed" : "failed",
        message: passed ? undefined : "Expected ".concat(test.expected, " shapes, got ").concat(actual),
        actual: actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
