import { AITPres } from "../../../api/server/src/schemas/base";
import { TLineValidationTestSchema, TTestResult } from "../schemas";
import { getShapes } from "./utils";

/**
 * Validates line shapes for verticality, equal length, and positioning.
 *
 * Checks:
 * 1. Each line is vertical (startPos[0] == endPos[0] within tolerance)
 * 2. All lines have equal length (calculated from startPos/endPos)
 * 3. Optionally: Lines divide textboxes properly
 */
export function validateLineValidationTest(
    presentation: AITPres,
    test: TLineValidationTestSchema,
    startTime: number
): TTestResult {
    const TOLERANCE = 10; // 10px tolerance for numerical comparisons
    
    try {
        // Get lines to validate
        const lineFilter = test.filter || { shapeType: "line" };
        const lines = getShapes(presentation, test.slideId, lineFilter);

        if (lines.length === 0) {
            return {
                testName:
                    test.description ||
                    `line_validation - no lines found`,
                status: "failed",
                message: "No lines found matching the filter",
                executionTime: Date.now() - startTime,
            };
        }

        const issues: string[] = [];
        const lineData: Array<{
            id: number;
            startPos: [number, number];
            endPos: [number, number];
            isVertical: boolean;
            length: number;
        }> = [];

        // Check each line
        for (const line of lines) {
            const startPos = line.startPos as [number, number] | undefined;
            const endPos = line.endPos as [number, number] | undefined;

            if (!startPos || !endPos) {
                issues.push(`Line ${line.id} is missing startPos or endPos`);
                continue;
            }

            // Calculate if line is vertical (startPos[0] == endPos[0])
            const xDiff = Math.abs(startPos[0] - endPos[0]);
            const isVertical = xDiff <= TOLERANCE;

            // Calculate line length
            const length = Math.sqrt(
                Math.pow(endPos[0] - startPos[0], 2) +
                Math.pow(endPos[1] - startPos[1], 2)
            );

            lineData.push({
                id: line.id,
                startPos,
                endPos,
                isVertical,
                length,
            });

            // Check verticality if required
            if (test.checkVerticality && !isVertical) {
                issues.push(
                    `Line ${line.id} is not vertical: startPos X=${startPos[0].toFixed(1)}, endPos X=${endPos[0].toFixed(1)} (diff: ${xDiff.toFixed(1)}px)`
                );
            }
        }

        // Check equal length if required
        if (test.checkEqualLength && lineData.length >= 2) {
            const lengths = lineData.map((l) => l.length);
            const firstLength = lengths[0];
            const allEqual = lengths.every(
                (len) => Math.abs(len - firstLength) <= TOLERANCE
            );

            if (!allEqual) {
                const lengthStr = lengths.map((l) => l.toFixed(1)).join(", ");
                issues.push(
                    `Lines have different lengths: ${lengthStr}px (tolerance: ${TOLERANCE}px)`
                );
            }
        }

        // Check that lines divide textboxes if required
        if (test.checkDividesTextboxes && test.textboxFilter) {
            const textboxes = getShapes(
                presentation,
                test.slideId,
                test.textboxFilter
            );

            if (textboxes.length === 0) {
                issues.push("No textboxes found for division check");
            } else if (textboxes.length < 2) {
                issues.push(`Need at least 2 textboxes for division check, found ${textboxes.length}`);
            } else {
                // Get textbox X positions (center or topLeft)
                const textboxXPositions = textboxes.map((tb) => {
                    const pos = tb.pos;
                    return pos?.center?.[0] ?? pos?.topLeft?.[0] ?? 0;
                });

                // Get line X positions (use startPos[0] since lines are vertical)
                const lineXPositions = lineData.map((l) => l.startPos[0]);

                // Check that lines are positioned between textboxes
                // Sort textbox positions
                const sortedTextboxX = [...textboxXPositions].sort((a, b) => a - b);
                const sortedLineX = [...lineXPositions].sort((a, b) => a - b);

                // For N textboxes, we should have N-1 lines dividing them
                // Lines should be between consecutive textboxes
                if (sortedTextboxX.length >= 2 && sortedLineX.length >= 1) {
                    // Check that each gap between textboxes has a line
                    const usedLines = new Set<number>();
                    
                    for (let i = 0; i < sortedTextboxX.length - 1; i++) {
                        const leftX = sortedTextboxX[i];
                        const rightX = sortedTextboxX[i + 1];
                        const gapCenter = (leftX + rightX) / 2;

                        // Find closest unused line to this gap
                        let closestLineIdx = -1;
                        let closestDist = Infinity;
                        
                        for (let j = 0; j < sortedLineX.length; j++) {
                            if (usedLines.has(j)) continue;
                            const dist = Math.abs(sortedLineX[j] - gapCenter);
                            if (dist < closestDist) {
                                closestDist = dist;
                                closestLineIdx = j;
                            }
                        }

                        if (closestLineIdx === -1) {
                            issues.push(
                                `No line found between textbox at X=${leftX.toFixed(1)} and X=${rightX.toFixed(1)}`
                            );
                        } else {
                            const lineX = sortedLineX[closestLineIdx];
                            // Allow tolerance: line should be between leftX and rightX, or very close to gap center
                            const isBetween = lineX >= leftX - TOLERANCE && lineX <= rightX + TOLERANCE;
                            const isNearCenter = Math.abs(lineX - gapCenter) <= TOLERANCE * 3; // 3x tolerance for division
                            
                            if (!isBetween && !isNearCenter) {
                                issues.push(
                                    `Line at X=${lineX.toFixed(1)} is not properly dividing textboxes (expected between ${leftX.toFixed(1)} and ${rightX.toFixed(1)})`
                                );
                            } else {
                                usedLines.add(closestLineIdx);
                            }
                        }
                    }
                }
            }
        }

        const passed = issues.length === 0;

        return {
            testName:
                test.description ||
                `line_validation - ${lines.length} line(s)`,
            status: passed ? "passed" : "failed",
            message: passed
                ? `All ${lines.length} line(s) passed validation`
                : issues.join("; "),
            actual: {
                lineCount: lines.length,
                lineData: lineData.map((l) => ({
                    id: l.id,
                    isVertical: l.isVertical,
                    length: l.length.toFixed(1),
                    startPos: l.startPos,
                    endPos: l.endPos,
                })),
                issues,
            },
            expected: passed
                ? undefined
                : `All lines should be vertical, have equal length${test.checkDividesTextboxes ? ", and divide textboxes properly" : ""}`,
            executionTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            testName:
                test.description ||
                `line_validation`,
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
            executionTime: Date.now() - startTime,
        };
    }
}

