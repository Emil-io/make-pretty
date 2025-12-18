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
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { afterAll, describe, expect, it } from "vitest";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
import { getModel, runLayoutAnalyzerAgent } from "./agent.js";
import { previewLayout } from "./preview-layout.js";
import { LayoutSchema } from "./types.js";
// Load environment variables from .env file
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var OUTPUT_BASE_DIR = path.join(__dirname, "__generated__");
var TEST_PPTX = path.join(__dirname, "example2.pptx");
var SLIDE_INDEX = 23; // First slide
/**
 * Generates a folder name based on current date-time (format: YYYY-MM-DD_HH:MM)
 */
function generateOutputFolderName() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    var hours = String(now.getHours()).padStart(2, "0");
    var minutes = String(now.getMinutes()).padStart(2, "0");
    // Format: YYYY-MM-DD_HH:MM
    return "".concat(year, "-").concat(month, "-").concat(day, "_").concat(hours, ":").concat(minutes);
}
/**
 * Gets or creates the output directory for this test run
 */
function getOutputDir() {
    return __awaiter(this, void 0, void 0, function () {
        var folderName, outputDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = generateOutputFolderName();
                    outputDir = path.join(OUTPUT_BASE_DIR, folderName);
                    return [4 /*yield*/, fs.mkdir(outputDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, outputDir];
            }
        });
    });
}
// Verify authentication is available (either GOOGLE_API_KEY or Application Default Credentials)
if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY not found in environment variables. Will attempt to use Application Default Credentials (ADC).");
    // Check if ADC credentials file exists
    var adcPath = "".concat(process.env.HOME, "/.config/gcloud/application_default_credentials.json");
    var fs_1 = require("fs");
    if (fs_1.existsSync(adcPath)) {
        console.log("ADC credentials found at: ".concat(adcPath));
        // Ensure the SDK can find the credentials by setting the environment variable
        // Note: GOOGLE_APPLICATION_CREDENTIALS is typically for service account keys,
        // but setting it might help the SDK find user credentials too
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Don't set it - let the SDK use the default location
            // The SDK should automatically find ~/.config/gcloud/application_default_credentials.json
        }
    }
    else {
        console.warn("ADC credentials not found at: ".concat(adcPath, ". Run: gcloud auth application-default login"));
    }
}
console.log("TEST_PPTX:", TEST_PPTX);
function ensureOutputDir() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.mkdir(OUTPUT_BASE_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe("Layout Analyzer Agent Test", function () {
    it("should extract PowerPoint slide, get snapshot, run agent, and save result to __generated__", function () { return __awaiter(void 0, void 0, void 0, function () {
        var service, OUTPUT_DIR, slide, snapshot, snapshotBase64, pngPath, datamodelPath, processId, result, layout, outputPath, stats, error_1, OUTPUT_DIR, errorPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
                case 1:
                    service = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 17]);
                    // Ensure base output directory exists
                    return [4 /*yield*/, ensureOutputDir()];
                case 3:
                    // Ensure base output directory exists
                    _a.sent();
                    return [4 /*yield*/, getOutputDir()];
                case 4:
                    OUTPUT_DIR = _a.sent();
                    console.log("Saving test results to: ".concat(OUTPUT_DIR));
                    getModel();
                    return [4 /*yield*/, service.getSlideByIndex(TEST_PPTX, SLIDE_INDEX)];
                case 5:
                    slide = _a.sent();
                    expect(slide).toBeDefined();
                    expect(slide.id).toBeDefined();
                    return [4 /*yield*/, service.getSlideSnapshotByIndex(TEST_PPTX, SLIDE_INDEX)];
                case 6:
                    snapshot = _a.sent();
                    expect(snapshot).toBeDefined();
                    expect(snapshot.pngBytes).toBeDefined();
                    expect(Buffer.isBuffer(snapshot.pngBytes)).toBe(true);
                    snapshotBase64 = snapshot.pngBytes.toString("base64");
                    pngPath = path.join(OUTPUT_DIR, "snapshot.png");
                    return [4 /*yield*/, fs.writeFile(pngPath, snapshot.pngBytes)];
                case 7:
                    _a.sent();
                    datamodelPath = path.join(OUTPUT_DIR, "datamodel.json");
                    return [4 /*yield*/, fs.writeFile(datamodelPath, JSON.stringify(slide, null, 2))];
                case 8:
                    _a.sent();
                    // Run the layout analyzer agent
                    console.log("Running layout analyzer agent...");
                    processId = path.basename(OUTPUT_DIR);
                    return [4 /*yield*/, runLayoutAnalyzerAgent({
                            snapshotBase64: snapshotBase64,
                            datamodel: slide,
                            processId: processId,
                        })];
                case 9:
                    result = _a.sent();
                    expect(result).toBeDefined();
                    expect(result.layout).toBeDefined();
                    expect(typeof result.layout === "object" && result.layout !== null).toBe(true);
                    layout = LayoutSchema.parse(result.layout);
                    expect(layout.name).toBeDefined();
                    expect(layout.type).toBeDefined();
                    expect(layout.b).toBeDefined();
                    console.log("Layout analyzer completed. Layout: ".concat(layout.name, " (").concat(layout.type, ")"));
                    outputPath = path.join(OUTPUT_DIR, "layout-analyzer-agent-result.json");
                    return [4 /*yield*/, fs.writeFile(outputPath, JSON.stringify(result, null, 2), "utf-8")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, fs.stat(outputPath)];
                case 11:
                    stats = _a.sent();
                    expect(stats.size).toBeGreaterThan(0);
                    console.log("Successfully saved agent result to ".concat(outputPath, " (").concat(stats.size, " bytes)"));
                    return [4 /*yield*/, previewLayout(processId, "layout-analyzer-visualization", TEST_PPTX, slide.id, layout)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 13:
                    error_1 = _a.sent();
                    console.error("Error in layout analyzer agent test:", error_1);
                    if (!(error_1 instanceof PowerPointServiceError)) return [3 /*break*/, 16];
                    return [4 /*yield*/, getOutputDir()];
                case 14:
                    OUTPUT_DIR = _a.sent();
                    errorPath = path.join(OUTPUT_DIR, "layout-analyzer-agent-error.json");
                    return [4 /*yield*/, fs.writeFile(errorPath, JSON.stringify(error_1.toJSON(), null, 2), "utf-8")];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16: throw error_1;
                case 17: return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Wait for 2 seconds to allow LangChain traces to complete
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 1:
                    // Wait for 2 seconds to allow LangChain traces to complete
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
