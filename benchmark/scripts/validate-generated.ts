#!/usr/bin/env tsx
/**
 * Validate Generated Results Script
 *
 * This script validates generated benchmark results against their test validation.ts files.
 *
 * Usage:
 *   tsx scripts/validate-generated.ts [options]
 *
 * Options:
 *   --scenario <name>     Scenario name (default: "basic-shapes")
 *   --run <folder>        Specific run folder name (default: latest)
 *   --test <id>           Specific test ID to validate (e.g., "test-1")
 *   --output <format>     Output format: "console" | "json" (default: "console")
 */

import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { config } from "dotenv";
import { AITPres } from "../../api/server/src/schemas/base/index.js";
import { TChangesetTestProtocol, TTestSuiteResult } from "../evaluation/schemas.js";
import { validateTest } from "../evaluation/validation/index.js";

// Load .env file from benchmark directory
config({ path: path.join(__dirname, "..", ".env") });

const execAsync = promisify(exec);

const SCENARIOS_DIR = path.join(__dirname, "..", "scenarios");

interface ValidationResult {
    testId: string;
    pptxFile: string;
    validationFile: string;
    result: TTestSuiteResult | null;
    error?: string;
}

interface RunValidationResult {
    runFolder: string;
    scenario: string;
    timestamp: string;
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    score: number;
    results: ValidationResult[];
    // Weighted score breakdown
    weightedScore?: number;
    staticTestScore?: number;
    llmJudgeScore?: number;
    llmJudgeWeight?: number;
}

/**
 * Get the latest run folder for a scenario
 */
function getLatestRunFolder(scenarioPath: string): string | null {
    const generatedDir = path.join(scenarioPath, "__generated__");
    if (!fs.existsSync(generatedDir)) {
        return null;
    }

    const folders = fs
        .readdirSync(generatedDir)
        .filter((f) => f.startsWith("run-"))
        .sort()
        .reverse();

    return folders.length > 0 ? folders[0] : null;
}

/**
 * Get all test IDs from a scenario folder
 */
function getTestIds(scenarioPath: string): string[] {
    return fs
        .readdirSync(scenarioPath)
        .filter((f) => f.startsWith("test-") && fs.statSync(path.join(scenarioPath, f)).isDirectory())
        .sort((a, b) => {
            const numA = parseInt(a.replace("test-", ""));
            const numB = parseInt(b.replace("test-", ""));
            return numA - numB;
        });
}

/**
 * Extract datamodel from a PPTX file using Python
 * Uses a minimal extraction that only gets slides (not masters) to avoid issues with complex presentations
 */
async function extractDatamodel(pptxPath: string): Promise<AITPres> {
    const cwd = process.cwd().endsWith("benchmark")
        ? process.cwd().replace("/benchmark", "")
        : process.cwd();
    
    // Convert to absolute path for Python script
    const absolutePptxPath = path.isAbsolute(pptxPath) 
        ? pptxPath 
        : path.resolve(pptxPath);

    const pythonScript = `
import sys
import os
import json
import io

old_stdout = sys.stdout
sys.stdout = io.StringIO()

try:
    sys.path.insert(0, '${cwd}/api/python')
    from src.services.pres_service import PresentationService
    from src.services.slide_service import SlideService

    # Extract presentation info
    with PresentationService('${absolutePptxPath}') as pres_service:
        info = pres_service.get_presentation_info()

    # Extract slides only (skip master extraction which can fail)
    slide_service = SlideService('${absolutePptxPath}')
    slides = []
    with slide_service:
        for slide in slide_service.pres.slides:
            try:
                slides.append(slide_service.extract_slide_data(slide).model_dump())
            except Exception as e:
                # If slide extraction fails, add minimal slide data
                slides.append({
                    'id': slide.slide_id,
                    'index': slide_service.pres.slides.index(slide),
                    'shapes': [],
                    'error': str(e)
                })

    sys.stdout = old_stdout

    result = {
        'info': info.model_dump() if hasattr(info, 'model_dump') else info,
        'slides': slides
    }
    print(json.dumps(result, default=str))
except Exception as e:
    sys.stdout = old_stdout
    import traceback
    error_result = {'error': f'Failed to extract datamodel: {str(e)}', 'traceback': traceback.format_exc()}
    print(json.dumps(error_result))
`;

    const command = `cd "${cwd}/api/python" && poetry run python3 -c "${pythonScript.replace(/"/g, '\\"')}" 2>/dev/null`;

    const { stdout } = await execAsync(command, {
        env: {
            ...process.env,
            PYTHONPATH: `${cwd}/api/python`,
        },
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large presentations
    });

    const result = JSON.parse(stdout.trim());
    if (result.error) {
        throw new Error(result.error);
    }

    return result as AITPres;
}

/**
 * Load validation tests from a test folder
 */
async function loadValidationTests(testFolder: string): Promise<TChangesetTestProtocol | null> {
    const validationPath = path.join(testFolder, "validation.ts");
    if (!fs.existsSync(validationPath)) {
        return null;
    }

    // Dynamically import the validation module
    const module = await import(validationPath);
    return module.Test as TChangesetTestProtocol;
}

/**
 * Validate a single test result
 */
async function validateSingleTest(
    scenarioPath: string,
    runFolderPath: string | null,
    testId: string,
    scenarioName: string,
    useGroundtruth: boolean = false
): Promise<ValidationResult> {
    const testFolder = path.join(scenarioPath, testId);
    
    // If using groundtruth mode, look for groundtruth.pptx in the test folder directly
    let pptxPath: string;
    let pptxFileName: string;
    if (useGroundtruth) {
        pptxFileName = "groundtruth.pptx";
        pptxPath = path.join(testFolder, pptxFileName);
    } else {
        pptxFileName = `result_${scenarioName}-${testId}.pptx`;
        pptxPath = path.join(runFolderPath!, pptxFileName);
    }
    
    const validationPath = path.join(testFolder, "validation.ts");

    const result: ValidationResult = {
        testId,
        pptxFile: pptxPath,
        validationFile: validationPath,
        result: null,
    };

    // Check if PPTX result exists
    if (!fs.existsSync(pptxPath)) {
        result.error = `Result file not found: ${pptxFileName}`;
        return result;
    }

    // Check if validation.ts exists
    if (!fs.existsSync(validationPath)) {
        result.error = `No validation.ts found for ${testId}`;
        return result;
    }

    try {
        // Load validation tests
        const tests = await loadValidationTests(testFolder);
        if (!tests || tests.length === 0) {
            result.error = `No tests defined in validation.ts for ${testId}`;
            return result;
        }

        // Extract datamodel from PPTX
        const datamodel = await extractDatamodel(pptxPath);

        // Build context for validation (needed for LLM judge tests)
        const initialPresentationPath = path.join(testFolder, "pres.pptx");
        const promptPath = path.join(testFolder, "prompt.md");
        const taskPrompt = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, "utf-8").trim() : undefined;

        const context = {
            presentationPath: pptxPath,
            initialPresentationPath: fs.existsSync(initialPresentationPath) ? initialPresentationPath : undefined,
            taskPrompt,
            caseId: `${scenarioName}/${testId}`,
            testDirectory: testFolder,
        };

        // Run validation
        result.result = await validateTest(datamodel, tests, context);
    } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
    }

    return result;
}

/**
 * Validate all tests in a run folder
 */
async function validateRun(
    scenarioName: string,
    runFolderName?: string,
    specificTestId?: string
): Promise<RunValidationResult> {
    const scenarioPath = path.join(SCENARIOS_DIR, scenarioName);

    if (!fs.existsSync(scenarioPath)) {
        throw new Error(`Scenario not found: ${scenarioName}`);
    }

    // Check if using groundtruth mode (use groundtruth.pptx from each test folder)
    const useGroundtruth = runFolderName === "groundtruth";
    
    let folderName: string;
    let runFolderPath: string | null = null;
    
    if (useGroundtruth) {
        folderName = "groundtruth";
        // No run folder path needed - we'll use groundtruth.pptx from each test folder
    } else {
        // Get run folder
        folderName = runFolderName || getLatestRunFolder(scenarioPath) || "";
        if (!folderName) {
            throw new Error(`No run folders found in ${scenarioName}/__generated__`);
        }

        runFolderPath = path.join(scenarioPath, "__generated__", folderName);
        if (!fs.existsSync(runFolderPath)) {
            throw new Error(`Run folder not found: ${folderName}`);
        }
    }

    // Get test IDs to validate
    let testIds = getTestIds(scenarioPath);
    if (specificTestId) {
        if (!testIds.includes(specificTestId)) {
            throw new Error(`Test not found: ${specificTestId}`);
        }
        testIds = [specificTestId];
    }

    // Validate each test
    const results: ValidationResult[] = [];
    for (const testId of testIds) {
        const result = await validateSingleTest(scenarioPath, runFolderPath, testId, scenarioName, useGroundtruth);
        results.push(result);
    }

    // Calculate totals
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    // Collect weighted scores from each test result
    const weightedScores: number[] = [];
    const staticScores: number[] = [];
    const llmScores: number[] = [];
    let llmWeight: number | undefined;

    for (const r of results) {
        if (r.result) {
            totalTests += r.result.totalTests;
            totalPassed += r.result.passed;
            totalFailed += r.result.failed;

            // Collect weighted score if available
            if (r.result.weightedScore !== undefined) {
                weightedScores.push(r.result.weightedScore);
            }
            if (r.result.staticTestScore !== undefined) {
                staticScores.push(r.result.staticTestScore);
            }
            if (r.result.llmJudgeScore !== undefined) {
                llmScores.push(r.result.llmJudgeScore);
            }
            if (r.result.llmJudgeWeight !== undefined && llmWeight === undefined) {
                llmWeight = r.result.llmJudgeWeight;
            }
        } else if (r.error) {
            totalTests += 1;
            totalFailed += 1;
        }
    }

    const score = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    // Calculate aggregate weighted scores
    const weightedScore = weightedScores.length > 0
        ? weightedScores.reduce((a, b) => a + b, 0) / weightedScores.length
        : undefined;
    const staticTestScore = staticScores.length > 0
        ? staticScores.reduce((a, b) => a + b, 0) / staticScores.length
        : undefined;
    const llmJudgeScore = llmScores.length > 0
        ? llmScores.reduce((a, b) => a + b, 0) / llmScores.length
        : undefined;

    return {
        runFolder: folderName,
        scenario: scenarioName,
        timestamp: new Date().toISOString(),
        totalTests,
        totalPassed,
        totalFailed,
        score,
        results,
        weightedScore,
        staticTestScore,
        llmJudgeScore,
        llmJudgeWeight: llmWeight,
    };
}

/**
 * Format console output
 */
function formatConsoleOutput(result: RunValidationResult): void {
    console.log("\n" + "=".repeat(80));
    console.log(`VALIDATION RESULTS - ${result.scenario}`);
    console.log(`Run: ${result.runFolder}`);
    console.log("=".repeat(80) + "\n");

    for (const r of result.results) {
        const hasValidation = !r.error?.includes("No validation.ts");
        const hasResult = !r.error?.includes("Result file not found");

        if (!hasResult) {
            console.log(`❌ ${r.testId}: No result file`);
            continue;
        }

        if (!hasValidation) {
            console.log(`⚪ ${r.testId}: No validation.ts (skipped)`);
            continue;
        }

        if (r.error) {
            console.log(`❌ ${r.testId}: ERROR - ${r.error}`);
            continue;
        }

        if (r.result) {
            const status = r.result.failed === 0 ? "✅" : "❌";
            const weightedInfo = r.result.weightedScore !== undefined
                ? ` (weighted: ${r.result.weightedScore.toFixed(1)}%)`
                : "";
            console.log(`${status} ${r.testId}: ${r.result.passed}/${r.result.totalTests} passed${weightedInfo}`);

            // Show failed test details
            for (const test of r.result.results) {
                if (test.status === "failed") {
                    console.log(`   └─ FAILED: ${test.testName}`);
                    if (test.message) {
                        console.log(`      Message: ${test.message}`);
                    }
                    if (test.actual !== undefined && test.expected !== undefined) {
                        console.log(`      Expected: ${JSON.stringify(test.expected)}`);
                        console.log(`      Actual: ${JSON.stringify(test.actual)}`);
                    }
                }
            }
        }
    }

    console.log("\n" + "-".repeat(80));
    console.log(`SUMMARY: ${result.totalPassed}/${result.totalTests} tests passed (${result.score.toFixed(1)}%)`);

    // Show weighted score breakdown if available
    if (result.weightedScore !== undefined) {
        console.log("");
        console.log("WEIGHTED SCORE BREAKDOWN:");
        if (result.staticTestScore !== undefined) {
            console.log(`  Static Tests:  ${result.staticTestScore.toFixed(1)}% (weight: ${((1 - (result.llmJudgeWeight ?? 0.5)) * 100).toFixed(0)}%)`);
        }
        if (result.llmJudgeScore !== undefined) {
            console.log(`  LLM Judge:     ${result.llmJudgeScore.toFixed(1)}% (weight: ${((result.llmJudgeWeight ?? 0.5) * 100).toFixed(0)}%)`);
        }
        console.log(`  ─────────────────────────`);
        console.log(`  OVERALL:       ${result.weightedScore.toFixed(1)}%`);
    }
    console.log("-".repeat(80) + "\n");
}

/**
 * Parse command line arguments
 */
function parseArgs(): { scenario: string; run?: string; test?: string; output: string } {
    const args = process.argv.slice(2);
    const options: { scenario: string; run?: string; test?: string; output: string } = {
        scenario: "basic-shapes",
        output: "console",
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--scenario":
                options.scenario = args[++i];
                break;
            case "--run":
                options.run = args[++i];
                break;
            case "--test":
                options.test = args[++i];
                break;
            case "--output":
                options.output = args[++i];
                break;
        }
    }

    return options;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
    const options = parseArgs();

    try {
        const result = await validateRun(options.scenario, options.run, options.test);

        if (options.output === "json") {
            console.log(JSON.stringify(result, null, 2));
        } else {
            formatConsoleOutput(result);
        }

        // Exit with error code if any tests failed
        process.exit(result.totalFailed > 0 ? 1 : 0);
    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main();
