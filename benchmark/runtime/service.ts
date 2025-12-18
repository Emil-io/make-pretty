import { AITPres } from "../../api/server/src/schemas/base/index.js";
import { AIChangesetSchema } from "../../api/server/src/schemas/changeset/schemas/changeset.js";
import { createPowerPointService } from "../../api/server/src/services/addin/powerpoint/service.js";
import {
    TChangesetTestProtocol,
    TTestSuiteResult,
} from "../evaluation/schemas.js";
import { validateTest } from "../evaluation/validation/index.js";
import fs from "fs/promises";
import path from "path";
import {
    clearGeneratedFiles,
    getGeneratedDatamodels,
    getTestCaseData,
    getTestCaseIds,
    getTestCaseDirectory,
    getTestCasePresentationPath,
    getTestCasePrompt,
    getTestCaseProtocol,
    saveGeneratedDatamodel,
} from "./scenarios.js";
import {
    GetResultsResponse,
    GetTestCaseIdsResponse,
    GetTestCaseResponse,
    RestartResponse,
    SubmitChangesetRequest,
    SubmitChangesetResponse,
} from "./types.js";

/**
 * Agent Beats Service
 * Contains all business logic for the agent-beats API
 */
export class AgentBeatsService {
    private readonly pptxService = createPowerPointService({
        baseUrl: process.env.PPTX_API || "http://localhost:8000",
    });

    /**
     * Get all test case IDs
     */
    async getTestCaseIds(): Promise<GetTestCaseIdsResponse> {
        try {
            const testCaseIds = await getTestCaseIds();
            console.log("testCaseIds", testCaseIds);
            return { ids: testCaseIds };
        } catch (error) {
            throw new Error(
                `Failed to get test case IDs: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Get test case data (datamodel and prompt)
     */
    async getTestCaseData(caseId: string): Promise<GetTestCaseResponse> {
        try {
            const testCaseData = await getTestCaseData(caseId);

            if (!testCaseData) {
                throw new Error(`Test case '${caseId}' not found`);
            }

            return testCaseData;
        } catch (error) {
            throw new Error(
                `Failed to get test case data for ${caseId}: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Submit a changeset for processing
     */
    async submitChangeset(
        request: SubmitChangesetRequest,
    ): Promise<SubmitChangesetResponse> {
        try {
            const { caseId, whiteAgentId, changeset } = request;

            // Validate changeset against Zod schema
            const validation = this.validateChangeset(changeset);
            if (!validation.success) {
                console.error(
                    `Invalid changeset: ${JSON.stringify(validation.errors)}`,
                );
                return {
                    success: false,
                    error: `Invalid changeset: ${JSON.stringify(validation.errors)}`,
                };
            }

            // Get the presentation path for the test case
            const presentationPath = await getTestCasePresentationPath(caseId);
            console.log("presentationPath", presentationPath);
            if (!presentationPath) {
                console.error(
                    `Presentation file not found for test case '${caseId}'`,
                );
                return {
                    success: false,
                    error: `Presentation file not found for test case '${caseId}'`,
                };
            }

            // Extract the original presentation datamodel so we can verify
            // that the submitted changeset actually changes the output.
            const originalExtractionResult =
                await this.extractDatamodel(presentationPath);
            if (!originalExtractionResult.success) {
                console.error(
                    `Failed to extract original datamodel: ${originalExtractionResult.error}`,
                );
                return {
                    success: false,
                    error:
                        originalExtractionResult.error ??
                        "Failed to extract original datamodel",
                };
            }

            // Inject changeset into presentation
            const injectionResult = await this.injectChangeset(
                presentationPath,
                validation.data,
                caseId,
                whiteAgentId,
            );
            if (!injectionResult.success) {
                console.error(
                    `Failed to inject changeset: ${injectionResult.error}`,
                );
                return {
                    success: false,
                    error: injectionResult.error,
                };
            }

            // Extract datamodel from the new presentation
            const extractionResult = await this.extractDatamodel(
                injectionResult.outputPath!,
            );
            if (!extractionResult.success) {
                console.error(
                    `Failed to extract datamodel: ${extractionResult.error}`,
                );
                return {
                    success: false,
                    error: extractionResult.error,
                };
            }

            // Save the generated datamodel
            await saveGeneratedDatamodel(
                caseId,
                whiteAgentId,
                extractionResult.datamodel,
            );

            // Sanity check: if we received a non-empty changeset, ensure the
            // resulting extracted datamodel reflects it (to catch accidental
            // "success" responses where the changeset was ignored).
            const verification = this.verifyChangesetApplied(
                originalExtractionResult.datamodel!,
                extractionResult.datamodel!,
                validation.data,
            );
            if (!verification.applied) {
                const msg = `Changeset verification failed: ${verification.reasons.join(
                    "; ",
                )}`;
                console.error(msg);
                return {
                    success: false,
                    error: msg,
                };
            }

            return {
                success: true,
                message: "Changeset submitted and processed successfully",
            };
        } catch (error) {
            console.error("Error submitting changeset:", error);
            return {
                success: false,
                error: `Failed to submit changeset: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    /**
     * Get test results for a white agent
     */
    async getResults(whiteAgentId: string): Promise<GetResultsResponse> {
        try {
            // Get all generated datamodels for this white agent
            const generatedDatamodels =
                await getGeneratedDatamodels(whiteAgentId);

            if (generatedDatamodels.length === 0) {
                throw new Error(
                    `No results found for white agent '${whiteAgentId}'`,
                );
            }

            // Run validation for each test case
            const testResults: TTestSuiteResult[] = [];
            for (const { caseId, datamodel } of generatedDatamodels) {
                try {
                    const testProtocol = await getTestCaseProtocol(caseId);
                    const result = await this.runTestValidation(
                        caseId,
                        whiteAgentId,
                        datamodel,
                        testProtocol,
                    );
                    testResults.push(result);
                } catch (error) {
                    console.error(
                        `Error running validation for ${caseId}:`,
                        error,
                    );
                    // Add a failed result for this case
                    testResults.push({
                        totalTests: 1,
                        passed: 0,
                        failed: 1,
                        results: [
                            {
                                testName: "validation_error",
                                status: "failed",
                                message:
                                    error instanceof Error
                                        ? error.message
                                        : String(error),
                                executionTime: 0,
                            },
                        ],
                    });
                }
            }

            // Calculate overall score
            const scoreData = this.calculateScore(testResults);

            // Format response
            return {
                whiteAgentId,
                score: scoreData.totalScore,
                totalTests: scoreData.totalTests,
                totalPassed: scoreData.totalPassed,
                totalFailed: scoreData.totalFailed,
                tests: testResults.map((result, index) => ({
                    caseId: generatedDatamodels[index].caseId,
                    success: result.failed === 0,
                    passed: result.passed,
                    failed: result.failed,
                    errors: result.results
                        .filter((r) => r.status === "failed")
                        .map((r) => ({
                            testName: r.testName,
                            message: r.message,
                            actual: r.actual,
                            expected: r.expected,
                        })),
                })),
            };
        } catch (error) {
            throw new Error(
                `Failed to get test results for white agent ${whiteAgentId}: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Restart the system by clearing generated files
     */
    async restart(): Promise<RestartResponse> {
        try {
            await clearGeneratedFiles();
            return {
                success: true,
                message: "All generated files have been cleared",
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to clear generated files: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    /**
     * Validate a changeset against the Zod schema
     */
    private validateChangeset(changeset: any): {
        success: boolean;
        data?: any;
        errors?: any;
    } {
        try {
            const validatedChangeset = AIChangesetSchema.parse(changeset);
            return {
                success: true,
                data: validatedChangeset,
            };
        } catch (error: any) {
            return {
                success: false,
                errors: error.errors || error.message,
            };
        }
    }

    private verifyChangesetApplied(
        original: AITPres,
        updated: AITPres,
        changeset: any,
    ): { applied: boolean; reasons: string[] } {
        const reasons: string[] = [];

        const added = Array.isArray(changeset?.added) ? changeset.added : [];
        const modified = Array.isArray(changeset?.modified)
            ? changeset.modified
            : [];
        const deleted = Array.isArray(changeset?.deleted) ? changeset.deleted : [];

        const hasIntent =
            added.length > 0 || modified.length > 0 || deleted.length > 0;
        if (!hasIntent) {
            // Nothing to verify (no-op changeset).
            return { applied: true, reasons: [] };
        }

        const originalSlide = original.slides?.[0];
        const updatedSlide = updated.slides?.[0];
        if (!originalSlide || !updatedSlide) {
            return {
                applied: false,
                reasons: ["Missing slide data in original or updated datamodel"],
            };
        }

        const originalShapes = originalSlide.shapes ?? [];
        const updatedShapes = updatedSlide.shapes ?? [];

        const originalById = new Map<number, any>(
            originalShapes
                .filter((s: any) => typeof s?.id === "number")
                .map((s: any) => [s.id as number, s]),
        );
        const updatedById = new Map<number, any>(
            updatedShapes
                .filter((s: any) => typeof s?.id === "number")
                .map((s: any) => [s.id as number, s]),
        );

        const approx = (a: number, b: number, eps: number = 0.25): boolean =>
            Number.isFinite(a) &&
            Number.isFinite(b) &&
            Math.abs(a - b) <= eps;

        const verifyPos = (shape: any, posPatch: any): boolean => {
            if (!posPatch || typeof posPatch !== "object") return true;
            const sp = shape?.pos;
            if (!sp || typeof sp !== "object") return false;
            const checks: Array<() => boolean> = [];
            for (const key of ["topLeft", "bottomRight", "center"] as const) {
                if (Array.isArray(posPatch[key]) && posPatch[key].length === 2) {
                    checks.push(() => {
                        const v = sp[key];
                        return (
                            Array.isArray(v) &&
                            v.length === 2 &&
                            approx(Number(v[0]), Number(posPatch[key][0])) &&
                            approx(Number(v[1]), Number(posPatch[key][1]))
                        );
                    });
                }
            }
            return checks.length === 0 ? true : checks.every((c) => c());
        };

        const verifySize = (shape: any, sizePatch: any): boolean => {
            if (!sizePatch || typeof sizePatch !== "object") return true;
            const ss = shape?.size;
            if (!ss || typeof ss !== "object") return false;
            if (typeof sizePatch.w === "number" && !approx(Number(ss.w), sizePatch.w)) {
                return false;
            }
            if (typeof sizePatch.h === "number" && !approx(Number(ss.h), sizePatch.h)) {
                return false;
            }
            return true;
        };

        // Deleted shapes should not exist anymore
        for (const d of deleted) {
            const id = d?.id;
            if (typeof id === "number" && updatedById.has(id)) {
                reasons.push(`Deleted shape ${id} still present in updated datamodel`);
            }
        }

        // Modified shapes should reflect requested patches (pos/size/zIndex)
        let anyVerifiedChange = false;
        for (const m of modified) {
            const id = m?.id;
            if (typeof id !== "number") continue;
            const before = originalById.get(id);
            const after = updatedById.get(id);
            if (!before || !after) {
                reasons.push(`Modified shape ${id} missing before or after`);
                continue;
            }

            let thisShapeVerified = false;

            if (m.pos) {
                const ok = verifyPos(after, m.pos);
                if (!ok) {
                    reasons.push(`Modified shape ${id} position does not match requested patch`);
                } else {
                    thisShapeVerified = true;
                }
            }

            if (m.size) {
                const ok = verifySize(after, m.size);
                if (!ok) {
                    reasons.push(`Modified shape ${id} size does not match requested patch`);
                } else {
                    thisShapeVerified = true;
                }
            }

            if (typeof m.zIndex === "number") {
                if (after?.zIndex !== m.zIndex) {
                    reasons.push(`Modified shape ${id} zIndex not applied (expected ${m.zIndex}, got ${after?.zIndex})`);
                } else {
                    thisShapeVerified = true;
                }
            }

            // If the changeset requested changes but the post-state equals pre-state on common fields, flag it.
            if (thisShapeVerified) {
                anyVerifiedChange = true;
            } else if (m.pos || m.size || typeof m.zIndex === "number") {
                const unchanged =
                    JSON.stringify(before?.pos) === JSON.stringify(after?.pos) &&
                    JSON.stringify(before?.size) === JSON.stringify(after?.size) &&
                    before?.zIndex === after?.zIndex;
                if (unchanged) {
                    reasons.push(`Modified shape ${id} appears unchanged after injection`);
                }
            }
        }

        // Added shapes should introduce at least one new ID in the updated slide.
        if (added.length > 0) {
            const originalIds = new Set<number>(originalById.keys());
            const newIds = [...updatedById.keys()].filter((id) => !originalIds.has(id));
            if (newIds.length === 0) {
                reasons.push("Added shapes requested but no new shape IDs appeared in updated datamodel");
            } else {
                anyVerifiedChange = true;
            }
        }

        // If we only had deletions, that itself counts as a verified change.
        if (!anyVerifiedChange && deleted.length > 0 && reasons.length === 0) {
            anyVerifiedChange = true;
        }

        return { applied: reasons.length === 0 && anyVerifiedChange, reasons };
    }

    /**
     * Inject changeset into PowerPoint presentation using PowerPointService
     */
    private async injectChangeset(
        presentationPath: string,
        changeset: any,
        caseId: string,
        whiteAgentId: string,
    ): Promise<{
        success: boolean;
        outputPath?: string;
        error?: string;
    }> {
        try {
            // Generate output path in __generated__ folder with test ID and agent ID
            // Create __generated__ directory if it doesn't exist
            const generatedDir = path.join(__dirname, "..", "__generated__");
            await fs.mkdir(generatedDir, { recursive: true });

            // Generate filename with test ID and agent ID
            const outputPath = path.join(
                generatedDir,
                `${caseId}_${whiteAgentId}_injected.pptx`,
            );

            const result = await this.pptxService.injectChangeset(
                presentationPath,
                changeset,
                outputPath,
            );

            return {
                success: true,
                outputPath: result.outputPath || outputPath,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Extract datamodel from PowerPoint presentation
     */
    private async extractDatamodel(presentationPath: string): Promise<{
        success: boolean;
        datamodel?: AITPres;
        error?: string;
    }> {
        try {
            const result = await this.pptxService.getPresentation(
                presentationPath,
            );

            return {
                success: true,
                datamodel: result as unknown as AITPres,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Run test validation for a specific test case
     */
    private async runTestValidation(
        caseId: string,
        whiteAgentId: string,
        datamodel: AITPres,
        testProtocol: TChangesetTestProtocol,
    ): Promise<TTestSuiteResult> {
        try {
            // Provide context required by llm_judge tests.
            const testDirectory = await getTestCaseDirectory(caseId);
            const initialPresentationPath = await getTestCasePresentationPath(
                caseId,
            );
            const taskPrompt = await getTestCasePrompt(caseId);

            const path = require("path");
            const fs = require("fs");
            const generatedDir = path.join(__dirname, "..", "__generated__");
            const resultPresentationPath = path.join(
                generatedDir,
                `${caseId}_${whiteAgentId}_injected.pptx`,
            );

            const context = {
                presentationPath: fs.existsSync(resultPresentationPath)
                    ? resultPresentationPath
                    : undefined,
                initialPresentationPath: initialPresentationPath ?? undefined,
                taskPrompt: taskPrompt ?? undefined,
                caseId,
                testDirectory: testDirectory ?? undefined,
            };

            return await validateTest(datamodel, testProtocol, context);
        } catch (error) {
            console.error(
                `Error running test validation for ${caseId}:`,
                error,
            );
            return {
                totalTests: 0,
                passed: 0,
                failed: 1,
                results: [
                    {
                        testName: "validation_error",
                        status: "failed",
                        message:
                            error instanceof Error
                                ? error.message
                                : String(error),
                        executionTime: 0,
                    },
                ],
            };
        }
    }

    /**
     * Calculate overall score from test results
     */
    private calculateScore(testResults: TTestSuiteResult[]): {
        totalScore: number;
        totalTests: number;
        totalPassed: number;
        totalFailed: number;
        caseResults: {
            caseId: string;
            score: number;
            passed: number;
            failed: number;
            results: TTestSuiteResult;
        }[];
    } {
        let totalTests = 0;
        let totalPassed = 0;
        let totalFailed = 0;

        const caseResults = testResults.map((result, index) => {
            totalTests += result.totalTests;
            totalPassed += result.passed;
            totalFailed += result.failed;

            const score =
                result.totalTests > 0
                    ? (result.passed / result.totalTests) * 100
                    : 0;

            return {
                caseId: `test-${index + 1}`, // This should be the actual case ID
                score,
                passed: result.passed,
                failed: result.failed,
                results: result,
            };
        });

        const totalScore =
            totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

        return {
            totalScore,
            totalTests,
            totalPassed,
            totalFailed,
            caseResults,
        };
    }
}

// Export a singleton instance
export const agentBeatsService = new AgentBeatsService();
