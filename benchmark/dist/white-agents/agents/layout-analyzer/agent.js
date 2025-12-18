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
import { HumanMessage } from "@langchain/core/messages";
import { ChatVertexAI } from "@langchain/google-vertexai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertToCoordinateYaml } from "../../coordinate-yaml.js";
import { getOutputDir, transformResult } from "../../helpers.js";
import { layoutAnalyzerInputTransformer } from "./transformer.js";
import { LayoutAnalyzerOutputSchema } from "./types.js";
// Constants
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var MAX_RETRIES = 0;
var PROMPT_FILE = "sp.md";
function formatValidationErrors(error) {
    return error.issues
        .map(function (issue) { return "".concat(issue.path.join("."), ": ").concat(issue.message); })
        .join("\n");
}
function createJsonParseErrorMessage(error) {
    var errorMessage = error instanceof Error ? error.message : String(error);
    return "Failed to parse JSON from response. Error: ".concat(errorMessage, ". Please ensure your output is valid JSON.");
}
function createSchemaValidationErrorMessage(error) {
    var errorMessages = formatValidationErrors(error);
    return "The output does not conform to the required schema. Schema validation errors:\n".concat(errorMessages, "\n\nPlease fix the output to match the required schema format.");
}
function createRetryMessage(originalError, hint) {
    return {
        role: "user",
        parts: [
            {
                text: "The previous output had an error. ".concat(originalError, " ").concat(hint),
            },
        ],
    };
}
var model;
export function getModel() {
    if (!model) {
        model = new ChatVertexAI({
            model: "gemini-2.5-flash",
            temperature: 0,
            thinkingBudget: 2048,
            maxReasoningTokens: 2048,
            platformType: "gcp",
            responseMimeType: "application/json",
            convertSystemMessageToHumanContent: true,
            maxOutputTokens: 8096,
            apiConfig: {
                thinking: {
                    type: "enabled",
                    budget_tokens: 2048,
                },
            },
        });
    }
    return model;
}
function loadPrompt() {
    return fs.readFileSync(path.join(__dirname, PROMPT_FILE), "utf8");
}
// Main agent function
export var runLayoutAnalyzerAgent = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    function runModelWithValidation() {
        return __awaiter(this, arguments, void 0, function (additionalMessages, attempt) {
            var transformedShapes, yamlDatamodel, yamlPath, start, response, parsedOutput, validationResult, resultingMessage, errorMessage, durationInSeconds, errorMessage;
            if (additionalMessages === void 0) { additionalMessages = []; }
            if (attempt === void 0) { attempt = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transformedShapes = layoutAnalyzerInputTransformer(input.datamodel.shapes);
                        yamlDatamodel = convertToCoordinateYaml(transformedShapes);
                        yamlPath = path.join(outputDir, "datamodel.yaml");
                        fs.writeFileSync(yamlPath, yamlDatamodel, "utf-8");
                        start = Date.now();
                        return [4 /*yield*/, model.invoke([
                                ["system", prompt],
                                new HumanMessage({
                                    content: [
                                        {
                                            type: "text",
                                            text: "# Datamodel\n\n".concat(yamlDatamodel),
                                        },
                                        {
                                            type: "image_url",
                                            image_url: "data:image/png;base64,".concat(input.snapshotBase64),
                                        },
                                    ],
                                }),
                            ], {
                                thinkingBudget: 0,
                                maxReasoningTokens: 0,
                                configurable: {
                                    thinking: {
                                        type: "disabled",
                                    },
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            resultingMessage = transformResult(response.content);
                            // Save string to outputDir/resultingMessage.json
                            fs.writeFileSync(path.join(outputDir, "resultingMessage.json"), resultingMessage, "utf-8");
                            parsedOutput = JSON.parse(resultingMessage);
                            validationResult =
                                LayoutAnalyzerOutputSchema.safeParse(parsedOutput);
                        }
                        catch (parseError) {
                            if (attempt < MAX_RETRIES) {
                                errorMessage = createJsonParseErrorMessage(parseError);
                                return [2 /*return*/, runModelWithValidation([
                                        createRetryMessage(errorMessage, "Please fix the output and return only valid JSON conforming to the schema."),
                                    ], attempt + 1)];
                            }
                            throw new Error("Failed to parse JSON after ".concat(MAX_RETRIES, " attempts: ").concat(createJsonParseErrorMessage(parseError)));
                        }
                        durationInSeconds = (Date.now() - start) / 1000;
                        console.log("Time taken: ".concat(durationInSeconds, "s"));
                        if (validationResult.success) {
                            return [2 /*return*/, validationResult.data];
                        }
                        console.log("Validation failed: ".concat(JSON.stringify(validationResult.error)));
                        if (attempt < MAX_RETRIES) {
                            errorMessage = createSchemaValidationErrorMessage(validationResult.error);
                            return [2 /*return*/, runModelWithValidation([
                                    createRetryMessage(errorMessage, "Please fix the output and ensure it matches the schema exactly."),
                                ], attempt + 1)];
                        }
                        throw new Error("Schema validation failed after ".concat(MAX_RETRIES, " attempts: ").concat(formatValidationErrors(validationResult.error)));
                }
            });
        });
    }
    var prompt, model, outputDir, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prompt = loadPrompt();
                model = getModel();
                outputDir = getOutputDir(input.processId);
                return [4 /*yield*/, runModelWithValidation([])];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
