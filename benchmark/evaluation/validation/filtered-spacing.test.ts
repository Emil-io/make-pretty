import { AITPres } from "../../../api/server/src/schemas/base";
import { TFilteredSpacingTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

/**
 * Validates that at least `minMatchCount` shapes matching the filter form an equally-spaced group.
 *
 * Algorithm:
 * 1. Find all shapes matching the filter
 * 2. Try different combinations to find the largest equally-spaced group
 * 3. Pass if a group of at least `minMatchCount` shapes with equal spacing is found
 *
 * This handles outliers: e.g., 5 shapes where 4 are equally spaced and 1 is not.
 */
export function validateFilteredSpacingTest(
    presentation: AITPres,
    test: TFilteredSpacingTestSchema,
    startTime: number
): TTestResult {
    try {
        const shapes = getShapes(presentation, test.slideId, test.filter);

        if (shapes.length === 0) {
            return {
                testName:
                    test.description ||
                    `filtered_spacing - ${test.direction} (min ${test.minMatchCount})`,
                status: "failed",
                message: "No shapes found matching the filter",
                executionTime: Date.now() - startTime,
            };
        }

        if (shapes.length < test.minMatchCount) {
            return {
                testName:
                    test.description ||
                    `filtered_spacing - ${test.direction} (min ${test.minMatchCount})`,
                status: "failed",
                message: `Only ${shapes.length} shape(s) found, but minMatchCount requires at least ${test.minMatchCount}`,
                actual: shapes.length,
                expected: `At least ${test.minMatchCount} shapes`,
                executionTime: Date.now() - startTime,
            };
        }

        // Get positions for all shapes
        interface ShapeWithPosition {
            id: number;
            topLeft: [number, number];
            bottomRight: [number, number];
        }

        const shapesWithPos: ShapeWithPosition[] = [];
        for (const shape of shapes) {
            try {
                const topLeft = getShapeProperty(
                    presentation,
                    test.slideId,
                    shape.id,
                    "pos.topLeft"
                );
                const bottomRight = getShapeProperty(
                    presentation,
                    test.slideId,
                    shape.id,
                    "pos.bottomRight"
                );
                shapesWithPos.push({
                    id: shape.id,
                    topLeft,
                    bottomRight,
                });
            } catch (error) {
                // Skip shapes without position data
                continue;
            }
        }

        if (shapesWithPos.length < test.minMatchCount) {
            return {
                testName:
                    test.description ||
                    `filtered_spacing - ${test.direction} (min ${test.minMatchCount})`,
                status: "failed",
                message: `Only ${shapesWithPos.length} shape(s) have position data, but minMatchCount requires at least ${test.minMatchCount}`,
                executionTime: Date.now() - startTime,
            };
        }

        // Optionally group shapes by perpendicular position first (for horizontal spacing, group by Y; for vertical, group by X)
        // This ensures we only check spacing within the same row/column when enabled
        let groups: ShapeWithPosition[][] = [];
        
        if (test.groupByPerpendicularPosition) {
            const positionTolerance = 50; // 50px tolerance for grouping by perpendicular position
            
            if (test.direction === "horizontal") {
                // Group by Y position (same row)
                const yGroups = new Map<number, ShapeWithPosition[]>();
                for (const shape of shapesWithPos) {
                    const y = shape.topLeft[1];
                    // Find existing group with similar Y
                    let foundGroup = false;
                    for (const [groupY, group] of yGroups.entries()) {
                        if (Math.abs(y - groupY) <= positionTolerance) {
                            group.push(shape);
                            foundGroup = true;
                            break;
                        }
                    }
                    if (!foundGroup) {
                        yGroups.set(y, [shape]);
                    }
                }
                groups = Array.from(yGroups.values());
            } else {
                // Group by X position (same column)
                const xGroups = new Map<number, ShapeWithPosition[]>();
                for (const shape of shapesWithPos) {
                    const x = shape.topLeft[0];
                    // Find existing group with similar X
                    let foundGroup = false;
                    for (const [groupX, group] of xGroups.entries()) {
                        if (Math.abs(x - groupX) <= positionTolerance) {
                            group.push(shape);
                            foundGroup = true;
                            break;
                        }
                    }
                    if (!foundGroup) {
                        xGroups.set(x, [shape]);
                    }
                }
                groups = Array.from(xGroups.values());
            }
        } else {
            // No grouping - use all shapes as one group (original behavior)
            groups = [shapesWithPos];
        }

        // Find the largest equally-spaced group across all position groups
        const tolerance = 1; // 1px tolerance for spacing
        let bestGroup: ShapeWithPosition[] = [];
        let bestGaps: number[] = [];

        // For each position group (row/column), try to find equally-spaced sequences
        for (const positionGroup of groups) {
            // Sort shapes within this group by the spacing direction
            const sortedShapes = [...positionGroup].sort((a, b) => {
                if (test.direction === "horizontal") {
                    return a.topLeft[0] - b.topLeft[0]; // Sort by X coordinate
                } else {
                    return a.topLeft[1] - b.topLeft[1]; // Sort by Y coordinate
                }
            });

            // Try to find equally-spaced sequences of length >= minMatchCount
            // We'll use a greedy approach: start from each shape and try to build the longest equally-spaced sequence
            for (let start = 0; start <= sortedShapes.length - test.minMatchCount; start++) {
                const group = [sortedShapes[start]];
                const gaps: number[] = [];

                for (let i = start + 1; i < sortedShapes.length; i++) {
                    const current = group[group.length - 1];
                    const next = sortedShapes[i];

                    let gap: number;
                    if (test.direction === "horizontal") {
                        gap = next.topLeft[0] - current.bottomRight[0];
                    } else {
                        gap = next.topLeft[1] - current.bottomRight[1];
                    }

                    // Check if this gap matches the pattern (within tolerance)
                    if (gaps.length === 0) {
                        // First gap in the sequence
                        gaps.push(gap);
                        group.push(next);
                    } else {
                        const expectedGap = gaps[0];
                        if (Math.abs(gap - expectedGap) <= tolerance) {
                            gaps.push(gap);
                            group.push(next);
                        }
                        // If gap doesn't match, skip this shape (it's an outlier)
                    }
                }

                // Update best group if this one is larger
                if (group.length > bestGroup.length) {
                    bestGroup = group;
                    bestGaps = gaps;
                }
            }
        }

        const passed = bestGroup.length >= test.minMatchCount;

        const shapeIdsInBestGroup = bestGroup.map((s) => s.id);
        const averageGap =
            bestGaps.length > 0
                ? bestGaps.reduce((sum, g) => sum + g, 0) / bestGaps.length
                : 0;

        return {
            testName:
                test.description ||
                `filtered_spacing - ${test.direction} (min ${test.minMatchCount})`,
            status: passed ? "passed" : "failed",
            message: passed
                ? `Found ${bestGroup.length} equally-spaced shapes (gap: ${averageGap.toFixed(2)}px). Shape IDs: ${shapeIdsInBestGroup.join(", ")}`
                : `Largest equally-spaced group has only ${bestGroup.length} shape(s), expected at least ${test.minMatchCount}. Found shape IDs: ${shapeIdsInBestGroup.join(", ")}`,
            actual: {
                groupSize: bestGroup.length,
                shapeIds: shapeIdsInBestGroup,
                gaps: bestGaps.map((g) => Number(g.toFixed(2))),
                averageGap: Number(averageGap.toFixed(2)),
            },
            expected: `At least ${test.minMatchCount} equally-spaced shapes`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName:
                test.description ||
                `filtered_spacing - ${test.direction} (min ${test.minMatchCount})`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}
