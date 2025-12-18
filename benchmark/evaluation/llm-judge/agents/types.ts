import { z } from "zod";

// Question categories
export type QuestionCategory = "structure" | "content" | "formatting" | "layout" | "compliance";

// Individual question schema
export const LlmJudgeQuestionSchema = z.object({
    id: z.string(),
    question: z.string(),
    category: z.enum(["structure", "content", "formatting", "layout", "compliance"]).optional(),
    weight: z.number().min(0).max(1).default(1),
});

// Answer schema
export const LlmJudgeAnswerSchema = z.object({
    questionId: z.string(),
    score: z.number().min(0).max(100),
    reasoning: z.string(),
    confidence: z.number().min(0).max(1).optional(),
});

// Result format for JSON output
export const LlmJudgeResultSchema = z.object({
    slideId: z.number(),
    caseId: z.string(),
    questions: z.array(LlmJudgeQuestionSchema),
    answers: z.array(LlmJudgeAnswerSchema),
    questionScoresPercent: z.record(z.string(), z.number()), // { "q1": 95.5, "q2": 80.0, ... } // TODO: use questionScoresPercent to calculate the overall result and give it back to Agentbeats or the API
    overallScorePercent: z.number().min(0).max(100),
    evaluatedAt: z.string(),
});

// Type exports
export type LlmJudgeQuestion = z.infer<typeof LlmJudgeQuestionSchema>;
export type LlmJudgeAnswer = z.infer<typeof LlmJudgeAnswerSchema>;
export type LlmJudgeResult = z.infer<typeof LlmJudgeResultSchema>;

// Configuration
export interface LlmJudgeConfig {
    provider: "google" | "anthropic" | "openai";
    model: string;
    temperature: number;
    maxTokens?: number;
    timeout?: number;
}

export const DEFAULT_QUESTION_GENERATOR_CONFIG: LlmJudgeConfig = {
    provider: "google",
    model: "gemini-2.5-flash",
    temperature: 0.3, // TODO: do we need the temperature?
    maxTokens: 8192, // TODO: do we actually need max Tokens?
    timeout: 60000,
};

export const DEFAULT_ANSWER_EVALUATOR_CONFIG: LlmJudgeConfig = {
    provider: "google",
    model: "gemini-2.5-flash",
    temperature: 0.1, // Very low for consistency
    maxTokens: 8192,
    timeout: 60000,
};
