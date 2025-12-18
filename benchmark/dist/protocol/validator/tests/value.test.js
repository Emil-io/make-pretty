import { getShapeProperty } from "../utils";
export function validateValueTest(presentation, test, startTime) {
    var actual = getShapeProperty(presentation, test.slideId, test.shapeId, test.key);
    var matches = actual === test.expected;
    var shouldMatch = test.name === "equals";
    if (matches === shouldMatch) {
        return {
            testName: "".concat(test.name, " - Slide ").concat(test.slideId, ", Shape ").concat(test.shapeId, ", ").concat(test.key),
            status: "passed",
            actual: actual,
            expected: test.expected,
            executionTime: Date.now() - startTime,
        };
    }
    else {
        return {
            testName: "".concat(test.name, " - Slide ").concat(test.slideId, ", Shape ").concat(test.shapeId, ", ").concat(test.key),
            status: "failed",
            message: "Expected ".concat(test.expected, ", got ").concat(actual),
            actual: actual,
            expected: test.expected,
            executionTime: Date.now() - startTime,
        };
    }
}
