import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import z from "zod";
import { AITSlide } from "../../../../api/server/src/schemas/base";
import { layoutAnalyzerInputTransformer } from "../layout-analyzer/transformer";

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_RETRIES = 1;
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
const ShapeSchema = z.object({
    id: z.string(),
    topLeft: z.tuple([z.number(), z.number()]),
    size: z.tuple([z.number(), z.number()]),
});

const LayoutSchema: z.ZodTypeAny = z.lazy(() =>
    z.object({
        name: z.string(),
        type: z.enum(["row", "column", "grid", "group"]),
        boundaries: z.tuple([
            z.tuple([z.number(), z.number()]),
            z.tuple([z.number(), z.number()]),
        ]),
        sublayouts: z.array(LayoutSchema).optional(),
        shapes: z.array(ShapeSchema).optional(),
    }),
);

const LayoutTransformerOutputSchema = z.object({
    affected_layout: z.string(),
    current_boundaries: z.tuple([
        z.tuple([z.number(), z.number()]),
        z.tuple([z.number(), z.number()]),
    ]),
    proposed_change: z.object({
        new_type: z.enum(["row", "column", "grid", "group"]),
        updated_sublayouts: z.array(LayoutSchema),
        notes: z.string(),
    }),
    deleted: z.array(z.number()),
});

// Type exports
export type Shape = z.infer<typeof ShapeSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type LayoutTransformerOutput = z.infer<
    typeof LayoutTransformerOutputSchema
>;

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

function loadPrompt(): string {
    return fs.readFileSync(path.join(__dirname, PROMPT_FILE), "utf8");
}

// Main agent function
export const runLayoutTransformerAgent = async (input: {
    layout: Layout;
    datamodel: AITSlide;
    userPrompt: string;
}): Promise<LayoutTransformerOutput> => {
    const prompt = loadPrompt();

    const model = layoutAnalyzerInputTransformer(input.datamodel.shapes);

    async function runModelWithValidation(
        additionalMessages: ModelMessage[] = [],
        attempt: number = 0,
    ): Promise<LayoutTransformerOutput> {
        const start = Date.now();

        // Build the request content
        const contents = [
            {
                role: "user",
                parts: [
                    {
                        text: `${prompt}\n\n## User Prompt\n\n${input.userPrompt}\n\n## Current Layout\n\n${JSON.stringify(input.layout)}\n\n## Data Model\n\n${JSON.stringify(model)}`,
                    },
                ],
            },
            ...additionalMessages,
        ];

        const ai = new GoogleGenAI({
            vertexai: true,
            project: "make-pretty",
            location: "global",
        });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: contents,
            config: {
                temperature: 0,
                topP: 0.95,
                maxOutputTokens: 8192,
                thinkingConfig: {
                    includeThoughts: false,
                    thinkingBudget: 2048,
                },
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No candidates in response");
        }

        const candidate = candidates[0];
        if (!candidate.content || !candidate.content.parts) {
            throw new Error("No content in candidate");
        }

        const resultingMessage = candidate.content.parts
            .map((part: any) => part.text || "")
            .join("");

        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const jsonMatch = resultingMessage.match(jsonRegex);
        if (!jsonMatch) {
            throw new Error("No JSON found in the output.");
        }
        const json = jsonMatch[1];
        let parsedOutput: unknown;
        try {
            parsedOutput = JSON.parse(json);
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

        const end = Date.now();
        const durationInSeconds = (end - start) / 1000;
        console.log(`Time taken: ${durationInSeconds}s`);

        const validationResult =
            LayoutTransformerOutputSchema.safeParse(parsedOutput);

        if (!validationResult.success) {
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

        return validationResult.data;
    }

    const result = await runModelWithValidation([]);

    return result;
};
