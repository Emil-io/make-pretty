 /**
 * Default LangGraph Agent
 *
 * This agent uses LangGraph with OpenAI to generate changesets for PowerPoint presentations.
 * It includes tool calling capabilities for alignment operations.
 */

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    Annotation,
    END,
    MessagesAnnotation,
    StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { getAlignmentTool } from "../../../tools/alignment/index.js";
import { Agent, WhiteAgentPPApi } from "../../runtime/index.js";

// AI Model Configuration
const AI_MODEL = "gpt-5-mini"; // <-- EDIT HERE
const REASONING_EFFORT = undefined; // <-- EDIT HERE, MAKE SURE MODEL SUPPORTS IT, OTHERWISE UNDEFINED

const LayouterGraphStateAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
});

export class DefaultAgent implements Agent {
    private changesetSchema: string = "";
    private masterAnalysis: string = "";
    private ppApi: WhiteAgentPPApi;

    constructor(ppApi: WhiteAgentPPApi) {
        this.ppApi = ppApi;
    }

    name = "Default LangGraph Agent";

    /**
     * Get the PowerPoint API
     */
    protected getPPApi(): WhiteAgentPPApi {
        return this.ppApi;
    }

    /**
     * Set schema and analysis context for the agent
     */
    setContext(changesetSchema: string, masterAnalysis: string): void {
        this.changesetSchema = changesetSchema;
        this.masterAnalysis = masterAnalysis;
    }

    /**
     * Generate changeset using AI
     */
    async generateChangeset(
        datamodel: any,
        userPrompt: string,
        systemPrompt: string,
    ): Promise<any> {
        console.log("🤖 Generating changeset with AI...");

        try {
            const model = new ChatOpenAI({
                modelName: AI_MODEL,
                reasoning: {
                    effort: REASONING_EFFORT,
                },
                verbosity: "low",
                verbose: false,
            });

            const shouldContinue = (
                state: typeof LayouterGraphStateAnnotation.State,
            ) => {
                const lastMessage = state.messages.at(-1);

                // If the LLM makes a tool call, then perform an action
                if (
                    lastMessage &&
                    "tool_calls" in lastMessage &&
                    (lastMessage as any).tool_calls?.length
                ) {
                    console.log("IS TOOL CALL");
                    return "tools";
                }
                // Otherwise, we stop (reply to the user)
                console.log("IS NOT TOOL CALL");
                return END;
            };

            const systemMessage = new SystemMessage({
                content: systemPrompt,
            });

            const masterAnalysisMessage = new SystemMessage({
                content: `## Master Analysis\n\n${this.masterAnalysis}`,
            });

            const schemaMessage = new SystemMessage({
                content: `## Changeset Schema\n\n${this.changesetSchema}`,
            });

            const dataMessage = new SystemMessage({
                content: `## Data Model\n\n${JSON.stringify(datamodel, null, 2)}`,
            });

            const userRequestMessage = new HumanMessage({
                content: userPrompt,
            });

            const modelNode = async (
                state: typeof LayouterGraphStateAnnotation.State,
            ) => {
                const response = await model.invoke(
                    [systemMessage, schemaMessage, ...state.messages],
                    {
                        tools: [getAlignmentTool],
                    },
                );

                return {
                    messages: [response],
                };
            };

            console.log("STARTING GRAPH");
            const graph = new StateGraph(LayouterGraphStateAnnotation)
                .addNode("llm", modelNode)
                .addNode("tools", new ToolNode([getAlignmentTool]))
                .addEdge("__start__", "llm")
                .addEdge("tools", "llm")
                .addConditionalEdges("llm", shouldContinue)
                .compile();

            const response = await graph.invoke(
                {
                    messages: [
                        masterAnalysisMessage,
                        dataMessage,
                        userRequestMessage,
                    ],
                },
                {},
            );

            const changesetText = response.messages[
                response.messages.length - 1
            ].content as string;

            // Try to parse the changeset
            try {
                console.log("✅ Changeset text:", changesetText);
                const changeset = JSON.parse(changesetText);
                console.log("✅ Changeset generated successfully");
                return changeset;
            } catch (parseError) {
                // If parsing fails, try to extract JSON from the response
                const jsonMatch = changesetText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const changeset = JSON.parse(jsonMatch[0]);
                    console.log("✅ Changeset extracted from response");
                    return changeset;
                } else {
                    throw new Error(
                        `Failed to parse changeset from AI response: ${parseError}`,
                    );
                }
            }
        } catch (error) {
            console.error("❌ Failed to generate changeset:", error);
            throw error;
        }
    }
}
