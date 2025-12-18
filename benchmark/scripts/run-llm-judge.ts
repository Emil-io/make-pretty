#!/usr/bin/env tsx

/**
 * Standalone script to run LLM-as-a-Judge evaluation
 *
 * Usage:
 *   npm run llm-judge -- --case basic-shapes/test-12
 *   npm run llm-judge -- --scenario basic-shapes
 *   npm run llm-judge -- --case basic-shapes/test-12 --regenerate
 *   npm run llm-judge -- --case basic-shapes/test-12 --output results.json
 */

import * as path from "path";
import * as fs from "fs/promises";
import { config } from "dotenv";
import { runLLMJudgeEvaluation } from "../evaluation/llm-judge";

// Load .env file from benchmark directory
config({ path: path.join(__dirname, "..", ".env") });

interface CLIArgs {
    case?: string;
    scenario?: string;
    regenerate?: boolean;
    output?: string;
    verbose?: boolean;
}

async function main() {
    const args = parseArgs();

    if (!args.case && !args.scenario) {
        console.error("Error: Must specify either --case or --scenario");
        printUsage();
        process.exit(1);
    }

    if (args.case) {
        await runSingleCase(args.case, args);
    } else if (args.scenario) {
        await runScenario(args.scenario, args);
    }
}

function parseArgs(): CLIArgs {
    const args: CLIArgs = {};
    const argv = process.argv.slice(2);

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--case" && i + 1 < argv.length) {
            args.case = argv[++i];
        } else if (arg === "--scenario" && i + 1 < argv.length) {
            args.scenario = argv[++i];
        } else if (arg === "--regenerate") {
            args.regenerate = true;
        } else if (arg === "--output" && i + 1 < argv.length) {
            args.output = argv[++i];
        } else if (arg === "--verbose" || arg === "-v") {
            args.verbose = true;
        }
    }

    return args;
}

async function runSingleCase(caseId: string, args: CLIArgs) {
    console.log(`\n=== Running LLM Judge for case: ${caseId} ===\n`);

    try {
        const scenariosDir = path.join(__dirname, "..", "scenarios");
        const testDirectory = path.join(scenariosDir, caseId);

        // Check if test directory exists
        try {
            await fs.access(testDirectory);
        } catch {
            console.error(`Error: Test directory not found: ${testDirectory}`);
            process.exit(1);
        }

        // Load test data
        const promptPath = path.join(testDirectory, "prompt.md");
        const datamodelPath = path.join(testDirectory, "datamodel.json");
        const presPath = path.join(testDirectory, "pres.pptx");

        const taskPrompt = await fs.readFile(promptPath, "utf-8");
        const datamodel = JSON.parse(await fs.readFile(datamodelPath, "utf-8"));

        // For standalone testing, we'll use the same presentation as both initial and result
        // In real usage, this would be called after the agent has generated a result
        console.log("Note: Using initial presentation as both initial and result for testing\n");

        // Get slide ID from datamodel (datamodel.json is a single slide object)
        const slideId = datamodel.id;
        if (!slideId) {
            console.error("Error: No slide ID found in datamodel");
            process.exit(1);
        }

        // Run LLM judge
        const result = await runLLMJudgeEvaluation({
            caseId,
            slideId,
            taskPrompt: taskPrompt.trim(),
            initialPresentationPath: presPath,
            resultPresentationPath: presPath, // TODO: Use actual result path
            initialDatamodel: datamodel,
            resultDatamodel: datamodel, // TODO: Use actual result datamodel
            testDirectory,
            forceRegenerate: args.regenerate,
        });

        // Print results
        console.log("\n=== Results ===\n");
        console.log(`Case ID: ${result.caseId}`);
        console.log(`Slide ID: ${result.slideId}`);
        console.log(`Overall Score: ${result.overallScorePercent.toFixed(1)}%`);
        console.log(`\nQuestions evaluated: ${result.questions.length}`);

        if (args.verbose) {
            console.log("\nDetailed Results:");
            for (const answer of result.answers) {
                const question = result.questions.find(q => q.id === answer.questionId);
                console.log(`\n[${answer.questionId}] ${question?.question}`);
                console.log(`  Score: ${answer.score}%`);
                console.log(`  Reasoning: ${answer.reasoning}`);
                if (answer.confidence) {
                    console.log(`  Confidence: ${(answer.confidence * 100).toFixed(0)}%`);
                }
            }
        } else {
            console.log("\nQuestion Scores:");
            for (const answer of result.answers) {
                const question = result.questions.find(q => q.id === answer.questionId);
                console.log(`  ${answer.questionId}: ${answer.score}% - ${question?.question}`);
            }
        }

        // Save to file if requested
        if (args.output) {
            const outputPath = path.resolve(args.output);
            await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
            console.log(`\nResults saved to: ${outputPath}`);
        }

        console.log("\n=== Done ===\n");
    } catch (error) {
        console.error("\nError running LLM judge:");
        console.error(error);
        process.exit(1);
    }
}

async function runScenario(scenarioName: string, args: CLIArgs) {
    console.log(`\n=== Running LLM Judge for scenario: ${scenarioName} ===\n`);

    try {
        const scenariosDir = path.join(__dirname, "..", "scenarios");
        const scenarioDir = path.join(scenariosDir, scenarioName);

        // Find all test cases in scenario
        const entries = await fs.readdir(scenarioDir, { withFileTypes: true });
        const testCases = entries
            .filter(entry => entry.isDirectory() && entry.name.startsWith("test-"))
            .map(entry => `${scenarioName}/${entry.name}`);

        console.log(`Found ${testCases.length} test cases\n`);

        const results = [];

        for (const caseId of testCases) {
            console.log(`\nProcessing: ${caseId}`);
            try {
                await runSingleCase(caseId, { ...args, verbose: false });
                results.push({ caseId, status: "success" });
            } catch (error) {
                console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
                results.push({ caseId, status: "failed", error: String(error) });
            }
        }

        // Summary
        console.log("\n=== Summary ===\n");
        const succeeded = results.filter(r => r.status === "success").length;
        console.log(`Succeeded: ${succeeded}/${results.length}`);
        console.log(`Failed: ${results.length - succeeded}/${results.length}`);

        // Save summary if output specified
        if (args.output) {
            const outputPath = path.resolve(args.output);
            await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
            console.log(`\nSummary saved to: ${outputPath}`);
        }

        console.log("\n=== Done ===\n");
    } catch (error) {
        console.error("\nError running scenario:");
        console.error(error);
        process.exit(1);
    }
}

function printUsage() {
    console.log(`
Usage:
  npm run llm-judge -- --case <case-id>               Run single test case
  npm run llm-judge -- --scenario <scenario-name>     Run entire scenario

Options:
  --regenerate      Force regenerate questions (ignore cache)
  --output <file>   Save results to JSON file
  --verbose, -v     Show detailed output

Examples:
  npm run llm-judge -- --case basic-shapes/test-12
  npm run llm-judge -- --scenario basic-shapes
  npm run llm-judge -- --case basic-shapes/test-12 --regenerate --output results.json
    `);
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
