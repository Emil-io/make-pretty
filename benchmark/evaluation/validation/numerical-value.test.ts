import { AITPres } from "../../../api/server/src/schemas/base";
import { TNumericalValueTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

export function validateNumericalValueTest(
    presentation: AITPres,
    test: TNumericalValueTestSchema,
    startTime: number
): TTestResult {
    // If filter is provided, find the shape by filter
    let shapeId = test.shapeId;
    if (test.filter && !shapeId) {
        const shapes = getShapes(presentation, test.slideId, test.filter);
        if (shapes.length === 0) {
            return {
                testName: test.description || `${test.name} - ${test.key}`,
                status: "failed",
                message: `No shapes found matching the filter`,
                executionTime: Date.now() - startTime,
            };
        }
        if (shapes.length > 1) {
            return {
                testName: test.description || `${test.name} - ${test.key}`,
                status: "failed",
                message: `Multiple shapes (${shapes.length}) found matching the filter, expected exactly 1`,
                executionTime: Date.now() - startTime,
            };
        }
        shapeId = shapes[0].id;
    }
    
    if (!shapeId) {
        return {
            testName: test.description || `${test.name} - ${test.key}`,
            status: "failed",
            message: "Either 'shapeId' or 'filter' must be provided",
            executionTime: Date.now() - startTime,
        };
    }

    const actual = getShapeProperty(
        presentation,
        test.slideId,
        shapeId,
        test.key
    );
    
    let passed = false;
    switch (test.name) {
        case "greater_than":
            passed = actual > test.expected;
            break;
        case "less_than":
            passed = actual < test.expected;
            break;
        case "greater_than_or_equal":
            passed = actual >= test.expected;
            break;
        case "less_than_or_equal":
            passed = actual <= test.expected;
            break;
    }
    
    return {
        testName: test.description || `${test.name} - Slide ${test.slideId}, Shape ${shapeId}, ${test.key}`,
        status: passed ? "passed" : "failed",
        message: passed ? undefined : `Expected ${test.key} ${test.name.replace(/_/g, ' ')} ${test.expected}, got ${actual}`,
        actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
