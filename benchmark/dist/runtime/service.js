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
import { AIChangesetSchema } from "../../api/server/src/schemas/changeset/schemas/changeset.js";
import { validateTest } from "../protocol/validator/index.js";
import { clearGeneratedFiles, getGeneratedDatamodels, getTestCaseData, getTestCaseIds, getTestCasePresentationPath, getTestCaseProtocol, saveGeneratedDatamodel, } from "./scenarios.js";
/**
 * Agent Beats Service
 * Contains all business logic for the agent-beats API
 */
var AgentBeatsService = /** @class */ (function () {
    function AgentBeatsService() {
    }
    /**
     * Get all test case IDs
     */
    AgentBeatsService.prototype.getTestCaseIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testCaseIds, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getTestCaseIds()];
                    case 1:
                        testCaseIds = _a.sent();
                        console.log("testCaseIds", testCaseIds);
                        return [2 /*return*/, { ids: testCaseIds }];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Failed to get test case IDs: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get test case data (datamodel and prompt)
     */
    AgentBeatsService.prototype.getTestCaseData = function (caseId) {
        return __awaiter(this, void 0, void 0, function () {
            var testCaseData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getTestCaseData(caseId)];
                    case 1:
                        testCaseData = _a.sent();
                        if (!testCaseData) {
                            throw new Error("Test case '".concat(caseId, "' not found"));
                        }
                        return [2 /*return*/, testCaseData];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Failed to get test case data for ".concat(caseId, ": ").concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submit a changeset for processing
     */
    AgentBeatsService.prototype.submitChangeset = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var caseId, whiteAgentId, changeset, validation, presentationPath, injectionResult, extractionResult, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        caseId = request.caseId, whiteAgentId = request.whiteAgentId, changeset = request.changeset;
                        validation = this.validateChangeset(changeset);
                        if (!validation.success) {
                            console.error("Invalid changeset: ".concat(JSON.stringify(validation.errors)));
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Invalid changeset: ".concat(JSON.stringify(validation.errors)),
                                }];
                        }
                        return [4 /*yield*/, getTestCasePresentationPath(caseId)];
                    case 1:
                        presentationPath = _a.sent();
                        console.log("presentationPath", presentationPath);
                        if (!presentationPath) {
                            console.error("Presentation file not found for test case '".concat(caseId, "'"));
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Presentation file not found for test case '".concat(caseId, "'"),
                                }];
                        }
                        return [4 /*yield*/, this.injectChangeset(presentationPath, validation.data, caseId, whiteAgentId)];
                    case 2:
                        injectionResult = _a.sent();
                        if (!injectionResult.success) {
                            console.error("Failed to inject changeset: ".concat(injectionResult.error));
                            return [2 /*return*/, {
                                    success: false,
                                    error: injectionResult.error,
                                }];
                        }
                        return [4 /*yield*/, this.extractDatamodel(injectionResult.outputPath)];
                    case 3:
                        extractionResult = _a.sent();
                        if (!extractionResult.success) {
                            console.error("Failed to extract datamodel: ".concat(extractionResult.error));
                            return [2 /*return*/, {
                                    success: false,
                                    error: extractionResult.error,
                                }];
                        }
                        // Save the generated datamodel
                        return [4 /*yield*/, saveGeneratedDatamodel(caseId, whiteAgentId, extractionResult.datamodel)];
                    case 4:
                        // Save the generated datamodel
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "Changeset submitted and processed successfully",
                            }];
                    case 5:
                        error_3 = _a.sent();
                        console.error("Error submitting changeset:", error_3);
                        return [2 /*return*/, {
                                success: false,
                                error: "Failed to submit changeset: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)),
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get test results for a white agent
     */
    AgentBeatsService.prototype.getResults = function (whiteAgentId) {
        return __awaiter(this, void 0, void 0, function () {
            var generatedDatamodels_2, testResults, _i, generatedDatamodels_1, _a, caseId, datamodel, testProtocol, result, error_4, scoreData, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, getGeneratedDatamodels(whiteAgentId)];
                    case 1:
                        generatedDatamodels_2 = _b.sent();
                        if (generatedDatamodels_2.length === 0) {
                            throw new Error("No results found for white agent '".concat(whiteAgentId, "'"));
                        }
                        testResults = [];
                        _i = 0, generatedDatamodels_1 = generatedDatamodels_2;
                        _b.label = 2;
                    case 2:
                        if (!(_i < generatedDatamodels_1.length)) return [3 /*break*/, 8];
                        _a = generatedDatamodels_1[_i], caseId = _a.caseId, datamodel = _a.datamodel;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, getTestCaseProtocol(caseId)];
                    case 4:
                        testProtocol = _b.sent();
                        return [4 /*yield*/, this.runTestValidation(caseId, datamodel, testProtocol)];
                    case 5:
                        result = _b.sent();
                        testResults.push(result);
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _b.sent();
                        console.error("Error running validation for ".concat(caseId, ":"), error_4);
                        // Add a failed result for this case
                        testResults.push({
                            totalTests: 1,
                            passed: 0,
                            failed: 1,
                            results: [
                                {
                                    testName: "validation_error",
                                    status: "failed",
                                    message: error_4 instanceof Error
                                        ? error_4.message
                                        : String(error_4),
                                    executionTime: 0,
                                },
                            ],
                        });
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8:
                        scoreData = this.calculateScore(testResults);
                        // Format response
                        return [2 /*return*/, {
                                whiteAgentId: whiteAgentId,
                                score: scoreData.totalScore,
                                totalTests: scoreData.totalTests,
                                totalPassed: scoreData.totalPassed,
                                totalFailed: scoreData.totalFailed,
                                tests: testResults.map(function (result, index) { return ({
                                    caseId: generatedDatamodels_2[index].caseId,
                                    success: result.failed === 0,
                                    passed: result.passed,
                                    failed: result.failed,
                                    errors: result.results
                                        .filter(function (r) { return r.status === "failed"; })
                                        .map(function (r) { return ({
                                        testName: r.testName,
                                        message: r.message,
                                        actual: r.actual,
                                        expected: r.expected,
                                    }); }),
                                }); }),
                            }];
                    case 9:
                        error_5 = _b.sent();
                        throw new Error("Failed to get test results for white agent ".concat(whiteAgentId, ": ").concat(error_5 instanceof Error ? error_5.message : String(error_5)));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Restart the system by clearing generated files
     */
    AgentBeatsService.prototype.restart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, clearGeneratedFiles()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "All generated files have been cleared",
                            }];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: "Failed to clear generated files: ".concat(error_6 instanceof Error ? error_6.message : String(error_6)),
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate a changeset against the Zod schema
     */
    AgentBeatsService.prototype.validateChangeset = function (changeset) {
        try {
            var validatedChangeset = AIChangesetSchema.parse(changeset);
            return {
                success: true,
                data: validatedChangeset,
            };
        }
        catch (error) {
            return {
                success: false,
                errors: error.errors || error.message,
            };
        }
    };
    /**
     * Inject changeset into PowerPoint presentation using Python service
     */
    AgentBeatsService.prototype.injectChangeset = function (presentationPath, changeset, caseId, whiteAgentId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, fs, generatedDir, outputPath, pythonScript_1, exec_1, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        path = require("path");
                        fs = require("fs");
                        generatedDir = path.join(__dirname, "..", "__generated__");
                        if (!fs.existsSync(generatedDir)) {
                            fs.mkdirSync(generatedDir, { recursive: true });
                        }
                        outputPath = path.join(generatedDir, "".concat(caseId, "_").concat(whiteAgentId, "_injected.pptx"));
                        pythonScript_1 = "\nimport sys\nimport os\nimport json\nimport io\nimport contextlib\n\n# Create a context manager to suppress all output\nclass SuppressOutput:\n    def __enter__(self):\n        self._original_stdout = sys.stdout\n        self._original_stderr = sys.stderr\n        sys.stdout = io.StringIO()\n        sys.stderr = io.StringIO()\n        return self\n    \n    def __exit__(self, *args):\n        sys.stdout = self._original_stdout\n        sys.stderr = self._original_stderr\n\ntry:\n    sys.path.insert(0, '".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python')\n\n    from src.procedures.injector import inject_changeset\n    from src.models import AIChangesetSchema\n\n    # Parse the changeset\n    changeset_data = json.loads('").concat(JSON.stringify(changeset).replace(/'/g, "\\'"), "')\n    changeset_obj = AIChangesetSchema(**changeset_data)\n    \n    # Use the inject_changeset procedure with output suppression\n    with SuppressOutput():\n        result = inject_changeset('").concat(presentationPath, "', changeset_obj, '").concat(outputPath, "')\n    \n    # Print only the result\n    print(json.dumps(result))\n    \nexcept Exception as e:\n    error_result = {\n        'error': f\"Failed to inject changeset: {str(e)}\",\n        'procedure': 'inject_changeset'\n    }\n    print(json.dumps(error_result))\n");
                        return [4 /*yield*/, import("child_process")];
                    case 1:
                        exec_1 = (_a.sent()).exec;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var command = "cd ".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python && /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -c \"").concat(pythonScript_1.replace(/"/g, '\\"'), "\" 2>/dev/null");
                                exec_1(command, {
                                    env: __assign(__assign({}, process.env), { PYTHONPATH: "".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python") }),
                                }, function (error, stdout, stderr) {
                                    if (error) {
                                        reject(new Error("Python injection failed: ".concat(error.message)));
                                        return;
                                    }
                                    try {
                                        var result_1 = JSON.parse(stdout.trim());
                                        resolve(result_1);
                                    }
                                    catch (parseError) {
                                        reject(new Error("Failed to parse Python output: ".concat(parseError)));
                                    }
                                });
                            })];
                    case 2:
                        result = _a.sent();
                        if (result.error) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: result.error,
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                outputPath: result.outputPath || outputPath,
                            }];
                    case 3:
                        error_7 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: error_7 instanceof Error ? error_7.message : String(error_7),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract datamodel from PowerPoint presentation
     */
    AgentBeatsService.prototype.extractDatamodel = function (presentationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pythonScript_2, exec_2, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        pythonScript_2 = "\nimport sys\nimport os\nimport json\nimport io\n\n# Redirect stdout to capture debug output\nold_stdout = sys.stdout\nsys.stdout = io.StringIO()\n\ntry:\n    sys.path.insert(0, '".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python')\n\n    from src.procedures.extraction import extract_complete_presentation_data\n\n    result = extract_complete_presentation_data('").concat(presentationPath, "')\n    \n    # Restore stdout and print only the result\n    sys.stdout = old_stdout\n    print(json.dumps(result, default=str))\nexcept Exception as e:\n    # Restore stdout and print error\n    sys.stdout = old_stdout\n    error_result = {\n        'error': f'Failed to extract datamodel: {str(e)}',\n        'procedure': 'extract_complete_presentation_data'\n    }\n    print(json.dumps(error_result))\n");
                        return [4 /*yield*/, import("child_process")];
                    case 1:
                        exec_2 = (_a.sent()).exec;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var command = "cd ".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python && /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -c \"").concat(pythonScript_2.replace(/"/g, '\\"'), "\" 2>/dev/null");
                                exec_2(command, {
                                    env: __assign(__assign({}, process.env), { PYTHONPATH: "".concat(process.cwd().endsWith("benchmark") ? process.cwd().replace("/benchmark", "") : process.cwd(), "/api/python") }),
                                }, function (error, stdout, stderr) {
                                    if (error) {
                                        reject(new Error("Python extraction failed: ".concat(error.message)));
                                        return;
                                    }
                                    try {
                                        var result_2 = JSON.parse(stdout.trim());
                                        resolve(result_2);
                                    }
                                    catch (parseError) {
                                        reject(new Error("Failed to parse Python output: ".concat(parseError)));
                                    }
                                });
                            })];
                    case 2:
                        result = _a.sent();
                        if (result.error) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: result.error,
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                datamodel: result,
                            }];
                    case 3:
                        error_8 = _a.sent();
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
     * Run test validation for a specific test case
     */
    AgentBeatsService.prototype.runTestValidation = function (caseId, datamodel, testProtocol) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                try {
                    result = validateTest(datamodel, testProtocol);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    console.error("Error running test validation for ".concat(caseId, ":"), error);
                    return [2 /*return*/, {
                            totalTests: 0,
                            passed: 0,
                            failed: 1,
                            results: [
                                {
                                    testName: "validation_error",
                                    status: "failed",
                                    message: error instanceof Error
                                        ? error.message
                                        : String(error),
                                    executionTime: 0,
                                },
                            ],
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Calculate overall score from test results
     */
    AgentBeatsService.prototype.calculateScore = function (testResults) {
        var totalTests = 0;
        var totalPassed = 0;
        var totalFailed = 0;
        var caseResults = testResults.map(function (result, index) {
            totalTests += result.totalTests;
            totalPassed += result.passed;
            totalFailed += result.failed;
            var score = result.totalTests > 0
                ? (result.passed / result.totalTests) * 100
                : 0;
            return {
                caseId: "test-".concat(index + 1), // This should be the actual case ID
                score: score,
                passed: result.passed,
                failed: result.failed,
                results: result,
            };
        });
        var totalScore = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
        return {
            totalScore: totalScore,
            totalTests: totalTests,
            totalPassed: totalPassed,
            totalFailed: totalFailed,
            caseResults: caseResults,
        };
    };
    return AgentBeatsService;
}());
export { AgentBeatsService };
// Export a singleton instance
export var agentBeatsService = new AgentBeatsService();
