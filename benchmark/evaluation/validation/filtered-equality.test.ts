import { AITPres } from "../../../api/server/src/schemas/base";
import { TFilteredEqualityTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

/**
 * Validates that at least `minMatchCount` shapes matching the filter share the same property value.
 *
 * Algorithm (single filter):
 * 1. Find all shapes matching the filter
 * 2. Extract the specified property from each shape
 * 3. Group shapes by property value
 * 4. Check if any group has at least `minMatchCount` shapes
 * 5. Pass if such a group exists (outliers are ignored)
 *
 * Algorithm (multiple filters):
 * 1. Find shapes matching each filter
 * 2. Extract the specified property from each group
 * 3. Check that all groups have the same property value (within tolerance)
 * 4. Pass if all groups match
 *
 * Example (single filter):
 * - 5 roundRect shapes found
 * - Property: pos.topLeft[1] (Y-coordinate)
 * - Values: [246, 246, 246, 246, 600]
 * - Group with value 246 has 4 shapes
 * - minMatchCount = 4 → PASS
 *
 * Example (multiple filters):
 * - Filter 1: {rawText: "01"} → finds 1 shape with X=259.9
 * - Filter 2: {rawText: "04"} → finds 1 shape with X=259.8
 * - Property: pos.topLeft[0] (X-coordinate)
 * - Values match within tolerance → PASS
 */
export function validateFilteredEqualityTest(
    presentation: AITPres,
    test: TFilteredEqualityTestSchema,
    startTime: number
): TTestResult {
    try {
        // Handle multiple filters case
        if (test.filters && test.filters.length > 0) {
            return validateMultipleFilters(presentation, test, startTime);
        }

        // Handle single filter case (original behavior)
        if (!test.filter) {
            return {
                testName:
                    test.description ||
                    `filtered_equality - ${test.key}`,
                status: "failed",
                message: "Either 'filter' or 'filters' must be provided",
                executionTime: Date.now() - startTime,
            };
        }

        const shapes = getShapes(presentation, test.slideId, test.filter);

        if (shapes.length === 0) {
            return {
                testName:
                    test.description ||
                    `filtered_equality - ${test.key} (min ${test.minMatchCount})`,
                status: "failed",
                message: "No shapes found matching the filter",
                executionTime: Date.now() - startTime,
            };
        }

        if (shapes.length < test.minMatchCount) {
            return {
                testName:
                    test.description ||
                    `filtered_equality - ${test.key} (min ${test.minMatchCount})`,
                status: "failed",
                message: `Only ${shapes.length} shape(s) found, but minMatchCount requires at least ${test.minMatchCount}`,
                actual: shapes.length,
                expected: `At least ${test.minMatchCount} shapes`,
                executionTime: Date.now() - startTime,
            };
        }

        // Extract property values from all shapes
        const shapeValues: Array<{ shapeId: number; value: any }> = [];
        for (const shape of shapes) {
            try {
                const value = getShapeProperty(
                    presentation,
                    test.slideId,
                    shape.id,
                    test.key
                );
                shapeValues.push({ shapeId: shape.id, value });
            } catch (error) {
                // Skip shapes that don't have this property
                continue;
            }
        }

        if (shapeValues.length === 0) {
            return {
                testName:
                    test.description ||
                    `filtered_equality - ${test.key} (min ${test.minMatchCount})`,
                status: "failed",
                message: `No shapes have the property "${test.key}"`,
                executionTime: Date.now() - startTime,
            };
        }

        // Group shapes by value (with tolerance for floating point numbers)
        const valueGroups = new Map<string, number[]>();
        const TOLERANCE = 10; // 10px tolerance for numerical values (allows for slight variations in alignment, cropping, and resizing)

        for (const { shapeId, value } of shapeValues) {
            let groupKey: string;

            if (typeof value === "number") {
                // For numbers, use tolerance-based grouping
                let foundGroup = false;
                valueGroups.forEach((existingIds, existingKey) => {
                    if (foundGroup) return;
                    const existingValue = parseFloat(existingKey);
                    if (Math.abs(value - existingValue) <= TOLERANCE) {
                        existingIds.push(shapeId);
                        foundGroup = true;
                    }
                });
                if (!foundGroup) {
                    groupKey = value.toString();
                    valueGroups.set(groupKey, [shapeId]);
                }
            } else {
                // For non-numbers, use exact string comparison
                groupKey = JSON.stringify(value);
                if (!valueGroups.has(groupKey)) {
                    valueGroups.set(groupKey, []);
                }
                valueGroups.get(groupKey)!.push(shapeId);
            }
        }

        // Find the largest group
        let largestGroupSize = 0;
        let largestGroupValue: string | undefined;
        let largestGroupShapeIds: number[] = [];

        valueGroups.forEach((shapeIds, value) => {
            if (shapeIds.length > largestGroupSize) {
                largestGroupSize = shapeIds.length;
                largestGroupValue = value;
                largestGroupShapeIds = shapeIds;
            }
        });

        const passed = largestGroupSize >= test.minMatchCount;

        // Build detailed message
        const groupSummaryParts: string[] = [];
        valueGroups.forEach((ids, value) => {
            groupSummaryParts.push(`${ids.length} shape(s) with ${test.key}=${value}`);
        });
        const groupSummary = groupSummaryParts.join(", ");

        return {
            testName:
                test.description ||
                `filtered_equality - ${test.key} (min ${test.minMatchCount})`,
            status: passed ? "passed" : "failed",
            message: passed
                ? `Found ${largestGroupSize} shapes with matching ${test.key} (${groupSummary})`
                : `Largest matching group has only ${largestGroupSize} shape(s), expected at least ${test.minMatchCount}. Groups: ${groupSummary}`,
            actual: {
                largestGroupSize,
                largestGroupValue,
                largestGroupShapeIds,
                allGroups: Object.fromEntries(valueGroups),
            },
            expected: `At least ${test.minMatchCount} shapes with equal ${test.key}`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName:
                test.description ||
                `filtered_equality - ${test.key} (min ${test.minMatchCount})`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}

/**
 * Validates equality across multiple filter groups.
 * Checks that shapes matching each filter have the same property value.
 */
function validateMultipleFilters(
    presentation: AITPres,
    test: TFilteredEqualityTestSchema,
    startTime: number
): TTestResult {
    const TOLERANCE = 10; // 10px tolerance for numerical values
    
    // Get shapes for each filter
    const filterGroups: Array<{ filter: any; shapes: any[]; values: number[] }> = [];
    
    for (const filter of test.filters!) {
        const shapes = getShapes(presentation, test.slideId, filter);
        
        if (shapes.length === 0) {
            return {
                testName:
                    test.description ||
                    `filtered_equality - ${test.key} (multi-filter)`,
                status: "failed",
                message: `No shapes found matching filter: ${JSON.stringify(filter)}`,
                executionTime: Date.now() - startTime,
            };
        }

        // Extract property values from shapes in this filter group
        const values: number[] = [];
        for (const shape of shapes) {
            try {
                const value = getShapeProperty(
                    presentation,
                    test.slideId,
                    shape.id,
                    test.key
                );
                if (typeof value === "number") {
                    values.push(value);
                } else {
                    return {
                        testName:
                            test.description ||
                            `filtered_equality - ${test.key} (multi-filter)`,
                        status: "failed",
                        message: `Property "${test.key}" is not a number for shape ${shape.id}. Multi-filter equality only supports numeric properties.`,
                        executionTime: Date.now() - startTime,
                    };
                }
            } catch (error) {
                return {
                    testName:
                        test.description ||
                        `filtered_equality - ${test.key} (multi-filter)`,
                    status: "failed",
                    message: `Shape ${shape.id} does not have property "${test.key}"`,
                    executionTime: Date.now() - startTime,
                };
            }
        }

        // For each filter group, use the average value (or first value if single shape)
        const groupValue = values.length === 1 
            ? values[0] 
            : values.reduce((a, b) => a + b, 0) / values.length;
        
        filterGroups.push({ filter, shapes, values: [groupValue] });
    }

    // Check that all filter groups have the same value (within tolerance)
    if (filterGroups.length < 2) {
        return {
            testName:
                test.description ||
                `filtered_equality - ${test.key} (multi-filter)`,
            status: "failed",
            message: "At least 2 filters are required for multi-filter equality check",
            executionTime: Date.now() - startTime,
        };
    }

    const firstValue = filterGroups[0].values[0];
    let allMatch = true;
    const mismatches: string[] = [];

    for (let i = 1; i < filterGroups.length; i++) {
        const currentValue = filterGroups[i].values[0];
        if (Math.abs(firstValue - currentValue) > TOLERANCE) {
            allMatch = false;
            mismatches.push(
                `Filter ${i + 1} has value ${currentValue.toFixed(1)}, expected ${firstValue.toFixed(1)} (diff: ${Math.abs(firstValue - currentValue).toFixed(1)}px)`
            );
        }
    }

    const filterDescriptions = test.filters!.map((f, i) => {
        const textFilter = f.rawText || f.rawTextContains;
        return textFilter ? `"${textFilter}"` : `Filter ${i + 1}`;
    }).join(", ");

    return {
        testName:
            test.description ||
            `filtered_equality - ${test.key} (${filterDescriptions})`,
        status: allMatch ? "passed" : "failed",
        message: allMatch
            ? `All filter groups have matching ${test.key} (${firstValue.toFixed(1)})`
            : `Filter groups do not match: ${mismatches.join("; ")}`,
        actual: {
            filterGroups: filterGroups.map((g, i) => ({
                filter: test.filters![i],
                value: g.values[0],
                shapeCount: g.shapes.length,
            })),
        },
        expected: `All filter groups should have equal ${test.key} (within ${TOLERANCE}px tolerance)`,
        executionTime: Date.now() - startTime,
    };
}
