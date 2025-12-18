/**
 * Test Configuration Parser
 *
 * Handles parsing of command-line arguments and environment variables
 * for scenario test configuration.
 */

import {
    DefaultAgent,
    DummyAgent,
    FunctionalAgent,
} from "../white-agents/agents/index.js";

export const REGISTERED_AGENTS = {
    dummy: DummyAgent,
    default: DefaultAgent,
    functional: FunctionalAgent,
} as const;

export type AgentName = keyof typeof REGISTERED_AGENTS;

export interface TestConfig {
    agent: AgentName;
    systemPrompt: string;
    scenario: string | null;
    case: string | null;
}

/**
 * Parse command-line arguments and environment variables for test configuration
 */
export function parseTestConfig(): TestConfig {
    const args = process.argv.slice(2);

    const agent =
        (args.find((arg) => arg.startsWith("--agent="))?.split("=")[1] ||
            process.env.AGENT ||
            "dummy") as AgentName;

    const systemPrompt =
        args.find((arg) => arg.startsWith("--sys-prompt="))?.split("=")[1] ||
        process.env.SYS_PROMPT ||
        "prompt";

    const scenario =
        args
            .find((arg) => arg.startsWith("--scenario=") || arg.startsWith("-s="))
            ?.split("=")[1] ||
        process.env.SCENARIO ||
        null;

    const caseArg =
        args.find((arg) => arg.startsWith("--case="))?.split("=")[1] ||
        process.env.CASE ||
        null;

    // Validate agent selection
    if (!(agent in REGISTERED_AGENTS)) {
        console.error(
            `❌ Invalid agent: "${agent}". Available agents: ${Object.keys(REGISTERED_AGENTS).join(", ")}`,
        );
        process.exit(1);
    }

    return {
        agent,
        systemPrompt,
        scenario,
        case: caseArg,
    };
}

