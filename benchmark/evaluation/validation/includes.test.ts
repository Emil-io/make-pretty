import { AITPres } from "../../../api/server/src/schemas/base";
import { TIncludesTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

export function validateIncludesTest(
    presentation: AITPres,
    test: TIncludesTestSchema,
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
    
    let includes = false;
    if (Array.isArray(actual)) {
        includes = actual.includes(test.expected);
    } else if (typeof actual === "string") {
        includes = actual.includes(test.expected);
    } else if (typeof actual === "object" && actual !== null) {
        includes = test.expected in actual;
    }
    
    const shouldInclude = test.name === "includes";
    const passed = includes === shouldInclude;
    
    return {
        testName: test.description || `${test.name} - Slide ${test.slideId}, Shape ${shapeId}, ${test.key}`,
        status: passed ? "passed" : "failed",
        message: passed ? undefined : `Expected ${test.key} to ${test.name === "includes" ? "include" : "not include"} ${test.expected}`,
        actual,
        expected: test.expected,
        executionTime: Date.now() - startTime,
    };
}
