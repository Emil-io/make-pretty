/**
 * White Agent Test Runner
 *
 * This class provides the runtime infrastructure for running white-box agent tests.
 * It handles test case discovery, execution, result tracking, and output generation.
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
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WhiteAgentPPApi } from "./pp-api.js";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// Paths
var BENCHMARK_DIR = path.join(__dirname, "../..");
var SCENARIOS_DIR = path.join(BENCHMARK_DIR, "scenarios");
var PROMPTS_DIR = path.join(BENCHMARK_DIR, "prompts");
var WhiteAgentRunner = /** @class */ (function () {
    function WhiteAgentRunner(config) {
        if (config === void 0) { config = {}; }
        this.outputDir = path.join(BENCHMARK_DIR, "__generated__");
        this.systemPromptName = config.systemPromptName || "prompt";
        this.scenarioFilter = config.scenarioFilter || null;
        this.caseFilter = config.caseFilter || null;
        // Create timestamped run directory (will be updated per scenario)
        var timestamp = new Date()
            .toISOString()
            .slice(0, 16)
            .replace(/:/g, "-");
        this.runDir = path.join(this.outputDir, "run-".concat(timestamp));
        this.changesetSchema = "";
        this.masterAnalysis = "";
    }
    /**
     * Ensure output directory exists
     */
    WhiteAgentRunner.prototype.ensureOutputDir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.mkdir(this.runDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to create output directory:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load changeset schema from YAML file
     */
    WhiteAgentRunner.prototype.loadChangesetSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schemaPath, schemaContent, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        schemaPath = path.join(BENCHMARK_DIR, "changeset-schema.yaml");
                        return [4 /*yield*/, fs.readFile(schemaPath, "utf8")];
                    case 1:
                        schemaContent = _a.sent();
                        this.changesetSchema = schemaContent;
                        console.log("✅ Changeset schema loaded successfully");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.warn("⚠️ Failed to load changeset schema:", error_2);
                        this.changesetSchema = "Changeset schema not available";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load master analysis from markdown file
     */
    WhiteAgentRunner.prototype.loadMasterAnalysis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var analysisPath, analysisContent, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        analysisPath = path.join(BENCHMARK_DIR, "master-analysis.md");
                        return [4 /*yield*/, fs.readFile(analysisPath, "utf8")];
                    case 1:
                        analysisContent = _a.sent();
                        this.masterAnalysis = analysisContent;
                        console.log("✅ Master analysis loaded successfully");
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.warn("⚠️ Failed to load master analysis:", error_3);
                        this.masterAnalysis = "Master analysis not available";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load system prompt from prompts folder for a specific scenario run directory
     */
    WhiteAgentRunner.prototype.loadSystemPromptForScenario = function (runDir) {
        return __awaiter(this, void 0, void 0, function () {
            var promptPath, promptContent, sysPromptPath, error_4, defaultPrompt, sysPromptPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        promptPath = path.join(PROMPTS_DIR, "".concat(this.systemPromptName, ".md"));
                        return [4 /*yield*/, fs.readFile(promptPath, "utf8")];
                    case 1:
                        promptContent = _a.sent();
                        sysPromptPath = path.join(runDir, "_sys-prompt.md");
                        return [4 /*yield*/, fs.writeFile(sysPromptPath, promptContent, "utf8")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, promptContent];
                    case 3:
                        error_4 = _a.sent();
                        console.warn("Failed to load system prompt from ".concat(this.systemPromptName, ".md, using default"));
                        defaultPrompt = "You are an expert PowerPoint layout assistant. Analyze the presentation data and generate precise changesets to modify slide layouts according to user requests.";
                        sysPromptPath = path.join(runDir, "_sys-prompt.md");
                        return [4 /*yield*/, fs.writeFile(sysPromptPath, defaultPrompt, "utf8")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, defaultPrompt];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load system prompt from prompts folder
     */
    WhiteAgentRunner.prototype.loadSystemPrompt = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promptPath, promptContent, sysPromptPath, error_5, defaultPrompt, sysPromptPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        promptPath = path.join(PROMPTS_DIR, "".concat(this.systemPromptName, ".md"));
                        return [4 /*yield*/, fs.readFile(promptPath, "utf8")];
                    case 1:
                        promptContent = _a.sent();
                        sysPromptPath = path.join(this.runDir, "_sys-prompt.md");
                        return [4 /*yield*/, fs.writeFile(sysPromptPath, promptContent, "utf8")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, promptContent];
                    case 3:
                        error_5 = _a.sent();
                        console.warn("Failed to load system prompt from ".concat(this.systemPromptName, ".md, using default"));
                        defaultPrompt = "You are an expert PowerPoint layout assistant. Analyze the presentation data and generate precise changesets to modify slide layouts according to user requests.";
                        sysPromptPath = path.join(this.runDir, "_sys-prompt.md");
                        return [4 /*yield*/, fs.writeFile(sysPromptPath, defaultPrompt, "utf8")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, defaultPrompt];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all test case IDs based on scenario filter
     */
    WhiteAgentRunner.prototype.getTestCaseIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var entries, testCaseIds, _i, entries_1, entry, scenarioDir, scenarioEntries, _a, scenarioEntries_1, testEntry, testCaseId, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, fs.readdir(SCENARIOS_DIR, {
                                withFileTypes: true,
                            })];
                    case 1:
                        entries = _b.sent();
                        testCaseIds = [];
                        _i = 0, entries_1 = entries;
                        _b.label = 2;
                    case 2:
                        if (!(_i < entries_1.length)) return [3 /*break*/, 5];
                        entry = entries_1[_i];
                        if (!(entry.isDirectory() && !entry.name.startsWith("_"))) return [3 /*break*/, 4];
                        // Apply scenario filter if specified
                        if (this.scenarioFilter &&
                            entry.name !== this.scenarioFilter) {
                            return [3 /*break*/, 4];
                        }
                        scenarioDir = path.join(SCENARIOS_DIR, entry.name);
                        return [4 /*yield*/, fs.readdir(scenarioDir, {
                                withFileTypes: true,
                            })];
                    case 3:
                        scenarioEntries = _b.sent();
                        for (_a = 0, scenarioEntries_1 = scenarioEntries; _a < scenarioEntries_1.length; _a++) {
                            testEntry = scenarioEntries_1[_a];
                            if (testEntry.isDirectory() &&
                                !testEntry.name.startsWith("_")) {
                                testCaseId = "".concat(entry.name, "-").concat(testEntry.name);
                                // Apply case filter if specified
                                if (this.caseFilter) {
                                    // If scenario is specified, match exact case ID
                                    if (this.scenarioFilter) {
                                        if (testCaseId !==
                                            "".concat(this.scenarioFilter, "-").concat(this.caseFilter)) {
                                            continue;
                                        }
                                    }
                                    else {
                                        // If no scenario specified, match just the case name
                                        if (testEntry.name !== this.caseFilter) {
                                            continue;
                                        }
                                    }
                                }
                                testCaseIds.push(testCaseId);
                            }
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, testCaseIds];
                    case 6:
                        error_6 = _b.sent();
                        console.error("Error reading test cases directory:", error_6);
                        return [2 /*return*/, []];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get test case data (datamodel.json and prompt.md)
     */
    WhiteAgentRunner.prototype.getTestCaseData = function (caseId) {
        return __awaiter(this, void 0, void 0, function () {
            var testIndex, scenarioName, testName, caseDir, presPath, promptPath, prompt_1, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        testIndex = caseId.lastIndexOf("test-");
                        if (testIndex === -1) {
                            throw new Error("Invalid case ID format: ".concat(caseId));
                        }
                        scenarioName = caseId.substring(0, testIndex - 1);
                        testName = caseId.substring(testIndex);
                        caseDir = path.join(SCENARIOS_DIR, scenarioName, testName);
                        presPath = path.join(caseDir, "pres.pptx");
                        return [4 /*yield*/, fs.access(presPath)];
                    case 1:
                        _a.sent(); // Check if file exists
                        promptPath = path.join(caseDir, "prompt.md");
                        return [4 /*yield*/, fs.readFile(promptPath, "utf-8")];
                    case 2:
                        prompt_1 = _a.sent();
                        return [2 /*return*/, {
                                caseId: caseId,
                                datamodel: null, // Will be extracted later with ppApi instance
                                prompt: prompt_1.trim(),
                                presentationPath: presPath,
                            }];
                    case 3:
                        error_7 = _a.sent();
                        console.error("Error reading test case data for ".concat(caseId, ":"), error_7);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract datamodel from PowerPoint using PowerPoint API
     */
    WhiteAgentRunner.prototype.extractDatamodel = function (ppApi) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ppApi.extractDatamodel()];
                    case 1:
                        result = _a.sent();
                        if (!result.success) {
                            throw new Error(result.error || "Failed to extract datamodel");
                        }
                        return [2 /*return*/, result.datamodel];
                }
            });
        });
    };
    /**
     * Inject changeset into PowerPoint using PowerPoint API
     */
    WhiteAgentRunner.prototype.injectChangeset = function (caseId, presentationPath, ppApi) {
        return __awaiter(this, void 0, void 0, function () {
            var outputFilename, outputPath, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDC89 Injecting changeset for ".concat(caseId, "..."));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        outputFilename = "result_".concat(caseId, ".pptx");
                        outputPath = path.join(this.runDir, outputFilename);
                        return [4 /*yield*/, ppApi.injectChangeset(outputPath, presentationPath)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_8 = _a.sent();
                        console.error("❌ Failed to inject changeset:", error_8);
                        return [2 /*return*/, {
                                success: false,
                                error: error_8 instanceof Error ? error_8.message : String(error_8),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save test results to run directory (only for failed tests)
     */
    WhiteAgentRunner.prototype.saveTestResults = function (caseId, result, agentName) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, filepath, resultData, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!!result.success) return [3 /*break*/, 2];
                        filename = "result_err_".concat(caseId, ".json");
                        filepath = path.join(this.runDir, filename);
                        resultData = __assign(__assign({}, result), { timestamp: new Date().toISOString(), systemPrompt: this.systemPromptName, agent: agentName });
                        return [4 /*yield*/, fs.writeFile(filepath, JSON.stringify(resultData, null, 2))];
                    case 1:
                        _a.sent();
                        console.log("\uD83D\uDCBE Error results saved to: ".concat(filepath));
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("\u2705 Test ".concat(caseId, " succeeded - no result file needed"));
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_9 = _a.sent();
                        console.error("❌ Failed to save test results:", error_9);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Run a single test case
     */
    WhiteAgentRunner.prototype.runTestCase = function (caseId, agent, ppApi) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, testData, systemPrompt, datamodel, changeset, changesetPath, injectionResult, executionTime, result, error_10, executionTime, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 11]);
                        console.log("\n\uD83D\uDE80 Running test case: ".concat(caseId));
                        return [4 /*yield*/, this.getTestCaseData(caseId)];
                    case 2:
                        testData = _a.sent();
                        if (!testData) {
                            throw new Error("Failed to load test data for ".concat(caseId));
                        }
                        return [4 /*yield*/, this.loadSystemPrompt()];
                    case 3:
                        systemPrompt = _a.sent();
                        return [4 /*yield*/, this.extractDatamodel(ppApi)];
                    case 4:
                        datamodel = _a.sent();
                        return [4 /*yield*/, agent.generateChangeset(datamodel, testData.prompt, systemPrompt)];
                    case 5:
                        changeset = _a.sent();
                        changesetPath = path.join(this.runDir, "result_cs_".concat(caseId, ".json"));
                        return [4 /*yield*/, fs.writeFile(changesetPath, JSON.stringify(changeset, null, 2), "utf8")];
                    case 6:
                        _a.sent();
                        console.log("\uD83D\uDCBE Changeset saved to: ".concat(changesetPath));
                        return [4 /*yield*/, this.injectChangeset(caseId, testData.presentationPath, ppApi)];
                    case 7:
                        injectionResult = _a.sent();
                        if (!injectionResult.success) {
                            throw new Error("Injection failed: ".concat(injectionResult.error));
                        }
                        executionTime = Date.now() - startTime;
                        result = {
                            caseId: caseId,
                            success: true,
                            executionTime: executionTime,
                            outputPath: injectionResult.outputPath,
                            changeset: changeset,
                        };
                        // Save results
                        return [4 /*yield*/, this.saveTestResults(caseId, result, agent.name)];
                    case 8:
                        // Save results
                        _a.sent();
                        console.log("\u2705 Test case ".concat(caseId, " completed successfully"));
                        return [2 /*return*/, result];
                    case 9:
                        error_10 = _a.sent();
                        executionTime = Date.now() - startTime;
                        result = {
                            caseId: caseId,
                            success: false,
                            executionTime: executionTime,
                            error: error_10 instanceof Error ? error_10.message : String(error_10),
                        };
                        // Save error results
                        return [4 /*yield*/, this.saveTestResults(caseId, result, agent.name)];
                    case 10:
                        // Save error results
                        _a.sent();
                        console.error("\u274C Test case ".concat(caseId, " failed:"), error_10);
                        return [2 /*return*/, result];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Run all test cases
     */
    WhiteAgentRunner.prototype.runAllTests = function (AgentClass) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, tempPpApi, tempAgent, agentName, testCaseIds, scenarioGroups, _i, testCaseIds_1, caseId, testIndex, scenarioName, allResults, scenarioSummaries, _loop_1, this_1, _a, _b, _c, scenarioName, caseIds, totalExecutionTime, totalPassedTests, totalFailedTests, overallSummary, error_11;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        startTime = Date.now();
                        tempPpApi = new WhiteAgentPPApi({});
                        tempAgent = new AgentClass(tempPpApi);
                        agentName = tempAgent.name;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, , 10]);
                        console.log("\uD83D\uDE80 Starting ".concat(agentName, " test runner..."));
                        console.log("\uD83D\uDCC1 System prompt: ".concat(this.systemPromptName));
                        console.log("\uD83C\uDFAF Scenario filter: ".concat(this.scenarioFilter || "all"));
                        console.log("\uD83D\uDD0D Case filter: ".concat(this.caseFilter || "all"));
                        return [4 /*yield*/, this.loadChangesetSchema()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, this.loadMasterAnalysis()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, this.getTestCaseIds()];
                    case 4:
                        testCaseIds = _d.sent();
                        console.log("\uD83D\uDCCB Found ".concat(testCaseIds.length, " test cases"));
                        if (testCaseIds.length === 0) {
                            throw new Error("No test cases found");
                        }
                        scenarioGroups = {};
                        for (_i = 0, testCaseIds_1 = testCaseIds; _i < testCaseIds_1.length; _i++) {
                            caseId = testCaseIds_1[_i];
                            testIndex = caseId.lastIndexOf("test-");
                            if (testIndex === -1) {
                                console.warn("Invalid case ID format: ".concat(caseId));
                                continue;
                            }
                            scenarioName = caseId.substring(0, testIndex - 1);
                            if (!scenarioGroups[scenarioName]) {
                                scenarioGroups[scenarioName] = [];
                            }
                            scenarioGroups[scenarioName].push(caseId);
                        }
                        console.log("\uD83D\uDCCA Found ".concat(Object.keys(scenarioGroups).length, " scenarios: ").concat(Object.keys(scenarioGroups).join(", ")));
                        allResults = [];
                        scenarioSummaries = {};
                        _loop_1 = function (scenarioName, caseIds) {
                            var timestamp, scenarioOutputDir, scenarioRunDir, masterAnalysisPath, schemaPath, sysPromptPath, systemPrompt, scenarioResults, scenarioExecutionTime, scenarioPassedTests, scenarioFailedTests, scenarioSummary, scenarioSummaryPath, scenarioSummaryContent;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        console.log("\n\uD83C\uDFAF Running scenario: ".concat(scenarioName, " (").concat(caseIds.length, " test cases)"));
                                        timestamp = new Date()
                                            .toISOString()
                                            .slice(0, 16)
                                            .replace(/:/g, "-");
                                        scenarioOutputDir = path.join(SCENARIOS_DIR, scenarioName, "__generated__");
                                        scenarioRunDir = path.join(scenarioOutputDir, "run-".concat(timestamp));
                                        // Ensure scenario output directory exists
                                        return [4 /*yield*/, fs.mkdir(scenarioRunDir, { recursive: true })];
                                    case 1:
                                        // Ensure scenario output directory exists
                                        _e.sent();
                                        masterAnalysisPath = path.join(scenarioRunDir, "_master-analysis.md");
                                        return [4 /*yield*/, fs.writeFile(masterAnalysisPath, this_1.masterAnalysis, "utf8")];
                                    case 2:
                                        _e.sent();
                                        schemaPath = path.join(scenarioRunDir, "_changeset-schema.yaml");
                                        return [4 /*yield*/, fs.writeFile(schemaPath, this_1.changesetSchema, "utf8")];
                                    case 3:
                                        _e.sent();
                                        sysPromptPath = path.join(scenarioRunDir, "_sys-prompt.md");
                                        return [4 /*yield*/, this_1.loadSystemPromptForScenario(scenarioRunDir)];
                                    case 4:
                                        systemPrompt = _e.sent();
                                        return [4 /*yield*/, fs.writeFile(sysPromptPath, systemPrompt, "utf8")];
                                    case 5:
                                        _e.sent();
                                        // Update run directory for this scenario
                                        this_1.runDir = scenarioRunDir;
                                        return [4 /*yield*/, Promise.all(caseIds.map(function (caseId) {
                                                // Extract test name from caseId (e.g., "basic-shapes-test-1" -> "test-1")
                                                var testIndex = caseId.lastIndexOf("test-");
                                                var testName = caseId.substring(testIndex);
                                                var casePresentationPath = path.join(SCENARIOS_DIR, scenarioName, testName, "pres.pptx");
                                                // Create fresh instances for each test case
                                                var ppApi = new WhiteAgentPPApi({
                                                    presentationPath: casePresentationPath,
                                                });
                                                var agent = new AgentClass(ppApi);
                                                return _this.runTestCase(caseId, agent, ppApi);
                                            }))];
                                    case 6:
                                        scenarioResults = _e.sent();
                                        scenarioExecutionTime = Date.now() - startTime;
                                        scenarioPassedTests = scenarioResults.filter(function (r) { return r.success; }).length;
                                        scenarioFailedTests = scenarioResults.filter(function (r) { return !r.success; }).length;
                                        scenarioSummary = {
                                            totalTests: scenarioResults.length,
                                            passedTests: scenarioPassedTests,
                                            failedTests: scenarioFailedTests,
                                            results: scenarioResults,
                                            executionTime: scenarioExecutionTime,
                                        };
                                        scenarioSummaryPath = path.join(scenarioRunDir, "_summary.md");
                                        scenarioSummaryContent = "# ".concat(scenarioName, " Scenario Summary\n\n**Generated:** ").concat(new Date().toISOString(), "  \n**Agent:** ").concat(agentName, "  \n**System Prompt:** ").concat(this_1.systemPromptName, "  \n**Scenario:** ").concat(scenarioName, "  \n**Execution Time:** ").concat(Math.round(scenarioExecutionTime / 1000), "s  \n\n## Results\n\n- **Total Tests:** ").concat(scenarioResults.length, "\n- **Passed:** ").concat(scenarioPassedTests, "\n- **Failed:** ").concat(scenarioFailedTests, "\n- **Success Rate:** ").concat(Math.round((scenarioPassedTests / scenarioResults.length) * 100), "%\n\n## Test Cases\n\n").concat(scenarioResults
                                            .map(function (result) {
                                            return "- **".concat(result.caseId, "**: ").concat(result.success ? "✅ PASSED" : "❌ FAILED", " (").concat(Math.round(result.executionTime / 1000), "s)");
                                        })
                                            .join("\n"), "\n\n## Failed Tests\n\n").concat(scenarioResults
                                            .filter(function (r) { return !r.success; })
                                            .map(function (result) { return "- **".concat(result.caseId, "**: ").concat(result.error); })
                                            .join("\n"), "\n");
                                        return [4 /*yield*/, fs.writeFile(scenarioSummaryPath, scenarioSummaryContent, "utf8")];
                                    case 7:
                                        _e.sent();
                                        console.log("\u2705 ".concat(scenarioName, " completed: ").concat(scenarioPassedTests, "/").concat(scenarioResults.length, " passed"));
                                        console.log("\uD83D\uDCC4 Results saved to: ".concat(scenarioRunDir));
                                        allResults.push.apply(allResults, scenarioResults);
                                        scenarioSummaries[scenarioName] = scenarioSummary;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = 0, _b = Object.entries(scenarioGroups);
                        _d.label = 5;
                    case 5:
                        if (!(_a < _b.length)) return [3 /*break*/, 8];
                        _c = _b[_a], scenarioName = _c[0], caseIds = _c[1];
                        return [5 /*yield**/, _loop_1(scenarioName, caseIds)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8:
                        totalExecutionTime = Date.now() - startTime;
                        totalPassedTests = allResults.filter(function (r) { return r.success; }).length;
                        totalFailedTests = allResults.filter(function (r) { return !r.success; }).length;
                        overallSummary = {
                            totalTests: allResults.length,
                            passedTests: totalPassedTests,
                            failedTests: totalFailedTests,
                            results: allResults,
                            executionTime: totalExecutionTime,
                        };
                        console.log("\n🎉 All scenarios completed!");
                        console.log("\uD83D\uDCCA Overall Results: ".concat(totalPassedTests, "/").concat(allResults.length, " passed"));
                        console.log("\u23F1\uFE0F  Total time: ".concat(Math.round(totalExecutionTime / 1000), "s"));
                        console.log("\uD83D\uDCC1 Scenarios: ".concat(Object.keys(scenarioSummaries).join(", ")));
                        return [2 /*return*/, overallSummary];
                    case 9:
                        error_11 = _d.sent();
                        console.error("💥 Test execution failed:", error_11);
                        throw error_11;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return WhiteAgentRunner;
}());
export { WhiteAgentRunner };
