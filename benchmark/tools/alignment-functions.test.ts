import { describe, expect, it } from "vitest";
import { getColumnAlignmentFunction } from "./alignment/helpers/column-helper";
import { getRowAlignmentFunction } from "./alignment/helpers/row-helper";

describe("Column and Row Alignment with Yoga", () => {
    it("should layout items in a column using Yoga", () => {
        const result = getColumnAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 100,
                topY: 0,
                bottomY: 300,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 10,
            items: [
                { id: "item1", width: 50, height: 50 },
                { id: "item2", width: 60, height: 60 },
                { id: "item3", width: 40, height: 40 },
            ],
        });

        expect(result.items).toHaveLength(3);
        expect(result.items[0].id).toBe("item1");
        expect(result.items[1].id).toBe("item2");
        expect(result.items[2].id).toBe("item3");

        // Items should be centered horizontally
        expect(result.items[0].x).toBeGreaterThan(0);
        expect(result.items[0].x).toBeLessThan(50);

        // Items should be stacked vertically
        expect(result.items[0].y).toBe(0);
        expect(result.items[1].y).toBeGreaterThan(result.items[0].y);
        expect(result.items[2].y).toBeGreaterThan(result.items[1].y);
    });

    it("should layout items in a row using Yoga", () => {
        const result = getRowAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 300,
                topY: 0,
                bottomY: 100,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 10,
            items: [
                { id: "item1", width: 50, height: 50 },
                { id: "item2", width: 60, height: 60 },
                { id: "item3", width: 40, height: 40 },
            ],
        });

        expect(result.items).toHaveLength(3);
        expect(result.items[0].id).toBe("item1");
        expect(result.items[1].id).toBe("item2");
        expect(result.items[2].id).toBe("item3");

        // Items should be centered vertically
        expect(result.items[0].y).toBeGreaterThan(0);
        expect(result.items[0].y).toBeLessThan(50);

        // Items should be arranged horizontally
        expect(result.items[0].x).toBe(0);
        expect(result.items[1].x).toBeGreaterThan(result.items[0].x);
        expect(result.items[2].x).toBeGreaterThan(result.items[1].x);
    });

    it("should handle flexGrow in column layout", () => {
        const result = getColumnAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 100,
                topY: 0,
                bottomY: 300,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 0,
            items: [
                { id: "item1", width: 80, height: 100, flexGrow: 1 },
                { id: "item2", width: 80, height: 100, flexGrow: 2 },
                { id: "item3", width: 80, height: 100, flexGrow: 1 },
            ],
        });

        expect(result.items).toHaveLength(3);

        // Item 2 should be taller due to flexGrow: 2
        expect(result.items[1].height).toBeGreaterThan(result.items[0].height);
        expect(result.items[1].height).toBeGreaterThan(result.items[2].height);
    });

    it("should handle flexGrow in row layout", () => {
        const result = getRowAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 300,
                topY: 0,
                bottomY: 100,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 0,
            items: [
                { id: "item1", width: 50, height: 80, flexGrow: 1 },
                { id: "item2", width: 50, height: 80, flexGrow: 2 },
                { id: "item3", width: 50, height: 80, flexGrow: 1 },
            ],
        });

        expect(result.items).toHaveLength(3);

        // Item 2 should be wider due to flexGrow: 2
        expect(result.items[1].width).toBeGreaterThan(result.items[0].width);
        expect(result.items[1].width).toBeGreaterThan(result.items[2].width);
    });

    it("should handle flexBasis in column layout", () => {
        const result = getColumnAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 100,
                topY: 0,
                bottomY: 400,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 0,
            items: [
                { id: "item1", width: 80, height: 100, flexBasis: "100%" },
                { id: "item2", width: 80, height: 100, flexBasis: "100%", flexGrow: 2 },
                { id: "item3", width: 80, height: 100, flexBasis: "100%" },
            ],
        });

        expect(result.items).toHaveLength(3);

        // All items should use flexBasis 100% and be distributed
        expect(result.items[0].height).toBeGreaterThan(0);
        expect(result.items[1].height).toBeGreaterThan(result.items[0].height);
        expect(result.items[2].height).toBeGreaterThan(0);
    });

    it("should handle empty items array", () => {
        const columnResult = getColumnAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 100,
                topY: 0,
                bottomY: 300,
            },
            items: [],
        });

        expect(columnResult.items).toHaveLength(0);
        expect(columnResult.totalWidth).toBe(0);
        expect(columnResult.totalHeight).toBe(0);

        const rowResult = getRowAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 300,
                topY: 0,
                bottomY: 100,
            },
            items: [],
        });

        expect(rowResult.items).toHaveLength(0);
        expect(rowResult.totalWidth).toBe(0);
        expect(rowResult.totalHeight).toBe(0);
    });

    it("should respect gap in column layout", () => {
        const result = getColumnAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 100,
                topY: 0,
                bottomY: 300,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 20,
            items: [
                { id: "item1", width: 50, height: 50 },
                { id: "item2", width: 60, height: 60 },
            ],
        });

        expect(result.items).toHaveLength(2);

        // Check that there's a gap between items
        const gap = result.items[1].y - (result.items[0].y + result.items[0].height);
        expect(gap).toBeCloseTo(20, 1);
    });

    it("should respect gap in row layout", () => {
        const result = getRowAlignmentFunction({
            boundary: {
                leftX: 0,
                rightX: 300,
                topY: 0,
                bottomY: 100,
            },
            fullWidth: true,
            fullHeight: true,
            gap: 20,
            items: [
                { id: "item1", width: 50, height: 50 },
                { id: "item2", width: 60, height: 60 },
            ],
        });

        expect(result.items).toHaveLength(2);

        // Check that there's a gap between items
        const gap = result.items[1].x - (result.items[0].x + result.items[0].width);
        expect(gap).toBeCloseTo(20, 1);
    });
});


