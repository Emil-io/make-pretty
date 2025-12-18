import { AITPres } from "../../../api/server/src/schemas/base";
import {
    TChangesetTestProtocol,
    TTestResult,
    TTestSuiteResult,
} from "../schemas";

// Import test validators
import { validateBarPercentageTest } from "./bar-percentage.test";
import { validateBoundaryTest } from "./boundary.test";
import { validateCountShapesTest } from "./count-shapes.test";
import { validateCountSlidesTest } from "./count-slides.test";
import { validateEqualityTest } from "./equality.test";
import { validateFilteredEqualityTest } from "./filtered-equality.test";
import { validateFilteredSpacingTest } from "./filtered-spacing.test";
import { validateLineValidationTest } from "./line-validation.test";
import { validateIncludesTest } from "./includes.test";
import { validateLlmJudgeTest } from "./llm-judge.test";
import { validateNumericalValueTest } from "./numerical-value.test";
import { validateSlideFillDistributionTest } from "./slide-fill-distribution.test";
import { validateSpacingTest } from "./spacing.test";
import { validateValueTest } from "./value.test";

export const validateTest = async (
    presentation: AITPres,
    tests: TChangesetTestProtocol,
    context?: {
        presentationPath?: string;
        initialPresentationPath?: string;
        taskPrompt?: string;
        caseId?: string;
        testDirectory?: string;
    }
): Promise<TTestSuiteResult> => {
    const results: TTestResult[] = [];

    // LLM judge can be expensive / require external services. When disabled, we still
    // run it for test cases that have no non-LLM assertions (otherwise those cases
    // would produce no meaningful signal).
    const llmJudgeEnabled =
        process.env.ENABLE_LLM_JUDGE === "1" ||
        process.env.ENABLE_LLM_JUDGE === "true";
    const hasNonLlmTests = tests.some((t) => t.name !== "llm_judge");
    const shouldRunLlmJudge = llmJudgeEnabled || !hasNonLlmTests;

    for (const test of tests) {
        const startTime = Date.now();

        try {
            let result: TTestResult;

            switch (test.name) {
                case "equals":
                case "not equals":
                    result = validateValueTest(presentation, test, startTime);
                    break;

                case "greater_than":
                case "less_than":
                case "greater_than_or_equal":
                case "less_than_or_equal":
                    result = validateNumericalValueTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "all_are_equal":
                case "some_are_equal":
                case "none_are_equal":
                case "some_are_unequal":
                    result = validateEqualityTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "includes":
                case "not_includes":
                    result = validateIncludesTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "count_slides":
                    result = validateCountSlidesTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "count_shapes":
                    result = validateCountShapesTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "llm_judge":
                    if (!shouldRunLlmJudge) {
                        result = {
                            testName: `llm_judge - Slide ${(test as any).slideId}`,
                            status: "passed",
                            message:
                                "LLM judge skipped (disabled via ENABLE_LLM_JUDGE).",
                            executionTime: Date.now() - startTime,
                        };
                    } else {
                        result = await validateLlmJudgeTest(
                            presentation,
                            test,
                            startTime,
                            context,
                        );
                    }
                    break;

                case "within_boundaries":
                    result = validateBoundaryTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "equal_spacing":
                    result = validateSpacingTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "slide_fill_distribution":
                    result = validateSlideFillDistributionTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "filtered_equality":
                    result = validateFilteredEqualityTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "filtered_spacing":
                    result = validateFilteredSpacingTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "line_validation":
                    result = validateLineValidationTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                case "bar_percentage":
                    result = validateBarPercentageTest(
                        presentation,
                        test,
                        startTime,
                    );
                    break;

                default:
                    result = {
                        testName: `unknown test`,
                        status: "failed",
                        message: `Unknown test type: ${(test as any).name}`,
                        executionTime: Date.now() - startTime,
                    };
            }

            results.push(result);
        } catch (error) {
            results.push({
                testName: `${test.name}`,
                status: "failed",
                message: error instanceof Error ? error.message : String(error),
                executionTime: Date.now() - startTime,
            });
        }
    }

    const passed = results.filter((r) => r.status === "passed").length;

    // Calculate weighted score
    // Separate static tests from LLM judge tests
    const llmJudgeTests = tests.filter((t) => t.name === "llm_judge");
    const staticTestCount = tests.length - llmJudgeTests.length;

    // Get LLM judge results and their scores
    const llmJudgeResults = results.filter((r) =>
        r.testName.startsWith("llm_judge"),
    );

    // Calculate static test score (% passed)
    const staticTestResults = results.filter(
        (r) => !r.testName.startsWith("llm_judge"),
    );
    const staticTestsPassed = staticTestResults.filter(
        (r) => r.status === "passed",
    ).length;
    const staticTestScore =
        staticTestCount > 0 ? (staticTestsPassed / staticTestCount) * 100 : 100;

    // Calculate LLM judge score (average of actual scores, not pass/fail)
    let llmJudgeScore: number | undefined;
    let llmJudgeWeight: number | undefined;

    if (llmJudgeResults.length > 0 && llmJudgeTests.length > 0) {
        // Get the weight from the first LLM judge test (they should all have the same weight)
        llmJudgeWeight = (llmJudgeTests[0] as any).weight ?? 0.5;

        // Extract actual scores from LLM judge results
        const llmScores = llmJudgeResults
            .map((r) => (typeof r.actual === "number" ? r.actual : null))
            .filter((s): s is number => s !== null);

        if (llmScores.length > 0) {
            llmJudgeScore =
                llmScores.reduce((a, b) => a + b, 0) / llmScores.length;
        }
    }

    // Calculate weighted overall score
    let weightedScore: number;
    if (llmJudgeScore !== undefined && llmJudgeWeight !== undefined) {
        // Weighted combination: static * (1 - weight) + llm * weight
        weightedScore =
            staticTestScore * (1 - llmJudgeWeight) +
            llmJudgeScore * llmJudgeWeight;
    } else {
        // No LLM judge tests, use static score only
        weightedScore = staticTestScore;
    }

    return {
        totalTests: results.length,
        passed,
        failed: results.length - passed,
        results,
        weightedScore,
        staticTestScore,
        llmJudgeScore,
        llmJudgeWeight,
    };
};

