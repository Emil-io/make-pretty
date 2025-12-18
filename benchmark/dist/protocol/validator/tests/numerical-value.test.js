import { getShapeProperty } from "../utils";
export function validateNumericalValueTest(presentation, test, startTime) {
    var actual = getShapeProperty(presentation, test.slideId, test.shapeId, test.key);
    var passed = false;
    switch (test.name) {
        case "greater_than":
            passed = actual > test.expected;
            break;
        case "less_than":
            passed = actual < test.expected;
            break;
        case "greater_than_or_equal":
            passed = actual >= test.expected;
            break;
        case "less_than_or_equal":
            passed = actual <= test.expected;
            break;
    }
    return {
        testName: "".concat(test.name, " - Slide ").concat(test.slideId, ", Shape ").concat(test.shapeId, ", ").concat(test.key),
        status: passed ? "passed" : "failed",
        message: passed ? undefined : "Expected ".concat(test.key, " ").concat(test.name.replace(/_/g, ' '), " ").concat(test.expected, ", got ").concat(actual),
        actual: actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
