import fs from "fs/promises";
import path from "path";
import { createPowerPointService } from "../../api/server/src/services/addin/powerpoint/service.js";

const pptxService = createPowerPointService({
    baseUrl: process.env.PPTX_API || "http://localhost:8000",
});

// Handle both running from root and from benchmark folder
const isRunningFromBenchmark = process.cwd().endsWith("benchmark");
const TEST_CASES_DIR = isRunningFromBenchmark
    ? path.join(process.cwd(), "scenarios")
    : path.join(process.cwd(), "benchmark", "scenarios");
const GENERATED_DIR = isRunningFromBenchmark
    ? path.join(process.cwd(), "__generated__")
    : path.join(process.cwd(), "benchmark", "__generated__");
const PROJECT_ROOT = isRunningFromBenchmark
    ? process.cwd().replace("/benchmark", "")
    : process.cwd();

/**
 * Get all test case IDs (scenario-test format from nested directory structure)
 */
export async function getTestCaseIds(): Promise<string[]> {
    try {
        const entries = await fs.readdir(TEST_CASES_DIR, {
            withFileTypes: true,
        });
        
        const testCaseIds: string[] = [];
        
        // Iterate through scenario directories
        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith("_")) {
                const scenarioDir = path.join(TEST_CASES_DIR, entry.name);
                const scenarioEntries = await fs.readdir(scenarioDir, {
                    withFileTypes: true,
                });
                
                // Find test directories within each scenario
                for (const testEntry of scenarioEntries) {
                    if (testEntry.isDirectory() && !testEntry.name.startsWith("_")) {
                        testCaseIds.push(`${entry.name}-${testEntry.name}`);
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
 * Get test case data (datamodel.json and prompt.md) for a specific case ID
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 * If datamodel.json doesn't exist but pres.pptx does, it will be generated automatically.
 */
export async function getTestCaseData(caseId: string): Promise<{
    caseId: string;
    datamodel: any;
    prompt: string;
} | null> {
    try {
        // Parse caseId to extract scenario and test name
        // Format: "scenario-test" (e.g., "basic-shapes-test-1")
        // We need to find the last occurrence of "test-" to split correctly
        const testIndex = caseId.lastIndexOf('test-');
        if (testIndex === -1) {
            throw new Error(`Invalid case ID format: ${caseId}. Expected format: scenario-test`);
        }

        const scenarioName = caseId.substring(0, testIndex - 1); // "basic-shapes" (remove the trailing '-')
        const testName = caseId.substring(testIndex); // "test-1"

        const caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);

        // Check if case directory exists
        await fs.access(caseDir);

        const datamodelPath = path.join(caseDir, "datamodel.json");
        const presPath = path.join(caseDir, "pres.pptx");

        // Check if datamodel.json exists, if not generate it from pres.pptx
        let datamodel: any;
        try {
            const datamodelContent = await fs.readFile(datamodelPath, "utf-8");
            datamodel = JSON.parse(datamodelContent);
        } catch {
            // datamodel.json doesn't exist, try to generate it from pres.pptx
            console.log(`datamodel.json not found for ${caseId}, generating from pres.pptx...`);

            // Check if pres.pptx exists
            await fs.access(presPath);

            // Generate datamodel.json via the PowerPoint API (no local Python subprocess)
            datamodel = await pptxService.getPresentation(presPath);
            await fs.writeFile(datamodelPath, JSON.stringify(datamodel, null, 2));
            console.log(`Generated datamodel.json for ${caseId}`);
        }

        // Read prompt.md
        const promptPath = path.join(caseDir, "prompt.md");
        const prompt = await fs.readFile(promptPath, "utf-8");

        return {
            caseId,
            datamodel,
            prompt: prompt.trim(),
        };
    } catch (error) {
        console.error(`Error reading test case data for ${caseId}:`, error);
        return null;
    }
}

/**
 * Get the path to the presentation file for a test case
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export async function getTestCasePresentationPath(
    caseId: string,
): Promise<string | null> {
    try {
        // Parse caseId to extract scenario and test name
        // Format: "scenario-test" (e.g., "basic-shapes-test-1")
        // We need to find the last occurrence of "test-" to split correctly
        const testIndex = caseId.lastIndexOf('test-');
        if (testIndex === -1) {
            throw new Error(`Invalid case ID format: ${caseId}. Expected format: scenario-test`);
        }
        
        const scenarioName = caseId.substring(0, testIndex - 1); // "basic-shapes" (remove the trailing '-')
        const testName = caseId.substring(testIndex); // "test-1"
        
        const caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);
        const presPath = path.join(caseDir, "pres.pptx");

        // Check if presentation file exists
        await fs.access(presPath);
        return presPath;
    } catch (error) {
        console.error(`Error finding presentation file for ${caseId}:`, error);
        return null;
    }
}

/**
 * Get the directory path for a test case.
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export async function getTestCaseDirectory(
    caseId: string,
): Promise<string | null> {
    try {
        const testIndex = caseId.lastIndexOf("test-");
        if (testIndex === -1) {
            throw new Error(
                `Invalid case ID format: ${caseId}. Expected format: scenario-test`,
            );
        }

        const scenarioName = caseId.substring(0, testIndex - 1); // remove trailing '-'
        const testName = caseId.substring(testIndex);
        const caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);
        await fs.access(caseDir);
        return caseDir;
    } catch (error) {
        console.error(`Error finding test directory for ${caseId}:`, error);
        return null;
    }
}

/**
 * Read prompt.md for a test case (no datamodel generation).
 */
export async function getTestCasePrompt(caseId: string): Promise<string | null> {
    try {
        const caseDir = await getTestCaseDirectory(caseId);
        if (!caseDir) return null;
        const promptPath = path.join(caseDir, "prompt.md");
        const prompt = await fs.readFile(promptPath, "utf-8");
        return prompt.trim();
    } catch (error) {
        console.error(`Error reading prompt for ${caseId}:`, error);
        return null;
    }
}

/**
 * Get the test protocol for a test case
 * Case ID format: "scenario-test" (e.g., "basic-shapes-test-1")
 */
export async function getTestCaseProtocol(caseId: string): Promise<any> {
    try {
        // Parse caseId to extract scenario and test name
        // Format: "scenario-test" (e.g., "basic-shapes-test-1")
        // We need to find the last occurrence of "test-" to split correctly
        const testIndex = caseId.lastIndexOf('test-');
        if (testIndex === -1) {
            throw new Error(`Invalid case ID format: ${caseId}. Expected format: scenario-test`);
        }
        
        const scenarioName = caseId.substring(0, testIndex - 1); // "basic-shapes" (remove the trailing '-')
        const testName = caseId.substring(testIndex); // "test-1"
        
        const caseDir = path.join(TEST_CASES_DIR, scenarioName, testName);

        // Try validation.ts first, then fall back to test.ts
        let testPath = path.join(caseDir, "validation.ts");
        try {
            await fs.access(testPath);
        } catch {
            testPath = path.join(caseDir, "test.ts");
        }

        // Dynamically import the TypeScript test file
        const module = await import(testPath);
        if (module.Test) {
            return module.Test;
        }

        throw new Error(`No Test export found in ${testPath}`);
    } catch (error) {
        console.error(`Error reading test protocol for ${caseId}:`, error);
        // Re-throw the error instead of using dummy data
        throw error;
    }
}

/**
 * Save generated datamodel to __generated__ folder
 */
export async function saveGeneratedDatamodel(
    caseId: string,
    whiteAgentId: string,
    datamodel: any,
): Promise<void> {
    try {
        // Ensure __generated__ directory exists
        await fs.mkdir(GENERATED_DIR, { recursive: true });

        const filename = `${caseId}:::${whiteAgentId}.json`;
        const filepath = path.join(GENERATED_DIR, filename);

        console.log("filepath", filepath);

        await fs.writeFile(filepath, JSON.stringify(datamodel, null, 2));
    } catch (error) {
        console.error(
            `Error saving generated datamodel for ${caseId}:::${whiteAgentId}:`,
            error,
        );
        throw error;
    }
}

/**
 * Get all generated datamodels for a white agent
 */
export async function getGeneratedDatamodels(whiteAgentId: string): Promise<
    {
        caseId: string;
        datamodel: any;
    }[]
> {
    try {
        const entries = await fs.readdir(GENERATED_DIR, {
            withFileTypes: true,
        });
        const datamodels: { caseId: string; datamodel: any }[] = [];

        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".json")) {
                const parts = entry.name.replace(".json", "").split(":::");
                if (parts.length === 2 && parts[1] === whiteAgentId) {
                    const caseId = parts[0];
                    const filepath = path.join(GENERATED_DIR, entry.name);
                    const content = await fs.readFile(filepath, "utf-8");
                    const datamodel = JSON.parse(content);

                    datamodels.push({ caseId, datamodel });
                }
            }
        }

        return datamodels;
    } catch (error) {
        console.error(
            `Error reading generated datamodels for ${whiteAgentId}:`,
            error,
        );
        return [];
    }
}

/**
 * Clear all generated files
 */
export async function clearGeneratedFiles(): Promise<void> {
    try {
        const entries = await fs.readdir(GENERATED_DIR, {
            withFileTypes: true,
        });

        for (const entry of entries) {
            const filepath = path.join(GENERATED_DIR, entry.name);
            await fs.unlink(filepath);
        }
    } catch (error) {
        console.error("Error clearing generated files:", error);
        throw error;
    }
}
