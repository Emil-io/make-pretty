import fs from "fs";
import path from "path";
import { BoundaryCoordinates, Item } from "../helpers/row-helper";

// Helper function to escape XML characters
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper function to log item changes
export function logItemChanges(
    initialItems: Item[],
    finalItems: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }>,
    testName: string,
) {
    console.log(`\n📊 ${testName} - Item Changes:`);
    console.log("==================================================");

    for (let i = 0; i < initialItems.length; i++) {
        const initial = initialItems[i];
        const final = finalItems[i];
        if (final) {
            console.log(`\n🔹 ${initial.id}:`);
            console.log(
                `   Position: (${initial.x || 0}, ${initial.y || 0}) → (${final.x}, ${final.y})`,
            );
            console.log(
                `   Changes:  Δx=${(final.x - (initial.x || 0)).toFixed(1)}, Δy=${(final.y - (initial.y || 0)).toFixed(1)}`,
            );
            console.log(
                `   Size:     ${initial.width}×${initial.height} → ${final.width}×${final.height}`,
            );
            console.log(
                `   Size Δ:   Δw=${(final.width - initial.width).toFixed(1)}, Δh=${(final.height - initial.height).toFixed(1)}`,
            );
        }
    }

    console.log("\n==================================================");
}

// Helper function to detect grid structure and assign semantic colors
function getSemanticColor(item: Item, allItems: Item[]): string {
    const id = item.id;
    
    // Detect headers (items with "header" in ID)
    if (id.toLowerCase().includes('header')) {
        return '#FF6B6B'; // Red/coral for headers
    }
    
    // Detect if this is a first column item (items with similar x position as the leftmost item)
    const leftmostX = Math.min(...allItems.map(i => i.x || 0));
    const isFirstColumn = Math.abs((item.x || 0) - leftmostX) < 5;
    
    // Group items by row (similar y positions)
    const yPositions = Array.from(new Set(allItems.map(i => Math.round((i.y || 0) / 10) * 10))).sort((a, b) => a - b);
    const itemY = Math.round((item.y || 0) / 10) * 10;
    const rowIndex = yPositions.indexOf(itemY);
    
    // Color scheme
    if (isFirstColumn && !id.toLowerCase().includes('header')) {
        return '#4ECDC4'; // Teal for first column
    }
    
    // Color content cells by row
    const rowColors = [
        '#BB8FCE', // Purple
        '#85C1E9', // Light blue
        '#98D8C8', // Mint
        '#F7DC6F', // Yellow
        '#E8DAEF', // Lavender
    ];
    
    return rowColors[rowIndex % rowColors.length] || '#96CEB4';
}

// Helper function to generate SVG visualization
export function generateVisualization(
    initialItems: Item[],
    finalItems: Item[],
    boundary: BoundaryCoordinates,
    testName: string,
    category: string = "",
) {
    // Ensure output directory exists
    const baseDir = path.join(__dirname, "alignment", "__generated__");
    const outputDir = category ? path.join(baseDir, category) : baseDir;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Calculate scale factor to fit in reasonable SVG size
    const maxWidth = Math.max(
        boundary.rightX - boundary.leftX,
        ...finalItems.map((item) => (item.x || 0) + item.width),
    );
    const maxHeight = Math.max(
        boundary.bottomY - boundary.topY,
        ...finalItems.map((item) => (item.y || 0) + item.height),
    );
    const scale = Math.min(300 / maxWidth, 200 / maxHeight, 1);

    // Ensure SVG is wide enough for side-by-side layout
    const contentWidth = maxWidth * scale;
    const svgWidth = contentWidth * 2 + 120; // Double width + spacing
    const svgHeight = maxHeight * scale + 80;

    const generateItemSVG = (
        item: Item,
        isInitial: boolean,
        offsetX: number = 0,
        allItems: Item[] = [],
    ) => {
        const x = (item.x || 0) * scale + offsetX;
        const y = (item.y || 0) * scale;
        const width = item.width * scale;
        const height = item.height * scale;
        const color = getSemanticColor(item, allItems);
        const opacity = isInitial ? 0.5 : 0.85;
        const stroke = isInitial ? "#666" : "#333";
        const strokeWidth = isInitial ? 1 : 2;

        return `
            <rect x="${x}" y="${y}" width="${width}" height="${height}" 
                  fill="${color}" opacity="${opacity}" 
                  stroke="${stroke}" stroke-width="${strokeWidth}"/>
            <text x="${x + width / 2}" y="${y + height / 2}" 
                  text-anchor="middle" dominant-baseline="middle" 
                  font-size="10" fill="${isInitial ? "#666" : "#000"}" font-weight="bold">
                ${item.id}
            </text>
            <text x="${x + width / 2}" y="${y + height / 2 + 12}" 
                  text-anchor="middle" dominant-baseline="middle" 
                  font-size="8" fill="${isInitial ? "#666" : "#000"}">
                ${Math.round(item.width)}×${Math.round(item.height)}
            </text>
        `;
    };

    const svg = `
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
        </pattern>
    </defs>
    
    <!-- White background -->
    <rect width="100%" height="100%" fill="white"/>
    
    <!-- Light gray grid -->
    <rect width="100%" height="100%" fill="url(#grid)"/>
    
    <!-- Boundary box -->
    <rect x="${boundary.leftX * scale + 20}" y="${boundary.topY * scale + 20}" 
          width="${(boundary.rightX - boundary.leftX) * scale}" height="${(boundary.bottomY - boundary.topY) * scale}" 
          fill="none" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="${(boundary.leftX + boundary.rightX) * scale + 20}" y="${boundary.topY * scale + 15}" 
          text-anchor="end" font-size="12" fill="#333" font-weight="bold">Boundary: ${boundary.rightX - boundary.leftX}×${boundary.bottomY - boundary.topY}</text>
    
    <!-- BEFORE: Initial items (left side) -->
    <g transform="translate(20, 20)">
        <text x="0" y="-5" font-size="14" fill="#666" font-weight="bold">BEFORE</text>
        ${initialItems.map((item) => generateItemSVG(item, true, 0, initialItems)).join("")}
    </g>
    
    <!-- AFTER: Final items (right side) -->
    <g transform="translate(${contentWidth + 60}, 20)">
        <text x="0" y="-5" font-size="14" fill="#000" font-weight="bold">AFTER</text>
        <!-- Boundary box for AFTER section -->
        <rect x="${boundary.leftX * scale}" y="${boundary.topY * scale}" 
              width="${(boundary.rightX - boundary.leftX) * scale}" height="${(boundary.bottomY - boundary.topY) * scale}" 
              fill="none" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="${(boundary.leftX + boundary.rightX) * scale}" y="${boundary.topY * scale - 5}" 
              text-anchor="end" font-size="12" fill="#333" font-weight="bold">Boundary: ${boundary.rightX - boundary.leftX}×${boundary.bottomY - boundary.topY}</text>
        ${finalItems.map((item) => generateItemSVG(item, false, 0, finalItems)).join("")}
    </g>
    
    <!-- Title at bottom -->
    <text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="16" fill="#333" font-weight="bold">
        ${escapeXml(testName)}
    </text>
</svg>`;

    // Save SVG file
    const filename = testName.toLowerCase().replace(/[^a-z0-9]/g, "-") + ".svg";
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, svg);

    console.log(`📊 Visual output saved: ${filepath}`);
    return filepath;
}
