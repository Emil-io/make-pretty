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
import fs from "fs";
import path from "path";
import TOML from "smol-toml";
import { mapDatamodelForAlignment } from "./mappings/datamodel";
export var MAX_ALIGNMENT_TOOL_CALLS = 3;
// Load configuration from TOML file
function loadConfig() {
    var configPath = path.join(__dirname, "config.toml");
    var configContent = fs.readFileSync(configPath, "utf8");
    return TOML.parse(configContent);
}
var AlignmentAgentStateAnnotation = Annotation.Root(__assign(__assign({}, MessagesAnnotation.spec), { originalUserPrompt: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
    }), task: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
    }), changeset: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return ({
            added: [],
            modified: [],
            deleted: [],
        }); },
    }), alignToolCallCount: Annotation({
        reducer: function (prev, next) { return next !== null && next !== void 0 ? next : prev; },
        default: function () { return 0; },
    }) }));
var createAgentNode = function (ppApi) {
    return function (state) { return __awaiter(void 0, void 0, void 0, function () {
        var datamodel, alignmentDataModel, dataModelMessage, prompt, sysPromptMessage, userPromptMessage, changesetApiYaml, changesetApiMessage, config, model, noToolCallsLeft, lastMessage, isToolMessage, result, alignmentToolCallCount, isToolCall, toolCallCount;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    datamodel = ppApi.getCurrentDM();
                    alignmentDataModel = mapDatamodelForAlignment(datamodel);
                    dataModelMessage = new SystemMessage({
                        content: "## Data Model\n\n".concat(JSON.stringify(alignmentDataModel, null, 2)),
                    });
                    prompt = fs.readFileSync(path.join(__dirname, "prompts/prompt.md"), "utf8");
                    sysPromptMessage = new SystemMessage({
                        content: "## Prompt\n\n".concat(prompt),
                    });
                    userPromptMessage = new HumanMessage({
                        content: "## Original User Prompt\n\n".concat(state.originalUserPrompt),
                    });
                    changesetApiYaml = fs.readFileSync(path.join(__dirname, "changeset/__generated__/changeset-schema.yaml"), "utf8");
                    changesetApiMessage = new SystemMessage({
                        content: "## Changeset API\n\n".concat(changesetApiYaml),
                    });
                    config = loadConfig();
                    model = new ChatOpenAI({
                        model: config.model.name,
                        reasoning: {
                            effort: config.model.reasoning.effort,
                        },
                        verbosity: config.model.verbosity,
                        verbose: config.model.verbose,
                    });
                    noToolCallsLeft = state.alignToolCallCount >= MAX_ALIGNMENT_TOOL_CALLS;
                    lastMessage = state.messages.at(-1);
                    isToolMessage = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.type) === "tool";
                    return [4 /*yield*/, model.invoke(__spreadArray([
                            sysPromptMessage,
                            changesetApiMessage,
                            dataModelMessage,
                            userPromptMessage
                        ], state.messages, true))];
                case 1:
                    result = _e.sent();
                    alignmentToolCallCount = (_b = (_a = result.tool_calls) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                    isToolCall = (_d = (_c = result.tool_calls) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0 > 0;
                    toolCallCount = isToolCall
                        ? alignmentToolCallCount + 1
                        : alignmentToolCallCount;
                    return [2 /*return*/, {
                            messages: [result],
                            alignToolCallCount: toolCallCount,
                        }];
            }
        });
    }); };
};
export function createAlignmentAgent(state, ppApi) {
    return __awaiter(this, void 0, void 0, function () {
        var shouldContinue, agentNode, graph, response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shouldContinue = function (state) {
                        var _a;
                        var lastMessage = state.messages.at(-1);
                        if (lastMessage &&
                            "tool_calls" in lastMessage &&
                            ((_a = lastMessage.tool_calls) === null || _a === void 0 ? void 0 : _a.length)) {
                            return "tools";
                        }
                        return END;
                    };
                    agentNode = createAgentNode(ppApi);
                    graph = new StateGraph(AlignmentAgentStateAnnotation)
                        .addNode("model", agentNode)
                        .addEdge("__start__", "model")
                        .addConditionalEdges("model", shouldContinue, [END])
                        .compile();
                    return [4 /*yield*/, graph.invoke({
                            messages: __spreadArray([], ((_a = state.messages) !== null && _a !== void 0 ? _a : []), true),
                            changeset: state.changeset,
                            originalUserPrompt: state.originalUserPrompt,
                        })];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, {
                            messages: response.messages,
                            changeset: response.changeset,
                        }];
            }
        });
    });
}
