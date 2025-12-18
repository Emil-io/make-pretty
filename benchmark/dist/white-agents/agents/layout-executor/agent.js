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
import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import { AILayoutUpdate } from "../../../../api/server/src/schemas/base/layout-update";
import { getChangesetFromDataModels } from "../../../../api/server/src/services/shared/datamodel/transformers/get-diff";
import { getLayoutByIdFromGraph, getOutputDir, getShapeIdsFromLayout, loadSystemPrompt, transformResult, } from "../../helpers";
import { StepType, } from "../layout-planner/types";
var MAX_RETRIES = 2;
function formatValidationErrors(error) {
    return error.issues
        .map(function (issue) { return "".concat(issue.path.join("."), ": ").concat(issue.message); })
        .join("\n");
}
function createSchemaValidationErrorMessage(error) {
    var errorMessages = formatValidationErrors(error);
    return "The output does not conform to the required schema. Schema validation errors:\n".concat(errorMessages, "\n\nPlease fix the output to match the required schema format.");
}
var executerAgent;
var getExecuterAgent = function () {
    if (!executerAgent) {
        executerAgent = new ChatVertexAI({
            model: "gemini-2.5-flash-lite",
            temperature: 0,
            thinkingBudget: 1024,
            maxOutputTokens: 4096,
            maxRetries: 2,
        });
    }
    return executerAgent;
};
export var runExecutorAgent = function (processId, step, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    function runModelWithValidation() {
        return __awaiter(this, arguments, void 0, function (additionalMessages, attempt) {
            var messages, response, result, parsedResult, errorMessage, validationResult, newDm, includedShapes_1, missingShapes, includedShapeIds_1, otherShapes, changeset, errorMessage;
            if (additionalMessages === void 0) { additionalMessages = []; }
            if (attempt === void 0) { attempt = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messages = [
                            ["system", systemPrompt],
                            new HumanMessage({
                                content: __spreadArray([
                                    {
                                        type: "text",
                                        text: "# Your Task: ".concat(step.task, "\n\n"),
                                    },
                                    {
                                        type: "text",
                                        text: "# Your Target Layout/Boundaries: \n\n".concat(JSON.stringify(scopedLayout.b), "\n\n"),
                                    },
                                    {
                                        type: "text",
                                        text: "# Shapes in original layouts: \n\n If the array is empty, you likely have to create new shapes (i.e., no shapes in the original layout that would transform into this new layout) \n\n".concat(JSON.stringify(executerModel), "\n\n"),
                                    },
                                    {
                                        type: "text",
                                        text: "# Coupler-Agent Rules/Constraints: \n\n".concat(constraintStrings, "\n\n"),
                                    }
                                ], additionalMessages, true),
                            }),
                        ];
                        return [4 /*yield*/, getExecuterAgent().invoke(messages, {
                            //  runId: processId,
                            })];
                    case 1:
                        response = _a.sent();
                        result = transformResult(response.content);
                        // Save result to file system
                        fs.writeFileSync(resultPath, JSON.stringify(JSON.parse(result), null, 2));
                        try {
                            parsedResult = JSON.parse(result);
                        }
                        catch (parseError) {
                            errorMessage = parseError instanceof Error
                                ? parseError.message
                                : String(parseError);
                            if (attempt < MAX_RETRIES) {
                                return [2 /*return*/, runModelWithValidation([
                                        {
                                            type: "text",
                                            text: "\n\n# Error: Your last try failed. Please fix the JSON parsing error:\n".concat(errorMessage, "\n\nPlease ensure your output is valid JSON conforming to the AIChangesetSchema."),
                                        },
                                    ], attempt + 1)];
                            }
                            throw new Error("Failed to parse JSON after ".concat(MAX_RETRIES, " attempts: ").concat(errorMessage));
                        }
                        validationResult = AILayoutUpdate.safeParse(parsedResult);
                        if (validationResult.success) {
                            newDm = validationResult.data.shapes;
                            includedShapes_1 = new Set(__spreadArray(__spreadArray([], newDm.map(function (s) { return s.id; }), true), validationResult.data.deleteShapes, true));
                            missingShapes = executerModel.filter(function (s) { return !includedShapes_1.has(s.id); });
                            // Add missing shapes to the newDm
                            newDm = __spreadArray(__spreadArray([], newDm, true), missingShapes, true);
                            includedShapeIds_1 = new Set(__spreadArray(__spreadArray([], newDm.map(function (s) { return s.id; }), true), validationResult.data.deleteShapes, true));
                            otherShapes = datamodel.shapes.filter(function (s) { return !includedShapeIds_1.has(s.id); });
                            newDm = __spreadArray(__spreadArray([], newDm, true), otherShapes, true);
                            changeset = getChangesetFromDataModels(datamodel, {
                                id: datamodel.id,
                                index: datamodel.index,
                                shapes: newDm,
                            });
                            return [2 /*return*/, __assign(__assign({}, step), { result: changeset })];
                        }
                        // Schema validation failed
                        if (attempt < MAX_RETRIES) {
                            errorMessage = createSchemaValidationErrorMessage(validationResult.error);
                            return [2 /*return*/, runModelWithValidation([
                                    {
                                        type: "text",
                                        text: "\n\n# Error: Your last try failed. Please only fix this according to the schema:\n\n".concat(errorMessage),
                                    },
                                ], attempt + 1)];
                        }
                        throw new Error("Failed to validate schema after ".concat(MAX_RETRIES, " attempts: ").concat(createSchemaValidationErrorMessage(validationResult.error)));
                }
            });
        });
    }
    var id, layoutId, datamodel, currentLayout, scopedLayout, executerModel, couplerSteps, constraintStrings, systemPrompt, outputDir, resultPath;
    return __generator(this, function (_a) {
        id = step.id, layoutId = step.layoutId;
        datamodel = ctx.datamodel, currentLayout = ctx.currentLayout;
        scopedLayout = getLayoutByIdFromGraph(layoutId, currentLayout);
        if (!scopedLayout) {
            throw new Error("Layout with id ".concat(layoutId, " not found in current layout"));
        }
        executerModel = getExecuterDatamodel(scopedLayout, ctx);
        couplerSteps = getPreviousCouplerSteps(id, ctx);
        constraintStrings = couplerSteps.map(function (s) { return s.result; }).join("\n\n");
        systemPrompt = getExecuterSystemPrompt();
        outputDir = getOutputDir(processId);
        resultPath = path.join(outputDir, "executor-result:".concat(id, ".json"));
        return [2 /*return*/, runModelWithValidation()];
    });
}); };
export var getPreviousCouplerSteps = function (stepId, ctx) {
    // Find the checkpoint that contains the step with stepId
    var graph = ctx.stepGraph;
    // Construct a map for quick id -> step lookup
    var stepMap = {};
    graph.forEach(function (s) {
        stepMap[s.id] = s;
    });
    // Find all ancestor nodes via reverse traversal of the graph, following "next" edges backward
    // To do this, create a mapping from child id to parents
    var parentMap = {};
    graph.forEach(function (s) {
        if (s.next) {
            s.next.forEach(function (n) {
                if (!parentMap[n])
                    parentMap[n] = [];
                parentMap[n].push(s.id);
            });
        }
    });
    // BFS from stepId backwards, collecting all ancestor nodes
    var visited = new Set();
    var couplerSteps = [];
    var queue = [stepId];
    while (queue.length > 0) {
        var currentId = queue.shift();
        if (visited.has(currentId))
            continue;
        visited.add(currentId);
        var currentStep = stepMap[currentId];
        if (currentStep && currentStep.type === StepType.coupler) {
            couplerSteps.push(currentStep);
        }
        var parents = parentMap[currentId] || [];
        for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
            var parentId = parents_1[_i];
            if (!visited.has(parentId)) {
                queue.push(parentId);
            }
        }
    }
    return couplerSteps.reverse();
};
export var getExecuterSystemPrompt = function () {
    var systemPrompt = loadSystemPrompt(import.meta.dirname, "sp.md");
    return systemPrompt;
};
export var getExecuterDatamodel = function (layout, ctx) {
    var datamodel = ctx.datamodel;
    // Only get the shapes that are associated with the layout (or its sublayouts)
    var shapeIdSet = new Set(getShapeIdsFromLayout(layout));
    var shapes = datamodel.shapes.filter(function (s) { return shapeIdSet.has(s.id); });
    return shapes;
};
