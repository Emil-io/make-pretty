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
import { Mutex } from "async-mutex";
import fs from "fs";
import path from "path";
import { getDatamodelFromChangeset } from "../../../../api/server/src/services/shared/datamodel/transformers/apply-changeset";
import { getChangesetFromDataModels } from "../../../../api/server/src/services/shared/datamodel/transformers/get-diff";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint";
import { getLayoutByIdFromGraph, getOutputDir, getShapeIdsFromLayout, } from "../../helpers";
import { runLayoutAnalyzerAgent } from "../layout-analyzer/agent";
import { previewLayout } from "../layout-analyzer/preview-layout";
import { runLayoutSelectorAgent } from "../layout-selector/agent";
import { runPlannerAgent } from "./agent";
import { runInParallel } from "./helpers";
var LayoutStepState = /** @class */ (function () {
    function LayoutStepState(_a) {
        var processId = _a.processId, stepGraph = _a.stepGraph, datamodel = _a.datamodel, layout = _a.layout, pptxPath = _a.pptxPath, slideId = _a.slideId;
        this.checkpoints = [];
        this.dmMutex = new Mutex();
        this.stopRequested = false;
        this.maxIterations = 10;
        this.pastSteps = [];
        this.nextSteps = [];
        this.processId = processId;
        this.stepGraph = stepGraph;
        this.datamodel = datamodel;
        this.layout = layout;
        this.currLayout = layout;
        this.originalDatamodel = datamodel;
        this.pptxPath = pptxPath;
        this.slideId = slideId;
    }
    LayoutStepState.prototype.getState = function () {
        return {
            stepGraph: this.stepGraph,
            originalLayout: this.layout,
            currentLayout: this.currLayout,
            promptCtx: null,
            datamodel: this.datamodel,
            checkpoints: this.checkpoints,
            accomplishedSteps: this.pastSteps,
        };
    };
    LayoutStepState.prototype.updateStep = function (stepId, step) {
        this.stepGraph = this.stepGraph.map(function (s) {
            return s.id === stepId ? step : s;
        });
        return this.stepGraph;
    };
    LayoutStepState.prototype.getContext = function () {
        return {
            stepGraph: this.stepGraph,
            pptxPath: this.pptxPath,
            slideId: this.slideId,
            originalLayout: this.layout,
            currentLayout: this.currLayout,
            promptCtx: null,
            datamodel: this.datamodel,
            checkpoints: this.checkpoints,
            accomplishedSteps: this.pastSteps,
            updateCurrLayout: this.updateCurrLayout.bind(this),
            updateDatamodelFromChangeset: this.updateDatamodel.bind(this),
            updateStep: this.updateStep.bind(this),
        };
    };
    LayoutStepState.prototype.updateCurrLayout = function (layout) {
        this.currLayout = layout;
    };
    LayoutStepState.prototype.updateDatamodel = function (changeset) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dmMutex.runExclusive(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                try {
                                    this.datamodel = getDatamodelFromChangeset(this.datamodel, changeset);
                                }
                                catch (error) {
                                    console.error("[layout-planner]: Error updating datamodel: ".concat(error));
                                    throw error;
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LayoutStepState.prototype.makeCheckpoint = function (stepId) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                state = this.getState();
                this.checkpoints.push({
                    stepId: stepId !== null && stepId !== void 0 ? stepId : undefined,
                    currentLayout: this.currLayout,
                    currentDatamodel: this.datamodel,
                });
                return [2 /*return*/];
            });
        });
    };
    LayoutStepState.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stopRequested = true;
                return [2 /*return*/];
            });
        });
    };
    LayoutStepState.prototype.getCurrentSteps = function () {
        var _this = this;
        // A step is current if it is not in "next" and not in "past" yet
        var currentStepIds = new Set();
        this.stepGraph.forEach(function (s) {
            if (!_this.nextSteps.map(function (s) { return s.id; }).includes(s.id) &&
                !_this.pastSteps.map(function (s) { return s.id; }).includes(s.id)) {
                currentStepIds.add(s.id);
            }
        });
        return this.stepGraph.filter(function (s) { return currentStepIds.has(s.id); });
    };
    LayoutStepState.prototype.getNextSteps = function (step) {
        var _a;
        // If null, find all steps that are not in "next" of any other step
        if (step === null) {
            var allNextSteps_1 = new Set();
            this.stepGraph.forEach(function (s) {
                if (s.next) {
                    s.next.forEach(function (n) { return allNextSteps_1.add(n); });
                }
            });
            return this.stepGraph.filter(function (s) { return !allNextSteps_1.has(s.id); });
        }
        // If a step is provided, find all steps that are in "next" of the provided step
        var nextCandidates = (_a = step.next) !== null && _a !== void 0 ? _a : [];
        return this.stepGraph.filter(function (s) { return nextCandidates.includes(s.id); });
    };
    LayoutStepState.prototype.setNextSteps = function (steps) {
        var _a;
        // Filter out steps whose id already exists in pastSteps or are already in nextSteps
        var pastStepIds = new Set(this.pastSteps.map(function (s) { return s.id; }));
        var nextStepIds = new Set(this.nextSteps.map(function (s) { return s.id; }));
        var newSteps = steps.filter(function (s) {
            // Skip if this step was already in pastSteps or nextSteps
            if (pastStepIds.has(s.id) || nextStepIds.has(s.id))
                return false;
            // If the step has dependencies, check all of them are already accomplished
            if (Array.isArray(s.dependsOn) && s.dependsOn.length > 0) {
                return s.dependsOn.every(function (depId) {
                    return pastStepIds.has(depId);
                });
            }
            // No dependencies, can be included
            return true;
        });
        // Add qualified new steps to nextSteps instead of overwriting
        (_a = this.nextSteps).push.apply(_a, newSteps);
    };
    LayoutStepState.prototype.getLatestChangeset = function () {
        var outputDir = getOutputDir(this.processId);
        // Save original datamodel to file system
        try {
            var originalDatamodelPath = path.join(outputDir, "original-datamodel.json");
            fs.writeFileSync(originalDatamodelPath, JSON.stringify(this.originalDatamodel, null, 2));
        }
        catch (error) {
            console.error("[layout-planner]: Error saving original datamodel: ".concat(error));
            throw error;
        }
        // Save current datamodel to file system
        try {
            var currentDatamodelPath = path.join(outputDir, "current-datamodel.json");
            fs.writeFileSync(currentDatamodelPath, JSON.stringify(this.datamodel, null, 2));
        }
        catch (error) {
            console.error("[layout-planner]: Error saving current datamodel: ".concat(error));
            throw error;
        }
        return getChangesetFromDataModels(this.originalDatamodel, this.datamodel);
    };
    LayoutStepState.prototype.run = function (onStepStart, onStepComplete) {
        return __awaiter(this, void 0, void 0, function () {
            var iterations, currSteps, context, res, firstError, error_1, outputDir, checkpointsPath, finalDatamodelPath, res, changesetPath, totalSteps;
            var _a;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (_a = this.nextSteps).push.apply(_a, this.getNextSteps(null));
                        iterations = 0;
                        _c.label = 1;
                    case 1:
                        if (!(this.nextSteps.length > 0 &&
                            !this.stopRequested &&
                            iterations <= this.maxIterations)) return [3 /*break*/, 6];
                        currSteps = [];
                        while (this.nextSteps.length > 0) {
                            currSteps.push(this.nextSteps.shift());
                        }
                        iterations++;
                        context = this.getContext();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        onStepStart === null || onStepStart === void 0 ? void 0 : onStepStart(currSteps, context);
                        return [4 /*yield*/, runInParallel(this.processId, currSteps, context, function (step, result) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    this.pastSteps.push(step);
                                    this.setNextSteps(this.getNextSteps(step));
                                    this.makeCheckpoint(step.id);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        res = _c.sent();
                        firstError = (_b = res.find(function (r) { return r.status === "rejected"; })) === null || _b === void 0 ? void 0 : _b.reason;
                        if (firstError) {
                            console.error("[layout-planner]: Error: ".concat(firstError));
                            //throw new Error(firstError);
                        }
                        onStepComplete === null || onStepComplete === void 0 ? void 0 : onStepComplete(currSteps, context);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        this.error = error_1;
                        console.error("[layout-planner]: Error: ".concat(error_1));
                        throw error_1;
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        outputDir = getOutputDir(this.processId);
                        // Save all checkpoints to file system
                        try {
                            checkpointsPath = path.join(outputDir, "checkpoints.json");
                            fs.writeFileSync(checkpointsPath, JSON.stringify(this.checkpoints, null, 2));
                        }
                        catch (error) {
                            console.error("[layout-planner]: Error saving checkpoints: ".concat(error));
                        }
                        // Save the final datamodel
                        try {
                            finalDatamodelPath = path.join(outputDir, "final-datamodel.json");
                            fs.writeFileSync(finalDatamodelPath, JSON.stringify(this.datamodel, null, 2));
                        }
                        catch (error) {
                            console.error("[layout-planner]: Error saving final datamodel: ".concat(error));
                        }
                        try {
                            res = this.getLatestChangeset();
                            changesetPath = path.join(outputDir, "changeset.json");
                            fs.writeFileSync(changesetPath, JSON.stringify(res, null, 2));
                        }
                        catch (error) {
                            console.error("[layout-planner]: Error saving changeset: ".concat(error));
                        }
                        totalSteps = this.pastSteps.length;
                        console.info("[layout-planner]: Completed ".concat(totalSteps, " steps"));
                        return [2 /*return*/];
                }
            });
        });
    };
    return LayoutStepState;
}());
export { LayoutStepState };
export var runWorkflow = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var service, datamodel, snapshot, layoutAnalyzerOutput, mapping_1, layoutSelectorOutput, narrowedDownLayout, narrowedDownShapeIds, narrowedDownDatamodel, plan, graph, outputDir, graphPath, changeset, outputPath, result;
    var userPrompt = _b.userPrompt, processId = _b.processId, pptxPath = _b.pptxPath, slideIndex = _b.slideIndex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
            case 1:
                service = _c.sent();
                return [4 /*yield*/, service.getSlideByIndex(pptxPath, slideIndex)];
            case 2:
                datamodel = _c.sent();
                return [4 /*yield*/, service.getSlideSnapshotByIndex(pptxPath, slideIndex)];
            case 3:
                snapshot = _c.sent();
                return [4 /*yield*/, runLayoutAnalyzerAgent({
                        snapshotBase64: snapshot.pngBytes.toString("base64"),
                        datamodel: datamodel,
                        processId: processId,
                    })];
            case 4:
                layoutAnalyzerOutput = _c.sent();
                return [4 /*yield*/, previewLayout(processId, "layout-analyzer-visualization", pptxPath, datamodel.id, layoutAnalyzerOutput.layout)];
            case 5:
                _c.sent();
                // Update the datamodel shape names by the layoutAnalyzerOutput.imgMapping
                if (layoutAnalyzerOutput.imgMapping) {
                    mapping_1 = layoutAnalyzerOutput.imgMapping;
                    datamodel.shapes = datamodel.shapes.map(function (s) {
                        var idKey = String(s.id);
                        return mapping_1.hasOwnProperty(idKey)
                            ? __assign(__assign({}, s), { name: mapping_1[idKey] }) : s;
                    });
                }
                return [4 /*yield*/, runLayoutSelectorAgent({
                        prompt: userPrompt,
                        layoutSchema: layoutAnalyzerOutput.layout,
                        processId: processId,
                    })];
            case 6:
                layoutSelectorOutput = _c.sent();
                narrowedDownLayout = getLayoutByIdFromGraph(layoutSelectorOutput.main, layoutAnalyzerOutput.layout);
                narrowedDownShapeIds = getShapeIdsFromLayout(narrowedDownLayout);
                narrowedDownDatamodel = __assign(__assign({}, datamodel), { shapes: datamodel.shapes.filter(function (s) {
                        return narrowedDownShapeIds.includes(s.id);
                    }) });
                return [4 /*yield*/, runPlannerAgent(processId, narrowedDownDatamodel, narrowedDownLayout, layoutSelectorOutput.main, userPrompt)];
            case 7:
                plan = _c.sent();
                graph = new LayoutStepState({
                    processId: processId,
                    stepGraph: plan.steps,
                    datamodel: narrowedDownDatamodel,
                    layout: narrowedDownLayout,
                    pptxPath: pptxPath,
                    slideId: datamodel.id,
                });
                outputDir = getOutputDir(processId);
                graphPath = path.join(outputDir, "graph.json");
                // Write graph to file system
                fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));
                return [4 /*yield*/, graph.run(function (steps, ctx) {
                        console.info("[layout-planner]: Starting steps: ".concat(steps.map(function (s) { return s.id; }).join(", ")));
                        return;
                    }, function (steps, ctx) {
                        console.info("[layout-planner]: Completed steps: ".concat(steps.map(function (s) { return s.id; }).join(", ")));
                        return;
                    })];
            case 8:
                _c.sent();
                changeset = graph.getLatestChangeset();
                outputPath = path.join(outputDir, "result.pptx");
                return [4 /*yield*/, service.injectChangeset(pptxPath, changeset, outputPath, datamodel.id)];
            case 9:
                result = _c.sent();
                console.info("[layout-planner]: Result saved to: ".concat(result.outputPath));
                return [2 /*return*/];
        }
    });
}); };
