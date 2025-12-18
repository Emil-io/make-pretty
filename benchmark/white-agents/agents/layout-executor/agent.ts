import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import z from "zod";
import { AILayoutUpdate } from "../../../../api/server/src/schemas/base/layout-update";
import { AITShape } from "../../../../api/server/src/schemas/base/schemas";
import { getChangesetFromDataModels } from "../../../../api/server/src/services/shared/datamodel/transformers/get-diff";
import {
    getLayoutByIdFromGraph,
    getOutputDir,
    getShapeIdsFromLayout,
    loadSystemPrompt,
    transformResult,
} from "../../helpers";
import { Layout, ShapeId } from "../layout-analyzer/types";
import {
    CouplerStep,
    ExecuterStep,
    StepContext,
    StepType,
} from "../layout-planner/types";

const MAX_RETRIES = 2;

function formatValidationErrors(error: z.ZodError): string {
    return error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
}

function createSchemaValidationErrorMessage(error: z.ZodError): string {
    const errorMessages = formatValidationErrors(error);
    return `The output does not conform to the required schema. Schema validation errors:\n${errorMessages}\n\nPlease fix the output to match the required schema format.`;
}
let executerAgent: ChatVertexAI;
const getExecuterAgent = () => {
    if (!executerAgent) {
        executerAgent = new ChatVertexAI({
            model: "gemini-2.5-flash-lite",
            temperature: 0,
            thinkingBudget: 1024,
            maxOutputTokens: 4096,
            maxRetries: 2,
        });
    }
    return executerAgent;
};

export const runExecutorAgent = async (
    processId: string,
    step: ExecuterStep,
    ctx: StepContext,
): Promise<ExecuterStep> => {
    // Collect all previously run coupler steps
    const { id, layoutId } = step;

    const { datamodel, currentLayout } = ctx;

    const scopedLayout = getLayoutByIdFromGraph(layoutId, currentLayout);

    if (!scopedLayout) {
        throw new Error(
            `Layout with id ${layoutId} not found in current layout`,
        );
    }

    const executerModel = getExecuterDatamodel(scopedLayout, ctx);

    const couplerSteps = getPreviousCouplerSteps(id, ctx);

    const constraintStrings = couplerSteps.map((s) => s.result).join("\n\n");

    const systemPrompt = getExecuterSystemPrompt();

    const outputDir = getOutputDir(processId);
    const resultPath = path.join(outputDir, `executor-result:${id}.json`);

    async function runModelWithValidation(
        additionalMessages: Array<{ type: string; text: string }> = [],
        attempt: number = 0,
    ): Promise<ExecuterStep> {
        const messages: any[] = [
            ["system", systemPrompt],
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: `# Your Task: ${step.task}\n\n`,
                    },
                    {
                        type: "text",
                        text: `# Your Target Layout/Boundaries: \n\n${JSON.stringify(scopedLayout.b)}\n\n`,
                    },
                    {
                        type: "text",
                        text: `# Shapes in original layouts: \n\n If the array is empty, you likely have to create new shapes (i.e., no shapes in the original layout that would transform into this new layout) \n\n${JSON.stringify(executerModel)}\n\n`,
                    },
                    {
                        type: "text",
                        text: `# Coupler-Agent Rules/Constraints: \n\n${constraintStrings}\n\n`,
                    },
                    ...additionalMessages,
                ],
            }) as any,
        ];

        const response = await getExecuterAgent().invoke(messages, {
            //  runId: processId,
        });

        const result = transformResult(response.content);

        // Save result to file system
        fs.writeFileSync(
            resultPath,
            JSON.stringify(JSON.parse(result), null, 2),
        );

        // Parse JSON first
        let parsedResult: unknown;
        try {
            parsedResult = JSON.parse(result);
        } catch (parseError) {
            const errorMessage =
                parseError instanceof Error
                    ? parseError.message
                    : String(parseError);
            if (attempt < MAX_RETRIES) {
                return runModelWithValidation(
                    [
                        {
                            type: "text",
                            text: `\n\n# Error: Your last try failed. Please fix the JSON parsing error:\n${errorMessage}\n\nPlease ensure your output is valid JSON conforming to the AIChangesetSchema.`,
                        },
                    ],
                    attempt + 1,
                );
            }
            throw new Error(
                `Failed to parse JSON after ${MAX_RETRIES} attempts: ${errorMessage}`,
            );
        }

        // Validate against schema
        const validationResult = AILayoutUpdate.safeParse(parsedResult);

        if (validationResult.success) {
            let newDm = validationResult.data.shapes;
            const includedShapes = new Set<string | number>([
                ...newDm.map((s) => s.id),
                ...validationResult.data.deleteShapes,
            ]);

            const missingShapes = executerModel.filter(
                (s) => !includedShapes.has(s.id),
            );
            // Add missing shapes to the newDm
            newDm = [...newDm, ...missingShapes] satisfies AITShape[];

            const includedShapeIds = new Set<string | number>([
                ...newDm.map((s) => s.id),
                ...validationResult.data.deleteShapes,
            ]);
            // Add all the other shapes from the dm that are not in the executerModel
            const otherShapes = datamodel.shapes.filter(
                (s) => !includedShapeIds.has(s.id),
            );
            newDm = [...newDm, ...otherShapes] satisfies AITShape[];

            // Now get changeset
            const changeset = getChangesetFromDataModels(datamodel, {
                id: datamodel.id,
                index: datamodel.index,
                shapes: newDm,
            });

            return {
                ...step,
                result: changeset,
            };
        }

        // Schema validation failed
        if (attempt < MAX_RETRIES) {
            const errorMessage = createSchemaValidationErrorMessage(
                validationResult.error,
            );
            return runModelWithValidation(
                [
                    {
                        type: "text",
                        text: `\n\n# Error: Your last try failed. Please only fix this according to the schema:\n\n${errorMessage}`,
                    },
                ],
                attempt + 1,
            );
        }

        throw new Error(
            `Failed to validate schema after ${MAX_RETRIES} attempts: ${createSchemaValidationErrorMessage(validationResult.error)}`,
        );
    }

    return runModelWithValidation();
};

export const getPreviousCouplerSteps = (
    stepId: string,
    ctx: StepContext,
): CouplerStep[] => {
    // Find the checkpoint that contains the step with stepId
    const graph = ctx.stepGraph;

    // Construct a map for quick id -> step lookup
    const stepMap: Record<string, any> = {};
    graph.forEach((s) => {
        stepMap[s.id] = s;
    });

    // Find all ancestor nodes via reverse traversal of the graph, following "next" edges backward
    // To do this, create a mapping from child id to parents
    const parentMap: Record<string, string[]> = {};
    graph.forEach((s) => {
        if (s.next) {
            s.next.forEach((n: string) => {
                if (!parentMap[n]) parentMap[n] = [];
                parentMap[n].push(s.id);
            });
        }
    });

    // BFS from stepId backwards, collecting all ancestor nodes
    const visited: Set<string> = new Set();
    const couplerSteps: CouplerStep[] = [];
    const queue: string[] = [stepId];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        const currentStep = stepMap[currentId];
        if (currentStep && currentStep.type === StepType.coupler) {
            couplerSteps.push(currentStep);
        }

        const parents = parentMap[currentId] || [];
        for (const parentId of parents) {
            if (!visited.has(parentId)) {
                queue.push(parentId);
            }
        }
    }

    return couplerSteps.reverse();
};

export const getExecuterSystemPrompt = () => {
    const systemPrompt = loadSystemPrompt(import.meta.dirname, "sp.md");
    return systemPrompt;
};

export const getExecuterDatamodel = (
    layout: Layout,
    ctx: StepContext,
): AITShape[] => {
    const { datamodel } = ctx;
    // Only get the shapes that are associated with the layout (or its sublayouts)

    const shapeIdSet = new Set<ShapeId>(getShapeIdsFromLayout(layout));

    const shapes = datamodel.shapes.filter((s) => shapeIdSet.has(s.id));

    return shapes;
};
