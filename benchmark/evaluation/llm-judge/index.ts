import { QuestionGeneratorAgent } from "./agents/question-generator";
import { AnswerEvaluatorAgent } from "./agents/answer-evaluator";
import { SnapshotService } from "./utils/snapshot-service";
import { convertPngToBase64 } from "./utils/image-converter";
import {
    loadCachedQuestionsFromMarkdown,
    cacheQuestionsToMarkdown,
    hasCachedQuestions,
} from "./utils/cache";
import type { LlmJudgeQuestion, LlmJudgeResult } from "./agents/types";
import * as path from "path";

/**
 * Shorten file paths for cleaner console output
 */
function shortenPath(filePath: string): string {
    const workspacePath = process.cwd();
    if (filePath.startsWith(workspacePath)) {
        return path.relative(workspacePath, filePath);
    }
    // If not in workspace, just return the filename
    return path.basename(filePath);
}

// Lazy-init singletons
let questionGenerator: QuestionGeneratorAgent | null = null;
let answerEvaluator: AnswerEvaluatorAgent | null = null;
let snapshotService: SnapshotService | null = null;

function getQuestionGenerator(): QuestionGeneratorAgent {
    if (!questionGenerator) {
        questionGenerator = new QuestionGeneratorAgent();
    }
    return questionGenerator;
}

function getAnswerEvaluator(): AnswerEvaluatorAgent {
    if (!answerEvaluator) {
        answerEvaluator = new AnswerEvaluatorAgent();
    }
    return answerEvaluator;
}

function getSnapshotService(): SnapshotService {
    if (!snapshotService) {
        snapshotService = new SnapshotService();
    }
    return snapshotService;
}

/**
 * Main orchestration function for LLM-as-a-Judge evaluation
 *
 * This coordinates the two-agent system:
 * 1. Question Generator: Creates evaluation questions from initial slide
 * 2. Answer Evaluator: Rates result slide against questions
 */
export async function runLLMJudgeEvaluation(input: {
    caseId: string;
    slideId: number;
    taskPrompt: string;
    initialPresentationPath: string;
    resultPresentationPath: string;
    initialDatamodel: any;
    resultDatamodel: any;
    testDirectory: string;
    forceRegenerate?: boolean;
    // Optional context to guide question generation
    criteria?: string;
    focusAreas?: string[];
    expectedChanges?: string[];
}): Promise<LlmJudgeResult> {
    const snapshot = getSnapshotService();

    // Step 1: Get or generate questions
    let questions: LlmJudgeQuestion[];

    const shouldUseCache = !input.forceRegenerate && await hasCachedQuestions(input.testDirectory);

    if (shouldUseCache) {
        const cached = await loadCachedQuestionsFromMarkdown(input.testDirectory);

        if (cached) {
            questions = cached.questions;
            console.log(`  Using ${questions.length} cached questions`);
        } else {
            // Cache check passed but loading failed, regenerate
            questions = await generateQuestions();
        }
    } else {
        questions = await generateQuestions();
    }

    async function generateQuestions(): Promise<LlmJudgeQuestion[]> {
        console.log(`\n  Generating questions for ${input.caseId}/slide-${input.slideId}`);

        // Get initial slide snapshot
        const initialSnapshot = await snapshot.getSlideSnapshot(
            input.initialPresentationPath,
            input.slideId
        );
        const initialImageBase64 = convertPngToBase64(initialSnapshot.pngBytes);

        // Generate questions
        const generator = getQuestionGenerator();
        const generatedQuestions = await generator.generateQuestions({
            slideImageBase64: initialImageBase64,
            datamodel: input.initialDatamodel,
            taskPrompt: input.taskPrompt,
            criteria: input.criteria,
            focusAreas: input.focusAreas,
            expectedChanges: input.expectedChanges,
        });

        console.log(`  Generated ${generatedQuestions.length} questions`);

        // Cache questions to Markdown
        await cacheQuestionsToMarkdown(
            input.testDirectory,
            {
                slideId: input.slideId,
                caseId: input.caseId,
                taskPrompt: input.taskPrompt,
                generatedAt: new Date().toISOString(),
            },
            generatedQuestions
        );

        const cachePath = shortenPath(path.join(input.testDirectory, "llm-judge-questions.md"));
        console.log(`  Cached to ${cachePath}\n`);

        return generatedQuestions;
    }

    // Step 2: Get result slide snapshot
    const resultSnapshot = await snapshot.getSlideSnapshot(
        input.resultPresentationPath,
        input.slideId
    );
    const resultImageBase64 = convertPngToBase64(resultSnapshot.pngBytes);

    // Step 3: Evaluate result against questions
    console.log(`  Evaluating ${questions.length} questions for ${input.caseId}/slide-${input.slideId}`);
    const evaluator = getAnswerEvaluator();
    const answers = await evaluator.evaluateQuestions({
        resultSlideImageBase64: resultImageBase64,
        questions,
        datamodel: input.resultDatamodel,
        taskPrompt: input.taskPrompt,
    });

    // Step 4: Calculate scores
    const questionScoresPercent: Record<string, number> = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const answer of answers) {
        const question = questions.find(q => q.id === answer.questionId);
        if (question) {
            questionScoresPercent[answer.questionId] = answer.score;
            totalWeightedScore += answer.score * question.weight;
            totalWeight += question.weight;
        }
    }

    const overallScorePercent = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    console.log(`\n  Overall score: ${overallScorePercent.toFixed(1)}%\n`);

    // Step 5: Return complete result
    const result: LlmJudgeResult = {
        slideId: input.slideId,
        caseId: input.caseId,
        questions,
        answers,
        questionScoresPercent,
        overallScorePercent,
        evaluatedAt: new Date().toISOString(),
    };

    return result;
}

/**
 * Export agents and utilities for direct use
 */
export {
    QuestionGeneratorAgent,
    AnswerEvaluatorAgent,
    SnapshotService,
    convertPngToBase64,
    loadCachedQuestionsFromMarkdown,
    cacheQuestionsToMarkdown,
    hasCachedQuestions,
};

export type { LlmJudgeQuestion, LlmJudgeResult };
