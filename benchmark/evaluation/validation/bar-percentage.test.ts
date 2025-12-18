import { AITPres } from "../../../api/server/src/schemas/base";
import { TBarPercentageTestSchema, TTestResult } from "../schemas";
import { getShapeProperty, getShapes } from "./utils";

/**
 * Validates that a bar's width is a specific percentage of its background bar's width.
 *
 * Dynamically finds the background bar by matching X position, then calculates the ratio.
 * This avoids hardcoding background widths and makes validation flexible.
 *
 * Algorithm:
 * 1. Get the bar shape by shapeId
 * 2. Find background bars matching the filter
 * 3. Match background bar to bar by X position (same topLeft[0])
 * 4. Calculate ratio: bar width / background width * 100
 * 5. Check if ratio is within expected percentage ± tolerance
 */
export function validateBarPercentageTest(
    presentation: AITPres,
    test: TBarPercentageTestSchema,
    startTime: number
): TTestResult {
    const POSITION_TOLERANCE = 1; // 1px tolerance for matching X positions
    const percentageTolerance = test.percentageTolerance ?? 5;

    try {
        // Get the bar shape properties directly
        const barWidth = getShapeProperty(presentation, test.slideId, test.barShapeId, "size.w") as number;
        const barX = getShapeProperty(presentation, test.slideId, test.barShapeId, "pos.topLeft[0]") as number;

        if (typeof barWidth !== "number" || typeof barX !== "number" || isNaN(barWidth) || isNaN(barX)) {
            return {
                testName: test.description || `bar_percentage - shape ${test.barShapeId}`,
                status: "failed",
                message: `Bar shape ${test.barShapeId} not found or missing width/X position`,
                executionTime: Date.now() - startTime,
            };
        }

        // Find background bars matching the filter
        const backgroundBars = getShapes(presentation, test.slideId, test.backgroundFilter);

        if (backgroundBars.length === 0) {
            return {
                testName: test.description || `bar_percentage - shape ${test.barShapeId}`,
                status: "failed",
                message: `No background bars found matching filter`,
                executionTime: Date.now() - startTime,
            };
        }

        // Find the background bar that matches the bar's X position
        let backgroundBar = null;
        let backgroundWidth = 0;

        for (const bgBar of backgroundBars) {
            const bgX = getShapeProperty(presentation, test.slideId, bgBar.id, "pos.topLeft[0]") as number;
            if (typeof bgX === "number" && Math.abs(bgX - barX) <= POSITION_TOLERANCE) {
                backgroundBar = bgBar;
                backgroundWidth = getShapeProperty(presentation, test.slideId, bgBar.id, "size.w") as number;
                break;
            }
        }

        if (!backgroundBar || typeof backgroundWidth !== "number" || backgroundWidth === 0) {
            return {
                testName: test.description || `bar_percentage - shape ${test.barShapeId}`,
                status: "failed",
                message: `No background bar found at X position ${barX} (tolerance: ${POSITION_TOLERANCE}px)`,
                executionTime: Date.now() - startTime,
            };
        }

        // Calculate the actual percentage
        const actualPercentage = (barWidth / backgroundWidth) * 100;
        const minPercentage = test.expectedPercentage - percentageTolerance;
        const maxPercentage = test.expectedPercentage + percentageTolerance;

        const passed = actualPercentage >= minPercentage && actualPercentage <= maxPercentage;

        return {
            testName: test.description || `bar_percentage - shape ${test.barShapeId}`,
            status: passed ? "passed" : "failed",
            message: passed
                ? undefined
                : `Bar width ${barWidth}px is ${actualPercentage.toFixed(1)}% of background width ${backgroundWidth}px, expected ${test.expectedPercentage}% (±${percentageTolerance}%)`,
            actual: {
                barWidth,
                backgroundWidth,
                actualPercentage: actualPercentage.toFixed(1) + "%",
            },
            expected: {
                expectedPercentage: test.expectedPercentage + "%",
                tolerance: `±${percentageTolerance}%`,
                range: `${minPercentage}% - ${maxPercentage}%`,
            },
            executionTime: Date.now() - startTime,
        };
    } catch (error: any) {
        return {
            testName: test.description || `bar_percentage - shape ${test.barShapeId}`,
            status: "failed",
            message: `Error: ${error.message || String(error)}`,
            executionTime: Date.now() - startTime,
        };
    }
}

