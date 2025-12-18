import { ContentBlock, HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";
import z from "zod";
import { AITSlide } from "../../../../api/server/src/schemas/base/slide.js";
import { layoutAnalyzerInputTransformer } from "./transformer.js";

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

export interface Layout {
    name: string;
    type: "row" | "column" | "grid" | "group";
    b:
        | [[number, number], [number, number]]
        | [[number, number], [number, number]][];
    multi?: boolean;
    sl?: Layout[]; // sl === sublayouts
}

// Schemas
const SingleBoundarySchema = z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
]);

const MultiBoundarySchema = z.array(
    z.tuple([
        z.tuple([z.number(), z.number()]),
        z.tuple([z.number(), z.number()]),
    ]),
);

const LayoutSchema: z.ZodType<Layout> = z.lazy(() =>
    z.union([
        z.object({
            name: z.string(),
            type: z.enum(["row", "column", "grid", "group"]),
            multi: z.literal(true),
            b: MultiBoundarySchema,
            sl: z.array(LayoutSchema).optional(), // sl === sublayouts
        }),
        z.object({
            name: z.string(),
            type: z.enum(["row", "column", "grid", "group"]),
            multi: z.literal(false).optional(),
            b: SingleBoundarySchema,
            sl: z.array(LayoutSchema).optional(), // sl === sublayouts
        }),
    ]),
);

const LayoutAnalyzerOutputSchema = z.object({
    layout: LayoutSchema,
});

// Type exports
export type LayoutAnalyzerOutput = z.infer<typeof LayoutAnalyzerOutputSchema>;

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
}): Promise<LayoutAnalyzerOutput> => {
    const prompt = loadPrompt();

    async function runModelWithValidation(
        additionalMessages: ModelMessage[] = [],
        attempt: number = 0,
    ): Promise<LayoutAnalyzerOutput> {
        const transformed = layoutAnalyzerInputTransformer(input.datamodel);

        const yamlDatamodel = yaml.dump(transformed);

        // Save yaml
        const yamlPath = path.join(
            __dirname,
            "__generated__",
            "datamodel.yaml",
        );
        fs.writeFileSync(yamlPath, yamlDatamodel, "utf-8");

        const start = Date.now();

        const response = await model.invoke(
            [
                ["system", prompt],
                new HumanMessage({
                    content: [
                        {
                            type: "text",
                            text: yamlDatamodel,
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
        try {
            const resultingMessage = transformResult(response.content);

            // Save string to __generated__/resultingMessage.txt
            fs.writeFileSync(
                path.join(__dirname, "__generated__", "resultingMessage.json"),
                resultingMessage,
                "utf-8",
            );

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
            LayoutAnalyzerOutputSchema.safeParse(parsedOutput);

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
