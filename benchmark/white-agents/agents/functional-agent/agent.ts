import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    Annotation,
    END,
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { AITChangesetSchema } from "../../../../api/server/src/schemas/changeset/schemas/changeset.js";
import { Agent, WhiteAgentPPApi } from "../../runtime/index.js";
import { createAlignmentAgent } from "./alignment/agent.js";

type Step = {
    agent: "alignment" | "copywriter" | "styling";
    task: string;
};

export const FunctionSpecificGraphStateAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    currentAgent: Annotation<string | null>({
        reducer: (prev, next) => next ?? prev,
        default: () => null,
    }),
    userPrompt: Annotation<string>({
        reducer: (prev, next) => next ?? prev,
        default: () => "",
    }),

    outstandingSteps: Annotation<Step[]>({
        reducer: (prev, next) => next ?? prev,
        default: () => [],
    }),
    finishedSteps: Annotation<Step[]>({
        reducer: (prev, next) => next ?? prev,
        default: () => [],
    }),

    changeset: Annotation<AITChangesetSchema>({
        reducer: (prev, next) => next ?? prev,
        default: () => ({
            added: [],
            modified: [],
            deleted: [],
        }),
    }),
});

/**
 * FunctionalAgent - Supervisor-based multi-agent system
 *
 * Routes requests to specialized agents based on task type:
 * - AlignmentAgent: Layout, positioning, alignment
 * - CopywriterAgent: Content generation
 * - StylingAgent: Visual styling
 */
export class FunctionalAgent implements Agent {
    public readonly name: string = "Functional Agent (Supervisor)";
    private ppApi: WhiteAgentPPApi;

    constructor(ppApi: WhiteAgentPPApi) {
        this.ppApi = ppApi;
    }

    /**
     * Get the PowerPoint API
     */
    protected getPPApi(): WhiteAgentPPApi {
        return this.ppApi;
    }

    /**
     * Add a step to the outstanding steps queue
     */
    private addStep(
        state: typeof FunctionSpecificGraphStateAnnotation.State,
        step: Step,
    ) {
        return {
            ...state,
            outstandingSteps: [...state.outstandingSteps, step],
        };
    }

    /**
     * Pop a step from the outstanding steps queue
     */
    private popStep(state: typeof FunctionSpecificGraphStateAnnotation.State) {
        const step = state.outstandingSteps[0];
        const newState = {
            ...state,
            outstandingSteps: state.outstandingSteps.slice(1),
            finishedSteps: [...state.finishedSteps, step],
        };
        return { newState, step };
    }

    /**
     * AlignmentAgent wrapper - Handles layout, positioning, and alignment tasks
     */
    private createAlignmentAgentWrapper = async (
        state: typeof FunctionSpecificGraphStateAnnotation.State,
    ) => {
        const alignmentAgent = await createAlignmentAgent(
            {
                originalUserPrompt: state.userPrompt,
                messages: state.messages,
            },
            this.ppApi,
        );

        // Take the alignment changeset and apply it to the presentation
        const alignmentChangeset = alignmentAgent.changeset;

        return {
            ...state,
            changeset: alignmentChangeset,
            messages: alignmentAgent.messages,
        };
    };

    /**
     * Router function to determine which agent should handle the request
     */
    private routeToAgent(
        state: typeof FunctionSpecificGraphStateAnnotation.State,
    ) {
        const lastMessage = state.messages.at(-1);

        // If the LLM makes a tool call, route to tools
        if (
            lastMessage &&
            "tool_calls" in lastMessage &&
            (lastMessage as any).tool_calls?.length
        ) {
            return "tools";
        }

        // If we have a current agent, continue with it, otherwise end
        return END;
    }

    /**
     * Create supervisor to decide which agent should handle the initial request
     */
    private createSupervisor() {
        const model = new ChatOpenAI({
            model: "gpt-5-nano",
            reasoning: {
                effort: "minimal",
            },
            verbosity: "low",
            verbose: true,
        });

        const systemPrompt = new SystemMessage({
            content: `You are a supervisor routing requests to specialized agents. Analyze the user's request and determine which agent should handle it:

- AlignmentAgent: For layout, positioning, alignment, spacing, and distribution tasks
Respond with ONLY one of: "alignment"`,
        });

        return async (
            state: typeof FunctionSpecificGraphStateAnnotation.State,
        ) => {
            const response = await model.invoke([
                systemPrompt,
                ...state.messages,
            ]);

            const agentChoice = (response.content as string)
                .toLowerCase()
                .trim();

            return {
                messages: [response],
                currentAgent: agentChoice,
            };
        };
    }

    /**
     * Route from supervisor to the appropriate agent
     */
    private routeFromSupervisor(
        state: typeof FunctionSpecificGraphStateAnnotation.State,
    ) {
        const agent = state.currentAgent;

        if (agent === "alignment") {
            return "alignmentAgent";
        } else if (agent === "copywriter") {
            return "copywriterAgent";
        } else if (agent === "styling") {
            return "stylingAgent";
        }

        // Default to alignment if unclear
        return "alignmentAgent";
    }

    /**
     * Generate changeset using supervisor-based agent system
     */
    async generateChangeset(
        userPrompt: string,
        systemPrompt: string,
    ): Promise<any> {
        console.log("🚀 Starting function-specific agent system...");

        try {


            // Extract datamodel
            await this.ppApi.extractDatamodel();


            // Simple graph with just alignment agent (no router)
            const graph = new StateGraph(FunctionSpecificGraphStateAnnotation)
                .addNode("alignmentAgent", this.createAlignmentAgentWrapper)
                .addEdge(START, "alignmentAgent")
                .addEdge("alignmentAgent", END)
                .compile();

            const userMessage = new HumanMessage({
                content: userPrompt,
            });

            const response = await graph.invoke({
                messages: [userMessage],
                userPrompt: userPrompt,
            });

            console.log("✅ Agent system completed");

            return response.changeset;

            /*// Build the graph
                        const supervisor = this.createSupervisor();

            const graph = new StateGraph(FunctionSpecificGraphStateAnnotation)
                // Add agent nodes
                .addNode("supervisor", supervisor)
                .addNode("alignmentAgent", this.createAlignmentAgentWrapper)
                .addEdge(START, "supervisor")
                .addConditionalEdges(
                    "supervisor",
                    this.routeFromSupervisor.bind(this),
                    ["alignmentAgent", END],
                )
                .addEdge("alignmentAgent", END)
                .compile();

            const userMessage = new HumanMessage({
                content: userPrompt,
            });

            const response = await graph.invoke({
                messages: [userMessage],
            });

            console.log("✅ Agent system completed");

            return response.changeset;
            */
        } catch (error) {
            console.error("❌ Function-specific agent system failed:", error);
            throw error;
        }
    }
}
