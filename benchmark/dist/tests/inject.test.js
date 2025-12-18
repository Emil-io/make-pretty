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
import { describe, expect, it } from "vitest";
import { AIChangesetSchema } from "../../api/server/src/schemas/changeset/index.js";
import { createPowerPointServiceWithHealthCheck } from "../../api/server/src/services/addin/powerpoint/service.js";
// Absolute paths for benchmark test-1 assets
var TEST_DIR = "/Users/paulostarek/Desktop/powerpoint/letmecook/benchmark/scenarios/test-1";
var INPUT_PPTX = path.join(TEST_DIR, "pres.pptx");
var INPUT_CHANGESET = path.join(TEST_DIR, "test-changeset.json");
var OUTPUT_PPTX = path.join(TEST_DIR, "pres-new.pptx");
var OUTPUT_DATAMODEL = path.join(TEST_DIR, "datamodel-new.json");
describe("PowerPointService.injectChangeset integration (test-1)", function () {
    it("injects changeset into a new PPTX and writes datamodel-new.json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, raw, parsed, zodResult, changeset, service, result, statNew, statOriginal, datamodel, dmRaw, dmParsed;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // Ensure inputs exist
                return [4 /*yield*/, fs.access(INPUT_PPTX)];
                case 1:
                    // Ensure inputs exist
                    _d.sent();
                    return [4 /*yield*/, fs.access(INPUT_CHANGESET)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fs.unlink(OUTPUT_PPTX)];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _d.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, fs.unlink(OUTPUT_DATAMODEL)];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _d.sent();
                    return [3 /*break*/, 9];
                case 9: return [4 /*yield*/, fs.readFile(INPUT_CHANGESET, "utf-8")];
                case 10:
                    raw = _d.sent();
                    parsed = JSON.parse(raw);
                    console.log("Parsed", parsed);
                    zodResult = AIChangesetSchema.safeParse(parsed);
                    if (!zodResult.success) {
                        throw zodResult.error;
                    }
                    changeset = zodResult.data;
                    return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
                case 11:
                    service = _d.sent();
                    return [4 /*yield*/, service.injectChangeset(INPUT_PPTX, changeset, OUTPUT_PPTX)];
                case 12:
                    result = _d.sent();
                    // Verify result shape and status
                    expect(result).toBeTruthy();
                    return [4 /*yield*/, fs.stat(OUTPUT_PPTX)];
                case 13:
                    statNew = _d.sent();
                    expect(statNew.size).toBeGreaterThan(0);
                    return [4 /*yield*/, fs.stat(INPUT_PPTX)];
                case 14:
                    statOriginal = _d.sent();
                    expect(statOriginal.size).toBeGreaterThan(0);
                    datamodel = (_c = result.outputPath) !== null && _c !== void 0 ? _c : result;
                    return [4 /*yield*/, fs.writeFile(OUTPUT_DATAMODEL, datamodel, "utf-8")];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, fs.readFile(OUTPUT_DATAMODEL, "utf-8")];
                case 16:
                    dmRaw = _d.sent();
                    dmParsed = JSON.parse(dmRaw);
                    expect(dmParsed).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); }, 120000);
});
