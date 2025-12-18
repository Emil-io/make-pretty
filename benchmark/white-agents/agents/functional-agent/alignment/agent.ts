import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    Annotation,
    END,
    MessagesAnnotation,
    StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";
import path from "path";
import TOML from "smol-toml";
import { z } from "zod";
import { getAlignmentTool } from "../../../../tools/alignment";
import { WhiteAgentPPApi } from "../../../runtime/pp-api.js";
import { AlignChangesetSchema } from "./changeset/schemas/changeset.js";
import { mapDatamodelForAlignment } from "./mappings/datamodel";

export const MAX_ALIGNMENT_TOOL_CALLS = 3;

// Configuration type
interface AlignmentConfig {
    model: {
        name: string;
        verbosity: "low" | "medium" | "high";
        verbose: boolean;
        reasoning: {
            effort: "minimal" | "low" | "medium" | "high";
        };
    };
}

// Load configuration from TOML file
function loadConfig(): AlignmentConfig {
    const configPath = path.join(__dirname, "config.toml");
    const configContent = fs.readFileSync(configPath, "utf8");
    return TOML.parse(configContent) as unknown as AlignmentConfig;
}

const AlignmentAgentStateAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    originalUserPrompt: Annotation<string>({
        reducer: (prev, next) => next ?? prev,
    }),
    task: Annotation<string>({
        reducer: (prev, next) => next ?? prev,
    }),

    changeset: Annotation<z.infer<typeof AlignChangesetSchema>>({
        reducer: (prev, next) => next ?? prev,
        default: () => ({
            added: [],
            modified: [],
            deleted: [],
        }),
    }),

    alignToolCallCount: Annotation<number>({
        reducer: (prev, next) => next ?? prev,
        default: () => 0,
    }),
});

const createAgentNode =
    (ppApi: WhiteAgentPPApi) =>
    async (state: typeof AlignmentAgentStateAnnotation.State) => {
        const datamodel = ppApi.getCurrentDM();

        const alignmentDataModel = mapDatamodelForAlignment(datamodel);

        const dataModelMessage = new SystemMessage({
            content: `## Data Model\n\n${JSON.stringify(alignmentDataModel, null, 2)}`,
        });

        const prompt = fs.readFileSync(
            path.join(__dirname, "prompts/prompt.md"),
            "utf8",
        );

        const sysPromptMessage = new SystemMessage({
            content: `## Prompt\n\n${prompt}`,
        });

        const userPromptMessage = new HumanMessage({
            content: `## Original User Prompt\n\n${state.originalUserPrompt}`,
        });

        const changesetApiYaml = fs.readFileSync(
            path.join(
                __dirname,
                "changeset/__generated__/changeset-schema.yaml",
            ),
            "utf8",
        );

        const changesetApiMessage = new SystemMessage({
            content: `## Changeset API\n\n${changesetApiYaml}`,
        });

        const config = loadConfig();
        const model = new ChatOpenAI({
            model: config.model.name,
            reasoning: {
                effort: config.model.reasoning.effort,
            },
            verbosity: config.model.verbosity,
            verbose: config.model.verbose,
        }).bindTools([getAlignmentTool]);

        const noToolCallsLeft =
            state.alignToolCallCount >= MAX_ALIGNMENT_TOOL_CALLS;

        // Check if last message is a tool message / response
        const lastMessage = state.messages.at(-1);
        const isToolMessage = lastMessage?.type === "tool";

        // FURTHER TODO: If we have used all alignment tool calls, we should not provide it to the model anymore and remove it from the prompt

        const result = await model.invoke(
            [
                sysPromptMessage,
                changesetApiMessage,
                dataModelMessage,
                userPromptMessage,
                ...state.messages,
            ],
            {
                tools: [getAlignmentTool],
            },
        );

        const alignmentToolCallCount = result.tool_calls?.length ?? 0;

        const isToolCall = result.tool_calls?.length ?? 0 > 0;
        const toolCallCount = isToolCall
            ? alignmentToolCallCount + 1
            : alignmentToolCallCount;

        return {
            messages: [result],
            alignToolCallCount: toolCallCount,
        };
    };

export async function createAlignmentAgent(
    state: Partial<typeof AlignmentAgentStateAnnotation.State>,

    ppApi: WhiteAgentPPApi,
) {
    const shouldContinue = (
        state: typeof AlignmentAgentStateAnnotation.State,
    ) => {
        const lastMessage = state.messages.at(-1);
        if (
            lastMessage &&
            "tool_calls" in lastMessage &&
            (lastMessage as any).tool_calls?.length
        ) {
            return "tools";
        }
        return END;
    };

    const agentNode = createAgentNode(ppApi);

    const graph = new StateGraph(AlignmentAgentStateAnnotation)
        .addNode("model", agentNode)
        .addNode("tools", new ToolNode([getAlignmentTool]))
        .addEdge("__start__", "model")
        .addEdge("tools", "model")
        .addConditionalEdges("model", shouldContinue, ["tools", END])
        .compile();

    const response = await graph.invoke({
        messages: [...(state.messages ?? [])],
        changeset: state.changeset,
        originalUserPrompt: state.originalUserPrompt,
    });

    return {
        messages: response.messages,
        changeset: response.changeset,
    };
}
