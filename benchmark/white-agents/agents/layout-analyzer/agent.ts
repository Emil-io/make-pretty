import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import z from "zod";
import { AITSlide } from "../../../../api/server/src/schemas/base/slide.js";
import { convertToCoordinateYaml } from "../../coordinate-yaml.js";
import { getOutputDir, transformResult } from "../../helpers.js";
import { layoutAnalyzerInputTransformer } from "./transformer.js";
import { LayoutAnalyzerOutput, LayoutAnalyzerOutputSchema } from "./types.js";

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_RETRIES = 0;
const PROMPT_FILE = "sp.md";

// Type definitions
type ModelMessage = {
    role: "user" | "system";
    parts: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
    }>;
};

function formatValidationErrors(error: z.ZodError): string {
    return error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
}

function createJsonParseErrorMessage(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Failed to parse JSON from response. Error: ${errorMessage}. Please ensure your output is valid JSON.`;
}

function createSchemaValidationErrorMessage(error: z.ZodError): string {
    const errorMessages = formatValidationErrors(error);
    return `The output does not conform to the required schema. Schema validation errors:\n${errorMessages}\n\nPlease fix the output to match the required schema format.`;
}

function createRetryMessage(originalError: string, hint: string): ModelMessage {
    return {
        role: "user",
        parts: [
            {
                text: `The previous output had an error. ${originalError} ${hint}`,
            },
        ],
    };
}

let model: ChatVertexAI;
export function getModel(): ChatVertexAI {
    if (!model) {
        model = new ChatVertexAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            thinkingBudget: 2048,
            maxReasoningTokens: 2048,

            platformType: "gcp",
            responseMimeType: "application/json",
            convertSystemMessageToHumanContent: true,
            maxOutputTokens: 8096,
            apiConfig: {
                thinking: {
                    type: "enabled",
                    budget_tokens: 2048,
                },
            },
        });
    }

    return model;
}

function loadPrompt(): string {
    return fs.readFileSync(path.join(__dirname, PROMPT_FILE), "utf8");
}

// Main agent function
export const runLayoutAnalyzerAgent = async (input: {
    snapshotBase64: string;
    datamodel: AITSlide;
    processId: string;
}): Promise<LayoutAnalyzerOutput> => {
    const prompt = loadPrompt();
    const model = getModel();

    // Get output directory for this process
    const outputDir = getOutputDir(input.processId);

    async function runModelWithValidation(
        additionalMessages: ModelMessage[] = [],
        attempt: number = 0,
    ): Promise<LayoutAnalyzerOutput> {
        const transformedShapes = layoutAnalyzerInputTransformer(
            input.datamodel.shapes,
        );

        const yamlDatamodel = convertToCoordinateYaml(transformedShapes);

        // Save yaml
        const yamlPath = path.join(outputDir, "datamodel.yaml");
        fs.writeFileSync(yamlPath, yamlDatamodel, "utf-8");

        const start = Date.now();

        const response = await model.invoke(
            [
                ["system", prompt],
                new HumanMessage({
                    content: [
                        {
                            type: "text",
                            text: `# Datamodel\n\n${yamlDatamodel}`,
                        },
                        {
                            type: "image_url",
                            image_url: `data:image/png;base64,${input.snapshotBase64}`,
                        },
                    ],
                }) as any,
            ],
            {
                thinkingBudget: 0,
                maxReasoningTokens: 0,
                configurable: {
                    thinking: {
                        type: "disabled",
                    },
                },
            },
        );

        let parsedOutput: unknown;
        let validationResult: z.ZodSafeParseResult<LayoutAnalyzerOutput>;
        try {
            const resultingMessage = transformResult(response.content);

            // Save string to outputDir/resultingMessage.json
            fs.writeFileSync(
                path.join(outputDir, "resultingMessage.json"),
                resultingMessage,
                "utf-8",
            );

            parsedOutput = JSON.parse(resultingMessage);

            validationResult =
                LayoutAnalyzerOutputSchema.safeParse(parsedOutput);
        } catch (parseError) {
            if (attempt < MAX_RETRIES) {
                const errorMessage = createJsonParseErrorMessage(parseError);
                return runModelWithValidation(
                    [
                        createRetryMessage(
                            errorMessage,
                            "Please fix the output and return only valid JSON conforming to the schema.",
                        ),
                    ],
                    attempt + 1,
                );
            }

            throw new Error(
                `Failed to parse JSON after ${MAX_RETRIES} attempts: ${createJsonParseErrorMessage(parseError)}`,
            );
        }

        const durationInSeconds = (Date.now() - start) / 1000;
        console.log(`Time taken: ${durationInSeconds}s`);

        if (validationResult.success) {
            return validationResult.data;
        }

        console.log(
            `Validation failed: ${JSON.stringify(validationResult.error)}`,
        );

        if (attempt < MAX_RETRIES) {
            const errorMessage = createSchemaValidationErrorMessage(
                validationResult.error,
            );
            return runModelWithValidation(
                [
                    createRetryMessage(
                        errorMessage,
                        "Please fix the output and ensure it matches the schema exactly.",
                    ),
                ],
                attempt + 1,
            );
        }

        throw new Error(
            `Schema validation failed after ${MAX_RETRIES} attempts: ${formatValidationErrors(validationResult.error)}`,
        );
    }

    const result = await runModelWithValidation([]);

    return result;
};
