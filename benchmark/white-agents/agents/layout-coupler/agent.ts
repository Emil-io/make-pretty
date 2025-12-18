import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { convertToCoordinateYaml } from "../../coordinate-yaml";
import { loadSystemPrompt, transformResult } from "../../helpers";
import { CouplerStep, StepContext } from "../layout-planner/types";
import { getLayoutWithRelativeShapes } from "./transformer";

let couplerAgent: ChatVertexAI;
const getCouplerAgent = () => {
    if (!couplerAgent) {
        couplerAgent = new ChatVertexAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            thinkingBudget: 2048,
            maxOutputTokens: 4096,
        });
    }
    return couplerAgent;
};

export const runCouplerAgent = async (
    processId: string,
    step: CouplerStep,
    ctx: StepContext,
): Promise<CouplerStep> => {
    const systemPrompt = loadSystemPrompt(import.meta.dirname, "sp.md");

    const { task, id } = step;
    const { currentLayout, originalLayout, datamodel } = ctx;

    const layoutWithRelativeShapes = getLayoutWithRelativeShapes(
        originalLayout,
        datamodel.shapes,
    );

    const layoutWithRelativeShapesYaml = convertToCoordinateYaml(
        layoutWithRelativeShapes,
    );

    // Run agent here
    const response = await getCouplerAgent().invoke(
        [
            ["system", systemPrompt],
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: `#Task: ${task}\n\n`,
                    },
                    {
                        type: "text",
                        text: `#Goal Layout: \n\n${JSON.stringify(currentLayout)}\n\n`,
                    },
                    ...(step.next
                        ? [
                              {
                                  type: "text",
                                  text: `# Executor-Agents depending on your output: \n\n${JSON.stringify(step.next)}\n\n`,
                              },
                          ]
                        : []),
                    {
                        type: "text",
                        text: `#Previous Layout with Relative Shapes: \n\n${layoutWithRelativeShapesYaml}`,
                    },
                ],
            }) as any,
        ],
        {
            // runId: processId,
        },
    );

    const result = transformResult(response.content);

    return {
        ...step,
        result: result,
    };
};
