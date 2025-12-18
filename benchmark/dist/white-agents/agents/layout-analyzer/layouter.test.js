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
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
import { layoutAnalyzerInputTransformer } from "./transformer.js";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var OUTPUT_DIR = path.join(__dirname, "__generated__");
// Use the test PowerPoint file from the PowerPoint service directory
var TEST_PPTX = "/Users/paulostarek/Desktop/powerpoint/letmecook/api/python/presentations/example.pptx";
function ensureOutputDir() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.mkdir(OUTPUT_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe("Layout Analyzer Transformer Test", function () {
    it("should extract PowerPoint slide, transform it, and save to __generated__", function () { return __awaiter(void 0, void 0, void 0, function () {
        var service, slide, transformedShapes, transformedData, outputPath, stats, error_1, errorPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
                case 1:
                    service = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 11]);
                    // Ensure output directory exists
                    return [4 /*yield*/, ensureOutputDir()];
                case 3:
                    // Ensure output directory exists
                    _a.sent();
                    return [4 /*yield*/, service.getSlideByIndex(TEST_PPTX, 6)];
                case 4:
                    slide = _a.sent();
                    expect(slide).toBeDefined();
                    expect(slide.id).toBeDefined();
                    console.log("Extracted slide ".concat(slide.id, " from ").concat(TEST_PPTX));
                    transformedShapes = layoutAnalyzerInputTransformer(slide.shapes);
                    expect(transformedShapes).toBeDefined();
                    expect(Array.isArray(transformedShapes)).toBe(true);
                    transformedData = {
                        slideId: slide.id,
                        width: 1280,
                        height: 720,
                        shapes: transformedShapes,
                    };
                    console.log("Transformed slide with ".concat(transformedShapes.length, " shapes"));
                    outputPath = path.join(OUTPUT_DIR, "layout-analyzer-output.yaml");
                    return [4 /*yield*/, fs.writeFile(outputPath, yaml.dump(transformedData), "utf-8")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, fs.stat(outputPath)];
                case 6:
                    stats = _a.sent();
                    expect(stats.size).toBeGreaterThan(0);
                    console.log("Successfully saved transformed data to ".concat(outputPath, " (").concat(stats.size, " bytes)"));
                    return [3 /*break*/, 11];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error in layout analyzer transformer test:", error_1);
                    if (!(error_1 instanceof PowerPointServiceError)) return [3 /*break*/, 10];
                    errorPath = path.join(OUTPUT_DIR, "layout-analyzer-error.json");
                    return [4 /*yield*/, ensureOutputDir()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(errorPath, JSON.stringify(error_1.toJSON(), null, 2), "utf-8")];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: throw error_1;
                case 11: return [2 /*return*/];
            }
        });
    }); });
});
