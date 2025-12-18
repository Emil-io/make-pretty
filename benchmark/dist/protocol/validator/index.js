// Import test validators
import { validateCountShapesTest } from "./tests/count-shapes.test";
import { validateCountSlidesTest } from "./tests/count-slides.test";
import { validateEqualityTest } from "./tests/equality.test";
import { validateIncludesTest } from "./tests/includes.test";
import { validateLlmJudgeTest } from "./tests/llm-judge.test";
import { validateNumericalValueTest } from "./tests/numerical-value.test";
import { validateValueTest } from "./tests/value.test";
export var validateTest = function (presentation, tests) {
    var results = [];
    for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
        var test_1 = tests_1[_i];
        var startTime = Date.now();
        try {
            var result = void 0;
            switch (test_1.name) {
                case "equals":
                case "not equals":
                    result = validateValueTest(presentation, test_1, startTime);
                    break;
                case "greater_than":
                case "less_than":
                case "greater_than_or_equal":
                case "less_than_or_equal":
                    result = validateNumericalValueTest(presentation, test_1, startTime);
                    break;
                case "all_are_equal":
                case "some_are_equal":
                case "none_are_equal":
                case "some_are_unequal":
                    result = validateEqualityTest(presentation, test_1, startTime);
                    break;
                case "includes":
                case "not_includes":
                    result = validateIncludesTest(presentation, test_1, startTime);
                    break;
                case "count_slides":
                    result = validateCountSlidesTest(presentation, test_1, startTime);
                    break;
                case "count_shapes":
                    result = validateCountShapesTest(presentation, test_1, startTime);
                    break;
                case "llm_judge":
                    result = validateLlmJudgeTest(presentation, test_1, startTime);
                    break;
                default:
                    result = {
                        testName: "unknown test",
                        status: "failed",
                        message: "Unknown test type: ".concat(test_1.name),
                        executionTime: Date.now() - startTime,
                    };
            }
            results.push(result);
        }
        catch (error) {
            results.push({
                testName: "".concat(test_1.name),
                status: "failed",
                message: error instanceof Error ? error.message : String(error),
                executionTime: Date.now() - startTime,
            });
        }
    }
    var passed = results.filter(function (r) { return r.status === "passed"; }).length;
    return {
        totalTests: results.length,
        passed: passed,
        failed: results.length - passed,
        results: results,
    };
};
