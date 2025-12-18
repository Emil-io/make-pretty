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
import path from "path";
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint";
import { getOutputDir } from "../../helpers";
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
/**
 * Recursively processes a layout and creates rectangles for each boundary
 */
export function previewLayout(processId_1, outputName_1, pptxPath_1, slideId_1, layout_1) {
    return __awaiter(this, arguments, void 0, function (processId, outputName, pptxPath, slideId, layout, level) {
        var shapes, changeset, outputDir, outputPptxPath, service, resultPptx, error_1;
        if (level === void 0) { level = 1; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    shapes = [];
                    recursivelyGetShapes(layout, level, shapes);
                    console.log("Shapes", shapes.length);
                    console.log("Created ".concat(shapes.length, " rectangle shapes from layout tree"));
                    changeset = {
                        added: shapes,
                        modified: [],
                        deleted: [],
                    };
                    outputDir = getOutputDir(processId);
                    outputPptxPath = path.join(outputDir, "".concat(outputName, ".pptx"));
                    return [4 /*yield*/, createPowerPointServiceWithHealthCheck()];
                case 1:
                    service = _a.sent();
                    return [4 /*yield*/, service.editSlide(pptxPath, slideId, changeset, outputPptxPath)];
                case 2:
                    resultPptx = _a.sent();
                    console.log("Saved changeset to ".concat(outputPptxPath));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error in saving preview of layout:", error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function recursivelyGetShapes(layout, level, shapes) {
    if (level === void 0) { level = 1; }
    if (shapes === void 0) { shapes = []; }
    // Handle multi layouts (where b is an array of boundaries)
    if (layout.multi === true && Array.isArray(layout.b)) {
        // For multi layouts, create a rectangle for each boundary in the array
        for (var i = 0; i < layout.b.length; i++) {
            var boundary = layout.b[i];
            var id = boundary[0], topLeft = boundary[1], bottomRight = boundary[2], shapeIds = boundary[3];
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
                _id: "layout-".concat(level, "-").concat(shapes.length, "-").concat(layout.name.replace(/\s+/g, "-"), "-").concat(i),
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
        }
    }
    else {
        // Handle single boundary layouts
        var boundary = layout.b;
        var topLeft = boundary[0], bottomRight = boundary[1];
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
            _id: "layout-".concat(level, "-").concat(shapes.length, "-").concat(layout.name.replace(/\s+/g, "-")),
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
    }
    // Recursively process sublayouts (sl === sublayouts)
    if (layout.sl && layout.sl.length > 0) {
        for (var _i = 0, _a = layout.sl; _i < _a.length; _i++) {
            var sublayout = _a[_i];
            recursivelyGetShapes(sublayout, level + 1, shapes);
        }
    }
}
