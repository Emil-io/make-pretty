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
import fs from "fs/promises";
import path from "path";
// Handle both running from root and from benchmark folder
var isRunningFromBenchmark = process.cwd().endsWith("benchmark");
var TEST_CASES_DIR = isRunningFromBenchmark
    ? path.join(process.cwd(), "scenarios")
    : path.join(process.cwd(), "benchmark", "scenarios");
var GENERATED_DIR = isRunningFromBenchmark
    ? path.join(process.cwd(), "__generated__")
    : path.join(process.cwd(), "benchmark", "__generated__");
/**
 * Get all test case IDs (scenario-test format from nested directory structure)
 */
export function getTestCaseIds() {
    return __awaiter(this, void 0, void 0, function () {
        var entries, testCaseIds, _i, entries_1, entry, scenarioDir, scenarioEntries, _a, scenarioEntries_1, testEntry, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fs.readdir(TEST_CASES_DIR, {
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
                    scenarioDir = path.join(TEST_CASES_DIR, entry.name);
                    return [4 /*yield*/, fs.readdir(scenarioDir, {
                            withFileTypes: true,
                        })];
                case 3:
                    scenarioEntries = _b.sent();
                    // Find test directories within each scenario
                    for (_a = 0, scenarioEntries_1 = scenarioEntries; _a < scenarioEntries_1.length; _a++) {
                        testEntry = scenarioEntries_1[_a];
                        if (testEntry.isDirectory() && !testEntry.name.startsWith("_")) {
                            testCaseIds.push("".concat(entry.name, "-").concat(testEntry.name));
                        }
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, testCaseIds];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error reading test cases directory:", error_1);
                    return [2 /*return*/, []];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get test case data (datamodel.json and prompt.md) for a specific case ID
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export function getTestCaseData(caseId) {
    return __awaiter(this, void 0, void 0, function () {
        var testIndex, scenarioName, testName, caseDir, datamodelPath, datamodelContent, datamodel, promptPath, prompt_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    testIndex = caseId.lastIndexOf('test-');
                    if (testIndex === -1) {
                        throw new Error("Invalid case ID format: ".concat(caseId, ". Expected format: scenario-test"));
                    }
                    scenarioName = caseId.substring(0, testIndex - 1);
                    testName = caseId.substring(testIndex);
                    caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);
                    // Check if case directory exists
                    return [4 /*yield*/, fs.access(caseDir)];
                case 1:
                    // Check if case directory exists
                    _a.sent();
                    datamodelPath = path.join(caseDir, "datamodel.json");
                    return [4 /*yield*/, fs.readFile(datamodelPath, "utf-8")];
                case 2:
                    datamodelContent = _a.sent();
                    datamodel = JSON.parse(datamodelContent);
                    promptPath = path.join(caseDir, "prompt.md");
                    return [4 /*yield*/, fs.readFile(promptPath, "utf-8")];
                case 3:
                    prompt_1 = _a.sent();
                    return [2 /*return*/, {
                            caseId: caseId,
                            datamodel: datamodel,
                            prompt: prompt_1.trim(),
                        }];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error reading test case data for ".concat(caseId, ":"), error_2);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the path to the presentation file for a test case
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export function getTestCasePresentationPath(caseId) {
    return __awaiter(this, void 0, void 0, function () {
        var testIndex, scenarioName, testName, caseDir, presPath, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    testIndex = caseId.lastIndexOf('test-');
                    if (testIndex === -1) {
                        throw new Error("Invalid case ID format: ".concat(caseId, ". Expected format: scenario-test"));
                    }
                    scenarioName = caseId.substring(0, testIndex - 1);
                    testName = caseId.substring(testIndex);
                    caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);
                    presPath = path.join(caseDir, "pres.pptx");
                    // Check if presentation file exists
                    return [4 /*yield*/, fs.access(presPath)];
                case 1:
                    // Check if presentation file exists
                    _a.sent();
                    return [2 /*return*/, presPath];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error finding presentation file for ".concat(caseId, ":"), error_3);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the test protocol for a test case
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export function getTestCaseProtocol(caseId) {
    return __awaiter(this, void 0, void 0, function () {
        var testIndex, scenarioName, testName, caseDir, testPath, testContent, testMatch, testStr, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    testIndex = caseId.lastIndexOf('test-');
                    if (testIndex === -1) {
                        throw new Error("Invalid case ID format: ".concat(caseId, ". Expected format: scenario-test"));
                    }
                    scenarioName = caseId.substring(0, testIndex - 1);
                    testName = caseId.substring(testIndex);
                    caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);
                    testPath = path.join(caseDir, "test.ts");
                    return [4 /*yield*/, fs.readFile(testPath, "utf-8")];
                case 1:
                    testContent = _a.sent();
                    testMatch = testContent.match(/export const Test[^=]*=\s*(\[[\s\S]*?\]);/);
                    if (testMatch) {
                        testStr = testMatch[1];
                        // Replace TypeScript syntax with JSON syntax
                        testStr = testStr
                            .replace(/(\w+):/g, '"$1":') // Add quotes around keys
                            .replace(/'/g, '"') // Replace single quotes with double quotes
                            .replace(/(\d+)/g, "$1") // Keep numbers as is
                            .replace(/slideId:\s*(\d+)/g, '"slideId": $1') // Fix slideId
                            .replace(/shapeId:\s*(\d+)/g, '"shapeId": $1') // Fix shapeId
                            .replace(/key:\s*"([^"]+)"/g, '"key": "$1"'); // Fix key
                        return [2 /*return*/, JSON.parse(testStr)];
                    }
                    // If parsing fails, return a default test protocol
                    console.warn("Could not parse test protocol from test.ts file for ".concat(caseId, ", using default"));
                    return [2 /*return*/, [
                            {
                                name: "all_are_equal",
                                objects: [
                                    { slideId: 1, shapeId: 1, key: "pos.topLeft[1]" },
                                    { slideId: 1, shapeId: 2, key: "pos.topLeft[1]" },
                                    { slideId: 1, shapeId: 3, key: "pos.topLeft[1]" },
                                ],
                            },
                            {
                                name: "all_are_equal",
                                objects: [
                                    { slideId: 1, shapeId: 1, key: "size.h" },
                                    { slideId: 1, shapeId: 2, key: "size.h" },
                                    { slideId: 1, shapeId: 3, key: "size.h" },
                                ],
                            },
                        ]];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error reading test protocol for ".concat(caseId, ":"), error_4);
                    // Return default test protocol on error
                    return [2 /*return*/, [
                            {
                                name: "all_are_equal",
                                objects: [
                                    { slideId: 1, shapeId: 1, key: "pos.topLeft[1]" },
                                    { slideId: 1, shapeId: 2, key: "pos.topLeft[1]" },
                                    { slideId: 1, shapeId: 3, key: "pos.topLeft[1]" },
                                ],
                            },
                            {
                                name: "all_are_equal",
                                objects: [
                                    { slideId: 1, shapeId: 1, key: "size.h" },
                                    { slideId: 1, shapeId: 2, key: "size.h" },
                                    { slideId: 1, shapeId: 3, key: "size.h" },
                                ],
                            },
                        ]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Save generated datamodel to __generated__ folder
 */
export function saveGeneratedDatamodel(caseId, whiteAgentId, datamodel) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, filepath, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Ensure __generated__ directory exists
                    return [4 /*yield*/, fs.mkdir(GENERATED_DIR, { recursive: true })];
                case 1:
                    // Ensure __generated__ directory exists
                    _a.sent();
                    filename = "".concat(caseId, ":::").concat(whiteAgentId, ".json");
                    filepath = path.join(GENERATED_DIR, filename);
                    console.log("filepath", filepath);
                    return [4 /*yield*/, fs.writeFile(filepath, JSON.stringify(datamodel, null, 2))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error saving generated datamodel for ".concat(caseId, ":::").concat(whiteAgentId, ":"), error_5);
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get all generated datamodels for a white agent
 */
export function getGeneratedDatamodels(whiteAgentId) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, datamodels, _i, entries_2, entry, parts, caseId, filepath, content, datamodel, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fs.readdir(GENERATED_DIR, {
                            withFileTypes: true,
                        })];
                case 1:
                    entries = _a.sent();
                    datamodels = [];
                    _i = 0, entries_2 = entries;
                    _a.label = 2;
                case 2:
                    if (!(_i < entries_2.length)) return [3 /*break*/, 5];
                    entry = entries_2[_i];
                    if (!(entry.isFile() && entry.name.endsWith(".json"))) return [3 /*break*/, 4];
                    parts = entry.name.replace(".json", "").split(":::");
                    if (!(parts.length === 2 && parts[1] === whiteAgentId)) return [3 /*break*/, 4];
                    caseId = parts[0];
                    filepath = path.join(GENERATED_DIR, entry.name);
                    return [4 /*yield*/, fs.readFile(filepath, "utf-8")];
                case 3:
                    content = _a.sent();
                    datamodel = JSON.parse(content);
                    datamodels.push({ caseId: caseId, datamodel: datamodel });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, datamodels];
                case 6:
                    error_6 = _a.sent();
                    console.error("Error reading generated datamodels for ".concat(whiteAgentId, ":"), error_6);
                    return [2 /*return*/, []];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Clear all generated files
 */
export function clearGeneratedFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _i, entries_3, entry, filepath, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fs.readdir(GENERATED_DIR, {
                            withFileTypes: true,
                        })];
                case 1:
                    entries = _a.sent();
                    _i = 0, entries_3 = entries;
                    _a.label = 2;
                case 2:
                    if (!(_i < entries_3.length)) return [3 /*break*/, 5];
                    entry = entries_3[_i];
                    filepath = path.join(GENERATED_DIR, entry.name);
                    return [4 /*yield*/, fs.unlink(filepath)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_7 = _a.sent();
                    console.error("Error clearing generated files:", error_7);
                    throw error_7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
