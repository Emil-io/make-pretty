import fs from "fs/promises";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint/service.js";
import { PowerPointServiceError } from "../../../../api/server/src/services/addin/powerpoint/types.js";
import { layoutAnalyzerInputTransformer } from "./transformer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "__generated__");
// Use the test PowerPoint file from the PowerPoint service directory
const TEST_PPTX =
    "/Users/paulostarek/Desktop/powerpoint/letmecook/api/python/presentations/example.pptx";

async function ensureOutputDir(): Promise<void> {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

describe("Layout Analyzer Transformer Test", () => {
    it("should extract PowerPoint slide, transform it, and save to __generated__", async () => {
        const service = await createPowerPointServiceWithHealthCheck();

        try {
            // Ensure output directory exists
            await ensureOutputDir();

            // Get the first slide from the test presentation
            const slide = await service.getSlideByIndex(TEST_PPTX, 6);
            expect(slide).toBeDefined();
            expect(slide.id).toBeDefined();

            console.log(`Extracted slide ${slide.id} from ${TEST_PPTX}`);

            // Transform the slide using the layout analyzer transformer
            let transformedData = layoutAnalyzerInputTransformer(slide);

            expect(transformedData).toBeDefined();
            expect(transformedData.slideId).toBe(slide.id);
            expect(transformedData.shapes).toBeDefined();
            expect(Array.isArray(transformedData.shapes)).toBe(true);

            console.log(
                `Transformed slide with ${transformedData.shapes.length} shapes`,
            );

            // Save the transformed data to __generated__ directory
            const outputPath = path.join(
                OUTPUT_DIR,
                "layout-analyzer-output.yaml",
            );
            await fs.writeFile(outputPath, yaml.dump(transformedData), "utf-8");

            // Verify the output file exists
            const stats = await fs.stat(outputPath);
            expect(stats.size).toBeGreaterThan(0);

            console.log(
                `Successfully saved transformed data to ${outputPath} (${stats.size} bytes)`,
            );
        } catch (error) {
            console.error("Error in layout analyzer transformer test:", error);
            if (error instanceof PowerPointServiceError) {
                const errorPath = path.join(
                    OUTPUT_DIR,
                    "layout-analyzer-error.json",
                );
                await ensureOutputDir();
                await fs.writeFile(
                    errorPath,
                    JSON.stringify(error.toJSON(), null, 2),
                    "utf-8",
                );
            }
            throw error;
        }
    });
});
