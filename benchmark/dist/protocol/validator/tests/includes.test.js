import { getShapeProperty } from "../utils";
export function validateIncludesTest(presentation, test, startTime) {
    var actual = getShapeProperty(presentation, test.slideId, test.shapeId, test.key);
    var includes = false;
    if (Array.isArray(actual)) {
        includes = actual.includes(test.expected);
    }
    else if (typeof actual === "string") {
        includes = actual.includes(test.expected);
    }
    else if (typeof actual === "object" && actual !== null) {
        includes = test.expected in actual;
    }
    var shouldInclude = test.name === "includes";
    var passed = includes === shouldInclude;
    return {
        testName: "".concat(test.name, " - Slide ").concat(test.slideId, ", Shape ").concat(test.shapeId, ", ").concat(test.key),
        status: passed ? "passed" : "failed",
        message: passed ? undefined : "Expected ".concat(test.key, " to ").concat(test.name === "includes" ? "include" : "not include", " ").concat(test.expected),
        actual: actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
