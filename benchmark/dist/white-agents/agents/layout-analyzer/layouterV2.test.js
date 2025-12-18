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
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum.js";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var OUTPUT_DIR = path.join(__dirname, "__generated__");
// Use the test PowerPoint file from the PowerPoint service directory
var TEST_PPTX = "/Users/paulostarek/Desktop/powerpoint/letmecook/api/python/presentations/firmlearning.pptx";
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
var TEST_PROPOSAL_JSON = path.join(__dirname, "test_proposal.json");
var SAMPLE_JSON = path.join(__dirname, "sample.json");
// Color palette for different layout levels
// Level 1: blue, Level 2: red, Level 3: green, Level 4: yellow, etc.
var LEVEL_COLORS = [
    "#0000FF", // Level 1: Blue
    "#FF0000", // Level 2: Red
    "#00FF00", // Level 3: Green
    "#FFFF00", // Level 4: Yellow
    "#FF00FF", // Level 5: Magenta
    "#00FFFF", // Level 6: Cyan
    "#FFA500", // Level 7: Orange
    "#800080", // Level 8: Purple
    "#008000", // Level 9: Dark Green
    "#000080", // Level 10: Navy
];
function createTimer() {
    var startTime = Date.now();
    return {
        getDuration: function () { return Date.now() - startTime; },
    };
}
/**
 * Recursively collects all shapes from sublayouts
 */
function collectShapesFromSublayouts(sublayout, collectedShapes) {
    if (collectedShapes === void 0) { collectedShapes = []; }
    // Collect shapes from this sublayout
    if (sublayout.shapes && sublayout.shapes.length > 0) {
        collectedShapes.push.apply(collectedShapes, sublayout.shapes);
    }
    // Recursively collect from nested sublayouts
    if (sublayout.sublayouts && sublayout.sublayouts.length > 0) {
        for (var _i = 0, _a = sublayout.sublayouts; _i < _a.length; _i++) {
            var nestedSublayout = _a[_i];
            collectShapesFromSublayouts(nestedSublayout, collectedShapes);
        }
    }
}
/**
 * Recursively processes a sublayout and creates rectangles for each boundary
 */
function processSublayout(sublayout, level, shapes) {
    if (level === void 0) { level = 1; }
    if (shapes === void 0) { shapes = []; }
    // Create a rectangle for this sublayout's boundary
    var _a = sublayout.boundaries, topLeft = _a[0], bottomRight = _a[1];
    var x1 = topLeft[0], y1 = topLeft[1];
    var x2 = bottomRight[0], y2 = bottomRight[1];
    // Calculate width and height
    var width = x2 - x1;
    var height = y2 - y1;
    // Get color for this level (cycle through colors if level exceeds array length)
    var colorIndex = (level - 1) % LEVEL_COLORS.length;
    var color = LEVEL_COLORS[colorIndex];
    // Create rectangle shape
    var shape = {
        _id: "proposal-".concat(level, "-").concat(shapes.length, "-").concat(sublayout.name.replace(/\s+/g, "-")),
        shapeType: "autoShape",
        pos: {
            topLeft: [x1, y1],
        },
        size: {
            w: width,
            h: height,
        },
        style: {
            fill: {
                type: "SOLID",
                color: color,
            },
            border: {
                color: "#000000",
                width: 1,
            },
            transparency: 0.3, // Make it semi-transparent so we can see overlapping layouts
        },
        details: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        },
    };
    shapes.push(shape);
    // Recursively process sublayouts
    if (sublayout.sublayouts && sublayout.sublayouts.length > 0) {
        for (var _i = 0, _b = sublayout.sublayouts; _i < _b.length; _i++) {
            var nestedSublayout = _b[_i];
            processSublayout(nestedSublayout, level + 1, shapes);
        }
    }
}
describe("Proposal Test", function () {
    it("should create rectangles from proposal boundaries and move/resize shapes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var timer, service, slide, shapeIdToTypeMap, _i, _a, shape, shapeTypesFound, proposalJson, proposalData, shapes, _b, topLeft, bottomRight, x1, y1, x2, y2, width, height, currentBoundaryShape, _c, _d, sublayout, shapesToModify, _e, _f, sublayout, validModifiedShapeTypes, modifiedShapes, _g, shapesToModify_1, shapeRef, shapeId, shapeType, modifiedShape, deletedShapes, _h, _j, deletedId, changeset, outputFile, result, stats, changesetPath, error_1, errorPath;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    timer = createTimer();
                    return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
                case 1:
                    service = _k.sent();
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 9, , 12]);
                    // Ensure output directory exists
                    return [4 /*yield*/, ensureOutputDir()];
                case 3:
                    // Ensure output directory exists
                    _k.sent();
                    return [4 /*yield*/, service.getSlideByIndex(TEST_PPTX, 2)];
                case 4:
                    slide = _k.sent();
                    expect(slide).toBeDefined();
                    expect(slide.id).toBeDefined();
                    expect(slide.shapes).toBeDefined();
                    shapeIdToTypeMap = new Map();
                    for (_i = 0, _a = slide.shapes; _i < _a.length; _i++) {
                        shape = _a[_i];
                        shapeIdToTypeMap.set(shape.id, shape.shapeType);
                    }
                    shapeTypesFound = new Set(Array.from(shapeIdToTypeMap.values()));
                    console.log("Found ".concat(shapeIdToTypeMap.size, " shapes on slide with types: ").concat(Array.from(shapeTypesFound).join(", ")));
                    return [4 /*yield*/, fs.readFile(SAMPLE_JSON, "utf-8")];
                case 5:
                    proposalJson = _k.sent();
                    proposalData = JSON.parse(proposalJson);
                    shapes = [];
                    _b = proposalData.current_boundaries, topLeft = _b[0], bottomRight = _b[1];
                    x1 = topLeft[0], y1 = topLeft[1];
                    x2 = bottomRight[0], y2 = bottomRight[1];
                    width = x2 - x1;
                    height = y2 - y1;
                    currentBoundaryShape = {
                        _id: "proposal-0-current-boundary",
                        shapeType: "autoShape",
                        pos: {
                            topLeft: [x1, y1],
                        },
                        size: {
                            w: width,
                            h: height,
                        },
                        style: {
                            fill: {
                                type: "SOLID",
                                color: LEVEL_COLORS[0], // Blue for level 1
                            },
                            border: {
                                color: "#000000",
                                width: 2,
                            },
                            transparency: 0.2, // Less transparent for the main boundary
                        },
                        details: {
                            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE,
                        },
                    };
                    shapes.push(currentBoundaryShape);
                    // Process all updated_sublayouts
                    for (_c = 0, _d = proposalData.proposed_change
                        .updated_sublayouts; _c < _d.length; _c++) {
                        sublayout = _d[_c];
                        processSublayout(sublayout, 2, shapes); // Start at level 2
                    }
                    console.log("Created ".concat(shapes.length, " rectangle shapes from proposal (1 current boundary + ").concat(proposalData.proposed_change.updated_sublayouts.length, " sublayouts)"));
                    shapesToModify = [];
                    for (_e = 0, _f = proposalData.proposed_change
                        .updated_sublayouts; _e < _f.length; _e++) {
                        sublayout = _f[_e];
                        collectShapesFromSublayouts(sublayout, shapesToModify);
                    }
                    validModifiedShapeTypes = new Set([
                        "line",
                        "autoShape",
                        "textbox",
                        "image",
                        "chart",
                        "placeholder",
                    ]);
                    modifiedShapes = [];
                    for (_g = 0, shapesToModify_1 = shapesToModify; _g < shapesToModify_1.length; _g++) {
                        shapeRef = shapesToModify_1[_g];
                        shapeId = parseInt(shapeRef.id, 10);
                        shapeType = shapeIdToTypeMap.get(shapeId);
                        if (!shapeType) {
                            console.warn("Shape ID ".concat(shapeId, " not found in slide. Skipping modification."));
                            continue;
                        }
                        // Skip shapes that cannot be modified (e.g., group shapes)
                        if (!validModifiedShapeTypes.has(shapeType)) {
                            console.warn("Shape ID ".concat(shapeId, " has unsupported type \"").concat(shapeType, "\" for modification. Skipping."));
                            continue;
                        }
                        modifiedShape = {
                            id: shapeId,
                            shapeType: shapeType,
                            pos: {
                                topLeft: shapeRef.topLeft,
                            },
                            size: {
                                w: shapeRef.size[0],
                                h: shapeRef.size[1],
                            },
                        };
                        modifiedShapes.push(modifiedShape);
                    }
                    console.log("Found ".concat(shapesToModify.length, " shapes to modify, ").concat(modifiedShapes.length, " successfully mapped to existing shapes"));
                    deletedShapes = [];
                    if (proposalData.deleted && proposalData.deleted.length > 0) {
                        for (_h = 0, _j = proposalData.deleted; _h < _j.length; _h++) {
                            deletedId = _j[_h];
                            deletedShapes.push({ id: Number(deletedId) });
                        }
                        console.log("Found ".concat(deletedShapes.length, " shapes to delete"));
                    }
                    changeset = {
                        added: shapes,
                        modified: modifiedShapes,
                        deleted: deletedShapes.length > 0 ? deletedShapes : undefined,
                    };
                    outputFile = path.join(OUTPUT_DIR, "test2.pptx");
                    return [4 /*yield*/, service.editSlide(TEST_PPTX, slide.id, changeset, outputFile)];
                case 6:
                    result = _k.sent();
                    expect(result).toBeDefined();
                    return [4 /*yield*/, fs.stat(result)];
                case 7:
                    stats = _k.sent();
                    expect(stats.size).toBeGreaterThan(0);
                    console.log("Successfully created test2.pptx with ".concat(shapes.length, " proposal rectangles, ").concat(modifiedShapes.length, " modified shapes, and ").concat(deletedShapes.length, " deleted shapes (").concat(timer.getDuration(), "ms)"));
                    changesetPath = path.join(OUTPUT_DIR, "proposal_changeset.json");
                    return [4 /*yield*/, fs.writeFile(changesetPath, JSON.stringify(changeset, null, 2), "utf-8")];
                case 8:
                    _k.sent();
                    return [3 /*break*/, 12];
                case 9:
                    error_1 = _k.sent();
                    console.error("Error in proposal test:", error_1);
                    if (!(error_1 instanceof PowerPointServiceError)) return [3 /*break*/, 11];
                    errorPath = path.join(OUTPUT_DIR, "proposal_error.json");
                    return [4 /*yield*/, fs.writeFile(errorPath, JSON.stringify(error_1.toJSON(), null, 2), "utf-8")];
                case 10:
                    _k.sent();
                    _k.label = 11;
                case 11: throw error_1;
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
