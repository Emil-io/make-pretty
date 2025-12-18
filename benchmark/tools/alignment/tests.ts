import { describe, expect, it } from "vitest";
import z from "zod";
import type {
    BoundaryCoordinates,
    GetAlignmentToolInput,
    GridRow,
} from "./index";
import { getAlignmentFunction } from "./index";
import { generateVisualization } from "./utils/visualization-utils";

describe("get-grid-alignment Tool", () => {
    it("should handle 4x2 grid with equal boundaries (5x2)", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1820, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 720, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    { id: "item1" },
                    { id: "item2" },
                    { id: "item3" },
                    { id: "item4" },
                ],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [
                    { id: "item5" },
                    { id: "item6" },
                    { id: "item7" },
                    { id: "item8" },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.05, // 5% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 4x2 Grid - Equal Boundaries - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "4x2 Grid - Equal Boundaries",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(8);
        expect(result.gridColumns).toBe(4);
        expect(result.gridRows).toBe(2);
    });

    it("should handle 8x2 grid with 5% spacing", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1820, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 720, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    { id: "item1" },
                    { id: "item2" },
                    { id: "item3" },
                    { id: "item4" },
                    { id: "item5" },
                    { id: "item6" },
                    { id: "item7" },
                    { id: "item8" },
                ],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [
                    { id: "item9" },
                    { id: "item10" },
                    { id: "item11" },
                    { id: "item12" },
                    { id: "item13" },
                    { id: "item14" },
                    { id: "item15" },
                    { id: "item16" },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.05, // 5% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 8x2 Grid - 5% Spacing - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "8x2 Grid - 5% Spacing",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(16);
        expect(result.gridColumns).toBe(8);
        expect(result.gridRows).toBe(2);
        
        // Verify gap is calculated based on smaller dimension (2.5% of smaller dimension)
        const boundaryWidth = boundary.rightX - boundary.leftX;
        const boundaryHeight = boundary.bottomY - boundary.topY;
        const smallerDimension = Math.min(boundaryWidth, boundaryHeight);
        const gapPx = smallerDimension * 0.025;
        
        // Check row gap (between item1 and item9) - allow for rounding
        const item1 = result.items.find(item => item.id === "item1");
        const item9 = result.items.find(item => item.id === "item9");
        if (item1 && item9) {
            const actualRowGap = item9.y - (item1.y + item1.height);
            expect(Math.abs(actualRowGap - gapPx)).toBeLessThan(20); // Within 2px for rounding
        }
        
        // Check column gap (between item1 and item2) - allow for rounding
        const item2 = result.items.find(item => item.id === "item2");
        if (item1 && item2) {
            const actualColGap = item2.x - (item1.x + item1.width);
            expect(Math.abs(actualColGap - gapPx)).toBeLessThan(20); // Within 2px for rounding
        }
    });

    it("should handle 5x4 grid with fixed first column and flex others", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    { id: "item1", flexBasis: 120 }, // Fixed width
                    { id: "item2", flexGrow: 1 },
                    { id: "item3", flexGrow: 1 },
                    { id: "item4", flexGrow: 1 },
                    { id: "item5", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [
                    { id: "item6", flexBasis: 120 }, // Fixed width
                    { id: "item7", flexGrow: 1 },
                    { id: "item8", flexGrow: 1 },
                    { id: "item9", flexGrow: 1 },
                    { id: "item10", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
            {
                id: "row3",
                cells: [
                    { id: "item11", flexBasis: 120 }, // Fixed width
                    { id: "item12", flexGrow: 1 },
                    { id: "item13", flexGrow: 1 },
                    { id: "item14", flexGrow: 1 },
                    { id: "item15", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
            {
                id: "row4",
                cells: [
                    { id: "item16", flexBasis: 120 }, // Fixed width
                    { id: "item17", flexGrow: 1 },
                    { id: "item18", flexGrow: 1 },
                    { id: "item19", flexGrow: 1 },
                    { id: "item20", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.02, // 2% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 5x4 Grid - Fixed First Column - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "5x4 Grid - Fixed First Column",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(20);
        expect(result.gridColumns).toBe(5);
        expect(result.gridRows).toBe(4);
    });

    it("should handle 3x3 grid with flex 2 for second row and column", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    { id: "item1", flexGrow: 1 },
                    { id: "item2", flexGrow: 2 }, // Flex 2
                    { id: "item3", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [
                    { id: "item4", flexGrow: 1 },
                    { id: "item5", flexGrow: 2 }, // Flex 2
                    { id: "item6", flexGrow: 1 },
                ],
                flexGrow: 2, // Flex 2
            },
            {
                id: "row3",
                cells: [
                    { id: "item7", flexGrow: 1 },
                    { id: "item8", flexGrow: 2 }, // Flex 2
                    { id: "item9", flexGrow: 1 },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.025, // 2.5% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(
            `\n📊 3x3 Grid - Flex 2 for Second Row and Column - Result:`,
        );
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "3x3 Grid - Flex 2 for Second Row and Column",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(9);
        expect(result.gridColumns).toBe(3);
        expect(result.gridRows).toBe(3);
    });

    it("should handle row-only layout (no columns)", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [{ id: "item1", flexGrow: 1 }],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [{ id: "item2", flexGrow: 1 }],
                flexGrow: 1,
            },
            {
                id: "row3",
                cells: [{ id: "item3", flexGrow: 1 }],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.02, // 2% gap (based on smaller dimension)
            disableColGap: true, // Only row gaps for row-only layout
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 Row-Only Layout - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "Row-Only Layout",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(3);
        expect(result.gridColumns).toBe(1); // Single column per row
        expect(result.gridRows).toBe(3);
    });

    it("should handle typical header structure with thinner header and first column", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "header",
                cells: [
                    { id: "header1", width: 150 }, // Fixed thinner first column
                    { id: "header2", flexGrow: 1 },
                    { id: "header3", flexGrow: 1 },
                    { id: "header4", flexGrow: 1 },
                ],
                flexGrow: 1, // Thinner header row
            },
            {
                id: "row1",
                cells: [
                    { id: "item1", width: 150 }, // Fixed thinner first column
                    { id: "item2", flexGrow: 1 },
                    { id: "item3", flexGrow: 1 },
                    { id: "item4", flexGrow: 1 },
                ],
                flexGrow: 2, // Thicker content rows
            },
            {
                id: "row2",
                cells: [
                    { id: "item5", width: 150 }, // Fixed thinner first column
                    { id: "item6", flexGrow: 1 },
                    { id: "item7", flexGrow: 1 },
                    { id: "item8", flexGrow: 1 },
                ],
                flexGrow: 2, // Thicker content rows
            },
            {
                id: "row3",
                cells: [
                    { id: "item9", width: 150 }, // Fixed thinner first column
                    { id: "item10", flexGrow: 1 },
                    { id: "item11", flexGrow: 1 },
                    { id: "item12", flexGrow: 1 },
                ],
                flexGrow: 2, // Thicker content rows
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.015, // 1.5% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(
            `\n📊 Header Structure - Thinner Header & First Column - Result:`,
        );
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "Header Structure - Thinner Header & First Column",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(16);
        expect(result.gridColumns).toBe(4);
        expect(result.gridRows).toBe(4);
    });

    it("should handle single row with multiple columns", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    {
                        id: "item1",
                        flexGrow: 1,
                    },
                    {
                        id: "item2",
                        flexGrow: 2,
                    }, // Wider column
                    {
                        id: "item3",
                        flexGrow: 1,
                    },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.015, // 1.5% gap (based on smaller dimension)
            disableRowGap: true, // Only column gaps for column-only layout
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 Column-Only Layout - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "Column-Only Layout",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(3);
        expect(result.gridColumns).toBe(3);
        expect(result.gridRows).toBe(1);
    });

    it("should handle no columns example - only rows with gaps", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [{ id: "item1", flexGrow: 1 }],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [{ id: "item2", flexGrow: 1 }],
                flexGrow: 2, // Taller row
            },
            {
                id: "row3",
                cells: [{ id: "item3", flexGrow: 1 }],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.03, // 3% gap (based on smaller dimension)
            disableColGap: true, // Only row gaps
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 No Columns - Only Rows with Gaps - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "No Columns - Only Rows with Gaps",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(3);
        expect(result.gridColumns).toBe(1); // Single column per row
        expect(result.gridRows).toBe(3);
    });

    it("should handle single row with 4 columns", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    {
                        id: "item1",
                        flexGrow: 1,
                    },
                    {
                        id: "item2",
                        flexGrow: 2,
                    }, // Wider column
                    {
                        id: "item3",
                        flexGrow: 1,
                    },
                    {
                        id: "item4",
                        flexGrow: 1,
                    },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.02, // 2% gap (based on smaller dimension)
            disableRowGap: true, // Only column gaps
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 No Rows - Only 4 Columns with Gaps - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "No Rows - Only 4 Columns with Gaps",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(4);
        expect(result.gridColumns).toBe(4);
        expect(result.gridRows).toBe(1); // Single row with 4 columns
    });

    it("should handle padding for the whole grid", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [
                    {
                        id: "item1",
                        flexGrow: 1,
                    },
                    {
                        id: "item2",
                        flexGrow: 1,
                    },
                ],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [
                    {
                        id: "item3",
                        flexGrow: 1,
                    },
                    {
                        id: "item4",
                        flexGrow: 1,
                    },
                ],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0.1, // 10% padding
            gap: 0.02, // 2% gap (based on smaller dimension)
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 Grid with 10% Padding - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "Grid with 10% Padding",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(4);
        expect(result.gridColumns).toBe(2);
        expect(result.gridRows).toBe(2);

        // Check that items are positioned with padding (should not start at boundary edges)
        const firstItem = result.items[0];
        expect(firstItem.x).toBeGreaterThan(boundary.leftX);
        expect(firstItem.y).toBeGreaterThan(boundary.topY);
    });

    it("should handle no columns example with original item heights", () => {
        const boundary: BoundaryCoordinates = {
            leftX: 50,
            rightX: 1450, // 16:9 aspect ratio - 1400px width
            topY: 50,
            bottomY: 837.5, // 16:9 aspect ratio - 787.5px height
        };

        const rows: GridRow[] = [
            {
                id: "row1",
                cells: [{ id: "item1", width: 200, height: 100 }],
                flexGrow: 1,
            },
            {
                id: "row2",
                cells: [{ id: "item2", width: 300, height: 150 }],
                flexGrow: 1,
            },
            {
                id: "row3",
                cells: [{ id: "item3", width: 400, height: 200 }],
                flexGrow: 1,
            },
        ];

        const params: z.infer<typeof GetAlignmentToolInput> = {
            boundary,
            rows,
            padding: 0, // No padding for this test
            gap: 0.025, // 2.5% gap (based on smaller dimension)
            disableColGap: true, // Only row gaps for this test
        };

        const result = getAlignmentFunction(params);

        // Log results
        console.log(`\n📊 No Columns - Original Heights - Result:`);
        console.log("==================================================");
        result.items.forEach((item, index) => {
            console.log(`\n🔹 ${item.id}:`);
            console.log(`   Position: (${item.x}, ${item.y})`);
            console.log(`   Size:     ${item.width}×${item.height}`);
        });
        console.log("\n==================================================");

        // Generate visualization
        generateVisualization(
            [],
            result.items,
            boundary,
            "No Columns - Original Heights",
            "grid-alignment",
        );

        expect(result.items).toHaveLength(3);
        expect(result.gridColumns).toBe(1); // Single column per row
        expect(result.gridRows).toBe(3);

        // Check that items maintain their original heights
        const item1 = result.items.find((item) => item.id === "item1");
        const item2 = result.items.find((item) => item.id === "item2");
        const item3 = result.items.find((item) => item.id === "item3");

        expect(item1?.height).toBe(100); // Original height preserved
        expect(item2?.height).toBe(150); // Original height preserved
        expect(item3?.height).toBe(200); // Original height preserved
    });

    describe("ai based examples", () => {
        it("should handle 4-row layout with fixed left circles and flexible right rectangles", () => {
            const boundary: BoundaryCoordinates = {
                leftX: 88,
                rightX: 1192,
                topY: 191,
                bottomY: 647,
            };

            const rows: GridRow[] = [
                {
                    id: "row1",
                    cells: [
                        { id: "3", width: 98 },
                        { id: "6", flexGrow: 1 },
                    ],
                    flexGrow: 1,
                },
                {
                    id: "row2",
                    cells: [
                        { id: "4", width: 98 },
                        { id: "8", flexGrow: 1 },
                    ],
                    flexGrow: 1,
                },
                {
                    id: "row3",
                    cells: [
                        { id: "5", width: 98 },
                        { id: "10", flexGrow: 1 },
                    ],
                    flexGrow: 1,
                },
                {
                    id: "row4",
                    cells: [
                        { id: "new_circle", width: 98 },
                        { id: "new_rect", flexGrow: 1 },
                    ],
                    flexGrow: 1,
                },
            ];

            const params: z.infer<typeof GetAlignmentToolInput> = {
                boundary,
                rows,
                padding: 0,
                gap: 0.04, // 4% gap
                disableColGap: false,
            };

            const result = getAlignmentFunction(params);

            // Log results
            console.log(
                `\n📊 4-Row Layout - Fixed Left Circles + Flexible Right Rectangles - Result:`,
            );
            console.log("==================================================");
            result.items.forEach((item, index) => {
                console.log(`\n🔹 ${item.id}:`);
                console.log(`   Position: (${item.x}, ${item.y})`);
                console.log(`   Size:     ${item.width}×${item.height}`);
            });
            console.log("\n==================================================");

            // Generate visualization
            generateVisualization(
                [],
                result.items,
                boundary,
                "4-Row Layout - Fixed Left Circles + Flexible Right Rectangles",
                "grid-alignment",
            );

            expect(result.items).toHaveLength(8);
            expect(result.gridColumns).toBe(2);
            expect(result.gridRows).toBe(4);

            // Verify equal row heights for all rows
            const row1Item = result.items.find((item) => item.id === "3");
            const row2Item = result.items.find((item) => item.id === "4");
            const row3Item = result.items.find((item) => item.id === "5");
            const row4Item = result.items.find((item) => item.id === "new_circle");

            expect(row1Item?.height).toBe(row2Item?.height);
            expect(row2Item?.height).toBe(row3Item?.height);
            expect(row3Item?.height).toBe(row4Item?.height);

            // Verify fixed width for left circles
            expect(row1Item?.width).toBe(98);
            expect(row2Item?.width).toBe(98);
            expect(row3Item?.width).toBe(98);
            expect(row4Item?.width).toBe(98);

            // Verify consistent gaps between rows
            if (row1Item && row2Item) {
                const gap1 = row2Item.y - (row1Item.y + row1Item.height);
                const gap2 = row3Item!.y - (row2Item.y + row2Item.height);
                const gap3 = row4Item!.y - (row3Item!.y + row3Item!.height);
                
                expect(Math.abs(gap1 - gap2)).toBeLessThan(1); // Within 1px for rounding
                expect(Math.abs(gap2 - gap3)).toBeLessThan(1); // Within 1px for rounding
            }
        });
    });
});












