/**
* Default LangGraph Agent
*
* This agent uses LangGraph with OpenAI to generate changesets for PowerPoint presentations.
* It includes tool calling capabilities for alignment operations.
*/
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
import { Annotation, END, MessagesAnnotation, StateGraph, } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// AI Model Configuration
var AI_MODEL = "gpt-5-mini"; // <-- EDIT HERE
var REASONING_EFFORT = undefined; // <-- EDIT HERE, MAKE SURE MODEL SUPPORTS IT, OTHERWISE UNDEFINED
var LayouterGraphStateAnnotation = Annotation.Root(__assign({}, MessagesAnnotation.spec));
var DefaultAgent = /** @class */ (function () {
    function DefaultAgent(ppApi) {
        this.changesetSchema = "";
        this.masterAnalysis = "";
        this.name = "Default LangGraph Agent";
        this.ppApi = ppApi;
    }
    /**
     * Get the PowerPoint API
     */
    DefaultAgent.prototype.getPPApi = function () {
        return this.ppApi;
    };
    /**
     * Set schema and analysis context for the agent
     */
    DefaultAgent.prototype.setContext = function (changesetSchema, masterAnalysis) {
        this.changesetSchema = changesetSchema;
        this.masterAnalysis = masterAnalysis;
    };
    /**
     * Generate changeset using AI
     */
    DefaultAgent.prototype.generateChangeset = function (datamodel, userPrompt, systemPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var model_1, shouldContinue, systemMessage_1, masterAnalysisMessage, schemaMessage_1, dataMessage, userRequestMessage, modelNode, graph, response, changesetText, changeset, jsonMatch, changeset, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🤖 Generating changeset with AI...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        model_1 = new ChatOpenAI({
                            modelName: AI_MODEL,
                            reasoning: {
                                effort: REASONING_EFFORT,
                            },
                            verbosity: "low",
                            verbose: false,
                        });
                        shouldContinue = function (state) {
                            var _a;
                            var lastMessage = state.messages.at(-1);
                            // If the LLM makes a tool call, then perform an action
                            if (lastMessage &&
                                "tool_calls" in lastMessage &&
                                ((_a = lastMessage.tool_calls) === null || _a === void 0 ? void 0 : _a.length)) {
                                console.log("IS TOOL CALL");
                                return "tools";
                            }
                            // Otherwise, we stop (reply to the user)
                            console.log("IS NOT TOOL CALL");
                            return END;
                        };
                        systemMessage_1 = new SystemMessage({
                            content: systemPrompt,
                        });
                        masterAnalysisMessage = new SystemMessage({
                            content: "## Master Analysis\n\n".concat(this.masterAnalysis),
                        });
                        schemaMessage_1 = new SystemMessage({
                            content: "## Changeset Schema\n\n".concat(this.changesetSchema),
                        });
                        dataMessage = new SystemMessage({
                            content: "## Data Model\n\n".concat(JSON.stringify(datamodel, null, 2)),
                        });
                        userRequestMessage = new HumanMessage({
                            content: userPrompt,
                        });
                        modelNode = function (state) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, model_1.invoke(__spreadArray([systemMessage_1, schemaMessage_1], state.messages, true))];
                                    case 1:
                                        response = _a.sent();
                                        return [2 /*return*/, {
                                                messages: [response],
                                            }];
                                }
                            });
                        }); };
                        console.log("STARTING GRAPH");
                        graph = new StateGraph(LayouterGraphStateAnnotation)
                            .addNode("llm", modelNode)
                            .addEdge("__start__", "llm")
                            .addConditionalEdges("llm", shouldContinue)
                            .compile();
                        return [4 /*yield*/, graph.invoke({
                                messages: [
                                    masterAnalysisMessage,
                                    dataMessage,
                                    userRequestMessage,
                                ],
                            }, {})];
                    case 2:
                        response = _a.sent();
                        changesetText = response.messages[response.messages.length - 1].content;
                        // Try to parse the changeset
                        try {
                            console.log("✅ Changeset text:", changesetText);
                            changeset = JSON.parse(changesetText);
                            console.log("✅ Changeset generated successfully");
                            return [2 /*return*/, changeset];
                        }
                        catch (parseError) {
                            jsonMatch = changesetText.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                changeset = JSON.parse(jsonMatch[0]);
                                console.log("✅ Changeset extracted from response");
                                return [2 /*return*/, changeset];
                            }
                            else {
                                throw new Error("Failed to parse changeset from AI response: ".concat(parseError));
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("❌ Failed to generate changeset:", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DefaultAgent;
}());
export { DefaultAgent };
