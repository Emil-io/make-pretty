import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import z from "zod";
import { convertToCoordinateYaml } from "../../coordinate-yaml";
import {
    getLayoutIdsFromPlannerResult,
    loadSystemPrompt,
    transformResult,
} from "../../helpers";
import { previewLayout } from "../layout-analyzer/preview-layout";
import { layoutAnalyzerInputTransformer } from "../layout-analyzer/transformer";
import { LayoutAnalyzerOutputSchema } from "../layout-analyzer/types";
import { RelayouterStep, StepContext } from "../layout-planner/types";

let agent: ChatVertexAI;
const getRelayouterAgent = () => {
    if (!agent) {
        agent = new ChatVertexAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            thinkingBudget: 1024,
            maxOutputTokens: 4096,
        });
    }
    return agent;
};

export const runRelayouterAgent = async (
    processId: string,
    step: RelayouterStep,
    ctx: StepContext,
): Promise<RelayouterStep> => {
    const { id, task } = step;
    const { currentLayout, originalLayout, datamodel, pptxPath, slideId } = ctx;

    const systemPrompt = loadSystemPrompt(import.meta.dirname, "sp.md");

    const resultSchema = LayoutAnalyzerOutputSchema.extend({
        os: z.array(z.string()),
    });

    const dm = convertToCoordinateYaml(
        layoutAnalyzerInputTransformer(datamodel.shapes),
    );

    const plannedLayoutIds = getLayoutIdsFromPlannerResult(ctx.stepGraph);

    // Run agent here
    const response = await getRelayouterAgent().invoke(
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
                        text: `#Layout: \n\n${JSON.stringify(currentLayout)}\n\n`,
                    },
                    {
                        type: "text",
                        text: `#Planned Layout IDs: \n\n${plannedLayoutIds.join(", ")}\n\n`,
                    },
                    {
                        type: "text",
                        text: `#Datamodel: \n\n${dm}`,
                    },
                ],
            }) as any,
        ],
        {
            //  runId: processId,
        },
    );

    const result = transformResult(response.content);

    const layout = LayoutAnalyzerOutputSchema.safeParse(JSON.parse(result));

    if (!layout.success) {
        throw new Error(`Invalid layout: ${JSON.stringify(layout.error)}`);
    }

    await previewLayout(
        processId,
        "layout-replaner-visualization",
        pptxPath,
        slideId,
        layout.data.layout,
    );

    ctx.updateCurrLayout(layout.data.layout);

    return {
        ...step,
        result: layout.data.layout,
    };
};
