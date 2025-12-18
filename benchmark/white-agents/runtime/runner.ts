/**
 * White Agent Test Runner
 *
 * This class provides the runtime infrastructure for running white-box agent tests.
 * It handles test case discovery, execution, result tracking, and output generation.
 */

import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WhiteAgentPPApi } from "./pp-api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const BENCHMARK_DIR = path.join(__dirname, "../..");
const SCENARIOS_DIR = path.join(BENCHMARK_DIR, "scenarios");
const PROMPTS_DIR = path.join(BENCHMARK_DIR, "prompts");

export interface TestResult {
    caseId: string;
    success: boolean;
    executionTime: number;
    error?: string;
    outputPath?: string;
    changeset?: any;
    validationResults?: any;
}

export interface TestSummary {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    results: TestResult[];
    executionTime: number;
}

export interface TestCaseData {
    caseId: string;
    datamodel: any;
    prompt: string;
    presentationPath: string;
}

export interface AgentConfig {
    systemPromptName?: string;
    scenarioFilter?: string | null;
    caseFilter?: string | null;
}

export interface Agent {
    /**
     * Generate a changeset for the given test case
     */
    generateChangeset(
        datamodel: any,
        userPrompt: string,
        systemPrompt: string,
    ): Promise<any>;

    name: string;
}

export interface AgentConstructor {
    new (ppApi: WhiteAgentPPApi): Agent;
}

export class WhiteAgentRunner {
    private outputDir: string;
    private runDir: string;
    private systemPromptName: string;
    private scenarioFilter: string | null;
    private caseFilter: string | null;
    private changesetSchema: string;
    private masterAnalysis: string;

    constructor(config: AgentConfig = {}) {
        this.outputDir = path.join(BENCHMARK_DIR, "__generated__");
        this.systemPromptName = config.systemPromptName || "prompt";
        this.scenarioFilter = config.scenarioFilter || null;
        this.caseFilter = config.caseFilter || null;

        // Create timestamped run directory (will be updated per scenario)
        const timestamp = new Date()
            .toISOString()
            .slice(0, 16)
            .replace(/:/g, "-");
        this.runDir = path.join(this.outputDir, `run-${timestamp}`);
        this.changesetSchema = "";
        this.masterAnalysis = "";
    }

    /**
     * Ensure output directory exists
     */
    private async ensureOutputDir(): Promise<void> {
        try {
            await fs.mkdir(this.runDir, { recursive: true });
        } catch (error) {
            console.error("Failed to create output directory:", error);
            throw error;
        }
    }

    /**
     * Load changeset schema from YAML file
     */
    private async loadChangesetSchema(): Promise<void> {
        try {
            const schemaPath = path.join(
                BENCHMARK_DIR,
                "changeset-schema.yaml",
            );
            const schemaContent = await fs.readFile(schemaPath, "utf8");
            this.changesetSchema = schemaContent;
            console.log("✅ Changeset schema loaded successfully");
        } catch (error) {
            console.warn("⚠️ Failed to load changeset schema:", error);
            this.changesetSchema = "Changeset schema not available";
        }
    }

    /**
     * Load master analysis from markdown file
     */
    private async loadMasterAnalysis(): Promise<void> {
        try {
            const analysisPath = path.join(BENCHMARK_DIR, "master-analysis.md");
            const analysisContent = await fs.readFile(analysisPath, "utf8");
            this.masterAnalysis = analysisContent;
            console.log("✅ Master analysis loaded successfully");
        } catch (error) {
            console.warn("⚠️ Failed to load master analysis:", error);
            this.masterAnalysis = "Master analysis not available";
        }
    }

    /**
     * Load system prompt from prompts folder for a specific scenario run directory
     */
    private async loadSystemPromptForScenario(runDir: string): Promise<string> {
        try {
            const promptPath = path.join(
                PROMPTS_DIR,
                `${this.systemPromptName}.md`,
            );
            const promptContent = await fs.readFile(promptPath, "utf8");

            // Save system prompt to run directory
            const sysPromptPath = path.join(runDir, "_sys-prompt.md");
            await fs.writeFile(sysPromptPath, promptContent, "utf8");

            return promptContent;
        } catch (error) {
            console.warn(
                `Failed to load system prompt from ${this.systemPromptName}.md, using default`,
            );
            const defaultPrompt =
                "You are an expert PowerPoint layout assistant. Analyze the presentation data and generate precise changesets to modify slide layouts according to user requests.";

            // Save default prompt to run directory
            const sysPromptPath = path.join(runDir, "_sys-prompt.md");
            await fs.writeFile(sysPromptPath, defaultPrompt, "utf8");

            return defaultPrompt;
        }
    }

    /**
     * Load system prompt from prompts folder
     */
    private async loadSystemPrompt(): Promise<string> {
        try {
            const promptPath = path.join(
                PROMPTS_DIR,
                `${this.systemPromptName}.md`,
            );
            const promptContent = await fs.readFile(promptPath, "utf8");

            // Save system prompt to run directory
            const sysPromptPath = path.join(this.runDir, "_sys-prompt.md");
            await fs.writeFile(sysPromptPath, promptContent, "utf8");

            return promptContent;
        } catch (error) {
            console.warn(
                `Failed to load system prompt from ${this.systemPromptName}.md, using default`,
            );
            const defaultPrompt =
                "You are an expert PowerPoint layout assistant. Analyze the presentation data and generate precise changesets to modify slide layouts according to user requests.";

            // Save default prompt to run directory
            const sysPromptPath = path.join(this.runDir, "_sys-prompt.md");
            await fs.writeFile(sysPromptPath, defaultPrompt, "utf8");

            return defaultPrompt;
        }
    }

    /**
     * Get all test case IDs based on scenario filter
     */
    private async getTestCaseIds(): Promise<string[]> {
        try {
            const entries = await fs.readdir(SCENARIOS_DIR, {
                withFileTypes: true,
            });
            const testCaseIds: string[] = [];

            for (const entry of entries) {
                if (entry.isDirectory() && !entry.name.startsWith("_")) {
                    // Apply scenario filter if specified
                    if (
                        this.scenarioFilter &&
                        entry.name !== this.scenarioFilter
                    ) {
                        continue;
                    }

                    const scenarioDir = path.join(SCENARIOS_DIR, entry.name);
                    const scenarioEntries = await fs.readdir(scenarioDir, {
                        withFileTypes: true,
                    });

                    for (const testEntry of scenarioEntries) {
                        if (
                            testEntry.isDirectory() &&
                            !testEntry.name.startsWith("_")
                        ) {
                            const testCaseId = `${entry.name}-${testEntry.name}`;

                            // Apply case filter if specified
                            if (this.caseFilter) {
                                // If scenario is specified, match exact case ID
                                if (this.scenarioFilter) {
                                    if (
                                        testCaseId !==
                                        `${this.scenarioFilter}-${this.caseFilter}`
                                    ) {
                                        continue;
                                    }
                                } else {
                                    // If no scenario specified, match just the case name
                                    if (testEntry.name !== this.caseFilter) {
                                        continue;
                                    }
                                }
                            }

                            testCaseIds.push(testCaseId);
                        }
                    }
                }
            }

            return testCaseIds;
        } catch (error) {
            console.error("Error reading test cases directory:", error);
            return [];
        }
    }

    /**
     * Get test case data (datamodel.json and prompt.md)
     */
    async getTestCaseData(caseId: string): Promise<TestCaseData | null> {
        try {
            const testIndex = caseId.lastIndexOf("test-");
            if (testIndex === -1) {
                throw new Error(`Invalid case ID format: ${caseId}`);
            }

            const scenarioName = caseId.substring(0, testIndex - 1);
            const testName = caseId.substring(testIndex);
            const caseDir = path.join(SCENARIOS_DIR, scenarioName, testName);

            // Read presentation file
            const presPath = path.join(caseDir, "pres.pptx");
            await fs.access(presPath); // Check if file exists

            // Read prompt.md
            const promptPath = path.join(caseDir, "prompt.md");
            const prompt = await fs.readFile(promptPath, "utf-8");

            return {
                caseId,
                datamodel: null, // Will be extracted later with ppApi instance
                prompt: prompt.trim(),
                presentationPath: presPath,
            };
        } catch (error) {
            console.error(`Error reading test case data for ${caseId}:`, error);
            return null;
        }
    }

    /**
     * Extract datamodel from PowerPoint using PowerPoint API
     */
    async extractDatamodel(ppApi: WhiteAgentPPApi): Promise<any> {
        const result = await ppApi.extractDatamodel();

        if (!result.success) {
            throw new Error(result.error || "Failed to extract datamodel");
        }

        return result.datamodel;
    }

    /**
     * Inject changeset into PowerPoint using PowerPoint API
     */
    async injectChangeset(
        caseId: string,
        presentationPath: string,
        ppApi: WhiteAgentPPApi,
        changeset: any,
    ): Promise<{
        success: boolean;
        outputPath?: string;
        error?: string;
    }> {
        console.log(`💉 Injecting changeset for ${caseId}...`);

        try {
            const outputFilename = `result_${caseId}.pptx`;
            const outputPath = path.join(this.runDir, outputFilename);

            // Inject changeset using PowerPoint API
            const result = await ppApi.injectChangeset(
                changeset,
                outputPath,
                presentationPath,
            );

            return result;
        } catch (error) {
            console.error("❌ Failed to inject changeset:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Save test results to run directory (only for failed tests)
     */
    private async saveTestResults(
        caseId: string,
        result: TestResult,
        agentName: string,
    ): Promise<void> {
        try {
            // Only save error results, not success results
            if (!result.success) {
                const filename = `result_err_${caseId}.json`;
                const filepath = path.join(this.runDir, filename);

                const resultData = {
                    ...result,
                    timestamp: new Date().toISOString(),
                    systemPrompt: this.systemPromptName,
                    agent: agentName,
                };

                await fs.writeFile(
                    filepath,
                    JSON.stringify(resultData, null, 2),
                );
                console.log(`💾 Error results saved to: ${filepath}`);
            } else {
                console.log(
                    `✅ Test ${caseId} succeeded - no result file needed`,
                );
            }
        } catch (error) {
            console.error("❌ Failed to save test results:", error);
        }
    }

    /**
     * Run a single test case
     */
    private async runTestCase(
        caseId: string,
        agent: Agent,
        ppApi: WhiteAgentPPApi,
    ): Promise<TestResult> {
        const startTime = Date.now();

        try {
            console.log(`\n🚀 Running test case: ${caseId}`);

            // Get test case data
            const testData = await this.getTestCaseData(caseId);
            if (!testData) {
                throw new Error(`Failed to load test data for ${caseId}`);
            }

            // Load system prompt
            const systemPrompt = await this.loadSystemPrompt();

            // Extract datamodel from PowerPoint
            const datamodel = await this.extractDatamodel(ppApi);

            // Generate changeset using agent
            const changeset = await agent.generateChangeset(
                datamodel,
                testData.prompt,
                systemPrompt,
            );

            // Save changeset before injection (in case injection fails)
            const changesetPath = path.join(
                this.runDir,
                `result_cs_${caseId}.json`,
            );
            await fs.writeFile(
                changesetPath,
                JSON.stringify(changeset, null, 2),
                "utf8",
            );
            console.log(`💾 Changeset saved to: ${changesetPath}`);

            // Inject changeset
            const injectionResult = await this.injectChangeset(
                caseId,
                testData.presentationPath,
                ppApi,
                changeset,
            );
            if (!injectionResult.success) {
                throw new Error(`Injection failed: ${injectionResult.error}`);
            }

            const executionTime = Date.now() - startTime;
            const result: TestResult = {
                caseId,
                success: true,
                executionTime,
                outputPath: injectionResult.outputPath,
                changeset,
            };

            // Save results
            await this.saveTestResults(caseId, result, agent.name);

            console.log(`✅ Test case ${caseId} completed successfully`);
            return result;
        } catch (error) {
            const executionTime = Date.now() - startTime;
            const result: TestResult = {
                caseId,
                success: false,
                executionTime,
                error: error instanceof Error ? error.message : String(error),
            };

            // Save error results
            await this.saveTestResults(caseId, result, agent.name);

            console.error(`❌ Test case ${caseId} failed:`, error);
            return result;
        }
    }

    /**
     * Run all test cases
     */
    public async runAllTests(
        AgentClass: AgentConstructor,
    ): Promise<TestSummary> {
        const startTime = Date.now();

        // Create a temporary agent instance to get the name
        const tempPpApi = new WhiteAgentPPApi({});
        const tempAgent = new AgentClass(tempPpApi);
        const agentName = tempAgent.name;

        try {
            console.log(`🚀 Starting ${agentName} test runner...`);
            console.log(`📁 System prompt: ${this.systemPromptName}`);
            console.log(`🎯 Scenario filter: ${this.scenarioFilter || "all"}`);
            console.log(`🔍 Case filter: ${this.caseFilter || "all"}`);

            await this.loadChangesetSchema();
            await this.loadMasterAnalysis();

            // Get all test case IDs
            const testCaseIds = await this.getTestCaseIds();
            console.log(`📋 Found ${testCaseIds.length} test cases`);

            if (testCaseIds.length === 0) {
                throw new Error("No test cases found");
            }

            // Group test cases by scenario
            const scenarioGroups: { [scenario: string]: string[] } = {};
            for (const caseId of testCaseIds) {
                // Extract scenario name by finding the last occurrence of "test-"
                const testIndex = caseId.lastIndexOf("test-");
                if (testIndex === -1) {
                    console.warn(`Invalid case ID format: ${caseId}`);
                    continue;
                }
                const scenarioName = caseId.substring(0, testIndex - 1);
                if (!scenarioGroups[scenarioName]) {
                    scenarioGroups[scenarioName] = [];
                }
                scenarioGroups[scenarioName].push(caseId);
            }

            console.log(
                `📊 Found ${Object.keys(scenarioGroups).length} scenarios: ${Object.keys(scenarioGroups).join(", ")}`,
            );

            // Run tests for each scenario
            const allResults: TestResult[] = [];
            const scenarioSummaries: { [scenario: string]: TestSummary } = {};

            for (const [scenarioName, caseIds] of Object.entries(
                scenarioGroups,
            )) {
                console.log(
                    `\n🎯 Running scenario: ${scenarioName} (${caseIds.length} test cases)`,
                );

                // Create scenario-specific run directory
                const timestamp = new Date()
                    .toISOString()
                    .slice(0, 16)
                    .replace(/:/g, "-");
                const scenarioOutputDir = path.join(
                    SCENARIOS_DIR,
                    scenarioName,
                    "__generated__",
                );
                const scenarioRunDir = path.join(
                    scenarioOutputDir,
                    `run-${timestamp}`,
                );

                // Ensure scenario output directory exists
                await fs.mkdir(scenarioRunDir, { recursive: true });

                // Save master analysis and schema to scenario run directory
                const masterAnalysisPath = path.join(
                    scenarioRunDir,
                    "_master-analysis.md",
                );
                await fs.writeFile(
                    masterAnalysisPath,
                    this.masterAnalysis,
                    "utf8",
                );

                const schemaPath = path.join(
                    scenarioRunDir,
                    "_changeset-schema.yaml",
                );
                await fs.writeFile(schemaPath, this.changesetSchema, "utf8");

                // Save system prompt to scenario run directory
                const sysPromptPath = path.join(
                    scenarioRunDir,
                    "_sys-prompt.md",
                );
                const systemPrompt =
                    await this.loadSystemPromptForScenario(scenarioRunDir);
                await fs.writeFile(sysPromptPath, systemPrompt, "utf8");

                // Update run directory for this scenario
                this.runDir = scenarioRunDir;

                // Run tests for this scenario - create fresh agent and ppApi for each test
                const scenarioResults = await Promise.all(
                    caseIds.map((caseId) => {
                        // Extract test name from caseId (e.g., "basic-shapes-test-1" -> "test-1")
                        const testIndex = caseId.lastIndexOf("test-");
                        const testName = caseId.substring(testIndex);
                        
                        const casePresentationPath = path.join(
                            SCENARIOS_DIR,
                            scenarioName,
                            testName,
                            "pres.pptx",
                        );
                        
                        // Create fresh instances for each test case
                        const ppApi = new WhiteAgentPPApi({
                            presentationPath: casePresentationPath,
                        });
                        const agent = new AgentClass(ppApi);
                        return this.runTestCase(caseId, agent, ppApi);
                    }),
                );

                const scenarioExecutionTime = Date.now() - startTime;
                const scenarioPassedTests = scenarioResults.filter(
                    (r) => r.success,
                ).length;
                const scenarioFailedTests = scenarioResults.filter(
                    (r) => !r.success,
                ).length;

                const scenarioSummary: TestSummary = {
                    totalTests: scenarioResults.length,
                    passedTests: scenarioPassedTests,
                    failedTests: scenarioFailedTests,
                    results: scenarioResults,
                    executionTime: scenarioExecutionTime,
                };

                // Save scenario summary
                const scenarioSummaryPath = path.join(
                    scenarioRunDir,
                    "_summary.md",
                );
                const scenarioSummaryContent = `# ${scenarioName} Scenario Summary

**Generated:** ${new Date().toISOString()}  
**Agent:** ${agentName}  
**System Prompt:** ${this.systemPromptName}  
**Scenario:** ${scenarioName}  
**Execution Time:** ${Math.round(scenarioExecutionTime / 1000)}s  

## Results

- **Total Tests:** ${scenarioResults.length}
- **Passed:** ${scenarioPassedTests}
- **Failed:** ${scenarioFailedTests}
- **Success Rate:** ${Math.round((scenarioPassedTests / scenarioResults.length) * 100)}%

## Test Cases

${scenarioResults
    .map(
        (result) =>
            `- **${result.caseId}**: ${result.success ? "✅ PASSED" : "❌ FAILED"} (${Math.round(result.executionTime / 1000)}s)`,
    )
    .join("\n")}

## Failed Tests

${scenarioResults
    .filter((r) => !r.success)
    .map((result) => `- **${result.caseId}**: ${result.error}`)
    .join("\n")}
`;
                await fs.writeFile(
                    scenarioSummaryPath,
                    scenarioSummaryContent,
                    "utf8",
                );

                console.log(
                    `✅ ${scenarioName} completed: ${scenarioPassedTests}/${scenarioResults.length} passed`,
                );
                console.log(`📄 Results saved to: ${scenarioRunDir}`);

                allResults.push(...scenarioResults);
                scenarioSummaries[scenarioName] = scenarioSummary;
            }

            const totalExecutionTime = Date.now() - startTime;
            const totalPassedTests = allResults.filter((r) => r.success).length;
            const totalFailedTests = allResults.filter(
                (r) => !r.success,
            ).length;

            const overallSummary: TestSummary = {
                totalTests: allResults.length,
                passedTests: totalPassedTests,
                failedTests: totalFailedTests,
                results: allResults,
                executionTime: totalExecutionTime,
            };

            console.log("\n🎉 All scenarios completed!");
            console.log(
                `📊 Overall Results: ${totalPassedTests}/${allResults.length} passed`,
            );
            console.log(
                `⏱️  Total time: ${Math.round(totalExecutionTime / 1000)}s`,
            );
            console.log(
                `📁 Scenarios: ${Object.keys(scenarioSummaries).join(", ")}`,
            );

            return overallSummary;
        } catch (error) {
            console.error("💥 Test execution failed:", error);
            throw error;
        }
    }
}
