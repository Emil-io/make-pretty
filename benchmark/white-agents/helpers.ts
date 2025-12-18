import { ContentBlock } from "@langchain/core/messages";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Layout } from "./agents/layout-analyzer/types";
import { Step, StepType } from "./agents/layout-planner/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function transformResult(
    res: string | (ContentBlock | ContentBlock.Text)[],
): string {
    function getString(): string {
        if (typeof res === "string") {
            return res;
        }
        const lastMessage = res[res.length - 1];
        if (lastMessage.type === "text") {
            return (lastMessage as ContentBlock.Text).text;
        }
        throw new Error("No text found in the last message.");
    }

    const string = getString().trim();

    // Try multiple patterns to extract JSON from code blocks
    // Order matters: try most specific patterns first
    // Use non-greedy matching to stop at the first closing ```
    const patterns = [
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
    for (const pattern of patterns) {
        const match = string.match(pattern);
        if (match && match[1]) {
            const extracted = match[1].trim();
            // Verify it looks like JSON (starts with { or [)
            if (extracted.startsWith("{") || extracted.startsWith("[")) {
                return extracted;
            }
        }
    }

    // If no code block found, check if the string itself is valid JSON
    const trimmed = string.trim();
    if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
        // Try to parse it to verify it's valid JSON
        try {
            JSON.parse(trimmed);
            return trimmed;
        } catch {
            // Not valid JSON, continue to fallback
        }
    }

    // Fallback: try to find JSON-like content by looking for the first { or [
    const firstBrace = trimmed.indexOf("{");
    const firstBracket = trimmed.indexOf("[");

    if (firstBrace !== -1 || firstBracket !== -1) {
        const startIndex =
            firstBracket === -1 ||
            (firstBrace !== -1 && firstBrace < firstBracket)
                ? firstBrace
                : firstBracket;

        // Try to find the matching closing brace/bracket
        const openChar = trimmed[startIndex];
        const closeChar = openChar === "{" ? "}" : "]";

        let depth = 0;
        let inString = false;
        let escapeNext = false;

        for (let i = startIndex; i < trimmed.length; i++) {
            const char = trimmed[i];

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
                } else if (char === closeChar) {
                    depth--;
                    if (depth === 0) {
                        const extracted = trimmed
                            .substring(startIndex, i + 1)
                            .trim();
                        try {
                            JSON.parse(extracted);
                            return extracted;
                        } catch {
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
    const preview =
        trimmed.length > 100 ? trimmed.substring(0, 100) + "..." : trimmed;
    console.warn(
        `[transformResult] Failed to extract JSON. First 100 chars: ${preview}`,
    );
    return trimmed;
}

export function loadSystemPrompt(dirname: string, promptName: string): string {
    return fs.readFileSync(path.join(dirname, promptName), "utf8");
}

/**
 * Get a layout from a graph by its id.
 * @param layoutId
 * @param layout
 * @returns
 */
export const getLayoutByIdFromGraph = (
    layoutId: string | null,
    layout: Layout,
): Layout => {
    if (!layoutId) {
        console.log(`No layout id provided, returning original layout`);
        return layout;
    }
    const queue: Layout[] = [layout];
    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.id === layoutId) {
            return current;
        }
        if (current.multi) {
            for (const b of current.b) {
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
        const hasSublayouts = current.sl && current.sl.length > 0;
        if (hasSublayouts && current.sl) {
            queue.push(...current.sl);
        }
    }
    throw new Error(`Layout with id ${layoutId} not found in graph`);
};

/**
 * Get all shape ids from a layout.
 * @param layout
 * @returns
 */
export const getShapeIdsFromLayout = (layout: Layout): (string | number)[] => {
    const shapeIds = new Set<string | number>();
    const queue: Layout[] = [layout];
    while (queue.length > 0) {
        const currentLayout = queue.shift()!;
        if (currentLayout.s) {
            currentLayout.s.forEach((s) => shapeIds.add(s));
        }
        // Check if is multi, has boundaries and has shape ids (i.e., entries are arrays with length 3)
        if (currentLayout.multi) {
            currentLayout.b.forEach((b) => {
                b[3].forEach((s) => shapeIds.add(s));
            });
        }
        if (currentLayout.sl) {
            queue.push(...currentLayout.sl);
        }
    }
    return Array.from(shapeIds);
};

/**
 * Get all layout ids from a layout.
 * @param layout
 * @returns
 */
export const getLayoutIds = (layout: Layout): string[] => {
    const layoutIds = new Set<string>();
    const queue: Layout[] = [layout];
    while (queue.length > 0) {
        const currentLayout = queue.shift()!;
        layoutIds.add(currentLayout.id);
        if (currentLayout.sl) {
            queue.push(...currentLayout.sl);
        }
        if (currentLayout.multi) {
            currentLayout.b.forEach((b) => {
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
export const getLayoutIdsFromPlannerResult = (steps: Step[]): string[] => {
    const layoutIds = new Set<string>();
    steps.forEach((s) => {
        if (s.type === StepType.relayouter) {
            s.expected_layout_ids.forEach((id) => layoutIds.add(id));
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
export const getOutputDir = (processId: string): string => {
    const outputDir = path.join(
        __dirname,
        "agents",
        "layout-planner",
        "__generated__",
        processId,
    );
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    return outputDir;
};
