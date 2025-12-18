import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import { AITSlide } from "../../../../api/server/src/schemas/base";
import { convertToCoordinateYaml } from "../../coordinate-yaml";
import {
    getLayoutByIdFromGraph,
    getOutputDir,
    loadSystemPrompt,
    transformResult,
} from "../../helpers";
import { layoutAnalyzerInputTransformer } from "../layout-analyzer/transformer";
import { Layout } from "../layout-analyzer/types";
import { LayoutPlannerResultSchema } from "./types";

let agent: ChatVertexAI;
const getPlannerAgent = () => {
    if (!agent) {
        agent = new ChatVertexAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            thinkingBudget: 0,
            maxOutputTokens: 4096,
        });
    }
    return agent;
};

export const runPlannerAgent = async (
    processId: string,
    datamodel: AITSlide,
    layout: Layout,
    selectedLayoutId: string | null,
    prompt: string,
) => {
    const systemPrompt = loadSystemPrompt(import.meta.dirname, "sp.md");

    const transformedDm = layoutAnalyzerInputTransformer(datamodel.shapes);
    const yamlDatamodel = convertToCoordinateYaml(transformedDm);

    const selectedLayout = selectedLayoutId
        ? getLayoutByIdFromGraph(selectedLayoutId, layout)
        : layout;

    const response = await getPlannerAgent().invoke(
        [
            ["system", systemPrompt],
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: `# Prompt\n\n${prompt}\n\n`,
                    },
                    {
                        type: "text",
                        text: `# Layout\n\n${JSON.stringify(selectedLayout)}`,
                    },
                    {
                        type: "text",
                        text: `# Datamodel\n\n${yamlDatamodel}`,
                    },
                ],
            }) as any,
        ],
        {
            //  runId: processId,
        },
    );

    const result = transformResult(response.content);

    // Save result to file system
    const outputDir = getOutputDir(processId);
    const resultPath = path.join(outputDir, "result.json");
    // Write result to file system
    fs.writeFileSync(resultPath, JSON.stringify(JSON.parse(result), null, 2));

    // Parse result into LayoutPlannerResult
    const layoutPlannerResult = LayoutPlannerResultSchema.safeParse(
        JSON.parse(result),
    );

    if (!layoutPlannerResult.success) {
        throw new Error(
            `Failed to parse layout planner result: ${layoutPlannerResult.error.message}`,
        );
    }

    return layoutPlannerResult.data;
};
