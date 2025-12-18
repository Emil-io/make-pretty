import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LlmJudgeQuestion } from "./types";
import { LlmJudgeQuestionSchema, DEFAULT_QUESTION_GENERATOR_CONFIG } from "./types";
import {
    QUESTION_GENERATOR_SYSTEM_PROMPT_V1,
    buildQuestionGeneratorPrompt,
    summarizeDatamodel,
} from "../utils/prompt-templates";

/**
 * Question Generator Agent
 *
 * Analyzes initial slide state and task to dynamically generate
 * 1-10 evaluation questions based on task complexity.
 */
export class QuestionGeneratorAgent {
    private genAI: GoogleGenerativeAI;
    private modelName: string;
    private temperature: number;

    constructor() {
        const config = DEFAULT_QUESTION_GENERATOR_CONFIG;
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
     * Generate evaluation questions
     *
     * @param input.slideImageBase64 - Base64 encoded PNG of initial slide
     * @param input.datamodel - Presentation datamodel (always included)
     * @param input.taskPrompt - Task description
     * @param input.criteria - Optional high-level evaluation criteria
     * @param input.focusAreas - Optional specific aspects to validate
     * @param input.expectedChanges - Optional list of expected transformations
     * @returns Array of 1-10 questions determined by LLM based on complexity
     */
    async generateQuestions(input: {
        slideImageBase64: string;
        datamodel: any;
        taskPrompt: string;
        criteria?: string;
        focusAreas?: string[];
        expectedChanges?: string[];
    }): Promise<LlmJudgeQuestion[]> {
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const datamodelSummary = summarizeDatamodel(input.datamodel);
                const userPrompt = buildQuestionGeneratorPrompt({
                    taskPrompt: input.taskPrompt,
                    datamodelSummary,
                    criteria: input.criteria,
                    focusAreas: input.focusAreas,
                    expectedChanges: input.expectedChanges,
                });

                const model = this.genAI.getGenerativeModel({
                    model: this.modelName,
                    generationConfig: {
                        temperature: this.temperature,
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json",
                    },
                    systemInstruction: QUESTION_GENERATOR_SYSTEM_PROMPT_V1,
                });

                // Prepare the request with image and text
                const imagePart = {
                    inlineData: {
                        mimeType: "image/png",
                        data: input.slideImageBase64,
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
                if (!parsed.questions || !Array.isArray(parsed.questions)) {
                    throw new Error(
                        "Invalid response format: missing questions array"
                    );
                }

                // Validate each question
                const questions: LlmJudgeQuestion[] = [];
                for (const q of parsed.questions) {
                    try {
                        const validated = LlmJudgeQuestionSchema.parse(q);
                        questions.push(validated);
                    } catch (validationError) {
                        console.warn(
                            `Question validation failed for question:`,
                            q,
                            validationError
                        );
                        // Skip invalid questions but continue
                    }
                }

                if (questions.length === 0) {
                    throw new Error("No valid questions generated");
                }

                if (questions.length > 10) {
                    console.warn(
                        `Generated ${questions.length} questions, truncating to 10`
                    );
                    return questions.slice(0, 10);
                }

                return questions;
            } catch (error) {
                lastError = error as Error;
                console.warn(
                    `Question generation attempt ${attempt + 1}/${maxRetries} failed:`,
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
            `Question generation failed after ${maxRetries} attempts: ${lastError?.message}`
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
