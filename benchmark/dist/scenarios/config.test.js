/**
 * Test Configuration Parser
 *
 * Handles parsing of command-line arguments and environment variables
 * for scenario test configuration.
 */
import { DefaultAgent, DummyAgent, FunctionalAgent, } from "../white-agents/agents/index.js";
export var REGISTERED_AGENTS = {
    dummy: DummyAgent,
    default: DefaultAgent,
    functional: FunctionalAgent,
};
/**
 * Parse command-line arguments and environment variables for test configuration
 */
export function parseTestConfig() {
    var _a, _b, _c, _d;
    var args = process.argv.slice(2);
    var agent = (((_a = args.find(function (arg) { return arg.startsWith("--agent="); })) === null || _a === void 0 ? void 0 : _a.split("=")[1]) ||
        process.env.AGENT ||
        "dummy");
    var systemPrompt = ((_b = args.find(function (arg) { return arg.startsWith("--sys-prompt="); })) === null || _b === void 0 ? void 0 : _b.split("=")[1]) ||
        process.env.SYS_PROMPT ||
        "prompt";
    var scenario = ((_c = args
        .find(function (arg) { return arg.startsWith("--scenario=") || arg.startsWith("-s="); })) === null || _c === void 0 ? void 0 : _c.split("=")[1]) ||
        process.env.SCENARIO ||
        null;
    var caseArg = ((_d = args.find(function (arg) { return arg.startsWith("--case="); })) === null || _d === void 0 ? void 0 : _d.split("=")[1]) ||
        process.env.CASE ||
        null;
    // Validate agent selection
    if (!(agent in REGISTERED_AGENTS)) {
        console.error("\u274C Invalid agent: \"".concat(agent, "\". Available agents: ").concat(Object.keys(REGISTERED_AGENTS).join(", ")));
        process.exit(1);
    }
    return {
        agent: agent,
        systemPrompt: systemPrompt,
        scenario: scenario,
        case: caseArg,
    };
}
