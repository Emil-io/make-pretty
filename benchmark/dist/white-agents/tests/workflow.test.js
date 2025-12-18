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
import { describe } from "vitest";
import { runWorkflow } from "../agents/layout-planner";
dotenv.config();
var PPTX_PATH = "/Users/paulostarek/Desktop/powerpoint/letmecook/benchmark/white-agents/tests/example2.pptx";
var SLIDE_INDEX = 10;
var PROMPT = "Please convert the three columns to three rows (each column should be a row in the new layout, with the heading being the left of the column (20%), then in the middle the icon and company logos, and the footer being the right of the column (20% width)). Also keep the gap between the rows vertically."; //"Instead of 7x2, make it 7x3, keep gaps in grid. Keep gap between the cells. For all the new cells, just give them placeholder text"; //"Pls make the first column 2x as wide as the others and add a fourth column to the right of the others, keep the gaps and align ofc"; //"Instead of 7x2, make it 5x3, keep gaps in grid";
describe("Workflow", function () {
    it("should run the workflow", function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, formattedDate, processId, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    formattedDate = now
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", "_");
                    processId = "workflow_".concat(formattedDate);
                    return [4 /*yield*/, runWorkflow({
                            processId: processId,
                            userPrompt: PROMPT,
                            pptxPath: PPTX_PATH,
                            slideIndex: SLIDE_INDEX,
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000); // 5minutes timeout
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // wait 5 secs
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 1:
                    // wait 5 secs
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
