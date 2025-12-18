import { getShapeProperty } from "../utils";
export function validateEqualityTest(presentation, test, startTime) {
    // Extract all values
    var values = test.objects.map(function (obj) {
        return getShapeProperty(presentation, obj.slideId, obj.shapeId, obj.key);
    });
    // Check equality based on test type
    var allEqual = values.every(function (v) { return v === values[0]; });
    var someEqual = values.some(function (v, i) {
        return values.some(function (v2, j) { return i !== j && v === v2; });
    });
    var noneEqual = new Set(values).size === values.length;
    var passed = false;
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
        testName: "".concat(test.name, " - ").concat(test.objects.length, " objects"),
        status: passed ? "passed" : "failed",
        message: passed ? undefined : "Values: ".concat(JSON.stringify(values)),
        actual: values,
        executionTime: Date.now() - startTime,
    };
}
