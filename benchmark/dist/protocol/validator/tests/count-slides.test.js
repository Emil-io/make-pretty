export function validateCountSlidesTest(presentation, test, startTime) {
    var actual = presentation.slides.length;
    var passed = actual === test.expected;
    return {
        testName: "count_slides",
        status: passed ? "passed" : "failed",
        message: passed ? undefined : "Expected ".concat(test.expected, " slides, got ").concat(actual),
        actual: actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
