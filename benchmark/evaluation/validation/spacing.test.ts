import { AITPres } from "../../../api/server/src/schemas/base";
import { TSpacingTestSchema, TTestResult } from "../schemas";
import { getShapeProperty } from "./utils";

export function validateSpacingTest(
    presentation: AITPres,
    test: TSpacingTestSchema,
    startTime: number
): TTestResult {
    try {
        // Get all shapes and their positions
        // For lines, use startPos/endPos; for other shapes, use pos.topLeft/pos.bottomRight
        const shapes = test.shapeIds.map(shapeId => {
            const shapeType = getShapeProperty(presentation, test.slideId, shapeId, "shapeType");
            const isLine = shapeType === "line";
            
            if (isLine) {
                // For lines, use startPos and endPos
                const startPos = getShapeProperty(presentation, test.slideId, shapeId, "startPos") as [number, number] | undefined;
                const endPos = getShapeProperty(presentation, test.slideId, shapeId, "endPos") as [number, number] | undefined;
                if (!startPos || !endPos) {
                    throw new Error(`Line ${shapeId} is missing startPos or endPos`);
                }
                // For horizontal spacing, use X coordinate of startPos
                // For vertical spacing, use Y coordinate of startPos
                return {
                    id: shapeId,
                    position: startPos, // [x, y]
                    isLine: true,
                };
            } else {
                // For other shapes, use pos.topLeft and pos.bottomRight
                const topLeft = getShapeProperty(presentation, test.slideId, shapeId, "pos.topLeft") as [number, number] | undefined;
                const bottomRight = getShapeProperty(presentation, test.slideId, shapeId, "pos.bottomRight") as [number, number] | undefined;
                if (!topLeft || !bottomRight) {
                    throw new Error(`Shape ${shapeId} is missing pos.topLeft or pos.bottomRight`);
                }
                return {
                    id: shapeId,
                    topLeft,
                    bottomRight,
                    isLine: false,
                };
            }
        });

        // Sort shapes by position based on direction
        const sortedShapes = shapes.sort((a, b) => {
            if (test.direction === "horizontal") {
                const aX = a.isLine ? a.position[0] : a.topLeft[0];
                const bX = b.isLine ? b.position[0] : b.topLeft[0];
                return aX - bX; // Sort by X coordinate
            } else {
                const aY = a.isLine ? a.position[1] : a.topLeft[1];
                const bY = b.isLine ? b.position[1] : b.topLeft[1];
                return aY - bY; // Sort by Y coordinate
            }
        });

        // Calculate gaps between consecutive shapes
        const gaps: number[] = [];
        for (let i = 0; i < sortedShapes.length - 1; i++) {
            const current = sortedShapes[i];
            const next = sortedShapes[i + 1];
            
            let gap: number;
            if (test.direction === "horizontal") {
                if (current.isLine && next.isLine) {
                    // For lines, gap = next line's X - current line's X
                    gap = next.position[0] - current.position[0];
                } else if (current.isLine) {
                    // Current is line, next is shape: gap = next shape's left edge - current line's X
                    gap = next.topLeft[0] - current.position[0];
                } else if (next.isLine) {
                    // Next is line, current is shape: gap = next line's X - current shape's right edge
                    gap = next.position[0] - current.bottomRight[0];
                } else {
                    // Both are shapes: gap = next shape's left edge - current shape's right edge
                    gap = next.topLeft[0] - current.bottomRight[0];
                }
            } else {
                if (current.isLine && next.isLine) {
                    // For lines, gap = next line's Y - current line's Y
                    gap = next.position[1] - current.position[1];
                } else if (current.isLine) {
                    // Current is line, next is shape: gap = next shape's top edge - current line's Y
                    gap = next.topLeft[1] - current.position[1];
                } else if (next.isLine) {
                    // Next is line, current is shape: gap = next line's Y - current shape's bottom edge
                    gap = next.position[1] - current.bottomRight[1];
                } else {
                    // Both are shapes: gap = next shape's top edge - current shape's bottom edge
                    gap = next.topLeft[1] - current.bottomRight[1];
                }
            }
            gaps.push(gap);
        }

        // Check if all gaps are equal (within 5px tolerance for floating point precision and visual alignment)
        const tolerance = 5;
        const firstGap = gaps[0];
        const allEqual = gaps.every(gap => Math.abs(gap - firstGap) <= tolerance);

        return {
            testName: test.description || `equal_spacing - ${test.direction} - ${test.shapeIds.length} shapes`,
            status: allEqual ? "passed" : "failed",
            message: allEqual ? undefined : `Expected equal spacing, got gaps: ${gaps.map(g => g.toFixed(2)).join(', ')}`,
            actual: gaps,
            expected: `Equal spacing (${firstGap.toFixed(2)}px)`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName: test.description || `equal_spacing - ${test.direction}`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}
