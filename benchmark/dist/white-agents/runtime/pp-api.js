/**
 * White Agent PowerPoint API
 *
 * Provides PowerPoint operations (extract datamodel, inject changeset) for agents.
 * This service wraps the PowerPointService and provides a clean interface for agents.
 */
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
import { PowerPointService } from "@make-pretty/server/services/addin/powerpoint/service.js";
import { getDatamodelFromChangeset } from "@make-pretty/server/services/shared/datamodel/transformers/apply-changeset.js";
import { getChangesetFromDataModels } from "@make-pretty/server/services/shared/datamodel/transformers/get-diff.js";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// Default Python API directory
var DEFAULT_PYTHON_API_DIR = path.join(__dirname, "..", "..", "..", "api", "python");
var WhiteAgentPPApi = /** @class */ (function () {
    function WhiteAgentPPApi(_a) {
        var presentationPath = _a.presentationPath, pythonApiDir = _a.pythonApiDir;
        this.pptService = null;
        /**
         * Get the current datamodel (temporary changes applied)
         */
        this.originalDM = null;
        /**
         * The changeset history
         */
        this.changes = [];
        this.presentationPath = presentationPath;
        this.pythonApiDir = pythonApiDir || DEFAULT_PYTHON_API_DIR;
    }
    /**
     * Initialize the PowerPoint service (lazy initialization)
     */
    WhiteAgentPPApi.prototype.ensurePPTService = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.pptService) {
                    this.pptService = new PowerPointService();
                }
                return [2 /*return*/, this.pptService];
            });
        });
    };
    /**
     * Extract datamodel from PowerPoint presentation
     */
    WhiteAgentPPApi.prototype.extractDatamodel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pptService, result, error_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Extracting datamodel from: ".concat(this.presentationPath));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.ensurePPTService()];
                    case 2:
                        pptService = _a.sent();
                        if (!this.presentationPath) {
                            throw new Error("Presentation path is required");
                        }
                        console.log("Presentation path:", this.presentationPath);
                        return [4 /*yield*/, pptService.getSlideByIndex(this.presentationPath, 0)];
                    case 3:
                        result = _a.sent();
                        console.log("Result:", JSON.stringify(result, null, 2));
                        throw new Error("Test error");
                    case 4:
                        error_1 = _a.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        console.error("❌ Failed to extract datamodel:", errorMessage);
                        return [2 /*return*/, {
                                success: false,
                                error: errorMessage,
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Inject changeset into PowerPoint presentation
     */
    WhiteAgentPPApi.prototype.injectChangeset = function (outputPath, presentationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _presentationPath, originalDM, currentDM, totalChangeset, pptService, result, error_2, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _presentationPath = presentationPath || this.presentationPath;
                        if (!_presentationPath) {
                            throw new Error("Presentation path is required");
                        }
                        console.log("\uD83D\uDC89 Injecting changeset into: ".concat(_presentationPath));
                        console.log("\uD83D\uDCC1 Output path: ".concat(outputPath));
                        originalDM = this.originalDM;
                        currentDM = this.getCurrentDM();
                        if (!originalDM || !currentDM) {
                            throw new Error("Original or current datamodel is not set");
                        }
                        console.log("🔍 Original DM:", JSON.stringify(originalDM.shapes));
                        console.log("🔍 Current DM:", JSON.stringify(currentDM.shapes));
                        totalChangeset = getChangesetFromDataModels(originalDM, currentDM);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.ensurePPTService()];
                    case 2:
                        pptService = _a.sent();
                        return [4 /*yield*/, pptService.injectChangeset(_presentationPath, totalChangeset, outputPath)];
                    case 3:
                        result = _a.sent();
                        console.log("✅ Changeset injected successfully");
                        return [2 /*return*/, {
                                success: true,
                                outputPath: outputPath,
                            }];
                    case 4:
                        error_2 = _a.sent();
                        errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                        console.error("❌ Failed to inject changeset:", errorMessage);
                        return [2 /*return*/, {
                                success: false,
                                error: errorMessage,
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the Python API directory path
     */
    WhiteAgentPPApi.prototype.getPythonApiDir = function () {
        return this.pythonApiDir;
    };
    WhiteAgentPPApi.prototype.getCurrentDM = function () {
        if (!this.originalDM) {
            throw new Error("Original datamodel is not set");
        }
        var _dm = this.originalDM;
        if (!_dm) {
            throw new Error("Failed to get current datamodel");
        }
        for (var _i = 0, _a = this.changes; _i < _a.length; _i++) {
            var change = _a[_i];
            _dm = getDatamodelFromChangeset(_dm, change);
        }
        return _dm;
    };
    WhiteAgentPPApi.prototype.undoLastChange = function () {
        this.changes.pop();
    };
    WhiteAgentPPApi.prototype.applyChangesetToCurrentDM = function (changeset) {
        this.changes.push(changeset);
    };
    return WhiteAgentPPApi;
}());
export { WhiteAgentPPApi };
