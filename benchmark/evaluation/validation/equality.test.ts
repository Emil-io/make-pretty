import { AITPres } from "../../../api/server/src/schemas/base";
import { TEqualityTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

// Tolerance for numeric comparisons (5px difference is acceptable)
const NUMERIC_TOLERANCE = 5;

/**
 * Check if two values are equal, with tolerance for numeric values
 */
function valuesAreEqual(a: any, b: any): boolean {
    // If both are numbers, use tolerance comparison
    if (typeof a === "number" && typeof b === "number") {
        return Math.abs(a - b) <= NUMERIC_TOLERANCE;
    }
    // Otherwise, use strict equality
    return a === b;
}

export function validateEqualityTest(
    presentation: AITPres,
    test: TEqualityTestSchema,
    startTime: number
): TTestResult {
    // Extract all values, handling filters if provided
    const values = test.objects.map(obj => {
        let shapeId = obj.shapeId;
        if (obj.filter && !shapeId) {
            const shapes = getShapes(presentation, obj.slideId, obj.filter);
            if (shapes.length === 0) {
                throw new Error(`No shapes found matching the filter for ${obj.key}`);
            }
            if (shapes.length > 1) {
                throw new Error(`Multiple shapes (${shapes.length}) found matching the filter for ${obj.key}, expected exactly 1`);
            }
            shapeId = shapes[0].id;
        }
        if (!shapeId) {
            throw new Error(`Either 'shapeId' or 'filter' must be provided for ${obj.key}`);
        }
        return getShapeProperty(presentation, obj.slideId, shapeId, obj.key);
    });

    // Check equality based on test type (with tolerance for numeric values)
    const allEqual = values.every(v => valuesAreEqual(v, values[0]));
    const someEqual = values.some((v, i) =>
        values.some((v2, j) => i !== j && valuesAreEqual(v, v2))
    );
    // For noneEqual, count unique values considering tolerance
    const uniqueValues: any[] = [];
    for (const v of values) {
        if (!uniqueValues.some(uv => valuesAreEqual(v, uv))) {
            uniqueValues.push(v);
        }
    }
    const noneEqual = uniqueValues.length === values.length;
    
    let passed = false;
    switch (test.name) {
        case "all_are_equal":
            passed = allEqual;
            break;
        case "some_are_equal":
            passed = someEqual && !allEqual;
            break;
        case "none_are_equal":
            passed = noneEqual;
            break;
        case "some_are_unequal":
            passed = !allEqual;
            break;
    }
    
    return {
        testName: test.description || `${test.name} - ${test.objects.length} objects`,
        status: passed ? "passed" : "failed",
        message: passed ? undefined : `Values: ${JSON.stringify(values)}`,
        actual: values,
        executionTime: Date.now() - startTime,
    };
}
