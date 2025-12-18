import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { StepType } from "./agents/layout-planner/types";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export function transformResult(res) {
    function getString() {
        if (typeof res === "string") {
            return res;
        }
        var lastMessage = res[res.length - 1];
        if (lastMessage.type === "text") {
            return lastMessage.text;
        }
        throw new Error("No text found in the last message.");
    }
    var string = getString().trim();
    // Try multiple patterns to extract JSON from code blocks
    // Order matters: try most specific patterns first
    // Use non-greedy matching to stop at the first closing ```
    var patterns = [
        // ```json\n...\n``` (with explicit newlines)
        /```json\n([\s\S]*?)\n```/,
        // ```json ... ``` (with whitespace after json)
        /```json\s+([\s\S]*?)\s*```/,
        // ```json...``` (no whitespace, but content starts with { or [)
        /```json([\s\S]*?)```/,
        // ```\n...\n``` (generic code block with newlines)
        /```\n([\s\S]*?)\n```/,
        // ``` ... ``` (generic code block with whitespace)
        /```\s+([\s\S]*?)\s*```/,
        // ```...``` (generic code block, no whitespace)
        /```([\s\S]*?)```/,
    ];
    // Try each pattern
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var pattern = patterns_1[_i];
        var match = string.match(pattern);
        if (match && match[1]) {
            var extracted = match[1].trim();
            // Verify it looks like JSON (starts with { or [)
            if (extracted.startsWith("{") || extracted.startsWith("[")) {
                return extracted;
            }
        }
    }
    // If no code block found, check if the string itself is valid JSON
    var trimmed = string.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        // Try to parse it to verify it's valid JSON
        try {
            JSON.parse(trimmed);
            return trimmed;
        }
        catch (_a) {
            // Not valid JSON, continue to fallback
        }
    }
    // Fallback: try to find JSON-like content by looking for the first { or [
    var firstBrace = trimmed.indexOf("{");
    var firstBracket = trimmed.indexOf("[");
    if (firstBrace !== -1 || firstBracket !== -1) {
        var startIndex = firstBracket === -1 ||
            (firstBrace !== -1 && firstBrace < firstBracket)
            ? firstBrace
            : firstBracket;
        // Try to find the matching closing brace/bracket
        var openChar = trimmed[startIndex];
        var closeChar = openChar === "{" ? "}" : "]";
        var depth = 0;
        var inString = false;
        var escapeNext = false;
        for (var i = startIndex; i < trimmed.length; i++) {
            var char = trimmed[i];
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            if (char === "\\") {
                escapeNext = true;
                continue;
            }
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            if (!inString) {
                if (char === openChar) {
                    depth++;
                }
                else if (char === closeChar) {
                    depth--;
                    if (depth === 0) {
                        var extracted = trimmed
                            .substring(startIndex, i + 1)
                            .trim();
                        try {
                            JSON.parse(extracted);
                            return extracted;
                        }
                        catch (_b) {
                            // Not valid, continue
                        }
                        break;
                    }
                }
            }
        }
    }
    // Last resort: return the trimmed string as-is
    // The caller will handle JSON.parse errors
    // Log first 100 chars for debugging when extraction fails
    var preview = trimmed.length > 100 ? trimmed.substring(0, 100) + "..." : trimmed;
    console.warn("[transformResult] Failed to extract JSON. First 100 chars: ".concat(preview));
    return trimmed;
}
export function loadSystemPrompt(dirname, promptName) {
    return fs.readFileSync(path.join(dirname, promptName), "utf8");
}
/**
 * Get a layout from a graph by its id.
 * @param layoutId
 * @param layout
 * @returns
 */
export var getLayoutByIdFromGraph = function (layoutId, layout) {
    if (!layoutId) {
        console.log("No layout id provided, returning original layout");
        return layout;
    }
    var queue = [layout];
    while (queue.length > 0) {
        var current = queue.shift();
        if (current.id === layoutId) {
            return current;
        }
        if (current.multi) {
            for (var _i = 0, _a = current.b; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b[0] === layoutId) {
                    return {
                        id: b[0],
                        name: current.name,
                        type: current.type,
                        multi: false,
                        b: [b[1], b[2]],
                        sl: current.sl,
                        s: b[3],
                    };
                }
            }
        }
        var hasSublayouts = current.sl && current.sl.length > 0;
        if (hasSublayouts && current.sl) {
            queue.push.apply(queue, current.sl);
        }
    }
    throw new Error("Layout with id ".concat(layoutId, " not found in graph"));
};
/**
 * Get all shape ids from a layout.
 * @param layout
 * @returns
 */
export var getShapeIdsFromLayout = function (layout) {
    var shapeIds = new Set();
    var queue = [layout];
    while (queue.length > 0) {
        var currentLayout = queue.shift();
        if (currentLayout.s) {
            currentLayout.s.forEach(function (s) { return shapeIds.add(s); });
        }
        // Check if is multi, has boundaries and has shape ids (i.e., entries are arrays with length 3)
        if (currentLayout.multi) {
            currentLayout.b.forEach(function (b) {
                b[3].forEach(function (s) { return shapeIds.add(s); });
            });
        }
        if (currentLayout.sl) {
            queue.push.apply(queue, currentLayout.sl);
        }
    }
    return Array.from(shapeIds);
};
/**
 * Get all layout ids from a layout.
 * @param layout
 * @returns
 */
export var getLayoutIds = function (layout) {
    var layoutIds = new Set();
    var queue = [layout];
    while (queue.length > 0) {
        var currentLayout = queue.shift();
        layoutIds.add(currentLayout.id);
        if (currentLayout.sl) {
            queue.push.apply(queue, currentLayout.sl);
        }
        if (currentLayout.multi) {
            currentLayout.b.forEach(function (b) {
                layoutIds.add(b[0]);
            });
        }
    }
    return Array.from(layoutIds);
};
/**
 * Get all layout ids from a planner result.
 * @param steps
 * @returns
 */
export var getLayoutIdsFromPlannerResult = function (steps) {
    var layoutIds = new Set();
    steps.forEach(function (s) {
        if (s.type === StepType.relayouter) {
            s.expected_layout_ids.forEach(function (id) { return layoutIds.add(id); });
        }
        if (s.type === StepType.executor) {
            layoutIds.add(s.layoutId);
        }
    });
    return Array.from(layoutIds);
};
/**
 * Get the centralized output directory for a given process ID.
 * All agents should use this function to ensure they write to the same folder.
 * The base directory is in layout-planner/__generated__/
 */
export var getOutputDir = function (processId) {
    var outputDir = path.join(__dirname, "agents", "layout-planner", "__generated__", processId);
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    return outputDir;
};
