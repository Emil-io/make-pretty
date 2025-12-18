import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LlmJudgeQuestion, LlmJudgeAnswer } from "./types";
import { LlmJudgeAnswerSchema, DEFAULT_ANSWER_EVALUATOR_CONFIG } from "./types";
import {
    ANSWER_EVALUATOR_SYSTEM_PROMPT_V1,
    buildAnswerEvaluatorPrompt,
    summarizeDatamodel,
} from "../utils/prompt-templates";

/**
 * Answer Evaluator Agent
 *
 * Evaluates result slide against generated questions and provides
 * percentage scores with reasoning for each question.
 */
export class AnswerEvaluatorAgent {
    private genAI: GoogleGenerativeAI;
    private modelName: string;
    private temperature: number;

    constructor() {
        const config = DEFAULT_ANSWER_EVALUATOR_CONFIG;
        this.modelName = config.model;
        this.temperature = config.temperature;

        // Google Generative AI authentication via GOOGLE_API_KEY env var
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("GOOGLE_API_KEY environment variable is required");
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Evaluate questions against result slide
     *
     * @param input.resultSlideImageBase64 - Base64 encoded PNG of result slide
     * @param input.questions - Questions to evaluate
     * @param input.datamodel - Result datamodel (always included)
     * @param input.taskPrompt - Original task for context
     * @returns Array of answers with scores (0-100%) and reasoning
     */
    async evaluateQuestions(input: {
        resultSlideImageBase64: string;
        questions: LlmJudgeQuestion[];
        datamodel: any;
        taskPrompt: string;
    }): Promise<LlmJudgeAnswer[]> {
        const maxRetries = 3; // TODO: check whether 3 retries are needed
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const datamodelSummary = summarizeDatamodel(input.datamodel);
                const userPrompt = buildAnswerEvaluatorPrompt({
                    questions: input.questions,
                    taskPrompt: input.taskPrompt,
                    datamodelSummary,
                });

                const model = this.genAI.getGenerativeModel({
                    model: this.modelName,
                    generationConfig: {
                        temperature: this.temperature,
                        maxOutputTokens: 8192, // TODO max output tokens necessary?
                        responseMimeType: "application/json",
                    },
                    systemInstruction: ANSWER_EVALUATOR_SYSTEM_PROMPT_V1,
                });

                // Prepare the request with image and text
                const imagePart = {
                    inlineData: {
                        mimeType: "image/png",
                        data: input.resultSlideImageBase64,
                    },
                };

                const response = await model.generateContent([
                    imagePart,
                    userPrompt,
                ]);
                const result = response.response;

                if (!result.candidates || result.candidates.length === 0) {
                    throw new Error("No candidates in response");
                }

                const content = result.candidates[0].content;
                if (!content.parts || content.parts.length === 0) {
                    throw new Error("No parts in response content");
                }

                const textPart = content.parts[0].text;
                if (!textPart) {
                    throw new Error("No text in response");
                }

                // Parse JSON response
                const parsed = this.parseJsonResponse(textPart);

                // Validate structure
                if (!parsed.answers || !Array.isArray(parsed.answers)) {
                    throw new Error(
                        "Invalid response format: missing answers array"
                    );
                }

                // Validate each answer
                const answers: LlmJudgeAnswer[] = [];
                for (const a of parsed.answers) {
                    try {
                        const validated = LlmJudgeAnswerSchema.parse(a);
                        answers.push(validated);
                    } catch (validationError) {
                        console.warn(
                            `Answer validation failed for answer:`,
                            a,
                            validationError
                        );
                        // Skip invalid answers but continue
                    }
                }

                if (answers.length === 0) {
                    throw new Error("No valid answers generated");
                }

                // Ensure we have answers for all questions
                if (answers.length < input.questions.length) {
                    console.warn(
                        `Expected ${input.questions.length} answers, got ${answers.length}`
                    );
                }

                return answers;
            } catch (error) {
                lastError = error as Error;
                console.warn(
                    `Answer evaluation attempt ${attempt + 1}/${maxRetries} failed:`,
                    error
                );

                if (attempt < maxRetries - 1) {
                    // Exponential backoff
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000 * (attempt + 1))
                    );
                }
            }
        }

        throw new Error(
            `Answer evaluation failed after ${maxRetries} attempts: ${lastError?.message}`
        );
    }

    /**
     * Parse JSON from LLM response (handles markdown code blocks)
     */
    private parseJsonResponse(content: string): any {
        // Remove markdown code blocks if present
        let jsonText = content.trim();

        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7);
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.substring(3);
        }

        if (jsonText.endsWith("```")) {
            jsonText = jsonText.substring(0, jsonText.length - 3);
        }

        jsonText = jsonText.trim();

        try {
            return JSON.parse(jsonText);
        } catch (error) {
            throw new Error(
                `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}
