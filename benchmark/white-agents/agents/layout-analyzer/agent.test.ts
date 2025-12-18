import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { afterAll, describe, expect, it } from "vitest";
import { AITChangesetSchema } from "../../../../api/server/src/schemas/changeset/schemas/changeset.js";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
import { getModel, runLayoutAnalyzerAgent } from "./agent.js";
import { previewLayout } from "./preview-layout.js";
import { LayoutAnalyzerOutput, LayoutSchema } from "./types.js";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_BASE_DIR = path.join(__dirname, "__generated__");
const TEST_PPTX = path.join(__dirname, "example2.pptx");
const SLIDE_INDEX = 23; // First slide

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

describe("Layout Analyzer Agent Test", () => {
    it("should extract PowerPoint slide, get snapshot, run agent, and save result to __generated__", async () => {
        const service = await createPowerPointServiceWithHealthCheck();

        try {
            // Ensure base output directory exists
            await ensureOutputDir();

            // Get or create the output directory for this test run
            const OUTPUT_DIR = await getOutputDir();
            console.log(`Saving test results to: ${OUTPUT_DIR}`);

            getModel();

            // Get the slide datamodel
            const slide = await service.getSlideByIndex(TEST_PPTX, SLIDE_INDEX);

            expect(slide).toBeDefined();
            expect(slide.id).toBeDefined();

            // Get the slide snapshot
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

            // Run the layout analyzer agent
            console.log("Running layout analyzer agent...");

            // Extract processId from OUTPUT_DIR (folder name)
            const processId = path.basename(OUTPUT_DIR);

            const result: LayoutAnalyzerOutput = await runLayoutAnalyzerAgent({
                snapshotBase64,
                datamodel: slide,
                processId,
            });

            expect(result).toBeDefined();
            expect(result.layout).toBeDefined();
            expect(
                typeof result.layout === "object" && result.layout !== null,
            ).toBe(true);
            const layout = LayoutSchema.parse(result.layout);

            expect(layout.name).toBeDefined();
            expect(layout.type).toBeDefined();
            expect(layout.b).toBeDefined();

            console.log(
                `Layout analyzer completed. Layout: ${layout.name} (${layout.type})`,
            );

            // Save the result to __generated__ directory
            const outputPath = path.join(
                OUTPUT_DIR,
                "layout-analyzer-agent-result.json",
            );
            await fs.writeFile(
                outputPath,
                JSON.stringify(result, null, 2),
                "utf-8",
            );

            // Verify the output file exists
            const stats = await fs.stat(outputPath);
            expect(stats.size).toBeGreaterThan(0);

            console.log(
                `Successfully saved agent result to ${outputPath} (${stats.size} bytes)`,
            );

            await previewLayout(
                processId,
                "layout-analyzer-visualization",
                TEST_PPTX,
                slide.id,
                layout,
            );
        } catch (error) {
            console.error("Error in layout analyzer agent test:", error);
            if (error instanceof PowerPointServiceError) {
                // Get output directory even if test failed early
                const OUTPUT_DIR = await getOutputDir();
                const errorPath = path.join(
                    OUTPUT_DIR,
                    "layout-analyzer-agent-error.json",
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

    it("should inject existing changeset into slide and save visualization PPTX", async () => {
        const service = await createPowerPointServiceWithHealthCheck();
        return;

        try {
            // Ensure base output directory exists
            await ensureOutputDir();

            // Get or create the output directory for this test run
            const OUTPUT_DIR = await getOutputDir();
            console.log(`Saving test results to: ${OUTPUT_DIR}`);

            // Load the existing changeset from output directory
            const changesetPath = path.join(
                OUTPUT_DIR,
                "layout-analyzer-changeset.json",
            );

            // Check if changeset file exists
            try {
                await fs.access(changesetPath);
            } catch {
                throw new Error(
                    `Changeset file not found at ${changesetPath}. Please run the first test to generate it.`,
                );
            }

            // Read and parse the changeset
            const changesetContent = await fs.readFile(changesetPath, "utf-8");
            const changeset: AITChangesetSchema = JSON.parse(changesetContent);

            expect(changeset).toBeDefined();
            expect(changeset.added).toBeDefined();
            expect(Array.isArray(changeset.added)).toBe(true);
            expect(changeset.added?.length).toBeGreaterThan(0);

            console.log(
                `Loaded changeset with ${changeset.added?.length} shapes to add`,
            );

            // Get the slide datamodel
            const slide = await service.getSlideByIndex(TEST_PPTX, SLIDE_INDEX);
            expect(slide).toBeDefined();
            expect(slide.id).toBeDefined();

            console.log(`Extracted slide ${slide.id} from ${TEST_PPTX}`);

            // Edit the slide with the changeset to create a new PPTX with layout boxes
            const outputPptxPath = path.join(
                OUTPUT_DIR,
                "layout-analyzer-visualization.pptx",
            );
            const resultPptx = await service.editSlide(
                TEST_PPTX,
                slide.id,
                changeset,
                outputPptxPath,
            );

            expect(resultPptx).toBeDefined();

            // Verify the output PPTX file exists
            const pptxStats = await fs.stat(resultPptx);
            expect(pptxStats.size).toBeGreaterThan(0);

            console.log(
                `Successfully created layout visualization PPTX at ${resultPptx} (${pptxStats.size} bytes)`,
            );
        } catch (error) {
            console.error("Error in changeset injection test:", error);
            if (error instanceof PowerPointServiceError) {
                // Get output directory even if test failed early
                const OUTPUT_DIR = await getOutputDir();
                const errorPath = path.join(
                    OUTPUT_DIR,
                    "layout-analyzer-injection-error.json",
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
