import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { afterAll, describe, expect, it } from "vitest";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
import {
    getModel,
    runLayoutAnalyzerAgent
} from "../layout-analyzer/agent.js";
import {
    getModel as getSelectorModel,
    runLayoutSelectorAgent,
    type LayoutSelectorOutput,
} from "./agent.js";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_BASE_DIR = path.join(__dirname, "__generated__");
const TEST_PPTX = path.join(__dirname, "../layout-analyzer/example2.pptx");
const SLIDE_INDEX = 23; // First slide
const PROMPT = "Add another box/column to the right";

/**
 * Generates a folder name based on current date-time (format: YYYY-MM-DD_HH:MM)
 */
function generateOutputFolderName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    // Format: YYYY-MM-DD_HH:MM
    return `${year}-${month}-${day}_${hours}:${minutes}`;
}

/**
 * Gets or creates the output directory for this test run
 */
async function getOutputDir(): Promise<string> {
    const folderName = generateOutputFolderName();
    const outputDir = path.join(OUTPUT_BASE_DIR, folderName);
    await fs.mkdir(outputDir, { recursive: true });
    return outputDir;
}

// Verify authentication is available (either GOOGLE_API_KEY or Application Default Credentials)
if (!process.env.GOOGLE_API_KEY) {
    console.warn(
        "GOOGLE_API_KEY not found in environment variables. Will attempt to use Application Default Credentials (ADC).",
    );

    // Check if ADC credentials file exists
    const adcPath = `${process.env.HOME}/.config/gcloud/application_default_credentials.json`;
    const fs = require("fs");
    if (fs.existsSync(adcPath)) {
        console.log(`ADC credentials found at: ${adcPath}`);
        // Ensure the SDK can find the credentials by setting the environment variable
        // Note: GOOGLE_APPLICATION_CREDENTIALS is typically for service account keys,
        // but setting it might help the SDK find user credentials too
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Don't set it - let the SDK use the default location
            // The SDK should automatically find ~/.config/gcloud/application_default_credentials.json
        }
    } else {
        console.warn(
            `ADC credentials not found at: ${adcPath}. Run: gcloud auth application-default login`,
        );
    }
}

console.log("TEST_PPTX:", TEST_PPTX);

async function ensureOutputDir(): Promise<void> {
    await fs.mkdir(OUTPUT_BASE_DIR, { recursive: true });
}

describe("Layout Selector Agent Test", () => {
    it("should run layout analyzer first, then test layout selector with various prompts", async () => {
        const service = await createPowerPointServiceWithHealthCheck();

        try {
            // Ensure base output directory exists
            await ensureOutputDir();

            // Get or create the output directory for this test run
            const OUTPUT_DIR = await getOutputDir();
            console.log(`Saving test results to: ${OUTPUT_DIR}`);

            // Extract processId from OUTPUT_DIR (folder name)
            const processId = path.basename(OUTPUT_DIR);

            getModel();
            getSelectorModel();

            // Step 1: Get the slide datamodel
            const slide = await service.getSlideByIndex(TEST_PPTX, SLIDE_INDEX);

            expect(slide).toBeDefined();
            expect(slide.id).toBeDefined();

            // Step 2: Get the slide snapshot
            const snapshot = await service.getSlideSnapshotByIndex(
                TEST_PPTX,
                SLIDE_INDEX,
            );
            expect(snapshot).toBeDefined();
            expect(snapshot.pngBytes).toBeDefined();
            expect(Buffer.isBuffer(snapshot.pngBytes)).toBe(true);

            // Convert PNG bytes to base64
            const snapshotBase64 = snapshot.pngBytes.toString("base64");

            // Save png and datamodel to output directory
            const pngPath = path.join(OUTPUT_DIR, "snapshot.png");
            await fs.writeFile(pngPath, snapshot.pngBytes);
            const datamodelPath = path.join(OUTPUT_DIR, "datamodel.json");
            await fs.writeFile(datamodelPath, JSON.stringify(slide, null, 2));

            // Step 3: Run the layout analyzer agent to get the layout schema
            console.log("Running layout analyzer agent...");

            const layoutResult = await runLayoutAnalyzerAgent({
                snapshotBase64,
                datamodel: slide,
                processId,
            });

            expect(layoutResult).toBeDefined();
            expect(layoutResult.layout).toBeDefined();
            expect(
                typeof layoutResult.layout === "object" &&
                    layoutResult.layout !== null,
            ).toBe(true);

            const layout = layoutResult.layout;
            expect(layout.name).toBeDefined();
            expect(layout.type).toBeDefined();
            expect(layout.b).toBeDefined();

            console.log(
                `Layout analyzer completed. Layout: ${layout.name} (${layout.type})`,
            );

            // Save the layout result
            const layoutResultPath = path.join(
                OUTPUT_DIR,
                "layout-analyzer-result.json",
            );
            await fs.writeFile(
                layoutResultPath,
                JSON.stringify(layoutResult, null, 2),
                "utf-8",
            );

            // Step 4: Test the layout selector agent with various prompts
            console.log("Running layout selector agent...");

            console.log(`Testing prompt: "${PROMPT}"`);

            const selectorResult: LayoutSelectorOutput =
                await runLayoutSelectorAgent({
                    prompt: PROMPT,
                    layoutSchema: layout,
                    processId,
                });

            // Save all selector results
            const selectorResultPath = path.join(
                OUTPUT_DIR,
                "layout-selector-result.json",
            );
            await fs.writeFile(
                selectorResultPath,
                JSON.stringify(selectorResult, null, 2),
                "utf-8",
            );

            // Verify the output file exists
            const stats = await fs.stat(selectorResultPath);
            expect(stats.size).toBeGreaterThan(0);

            console.log(
                `Successfully saved selector results to ${selectorResultPath} (${stats.size} bytes)`,
            );

            // Verify at least one result has a non-null main
            expect(selectorResult.main).toBeDefined();
            expect(selectorResult.main).not.toBeNull();

            console.log(
                `Layout selector result: ${JSON.stringify(selectorResult)}`,
            );
        } catch (error) {
            console.error("Error in layout selector agent test:", error);
            if (error instanceof PowerPointServiceError) {
                // Get output directory even if test failed early
                const OUTPUT_DIR = await getOutputDir();
                const errorPath = path.join(
                    OUTPUT_DIR,
                    "layout-selector-agent-error.json",
                );
                await fs.writeFile(
                    errorPath,
                    JSON.stringify(error.toJSON(), null, 2),
                    "utf-8",
                );
            }
            throw error;
        }
    });

    afterAll(async () => {
        // Wait for 2 seconds to allow LangChain traces to complete
        await new Promise((resolve) => setTimeout(resolve, 3000));
    });
});
