import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

/**
 * Custom YAML serializer that keeps coordinate arrays inline
 * Usage: coordinateYaml.dump(data)
 */

interface DumpOptions {
    // Fields that should have their arrays rendered inline
    inlineArrayFields?: string[];
    // Maximum array length to keep inline (default: no limit)
    maxInlineLength?: number;
    // Additional yaml.dump options
    yamlOptions?: yaml.DumpOptions;
}

const DEFAULT_INLINE_FIELDS = [
    "startPos",
    "endPos",
    "position",
    "pos",
    "coord",
    "size",
    "offset",
    "topLeft",
    "bottomRight",
    "center",
    "margin",
    "b",
    "s",
];

function shouldInlineArray(
    key: string | null,
    value: any[],
    options: DumpOptions,
): boolean {
    const inlineFields = options.inlineArrayFields || DEFAULT_INLINE_FIELDS;
    const maxLength = options.maxInlineLength;

    // Check if all elements are primitive (number, string, boolean, null)
    const allPrimitive = value.every(
        (item) => typeof item !== "object" || item === null,
    );

    if (!allPrimitive) return false;

    // Check length constraint
    if (maxLength !== undefined && value.length > maxLength) {
        return false;
    }

    // Check if the key matches our inline fields
    if (key && inlineFields.includes(key)) {
        return true;
    }

    return false;
}

function preprocessObject(
    obj: any,
    parentKey: string | null,
    options: DumpOptions,
): any {
    if (Array.isArray(obj)) {
        if (shouldInlineArray(parentKey, obj, options)) {
            // Mark this array to stay inline by ensuring it's compact
            return obj;
        }
        return obj.map((item) => preprocessObject(item, null, options));
    }

    if (obj !== null && typeof obj === "object") {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = preprocessObject(value, key, options);
        }
        return result;
    }

    return obj;
}

export function convertToCoordinateYaml(
    data: any,
    options: DumpOptions = {},
): string {
    const processed = preprocessObject(data, null, options);

    const yamlOptions: yaml.DumpOptions = {
        flowLevel: -1, // Start with block style
        lineWidth: -1, // No line width limit by default
        ...options.yamlOptions,
    };

    // First pass: dump with default settings
    let result = yaml.dump(processed, yamlOptions);

    // Second pass: convert number arrays to flow style (inline)
    // Process each line to find arrays that need to be inlined
    const lines = result.split("\n");
    const processedLines: string[] = [];
    let i = 0;
    
    // Helper function to check if a value is a number (including scientific notation and decimals)
    const isNumber = (str: string): boolean => {
        const trimmed = str.trim();
        if (trimmed === "" || trimmed === "null" || trimmed === "~") {
            return false;
        }
        // Match numbers including decimals, negatives, and scientific notation
        return /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed);
    };
    
    // Helper function to parse a nested array structure
    const parseNestedArray = (
        startIndex: number,
        baseIndent: string,
        indentLevel: number,
    ): { items: any[]; endIndex: number } | null => {
        const items: any[] = [];
        let j = startIndex;
        
        while (j < lines.length) {
            const currentLine = lines[j];
            const currentIndent = currentLine.match(/^(\s*)/)?.[1] || "";
            const currentIndentLevel = currentIndent.length;
            
            // Check if we've hit the next field at same or less indentation
            if (currentIndentLevel <= indentLevel && currentLine.trim() !== "") {
                const fieldMatch = currentLine.match(/^(\s*)(\w+):/);
                if (fieldMatch) {
                    break;
                }
            }
            
            // Check if this line is an array item at the correct indentation
            // Match: baseIndent + at least 1 space + "-" + optional value
            const itemMatch = currentLine.match(new RegExp(`^(${baseIndent}\\s+)-\\s*(.*)$`));
            if (itemMatch) {
                const itemValue = itemMatch[2].trim();
                const itemIndent = itemMatch[1];
                
                // Check if this item value starts with "-" (nested array on same line)
                // e.g., "- - 716" means outer array item containing nested array starting with 716
                if (itemValue.startsWith("-")) {
                    // This is a nested array starting on the same line
                    // Extract the first value after the nested "-"
                    const nestedValueMatch = itemValue.match(/^-\s+(.+)$/);
                    const firstNestedValue = nestedValueMatch ? nestedValueMatch[1].trim() : "";
                    
                    // Collect nested array items
                    const nestedItems: string[] = [];
                    if (firstNestedValue) {
                        nestedItems.push(firstNestedValue);
                    }
                    
                    // Look ahead for more nested items
                    let k = j + 1;
                    while (k < lines.length) {
                        const nextLine = lines[k];
                        const nextIndent = nextLine.match(/^(\s*)/)?.[1] || "";
                        const nextIndentLevel = nextIndent.length;
                        
                        // Check if this is a nested array item (more indented than current)
                        if (nextIndentLevel > currentIndentLevel) {
                            const nestedItemMatch = nextLine.match(/^(\s+)-/);
                            if (nestedItemMatch) {
                                const nestedValue = nextLine.replace(/^\s+-/, "").trim();
                                if (nestedValue) {
                                    nestedItems.push(nestedValue);
                                }
                                k++;
                                continue;
                            }
                        }
                        break;
                    }
                    
                    if (nestedItems.length > 0) {
                        items.push(nestedItems);
                        j = k;
                        continue;
                    }
                }
                
                // Check if next line is a nested array (different indentation)
                if (j + 1 < lines.length) {
                    const nextLine = lines[j + 1];
                    // Check if next line has deeper indentation and starts with "-"
                    const nextIndent = nextLine.match(/^(\s*)/)?.[1] || "";
                    const nextIndentLevel = nextIndent.length;
                    const nestedItemMatch = nextLine.match(/^(\s+)-/);
                    
                    // If next line is more indented and is an array item, this is nested
                    if (nestedItemMatch && nextIndentLevel > currentIndentLevel) {
                        // This is a nested array, parse it recursively
                        const nestedResult = parseNestedArray(j + 1, itemIndent, currentIndentLevel);
                        if (nestedResult) {
                            items.push(nestedResult.items);
                            j = nestedResult.endIndex;
                            continue;
                        }
                    }
                }
                
                // Single value item (or empty array item)
                items.push(itemValue);
                j++;
            } else {
                // Empty line or comment, skip
                if (currentLine.trim() === "" || currentLine.trim().startsWith("#")) {
                    j++;
                    continue;
                }
                break;
            }
        }
        
        return items.length > 0 ? { items, endIndex: j } : null;
    };
    
    while (i < lines.length) {
        const line = lines[i];
        // Match any field name with colon, but not already inline array
        const fieldMatch = line.match(/^(\s*)(\w+):\s*(.*)$/);
        
        if (fieldMatch) {
            const indent = fieldMatch[1];
            const fieldName = fieldMatch[2];
            const valueAfterColon = fieldMatch[3];
            const indentLevel = indent.length;
            const inlineFields = options.inlineArrayFields || DEFAULT_INLINE_FIELDS;
            
            // If already has inline array value, skip it
            if (valueAfterColon.trim().startsWith("[")) {
                processedLines.push(line);
                i++;
                continue;
            }
            
            // Check if next line starts an array (block style)
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                const arrayItemMatch = nextLine.match(new RegExp(`^(${indent}\\s+)-\\s*(.*)$`));
                
                if (arrayItemMatch) {
                    // Try to parse as nested array
                    const arrayResult = parseNestedArray(i + 1, indent, indentLevel);
                    
                    if (arrayResult) {
                        const { items, endIndex } = arrayResult;
                        
                        // Check if field should be inlined
                        const shouldInline = inlineFields.includes(fieldName);
                        
                        // Check if all items are numbers or nested arrays of numbers
                        const allNumeric = items.every(item => {
                            if (typeof item === "string") {
                                return isNumber(item) || item === "null" || item === "~" || item === "";
                            }
                            if (Array.isArray(item)) {
                                return item.every(subItem => 
                                    typeof subItem === "string" && 
                                    (isNumber(subItem) || subItem === "null" || subItem === "~" || subItem === "")
                                );
                            }
                            return false;
                        });
                        
                        // Check length constraint
                        const withinLength = !options.maxInlineLength || items.length <= options.maxInlineLength;
                        
                        if (shouldInline && allNumeric && withinLength) {
                            // Convert to inline format
                            const formatItem = (item: any): string => {
                                if (Array.isArray(item)) {
                                    const numberItems = item.filter(subItem => 
                                        subItem !== "null" && subItem !== "~" && subItem !== ""
                                    );
                                    return `[${numberItems.join(", ")}]`;
                                }
                                return item !== "null" && item !== "~" && item !== "" ? item : "";
                            };
                            
                            const formattedItems = items
                                .map(formatItem)
                                .filter(item => item !== "");
                            const inlineArray = `[${formattedItems.join(", ")}]`;
                            processedLines.push(`${indent}${fieldName}: ${inlineArray}`);
                            i = endIndex;
                            continue;
                        }
                    }
                }
            }
        }
        
        processedLines.push(line);
        i++;
    }
    
    result = processedLines.join("\n");

    return result;
}

const example = {
    slideId: 2145707934,
    width: 1280,
    height: 720,
    metadata: {
        title: "Example Slide",
        author: "Test User",
        created: "2024-01-15",
    },
    shapes: [
        {
            id: 1,
            shapeType: "rectangle",
            position: [100, 50],
            size: [300, 200],
            offset: [10, 10],
            center: [250, 150],
            topLeft: [100, 50],
            bottomRight: [400, 250],
            margin: [10, 20],
            style: {
                fill: "#FF5733",
                stroke: "#000000",
                strokeWidth: 2,
            },
            children: [
                {
                    id: 11,
                    shapeType: "text",
                    position: [120, 70],
                    size: [260, 160],
                    offset: [0, 0],
                    margin: [5, 10, 5, 10],
                },
            ],
        },
        {
            id: 2,
            shapeType: "circle",
            position: [500, 100],
            size: [150, 150],
            center: [575, 175],
            topLeft: [500, 100],
            bottomRight: [650, 250],
            margin: [15, 25, 15, 25],
            style: {
                fill: "#33FF57",
                stroke: "#000000",
            },
        },
        {
            id: 3,
            shapeType: "line",
            startPos: [0, 39],
            endPos: [1280, 39],
            offset: [0, 0],
            b: [[716, 638], [1241, 665]], // Test nested array (tuple of tuples)
        },
        {
            id: 4,
            shapeType: "group",
            position: [700, 300],
            size: [400, 300],
            topLeft: [700, 300],
            bottomRight: [1100, 600],
            margin: [20, 30, 20],
            children: [
                {
                    id: 41,
                    shapeType: "rectangle",
                    position: [720, 320],
                    size: [150, 100],
                    offset: [20, 20],
                    center: [795, 370],
                },
                {
                    id: 42,
                    shapeType: "ellipse",
                    position: [900, 350],
                    size: [120, 80],
                    offset: [0, 0],
                    center: [960, 390],
                    topLeft: [900, 350],
                    bottomRight: [1020, 430],
                },
                {
                    id: 43,
                    shapeType: "polygon",
                    position: [1050, 400],
                    size: [30, 30],
                    coord: [1050, 400, 1080, 400, 1065, 430],
                    offset: [0, 0],
                },
            ],
        },
        {
            id: 5,
            shapeType: "image",
            position: [100, 400],
            size: [250, 180],
            offset: [5, 5],
            center: [225, 490],
            topLeft: [100, 400],
            bottomRight: [350, 580],
            source: {
                url: "https://example.com/image.jpg",
                dimensions: [1920, 1080],
            },
        },
    ],
    layout: {
        grid: {
            columns: 12,
            rows: 8,
            cellSize: [106.67, 90],
            spacing: [10, 10],
        },
        constraints: [
            {
                type: "align",
                shapes: [1, 2],
                axis: "x",
                position: [100, 100],
            },
            {
                type: "distribute",
                shapes: [1, 2, 5],
                direction: "horizontal",
                spacing: 50,
            },
        ],
    },
};

// Example usage: convert to YAML and save to file
const yamlOutput = convertToCoordinateYaml(example);
const outputPath = path.join(__dirname, "coordinate.yaml");
fs.writeFileSync(outputPath, yamlOutput, "utf-8");
console.log(`YAML output saved to ${outputPath}`);

// Also save raw yaml.dump output for comparison/benchmarking
const rawYamlOutput = yaml.dump(example, {
    flowLevel: -1,
    lineWidth: -1,
});
const oldOutputPath = path.join(__dirname, "coordinate_old.yaml");
fs.writeFileSync(oldOutputPath, rawYamlOutput, "utf-8");
console.log(`Raw YAML output saved to ${oldOutputPath}`);
