import { AITPres } from "../../../api/server/src/schemas/base";
import { TLlmJudgeTestSchema, TTestResult } from "../schemas";
import { runLLMJudgeEvaluation } from "../llm-judge";

/**
 * Validate LLM Judge test
 *
 * This integrates the two-agent LLM evaluation system into the validation framework.
 */
export async function validateLlmJudgeTest(
    presentation: AITPres,
    test: TLlmJudgeTestSchema,
    startTime: number,
    context?: {
        presentationPath?: string;
        initialPresentationPath?: string;
        taskPrompt?: string;
        caseId?: string;
        testDirectory?: string;
    }
): Promise<TTestResult> {
    try {
        // Validate required context
        if (!context?.presentationPath) {
            throw new Error("presentationPath required in context for LLM judge");
        }

        if (!context?.initialPresentationPath) {
            throw new Error("initialPresentationPath required in context for LLM judge");
        }

        if (!context?.taskPrompt) {
            throw new Error("taskPrompt required in context for LLM judge");
        }

        if (!context?.caseId) {
            throw new Error("caseId required in context for LLM judge");
        }

        if (!context?.testDirectory) {
            throw new Error("testDirectory required in context for LLM judge");
        }

        // Find the slide in presentation
        const slide = presentation.slides.find(s => s.id === test.slideId);
        if (!slide) {
            return {
                testName: `llm_judge - Slide ${test.slideId}`,
                status: "failed",
                message: `Slide ${test.slideId} not found in presentation`,
                executionTime: Date.now() - startTime,
            };
        }

        // Run LLM judge evaluation
        const result = await runLLMJudgeEvaluation({
            caseId: context.caseId,
            slideId: test.slideId,
            taskPrompt: context.taskPrompt,
            initialPresentationPath: context.initialPresentationPath,
            resultPresentationPath: context.presentationPath,
            initialDatamodel: presentation, // Use full presentation as initial datamodel
            resultDatamodel: presentation,   // Use full presentation as result datamodel
            testDirectory: context.testDirectory,
            forceRegenerate: false, // Always use cache by default
            // Pass optional test context to guide question generation
            criteria: test.criteria,
            focusAreas: test.focusAreas,
            expectedChanges: test.expectedChanges,
        });

        // Calculate pass/fail (default threshold: 70%)
        const passThreshold = 70;
        const passed = result.overallScorePercent >= passThreshold;

        // Format detailed message with all question results
        const questionResults = result.answers
            .map(ans => {
                const q = result.questions.find(q => q.id === ans.questionId);
                return `  [${ans.score}%] ${q?.question}\n    → ${ans.reasoning}`;
            })
            .join("\n");

        const message = passed
            ? `LLM Judge PASSED (${result.overallScorePercent.toFixed(1)}% >= ${passThreshold}%)\n\nQuestion Results:\n${questionResults}`
            : `LLM Judge FAILED (${result.overallScorePercent.toFixed(1)}% < ${passThreshold}%)\n\nQuestion Results:\n${questionResults}`;

        return {
            testName: `llm_judge - Slide ${test.slideId}`,
            status: passed ? "passed" : "failed",
            message,
            actual: result.overallScorePercent,
            expected: passThreshold,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName: `llm_judge - Slide ${test.slideId}`,
            status: "failed",
            message: `LLM evaluation failed: ${error instanceof Error ? error.message : String(error)}`,
            executionTime: Date.now() - startTime,
        };
    }
}
