import { ContentBlock, HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import z from "zod";
import { getOutputDir } from "../../helpers";
import { Layout } from "../layout-analyzer/types";

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

// Schemas
const LayoutSelectorOutputSchema = z.object({
    main: z.string().nullable(),
});

// Type exports
export type LayoutSelectorOutput = z.infer<typeof LayoutSelectorOutputSchema>;

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
            model: "gemini-2.5-flash-lite",
            temperature: 0,
            platformType: "gcp",
            responseMimeType: "application/json",
            convertSystemMessageToHumanContent: true,
            maxOutputTokens: 8096,
        });
    }

    return model;
}

function loadPrompt(): string {
    return fs.readFileSync(path.join(__dirname, PROMPT_FILE), "utf8");
}

// Main agent function
export const runLayoutSelectorAgent = async (input: {
    prompt: string;
    layoutSchema: Layout;
    processId: string;
}): Promise<LayoutSelectorOutput> => {
    const systemPrompt = loadPrompt();
    const model = getModel();

    // Get output directory for this process
    const outputDir = getOutputDir(input.processId);

    async function runModelWithValidation(
        additionalMessages: ModelMessage[] = [],
        attempt: number = 0,
    ): Promise<LayoutSelectorOutput> {
        // Convert layoutSchema to compact JSON (no indentation to save tokens)
        const jsonLayout = JSON.stringify(input.layoutSchema);

        // Save JSON for debugging
        const jsonPath = path.join(outputDir, "layout.json");
        fs.writeFileSync(jsonPath, jsonLayout, "utf-8");

        const start = Date.now();

        // Construct the user message with prompt and layout
        const userMessageText = `User prompt: "${input.prompt}"\n\nLayout (JSON):\n${jsonLayout}`;

        const messages = [
            ["system", systemPrompt],
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: userMessageText,
                    },
                ],
            }) as any,
        ];

        const response = await model.invoke(messages);

        let parsedOutput: unknown;
        try {
            const resultingMessage = transformResult(response.content);

            // Save string to outputDir/resultingMessage.json
            const resultPath = path.join(outputDir, "resultingMessage.json");
            fs.writeFileSync(resultPath, resultingMessage, "utf-8");

            parsedOutput = JSON.parse(resultingMessage);
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

        const validationResult =
            LayoutSelectorOutputSchema.safeParse(parsedOutput);

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

function transformResult(
    res: string | (ContentBlock | ContentBlock.Text)[],
): string {
    function getString(): string {
        if (typeof res === "string") {
            return res;
        }
        const lastMessage = res[res.length - 1];
        if (lastMessage.type === "text") {
            return (lastMessage as ContentBlock.Text).text;
        }
        throw new Error("No text found in the last message.");
    }

    const string = getString();

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const jsonMatch = string.match(jsonRegex);
    if (!jsonMatch) {
        return string;
    }
    const json = jsonMatch[1];
    return json;
}
