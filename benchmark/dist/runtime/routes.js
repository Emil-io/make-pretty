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
import fs from "fs";
import path from "path";
import { agentBeatsService } from "./service.js";
export function initializeAgentBeats(app) {
    var _this = this;
    app.get("/scenarios", function (_req, response) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, agentBeatsService.getTestCaseIds()];
                case 1:
                    result = _a.sent();
                    response.json(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error getting test case IDs:", error_1);
                    response.status(500).json({
                        error: "Failed to get test case IDs",
                        details: error_1 instanceof Error ? error_1.message : String(error_1),
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/scenarios/datamodel/:caseId", function (req, response) { return __awaiter(_this, void 0, void 0, function () {
        var caseId, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    caseId = req.params.caseId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, agentBeatsService.getTestCaseData(caseId)];
                case 2:
                    result = _a.sent();
                    response.json(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error getting test case data for ".concat(caseId, ":"), error_2);
                    if (error_2 instanceof Error &&
                        error_2.message.includes("not found")) {
                        response.status(404).json({
                            error: error_2.message,
                        });
                    }
                    else {
                        response.status(500).json({
                            error: "Failed to get test case data",
                            details: error_2 instanceof Error
                                ? error_2.message
                                : String(error_2),
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.post("/scenarios/submit-changeset", function (req, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, caseId, whiteAgentId, changeset_str, changeset, timestamp, fileName, generatedDir, result, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, caseId = _a.caseId, whiteAgentId = _a.whiteAgentId, changeset_str = _a.changeset;
                    // Validate required fields
                    if (!caseId || !whiteAgentId || !changeset_str) {
                        response.status(400).json({
                            error: "Missing required fields: caseId, whiteAgentId, or changeset",
                        });
                        return [2 /*return*/];
                    }
                    changeset = JSON.parse(changeset_str);
                    timestamp = Date.now();
                    fileName = "".concat(timestamp, "-changeset.json");
                    generatedDir = path.join(process.cwd(), "__generated__");
                    // Ensure __generated__ directory exists
                    if (!fs.existsSync(generatedDir)) {
                        fs.mkdirSync(generatedDir, { recursive: true });
                    }
                    fs.writeFileSync(path.join(generatedDir, fileName), JSON.stringify(changeset, null, 2));
                    // Call the service with timeout protection
                    console.log("Calling agentBeatsService.submitChangeset...");
                    return [4 /*yield*/, agentBeatsService.submitChangeset({
                            caseId: caseId,
                            whiteAgentId: whiteAgentId,
                            changeset: changeset,
                        })];
                case 1:
                    result = _b.sent();
                    console.log("agentBeatsService.submitChangeset result:", result);
                    if (!result.success) {
                        console.error("Error submitting changeset:", result.error);
                        response.status(500).json(result);
                        return [2 /*return*/];
                    }
                    response.json(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.error("Error submitting changeset:", error_3);
                    response.status(500).json({
                        success: false,
                        error: "Failed to submit changeset",
                        details: error_3 instanceof Error ? error_3.message : String(error_3),
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/scenarios/results/:whiteAgentId", function (req, response) { return __awaiter(_this, void 0, void 0, function () {
        var whiteAgentId, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    whiteAgentId = req.params.whiteAgentId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, agentBeatsService.getResults(whiteAgentId)];
                case 2:
                    result = _a.sent();
                    response.json(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error getting results for white agent ".concat(whiteAgentId, ":"), error_4);
                    if (error_4 instanceof Error &&
                        error_4.message.includes("No results found")) {
                        response.status(404).json({
                            error: error_4.message,
                        });
                    }
                    else {
                        response.status(500).json({
                            error: "Failed to get test results",
                            details: error_4 instanceof Error
                                ? error_4.message
                                : String(error_4),
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.post("/scenarios/restart", function (req, response) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, agentBeatsService.restart()];
                case 1:
                    result = _a.sent();
                    if (!result.success) {
                        response.status(500).json(result);
                        return [2 /*return*/];
                    }
                    response.json(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error clearing generated files:", error_5);
                    response.status(500).json({
                        success: false,
                        error: "Failed to clear generated files",
                        details: error_5 instanceof Error ? error_5.message : String(error_5),
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
