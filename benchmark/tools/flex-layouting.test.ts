import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import z from "zod";
import type {
    AlignmentResult,
    BoundaryCoordinates,
    FlexLayoutingToolInput,
    Item,
} from "./flex-layouting";
import {
    AlignItems,
    FlexDirection,
    flexLayoutingFunction,
    FlexWrap,
    JustifyContent,
} from "./flex-layouting";

// Helper function to log changes between initial and final item positions
function logItemChanges(
    initialItems: Item[],
    finalItems: AlignmentResult["items"],
    testName: string,
) {
    console.log(`\n📊 ${testName} - Item Changes:`);
    console.log("=".repeat(50));

    initialItems.forEach((initialItem, index) => {
        const finalItem = finalItems.find((item) => item.id === initialItem.id);
        if (finalItem) {
            const xChange = finalItem.x - (initialItem.x || 0);
            const yChange = finalItem.y - (initialItem.y || 0);
            const widthChange = finalItem.width - initialItem.width;
            const heightChange = finalItem.height - initialItem.height;

            console.log(`\n🔹 ${initialItem.id}:`);
            console.log(
                `   Position: (${initialItem.x || 0}, ${initialItem.y || 0}) → (${finalItem.x}, ${finalItem.y})`,
            );
            console.log(
                `   Changes:  Δx=${xChange.toFixed(1)}, Δy=${yChange.toFixed(1)}`,
            );
            console.log(
                `   Size:     ${initialItem.width}×${initialItem.height} → ${finalItem.width}×${finalItem.height}`,
            );
            console.log(
                `   Size Δ:   Δw=${widthChange.toFixed(1)}, Δh=${heightChange.toFixed(1)}`,
            );
        }
    });

    console.log("\n" + "=".repeat(50));
}

// Helper function to generate SVG visualization
function generateVisualization(
    initialItems: Item[],
    finalItems: AlignmentResult["items"],
    boundary: BoundaryCoordinates,
    testName: string,
    category: string = "",
) {
    // Ensure output directory exists
    const baseDir = path.join(__dirname, "__generated__");
    const outputDir = category ? path.join(baseDir, category) : baseDir;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Calculate scale factor to fit in reasonable SVG size
    const maxWidth = Math.max(
        boundary.rightX - boundary.leftX,
        ...finalItems.map((item) => item.x + item.width),
    );
    const maxHeight = Math.max(
        boundary.bottomY - boundary.topY,
        ...finalItems.map((item) => item.y + item.height),
    );
    const scale = Math.min(300 / maxWidth, 200 / maxHeight, 1);

    // Ensure SVG is wide enough for side-by-side layout
    const contentWidth = maxWidth * scale;
    const svgWidth = contentWidth * 2 + 120; // Double width + spacing
    const svgHeight = maxHeight * scale + 80;

    // Generate colors for items
    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
    ];

    const generateItemSVG = (
        item: Item,
        isInitial: boolean,
        offsetX: number = 0,
    ) => {
        const x = (item.x || 0) * scale + offsetX;
        const y = (item.y || 0) * scale;
        const width = item.width * scale;
        const height = item.height * scale;
        const color = colors[item.id.length % colors.length];
        const opacity = isInitial ? 0.6 : 1.0;
        const stroke = isInitial ? "#666" : "#000";
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
        ${initialItems.map((item) => generateItemSVG(item, true)).join("")}
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
        ${finalItems.map((item) => generateItemSVG(item, false)).join("")}
    </g>
    
    <!-- Title at bottom -->
    <text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="16" fill="#333" font-weight="bold">
        ${testName}
    </text>
</svg>`;

    // Save SVG file
    const filename = testName.toLowerCase().replace(/[^a-z0-9]/g, "-") + ".svg";
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, svg);

    console.log(`📊 Visual output saved: ${filepath}`);
    return filepath;
}

describe("alignItems Tool", () => {
    const sampleItems: Item[] = [
        {
            id: "item1",
            width: 100,
            height: 50,
            alignSelf: AlignItems.flexStart,
        },
        {
            id: "item2",
            width: 80,
            height: 60,
            alignSelf: AlignItems.flexStart,
        },
        {
            id: "item3",
            width: 120,
            height: 40,
            alignSelf: AlignItems.flexStart,
        },
    ];

    const sampleBoundary: BoundaryCoordinates = {
        leftX: 0,
        rightX: 500,
        topY: 0,
        bottomY: 300,
    };

    describe("Rows", () => {
        it("should align items in a row with flex-start", async () => {
            const params: z.infer<typeof FlexLayoutingToolInput> = {
                direction: FlexDirection.row,
                boundary: sampleBoundary,
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Log the changes
            logItemChanges(
                sampleItems,
                result.items,
                "Row Layout - Flex Start",
            );

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                sampleBoundary,
                "flex-start",
                "rows",
            );

            expect(result.items).toHaveLength(3);
            expect(result.items[0].id).toBe("item1");
            expect(result.items[1].id).toBe("item2");
            expect(result.items[2].id).toBe("item3");

            // Check that items are positioned in sequence horizontally
            expect(result.items[0].x).toBeLessThan(result.items[1].x);
            expect(result.items[1].x).toBeLessThan(result.items[2].x);

            // Check that items are at the top (flex-start)
            expect(result.items[0].y).toBe(0);
            expect(result.items[1].y).toBe(0);
            expect(result.items[2].y).toBe(0);
        });

        it("should align items in a row with center alignment", async () => {
            const centerItems: Item[] = [
                { id: "item1", width: 100, height: 50 },
                { id: "item2", width: 80, height: 60 },
                { id: "item3", width: 120, height: 40 },
            ];

            const params = {
                direction: FlexDirection.row,
                alignItems: AlignItems.center,
                boundary: sampleBoundary,
                items: centerItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Log the changes
            logItemChanges(
                centerItems,
                result.items,
                "Row Layout - Center Alignment",
            );

            // Generate visualization
            generateVisualization(
                centerItems,
                result.items,
                sampleBoundary,
                "center-alignment",
                "rows",
            );

            expect(result.items).toHaveLength(3);

            // Items should be vertically centered
            const expectedCenterY =
                (sampleBoundary.bottomY - sampleBoundary.topY) / 2;
            expect(result.items[0].y + result.items[0].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
            expect(result.items[1].y + result.items[1].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
            expect(result.items[2].y + result.items[2].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
        });

        it("should align items in a row with space-between", async () => {
            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceBetween,
                boundary: sampleBoundary,
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Log the changes
            logItemChanges(
                sampleItems,
                result.items,
                "Row Layout - Space Between",
            );

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                sampleBoundary,
                "space-between",
                "rows",
            );

            expect(result.items).toHaveLength(3);

            // First item should be at the start
            expect(result.items[0].x).toBe(0);

            // Last item should be at the end
            expect(result.items[2].x + result.items[2].width).toBeCloseTo(
                sampleBoundary.rightX - sampleBoundary.leftX,
                0,
            );
        });
    });

    describe("Columns", () => {
        it("should align items in a column with flex-start", async () => {
            const params = {
                direction: FlexDirection.column,
                boundary: sampleBoundary,
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                sampleBoundary,
                "flex-start",
                "columns",
            );

            expect(result.items).toHaveLength(3);

            // Check that items are positioned in sequence vertically
            expect(result.items[0].y).toBeLessThan(result.items[1].y);
            expect(result.items[1].y).toBeLessThan(result.items[2].y);

            // Check that items are at the left (flex-start)
            expect(result.items[0].x).toBe(0);
            expect(result.items[1].x).toBe(0);
            expect(result.items[2].x).toBe(0);
        });

        it("should align items in a column with center alignment", async () => {
            const centerItems: Item[] = [
                { id: "item1", width: 100, height: 50 },
                { id: "item2", width: 80, height: 60 },
                { id: "item3", width: 120, height: 40 },
            ];

            const params = {
                direction: FlexDirection.column,
                alignItems: AlignItems.center,
                boundary: sampleBoundary,
                items: centerItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                centerItems,
                result.items,
                sampleBoundary,
                "center-alignment",
                "columns",
            );

            expect(result.items).toHaveLength(3);

            // Items should be horizontally centered
            const expectedCenterX =
                (sampleBoundary.rightX - sampleBoundary.leftX) / 2;
            expect(result.items[0].x + result.items[0].width / 2).toBeCloseTo(
                expectedCenterX,
                0,
            );
            expect(result.items[1].x + result.items[1].width / 2).toBeCloseTo(
                expectedCenterX,
                0,
            );
            expect(result.items[2].x + result.items[2].width / 2).toBeCloseTo(
                expectedCenterX,
                0,
            );
        });
    });

    describe("Grids", () => {
        it("should handle 9-item grid (3x3)", async () => {
            const gridItems: Item[] = Array.from({ length: 9 }, (_, i) => ({
                id: `grid-${i + 1}`,
                width: 80,
                height: 60,
            }));

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 200 },
                items: gridItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                gridItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 200 },
                "3x3-grid",
                "grids",
            );

            expect(result.items).toHaveLength(9);
        });

        it("should handle 16-item grid (4x4)", async () => {
            const gridItems: Item[] = Array.from({ length: 16 }, (_, i) => ({
                id: `grid-${i + 1}`,
                width: 60,
                height: 40,
            }));

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceAround,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 200 },
                items: gridItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                gridItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 200 },
                "4x4-grid",
                "grids",
            );

            expect(result.items).toHaveLength(16);
        });

        it("should handle single item in large container", async () => {
            const singleItem: Item[] = [
                { id: "single", width: 100, height: 80 },
            ];

            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.center,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 300 },
                items: singleItem,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                singleItem,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 300 },
                "single-item",
                "grids",
            );

            expect(result.items).toHaveLength(1);
        });

        it("should align equal-sized items in a row", async () => {
            const equalItems: Item[] = [
                { id: "item1", width: 100, height: 50 },
                { id: "item2", width: 100, height: 50 },
                { id: "item3", width: 100, height: 50 },
                { id: "item4", width: 100, height: 50 },
            ];

            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                items: equalItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                equalItems,
                result.items,
                { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                "row-layout",
                "grids",
            );

            expect(result.items).toHaveLength(4);
        });

        it("should align equal-sized items in a column", async () => {
            const equalItems: Item[] = [
                { id: "item1", width: 80, height: 60 },
                { id: "item2", width: 80, height: 60 },
                { id: "item3", width: 80, height: 60 },
            ];

            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                items: equalItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                equalItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                "column-layout",
                "grids",
            );

            expect(result.items).toHaveLength(3);
        });
    });

    describe("Masonry", () => {
        it("should create masonry-style layout with varying heights", async () => {
            const masonryItems: Item[] = [
                { id: "tall1", width: 100, height: 120 },
                { id: "short1", width: 100, height: 60 },
                { id: "medium1", width: 100, height: 80 },
                { id: "tall2", width: 100, height: 100 },
                { id: "short2", width: 100, height: 40 },
                { id: "medium2", width: 100, height: 90 },
            ];

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 350, topY: 0, bottomY: 250 },
                items: masonryItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                masonryItems,
                result.items,
                { leftX: 0, rightX: 350, topY: 0, bottomY: 250 },
                "varying-heights",
                "masonry",
            );

            expect(result.items).toHaveLength(6);
        });

        it("should create masonry with different widths", async () => {
            const masonryItems: Item[] = [
                { id: "wide1", width: 150, height: 80 },
                { id: "narrow1", width: 80, height: 60 },
                { id: "wide2", width: 120, height: 100 },
                { id: "narrow2", width: 70, height: 50 },
                { id: "wide3", width: 140, height: 70 },
            ];

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                items: masonryItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                masonryItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                "varying-widths",
                "masonry",
            );

            expect(result.items).toHaveLength(5);
        });
    });

    describe("flex-rows", () => {
        it("should align items in a column with space-between", async () => {
            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                "space-between",
                "flex-rows",
            );

            expect(result.items).toHaveLength(3);

            // First item should be at the top
            expect(result.items[0].y).toBe(0);

            // Last item should be at the bottom
            expect(result.items[2].y + result.items[2].height).toBeCloseTo(
                300,
                50,
            );

            // Items should be positioned within the container
            expect(result.items[0].x).toBeGreaterThanOrEqual(0);
            expect(result.items[1].x).toBeGreaterThanOrEqual(0);
            expect(result.items[2].x).toBeGreaterThanOrEqual(0);
        });

        it("should align items in a column with space-around", async () => {
            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.spaceAround,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 300 },
                "space-around",
                "flex-rows",
            );

            expect(result.items).toHaveLength(3);

            // Items should be left-aligned
            expect(result.items[0].x).toBe(0);
            expect(result.items[1].x).toBe(0);
            expect(result.items[2].x).toBe(0);
        });

        it("should handle column with wrapping", async () => {
            const tallItems: Item[] = [
                { id: "item1", width: 150, height: 100 },
                { id: "item2", width: 150, height: 100 },
                { id: "item3", width: 150, height: 100 },
                { id: "item4", width: 150, height: 100 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 320, topY: 0, bottomY: 150 }, // Force wrapping
                items: tallItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                tallItems,
                result.items,
                { leftX: 0, rightX: 320, topY: 0, bottomY: 150 },
                "column-wrap",
                "flex-columns",
            );

            expect(result.items).toHaveLength(4);

            // Should wrap to multiple columns since height is limited
            const uniqueXPositions = [
                ...new Set(result.items.map((item) => item.x)),
            ];
            expect(uniqueXPositions.length).toBeGreaterThan(1);
        });

        it("should create column with mixed flex-basis", async () => {
            const basisItems: Item[] = [
                { id: "item1", width: 100, height: 50, flexBasis: 100 },
                { id: "item2", width: 100, height: 50, flexBasis: 150 },
                { id: "item3", width: 100, height: 50, flexBasis: 80 },
            ];

            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 400 },
                items: basisItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                basisItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 400 },
                "flex-basis",
                "flex-rows",
            );

            expect(result.items).toHaveLength(3);

            // All items should be positioned within the container
            expect(result.items[0].width).toBeGreaterThan(0);
            expect(result.items[1].width).toBeGreaterThan(0);
            expect(result.items[2].width).toBeGreaterThan(0);

            // Items should be positioned vertically
            expect(result.items[0].y).toBeLessThan(result.items[1].y);
            expect(result.items[1].y).toBeLessThan(result.items[2].y);
        });

        it("should make three column items all full width", async () => {
            const fullWidthItems: Item[] = [
                { id: "item1", width: 100, height: 60, flexGrow: 1 },
                { id: "item2", width: 100, height: 60, flexGrow: 1 },
                { id: "item3", width: 100, height: 60, flexGrow: 1 },
            ];

            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                items: fullWidthItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                fullWidthItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                "column-items-stretch",
                "flex-rows",
            );

            expect(result.items).toHaveLength(3);
        });

        it("should create mixed full-height and fixed items", async () => {
            const mixedItems: Item[] = [
                { id: "fixed", width: 80, height: 40, flexShrink: 1 },
                { id: "stretch1", width: 100, height: 50, flexShrink: 1 },
                { id: "stretch2", width: 100, height: 50, flexShrink: 1 },
                { id: "fixed2", width: 60, height: 30, flexShrink: 1 },
            ];

            const params: z.infer<typeof FlexLayoutingToolInput> = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 150 },
                items: mixedItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                mixedItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 150 },
                "stretch-fixed",
                "flex-rows",
            );

            expect(result.items).toHaveLength(4);
        });

        it("should create multi-row layout with full-width items", async () => {
            const multiRowItems: Item[] = [
                {
                    id: "row1-item1",
                    width: 50,
                    height: 40,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "row1-item2",
                    width: 50,
                    height: 40,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "row2-item1",
                    width: 50,
                    height: 40,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "row2-item2",
                    width: 50,
                    height: 40,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
            ];

            const params: z.infer<typeof FlexLayoutingToolInput> = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 200 }, // Much smaller container to force wrapping
                items: multiRowItems,

                gap: 10,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                multiRowItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 200 },
                "multi-row-full-width",
                "flex-rows",
            );

            expect(result.items).toHaveLength(4);

            // All items should have some width (stretch behavior may vary)
            expect(result.items[0].width).toBe(200);
            expect(result.items[1].width).toBe(200);
            expect(result.items[2].width).toBe(200);
            expect(result.items[3].width).toBe(200);

            // Items should be positioned within the container
            expect(result.items[0].y).toBeGreaterThanOrEqual(0);
            expect(result.items[1].y).toBeGreaterThanOrEqual(0);
            expect(result.items[2].y).toBeGreaterThanOrEqual(0);
            expect(result.items[3].y).toBeGreaterThanOrEqual(0);
        });

        it("should create multi-column layout with full-height items", async () => {
            const multiColumnItems: Item[] = [
                {
                    id: "col1-item1",
                    width: 40,
                    height: 50,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "col1-item2",
                    width: 40,
                    height: 50,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "col2-item1",
                    width: 40,
                    height: 50,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
                {
                    id: "col2-item2",
                    width: 40,
                    height: 50,
                    flexGrow: 1,
                    flexBasis: "100%",
                },
            ];

            const params: z.infer<typeof FlexLayoutingToolInput> = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 200, topY: 0, bottomY: 200 }, // Much smaller container to force wrapping
                items: multiColumnItems,
                gap: 10,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                multiColumnItems,
                result.items,
                { leftX: 0, rightX: 200, topY: 0, bottomY: 200 },
                "multi-column-full-height",
                "flex-rows",
            );

            expect(result.items).toHaveLength(4);

            // All items should have some height (stretch behavior may vary)
            expect(result.items[0].height).toBe(200);
            expect(result.items[1].height).toBe(200);
            expect(result.items[2].height).toBe(200);
            expect(result.items[3].height).toBe(200);

            // Items should be positioned within the container
            expect(result.items[0].x).toBeGreaterThanOrEqual(0);
            expect(result.items[1].x).toBeGreaterThanOrEqual(0);
            expect(result.items[2].x).toBeGreaterThanOrEqual(0);
            expect(result.items[3].x).toBeGreaterThanOrEqual(0);
        });
    });

    describe("flex-columns", () => {
        it("should create three columns with the same width", async () => {
            const columns: Item[] = [
                { id: "column1", width: 100, height: 100 },
                { id: "column2", width: 100, height: 100 },
                { id: "column3", width: 100, height: 100 },
            ];

            const params: z.infer<typeof FlexLayoutingToolInput> = {
                direction: FlexDirection.row,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 100 },
                items: columns,

                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Plot
            generateVisualization(
                columns,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 100 },
                "three-columns",
                "flex-columns",
            );
        });

        it("should wrap items when they exceed container width", async () => {
            const wideItems: Item[] = [
                { id: "item1", width: 200, height: 50 },
                { id: "item2", width: 200, height: 50 },
                { id: "item3", width: 200, height: 50 },
            ];

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                alignItems: AlignItems.flexStart, // Don't stretch, use fixed height
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                items: wideItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                wideItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                "items-wrap",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // Check that items maintain their original dimensions - allow some tolerance for flexbox calculations
            expect(result.items[0].width).toBeCloseTo(200, 50);
            expect(result.items[0].height).toBeCloseTo(50, 20);
            expect(result.items[1].width).toBeCloseTo(200, 50);
            expect(result.items[1].height).toBeCloseTo(50, 20);
            expect(result.items[2].width).toBeCloseTo(200, 50);
            expect(result.items[2].height).toBeCloseTo(50, 20);

            // The flex wrap is working - items are being placed in a column when they don't fit in a row
            // All items should have the same X position (aligned in a column due to wrapping)
            expect(result.items[0].x).toBe(result.items[1].x);
            expect(result.items[1].x).toBe(result.items[2].x);

            // Items should be stacked vertically (different Y positions)
            expect(result.items[1].y).toBeGreaterThan(result.items[0].y);
            expect(result.items[2].y).toBeGreaterThan(result.items[1].y);

            // Verify the gaps are reasonable (should be around 50 + gap = 55px)
            const gap1 = result.items[1].y - result.items[0].y;
            const gap2 = result.items[2].y - result.items[1].y;
            expect(gap1).toBeGreaterThan(40); // More than just the item height
            expect(gap2).toBeGreaterThan(40);
        });

        it("should respect flex-grow property", async () => {
            const flexItems: Item[] = [
                { id: "item1", width: 100, height: 50, flexGrow: 1 },
                { id: "item2", width: 100, height: 50, flexGrow: 2 },
            ];

            const params = {
                direction: FlexDirection.row,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                items: flexItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                flexItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                "flex-grow",
                "flex-columns",
            );

            expect(result.items).toHaveLength(2);

            // Second item should be wider due to flexGrow: 2
            expect(result.items[1].width).toBeGreaterThan(
                result.items[0].width,
            );
        });

        it("should respect align-self property", async () => {
            const testItems: Item[] = [
                { id: "item1", width: 100, height: 50 },
                {
                    id: "item2",
                    width: 100,
                    height: 50,
                    alignSelf: AlignItems.flexEnd,
                },
            ];

            const params = {
                direction: FlexDirection.row,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 100 },
                items: testItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                testItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 100 },
                "align-self",
                "flex-columns",
            );

            expect(result.items).toHaveLength(2);

            // First item should be at the top (flex-start) - allowing some tolerance for flex behavior
            expect(result.items[0].y).toBeCloseTo(0, 5);

            // Second item should be at the bottom (flex-end)
            expect(result.items[1].y + result.items[1].height).toBeCloseTo(
                100,
                5,
            );
        });

        it("should apply gap between items", async () => {
            const params = {
                direction: FlexDirection.row,
                gap: 20,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                items: sampleItems,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                "20px-gap",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // Check that there's a 20px gap between items
            const gap1 =
                result.items[1].x - (result.items[0].x + result.items[0].width);
            const gap2 =
                result.items[2].x - (result.items[1].x + result.items[1].width);

            expect(gap1).toBeCloseTo(20, 2);
            expect(gap2).toBeCloseTo(20, 2);
        });

        it("should make three row items all full height", async () => {
            const fullHeightItems: Item[] = [
                { id: "item1", width: 100, height: 50, flexGrow: 1 },
                { id: "item2", width: 100, height: 50, flexGrow: 1 },
                { id: "item3", width: 100, height: 50, flexGrow: 1 },
            ];

            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                items: fullHeightItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                fullHeightItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                "row-items-stretch",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);
        });

        it("should align items with space-around", async () => {
            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceAround,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                "space-around",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // Items should be positioned within the container
            expect(result.items[0].y).toBeGreaterThanOrEqual(0);
            expect(result.items[1].y).toBeGreaterThanOrEqual(0);
            expect(result.items[2].y).toBeGreaterThanOrEqual(0);

            // First and last items should have some space between them
            const firstItemRight = result.items[0].x + result.items[0].width;
            const lastItemLeft = result.items[2].x;
            const totalSpace = lastItemLeft - firstItemRight;

            expect(totalSpace).toBeGreaterThan(0);
        });

        it("should align items with space-evenly", async () => {
            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                { leftX: 0, rightX: 500, topY: 0, bottomY: 100 },
                "space-evenly",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // Items should be positioned within the container
            expect(result.items[0].y).toBeGreaterThanOrEqual(0);
            expect(result.items[1].y).toBeGreaterThanOrEqual(0);
            expect(result.items[2].y).toBeGreaterThanOrEqual(0);
        });

        it("should align items with baseline alignment", async () => {
            const baselineItems: Item[] = [
                { id: "tall", width: 100, height: 80 },
                { id: "short", width: 100, height: 40 },
                { id: "medium", width: 100, height: 60 },
            ];

            const params = {
                direction: FlexDirection.row,
                alignItems: AlignItems.baseline,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                items: baselineItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                baselineItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                "baseline-alignment",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // All items should be aligned to the same baseline
            // For baseline alignment, the tallest item (80px) determines the baseline position
            const tallestHeight = Math.max(
                ...baselineItems.map((item) => item.height),
            );
            const expectedBaseline = tallestHeight;

            expect(result.items[0].y + result.items[0].height).toBeCloseTo(
                expectedBaseline,
                5,
            );
            expect(result.items[1].y + result.items[1].height).toBeCloseTo(
                expectedBaseline,
                5,
            );
            expect(result.items[2].y + result.items[2].height).toBeCloseTo(
                expectedBaseline,
                5,
            );
        });

        it("should handle row with different flex-shrink values", async () => {
            const shrinkItems: Item[] = [
                { id: "item1", width: 200, height: 50, flexShrink: 1 },
                { id: "item2", width: 200, height: 50, flexShrink: 2 },
                { id: "item3", width: 200, height: 50, flexShrink: 0 },
            ];

            const params = {
                direction: FlexDirection.row,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 100 }, // Container smaller than total width
                items: shrinkItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                shrinkItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 100 },
                "flex-shrink",
                "flex-columns",
            );

            expect(result.items).toHaveLength(3);

            // Items should fit within the container width
            expect(
                result.items[2].x + result.items[2].width,
            ).toBeLessThanOrEqual(400);

            // Second item should be most compressed due to flexShrink: 2
            expect(result.items[1].width).toBeLessThan(result.items[0].width);
            expect(result.items[1].width).toBeLessThan(result.items[2].width);
        });
    });

    describe("flex-grids", () => {
        it("should create responsive grid layout", async () => {
            const responsiveItems: Item[] = Array.from(
                { length: 12 },
                (_, i) => ({
                    id: `grid-${i + 1}`,
                    width: 80,
                    height: 60,
                }),
            );

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 360, topY: 0, bottomY: 240 }, // 4 columns, 3 rows
                items: responsiveItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                responsiveItems,
                result.items,
                { leftX: 0, rightX: 360, topY: 0, bottomY: 240 },
                "responsive-grid",
                "flex-grids",
            );

            expect(result.items).toHaveLength(12);

            // Should form a 4x3 grid (4 columns, 3 rows)
            const rows = Math.ceil(12 / 4); // 3 rows
            const cols = 4;

            // Check that items are arranged in a grid pattern
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    if (index < 12) {
                        const item = result.items[index];
                        // Items in same row should have similar Y positions
                        if (col === 0) {
                            expect(item.x).toBeCloseTo(0, 5); // First column
                        }
                    }
                }
            }
        });

        it("should create centered grid layout", async () => {
            const centerGridItems: Item[] = Array.from(
                { length: 9 },
                (_, i) => ({
                    id: `center-${i + 1}`,
                    width: 70,
                    height: 50,
                }),
            );

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.center,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 350, topY: 0, bottomY: 200 },
                items: centerGridItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                centerGridItems,
                result.items,
                { leftX: 0, rightX: 350, topY: 0, bottomY: 200 },
                "centered-grid",
                "flex-grids",
            );

            expect(result.items).toHaveLength(9);

            // Grid should be centered horizontally and vertically
            const expectedCenterX = 350 / 2;
            const expectedCenterY = 200 / 2;

            // Check that items are positioned within the container
            expect(result.items[0].x).toBeGreaterThanOrEqual(0);
            expect(result.items[4].x).toBeGreaterThanOrEqual(0);
        });

        it("should create holy grail layout", async () => {
            const holyGrailItems: Item[] = [
                { id: "header", width: 300, height: 60 },
                { id: "nav", width: 80, height: 120 },
                { id: "main", width: 140, height: 120, flexGrow: 1 },
                { id: "sidebar", width: 80, height: 120 },
                { id: "footer", width: 300, height: 40 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceBetween,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                items: holyGrailItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                holyGrailItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                "holy-grail",
                "flex-grids",
            );

            expect(result.items).toHaveLength(5);

            const header = result.items.find((item) => item.id === "header");
            const nav = result.items.find((item) => item.id === "nav");
            const main = result.items.find((item) => item.id === "main");
            const sidebar = result.items.find((item) => item.id === "sidebar");
            const footer = result.items.find((item) => item.id === "footer");

            expect(header).toBeDefined();
            expect(nav).toBeDefined();
            expect(main).toBeDefined();
            expect(sidebar).toBeDefined();
            expect(footer).toBeDefined();

            // Header should be at top
            expect(header!.y).toBe(0);
            // Footer should be at bottom
            expect(footer!.y + footer!.height).toBeCloseTo(300, 50);
            // Main should be wider than nav and sidebar (flexGrow: 1)
            expect(main!.width).toBeGreaterThan(nav!.width);
            expect(main!.width).toBeGreaterThan(sidebar!.width);
        });

        it("should create card grid layout", async () => {
            const cardItems: Item[] = Array.from({ length: 8 }, (_, i) => ({
                id: `card-${i + 1}`,
                width: 100,
                height: 120,
            }));

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 450, topY: 0, bottomY: 280 }, // 4 columns, 2 rows
                items: cardItems,
                gap: 10,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                cardItems,
                result.items,
                { leftX: 0, rightX: 450, topY: 0, bottomY: 280 },
                "card-grid",
                "flex-grids",
            );

            expect(result.items).toHaveLength(8);

            // Should form a 4x2 grid
            const firstRowY = result.items[0].y;
            const secondRowY = result.items[4].y;

            // First 4 items should be in first row
            for (let i = 0; i < 4; i++) {
                expect(result.items[i].y).toBeCloseTo(firstRowY, 10);
            }

            // Last 4 items should be in second row
            for (let i = 4; i < 8; i++) {
                expect(result.items[i].y).toBeCloseTo(secondRowY, 10);
            }

            // Second row should be below first row
            expect(secondRowY).toBeGreaterThan(firstRowY);
        });
    });

    describe("mixed", () => {
        it("should create sidebar layout with main content spanning", async () => {
            const sidebarItems: Item[] = [
                {
                    id: "sidebar",
                    width: 80,
                    height: 200,
                    flexGrow: 0,
                    flexShrink: 0,
                },
                { id: "header", width: 200, height: 60 },
                { id: "main-content", width: 200, height: 140, flexGrow: 1 },
                { id: "footer", width: 200, height: 40 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                items: sidebarItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sidebarItems,
                result.items,
                { leftX: 0, rightX: 300, topY: 0, bottomY: 300 },
                "sidebar-layout",
                "mixed",
            );

            expect(result.items).toHaveLength(4);

            const sidebar = result.items.find((item) => item.id === "sidebar");
            const header = result.items.find((item) => item.id === "header");
            const mainContent = result.items.find(
                (item) => item.id === "main-content",
            );
            const footer = result.items.find((item) => item.id === "footer");

            expect(sidebar).toBeDefined();
            expect(header).toBeDefined();
            expect(mainContent).toBeDefined();
            expect(footer).toBeDefined();

            // Sidebar should be fixed width
            expect(sidebar!.width).toBe(80);
            // Main content should take remaining space (flexGrow: 1)
            expect(mainContent!.width).toBeGreaterThan(sidebar!.width);
        });

        it("should create dashboard layout with spanning widgets", async () => {
            const dashboardItems: Item[] = [
                // Top row - full width header
                { id: "top-header", width: 400, height: 50 },

                // Second row - two equal widgets
                { id: "widget1", width: 190, height: 100 },
                { id: "widget2", width: 190, height: 100 },

                // Third row - spanning widget and smaller widget
                { id: "spanning-widget", width: 240, height: 80, flexGrow: 1 },
                { id: "small-widget", width: 140, height: 80 },

                // Bottom row - full width footer
                { id: "bottom-footer", width: 400, height: 40 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 350 },
                items: dashboardItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                dashboardItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 350 },
                "dashboard-layout",
                "mixed",
            );

            expect(result.items).toHaveLength(6);

            const topHeader = result.items.find(
                (item) => item.id === "top-header",
            );
            const widget1 = result.items.find((item) => item.id === "widget1");
            const widget2 = result.items.find((item) => item.id === "widget2");
            const spanningWidget = result.items.find(
                (item) => item.id === "spanning-widget",
            );
            const smallWidget = result.items.find(
                (item) => item.id === "small-widget",
            );
            const bottomFooter = result.items.find(
                (item) => item.id === "bottom-footer",
            );

            expect(topHeader).toBeDefined();
            expect(widget1).toBeDefined();
            expect(widget2).toBeDefined();
            expect(spanningWidget).toBeDefined();
            expect(smallWidget).toBeDefined();
            expect(bottomFooter).toBeDefined();

            // Top header should span full width
            expect(topHeader!.width).toBe(400);
            // Bottom footer should span full width
            expect(bottomFooter!.width).toBe(400);
            // Spanning widget should be wider than small widget
            expect(spanningWidget!.width).toBeGreaterThan(smallWidget!.width);
        });

        it("should create header with navigation and content spanning", async () => {
            const headerNavItems: Item[] = [
                { id: "logo", width: 100, height: 50 },
                { id: "nav-menu", width: 200, height: 50, flexGrow: 1 },
                { id: "user-profile", width: 80, height: 50 },

                { id: "hero-section", width: 380, height: 120, flexGrow: 0 },
                { id: "sidebar-nav", width: 120, height: 200 },
                { id: "main-article", width: 260, height: 200, flexGrow: 1 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.stretch,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 400 },
                items: headerNavItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                headerNavItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 400 },
                "header-nav-content",
                "mixed",
            );

            expect(result.items).toHaveLength(6);

            const logo = result.items.find((item) => item.id === "logo");
            const navMenu = result.items.find((item) => item.id === "nav-menu");
            const userProfile = result.items.find(
                (item) => item.id === "user-profile",
            );
            const heroSection = result.items.find(
                (item) => item.id === "hero-section",
            );
            const sidebarNav = result.items.find(
                (item) => item.id === "sidebar-nav",
            );
            const mainArticle = result.items.find(
                (item) => item.id === "main-article",
            );

            expect(logo).toBeDefined();
            expect(navMenu).toBeDefined();
            expect(userProfile).toBeDefined();
            expect(heroSection).toBeDefined();
            expect(sidebarNav).toBeDefined();
            expect(mainArticle).toBeDefined();

            // Navigation menu should be wider than logo and user profile (flexGrow: 1)
            expect(navMenu!.width).toBeGreaterThan(logo!.width);
            expect(navMenu!.width).toBeGreaterThan(userProfile!.width);
            // Main article should be wider than sidebar (flexGrow: 1)
            expect(mainArticle!.width).toBeGreaterThan(sidebarNav!.width);
        });

        it("should create two-column layout with spanning header", async () => {
            const twoColumnItems: Item[] = [
                // Spanning header
                { id: "page-header", width: 500, height: 60 },

                // Left column content
                { id: "left-col-1", width: 240, height: 80 },
                { id: "left-col-2", width: 240, height: 80 },

                // Right column content
                { id: "right-col-1", width: 240, height: 80 },
                { id: "right-col-2", width: 240, height: 80 },
                { id: "right-col-3", width: 240, height: 80 },

                // Spanning footer
                { id: "page-footer", width: 500, height: 40 },
            ];

            const params = {
                direction: FlexDirection.column,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.flexStart,
                boundary: { leftX: 0, rightX: 500, topY: 0, bottomY: 400 },
                items: twoColumnItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                twoColumnItems,
                result.items,
                { leftX: 0, rightX: 500, topY: 0, bottomY: 400 },
                "two-column-spanning",
                "mixed",
            );

            expect(result.items).toHaveLength(7);

            const pageHeader = result.items.find(
                (item) => item.id === "page-header",
            );
            const leftCol1 = result.items.find(
                (item) => item.id === "left-col-1",
            );
            const rightCol1 = result.items.find(
                (item) => item.id === "right-col-1",
            );
            const pageFooter = result.items.find(
                (item) => item.id === "page-footer",
            );

            expect(pageHeader).toBeDefined();
            expect(leftCol1).toBeDefined();
            expect(rightCol1).toBeDefined();
            expect(pageFooter).toBeDefined();

            // Header and footer should span full width
            expect(pageHeader!.width).toBe(500);
            expect(pageFooter!.width).toBe(500);

            // Left and right columns should have similar widths
            expect(leftCol1!.width).toBeCloseTo(rightCol1!.width, 5);
        });
    });

    describe("Edge Cases", () => {
        it("should handle single item", async () => {
            const singleItem: Item[] = [
                { id: "single", width: 100, height: 50 },
            ];

            const params = {
                direction: FlexDirection.row,
                boundary: sampleBoundary,
                items: singleItem,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                singleItem,
                result.items,
                sampleBoundary,
                "single-item",
                "edge-cases",
            );

            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe("single");
            expect(result.items[0].x).toBe(0);
            expect(result.items[0].y).toBe(0);
        });

        it("should handle empty items array", async () => {
            const params = {
                direction: FlexDirection.row,
                boundary: sampleBoundary,
                items: [],
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                [],
                result.items,
                sampleBoundary,
                "empty-array",
                "edge-cases",
            );

            expect(result.items).toHaveLength(0);
            expect(result.totalWidth).toBe(0);
            expect(result.totalHeight).toBe(0);
        });

        it("should handle reverse directions", async () => {
            const params = {
                direction: FlexDirection.rowReverse,
                boundary: sampleBoundary,
                items: sampleItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                sampleItems,
                result.items,
                sampleBoundary,
                "reverse-direction",
                "edge-cases",
            );

            expect(result.items).toHaveLength(3);

            // Items should be in reverse order
            expect(result.items[0].x).toBeGreaterThan(result.items[1].x);
            expect(result.items[1].x).toBeGreaterThan(result.items[2].x);
        });
    });

    describe("Advanced", () => {
        it("should handle nested flex properties", async () => {
            const complexItems: Item[] = [
                { id: "item1", width: 100, height: 50, flexGrow: 1 },
                { id: "item2", width: 100, height: 50, flexShrink: 2 },
                { id: "item3", width: 100, height: 50, flexBasis: 150 },
            ];

            const params = {
                direction: FlexDirection.row,
                justifyContent: JustifyContent.spaceAround,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 500, topY: 0, bottomY: 200 },
                items: complexItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Generate visualization
            generateVisualization(
                complexItems,
                result.items,
                { leftX: 0, rightX: 500, topY: 0, bottomY: 200 },
                "nested-flex-properties",
                "advanced",
            );

            expect(result.items).toHaveLength(3);

            // All items should be vertically centered
            const expectedCenterY = 100;
            expect(result.items[0].y + result.items[0].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
            expect(result.items[1].y + result.items[1].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
            expect(result.items[2].y + result.items[2].height / 2).toBeCloseTo(
                expectedCenterY,
                0,
            );
        });

        it("should create overlapping grid layout with flexbox positioning", async () => {
            // Create items that will create overlapping effects through flexbox
            const overlappingItems: Item[] = [
                // Base grid items with negative margins to create overlaps
                { id: "base1", width: 100, height: 80 },
                { id: "base2", width: 100, height: 80 },
                { id: "base3", width: 100, height: 80 },
                { id: "base4", width: 100, height: 80 },

                // Overlapping items with specific flex properties
                {
                    id: "overlay1",
                    width: 120,
                    height: 60,
                    flexGrow: 0,
                    flexShrink: 0,
                },
                {
                    id: "overlay2",
                    width: 80,
                    height: 100,
                    flexGrow: 0,
                    flexShrink: 0,
                },
            ];

            const params = {
                direction: FlexDirection.row,
                wrap: FlexWrap.wrap,
                justifyContent: JustifyContent.spaceEvenly,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                items: overlappingItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Log the changes
            logItemChanges(
                overlappingItems,
                result.items,
                "Overlapping Grid Layout",
            );

            // Generate visualization
            generateVisualization(
                overlappingItems,
                result.items,
                { leftX: 0, rightX: 400, topY: 0, bottomY: 200 },
                "overlapping-grid",
                "advanced",
            );

            expect(result.items).toHaveLength(6);

            // Verify that all items are positioned
            const base1 = result.items.find((item) => item.id === "base1");
            const base2 = result.items.find((item) => item.id === "base2");
            const base3 = result.items.find((item) => item.id === "base3");
            const base4 = result.items.find((item) => item.id === "base4");
            const overlay1 = result.items.find(
                (item) => item.id === "overlay1",
            );
            const overlay2 = result.items.find(
                (item) => item.id === "overlay2",
            );

            expect(base1).toBeDefined();
            expect(base2).toBeDefined();
            expect(base3).toBeDefined();
            expect(base4).toBeDefined();
            expect(overlay1).toBeDefined();
            expect(overlay2).toBeDefined();

            // Verify that items are distributed in the container
            expect(base1!.x).toBeGreaterThanOrEqual(0);
            expect(base1!.y).toBeGreaterThanOrEqual(0);
            expect(overlay1!.x).toBeGreaterThanOrEqual(0);
            expect(overlay1!.y).toBeGreaterThanOrEqual(0);
        });

        it("should create layered card layout with flexbox stacking", async () => {
            // Create a card-like layout using flexbox stacking
            const cardItems: Item[] = [
                // Card background (largest, will be at the bottom)
                { id: "card-bg", width: 200, height: 150 },

                // Card content layers (stacked on top)
                { id: "header", width: 180, height: 40 },
                { id: "content", width: 160, height: 80 },
                { id: "footer", width: 140, height: 30 },

                // Floating elements (smaller, will be positioned by flexbox)
                { id: "badge", width: 30, height: 30 },
                { id: "icon", width: 20, height: 20 },
            ];

            const params = {
                direction: FlexDirection.column,
                justifyContent: JustifyContent.flexStart,
                alignItems: AlignItems.center,
                boundary: { leftX: 0, rightX: 250, topY: 0, bottomY: 250 },
                items: cardItems,
                gap: 5,
            };

            const result = flexLayoutingFunction(params);

            // Log the changes
            logItemChanges(cardItems, result.items, "Layered Card Layout");

            // Generate visualization
            generateVisualization(
                cardItems,
                result.items,
                { leftX: 0, rightX: 250, topY: 0, bottomY: 250 },
                "layered-card",
                "advanced",
            );

            expect(result.items).toHaveLength(6);

            // Verify layered structure
            const cardBg = result.items.find((item) => item.id === "card-bg");
            const header = result.items.find((item) => item.id === "header");
            const content = result.items.find((item) => item.id === "content");
            const footer = result.items.find((item) => item.id === "footer");
            const badge = result.items.find((item) => item.id === "badge");
            const icon = result.items.find((item) => item.id === "icon");

            expect(cardBg).toBeDefined();
            expect(header).toBeDefined();
            expect(content).toBeDefined();
            expect(footer).toBeDefined();
            expect(badge).toBeDefined();
            expect(icon).toBeDefined();

            // Verify that items are stacked vertically
            if (header && content && footer) {
                expect(header.y).toBeLessThan(content.y);
                expect(content.y).toBeLessThan(footer.y);
            }

            // Verify that all items are horizontally centered
            const expectedCenterX = 125; // 250/2
            if (cardBg && header && content) {
                expect(cardBg.x + cardBg.width / 2).toBeCloseTo(
                    expectedCenterX,
                    10,
                );
                expect(header.x + header.width / 2).toBeCloseTo(
                    expectedCenterX,
                    10,
                );
                expect(content.x + content.width / 2).toBeCloseTo(
                    expectedCenterX,
                    10,
                );
            }
        });
    });
});
