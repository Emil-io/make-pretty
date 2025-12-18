var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Annotation, END, MessagesAnnotation, START, StateGraph, } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createAlignmentAgent } from "./alignment/agent.js";
export var FunctionSpecificGraphStateAnnotation = Annotation.Root(__assign(__assign({}, MessagesAnnotation.spec), { currentAgent: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return null; },
    }), userPrompt: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return ""; },
    }), outstandingSteps: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return []; },
    }), finishedSteps: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return []; },
    }), changeset: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return ({
            added: [],
            modified: [],
            deleted: [],
        }); },
    }) }));
/**
 * FunctionalAgent - Supervisor-based multi-agent system
 *
 * Routes requests to specialized agents based on task type:
 * - AlignmentAgent: Layout, positioning, alignment
 * - CopywriterAgent: Content generation
 * - StylingAgent: Visual styling
 */
var FunctionalAgent = /** @class */ (function () {
    function FunctionalAgent(ppApi) {
        var _this = this;
        this.name = "Functional Agent (Supervisor)";
        /**
         * AlignmentAgent wrapper - Handles layout, positioning, and alignment tasks
         */
        this.createAlignmentAgentWrapper = function (state) { return __awaiter(_this, void 0, void 0, function () {
            var alignmentAgent, alignmentChangeset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createAlignmentAgent({
                            originalUserPrompt: state.userPrompt,
                            messages: state.messages,
                        }, this.ppApi)];
                    case 1:
                        alignmentAgent = _a.sent();
                        alignmentChangeset = alignmentAgent.changeset;
                        return [2 /*return*/, __assign(__assign({}, state), { changeset: alignmentChangeset, messages: alignmentAgent.messages })];
                }
            });
        }); };
        this.ppApi = ppApi;
    }
    /**
     * Get the PowerPoint API
     */
    FunctionalAgent.prototype.getPPApi = function () {
        return this.ppApi;
    };
    /**
     * Add a step to the outstanding steps queue
     */
    FunctionalAgent.prototype.addStep = function (state, step) {
        return __assign(__assign({}, state), { outstandingSteps: __spreadArray(__spreadArray([], state.outstandingSteps, true), [step], false) });
    };
    /**
     * Pop a step from the outstanding steps queue
     */
    FunctionalAgent.prototype.popStep = function (state) {
        var step = state.outstandingSteps[0];
        var newState = __assign(__assign({}, state), { outstandingSteps: state.outstandingSteps.slice(1), finishedSteps: __spreadArray(__spreadArray([], state.finishedSteps, true), [step], false) });
        return { newState: newState, step: step };
    };
    /**
     * Router function to determine which agent should handle the request
     */
    FunctionalAgent.prototype.routeToAgent = function (state) {
        var _a;
        var lastMessage = state.messages.at(-1);
        // If the LLM makes a tool call, route to tools
        if (lastMessage &&
            "tool_calls" in lastMessage &&
            ((_a = lastMessage.tool_calls) === null || _a === void 0 ? void 0 : _a.length)) {
            return "tools";
        }
        // If we have a current agent, continue with it, otherwise end
        return END;
    };
    /**
     * Create supervisor to decide which agent should handle the initial request
     */
    FunctionalAgent.prototype.createSupervisor = function () {
        var _this = this;
        var model = new ChatOpenAI({
            model: "gpt-5-nano",
            reasoning: {
                effort: "minimal",
            },
            verbosity: "low",
            verbose: true,
        });
        var systemPrompt = new SystemMessage({
            content: "You are a supervisor routing requests to specialized agents. Analyze the user's request and determine which agent should handle it:\n\n- AlignmentAgent: For layout, positioning, alignment, spacing, and distribution tasks\nRespond with ONLY one of: \"alignment\"",
        });
        return function (state) { return __awaiter(_this, void 0, void 0, function () {
            var response, agentChoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.invoke(__spreadArray([
                            systemPrompt
                        ], state.messages, true))];
                    case 1:
                        response = _a.sent();
                        agentChoice = response.content
                            .toLowerCase()
                            .trim();
                        return [2 /*return*/, {
                                messages: [response],
                                currentAgent: agentChoice,
                            }];
                }
            });
        }); };
    };
    /**
     * Route from supervisor to the appropriate agent
     */
    FunctionalAgent.prototype.routeFromSupervisor = function (state) {
        var agent = state.currentAgent;
        if (agent === "alignment") {
            return "alignmentAgent";
        }
        else if (agent === "copywriter") {
            return "copywriterAgent";
        }
        else if (agent === "styling") {
            return "stylingAgent";
        }
        // Default to alignment if unclear
        return "alignmentAgent";
    };
    /**
     * Generate changeset using supervisor-based agent system
     */
    FunctionalAgent.prototype.generateChangeset = function (userPrompt, systemPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var graph, userMessage, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🚀 Starting function-specific agent system...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Extract datamodel
                        return [4 /*yield*/, this.ppApi.extractDatamodel()];
                    case 2:
                        // Extract datamodel
                        _a.sent();
                        graph = new StateGraph(FunctionSpecificGraphStateAnnotation)
                            .addNode("alignmentAgent", this.createAlignmentAgentWrapper)
                            .addEdge(START, "alignmentAgent")
                            .addEdge("alignmentAgent", END)
                            .compile();
                        userMessage = new HumanMessage({
                            content: userPrompt,
                        });
                        return [4 /*yield*/, graph.invoke({
                                messages: [userMessage],
                                userPrompt: userPrompt,
                            })];
                    case 3:
                        response = _a.sent();
                        console.log("✅ Agent system completed");
                        return [2 /*return*/, response.changeset];
                    case 4:
                        error_1 = _a.sent();
                        console.error("❌ Function-specific agent system failed:", error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FunctionalAgent;
}());
export { FunctionalAgent };
