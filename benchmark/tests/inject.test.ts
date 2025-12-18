import fs from "fs/promises";
import path from "path";
import { describe, expect, it } from "vitest";
import { AIChangesetSchema } from "../../api/server/src/schemas/changeset/index.js";
import { PowerPointService } from "../../api/server/src/services/addin/powerpoint/powerpoint.service.js";

// Absolute paths for benchmark test-1 assets
const TEST_DIR =
    "/Users/paulostarek/Desktop/powerpoint/letmecook/benchmark/scenarios/test-1";
const INPUT_PPTX = path.join(TEST_DIR, "pres.pptx");
const INPUT_CHANGESET = path.join(TEST_DIR, "test-changeset.json");
const OUTPUT_PPTX = path.join(TEST_DIR, "pres-new.pptx");
const OUTPUT_DATAMODEL = path.join(TEST_DIR, "datamodel-new.json");

describe("PowerPointService.injectChangeset integration (test-1)", () => {
    it("injects changeset into a new PPTX and writes datamodel-new.json", async () => {
        // Ensure inputs exist
        await fs.access(INPUT_PPTX);
        await fs.access(INPUT_CHANGESET);

        // Clean outputs if exist from previous runs
        try {
            await fs.unlink(OUTPUT_PPTX);
        } catch {}
        try {
            await fs.unlink(OUTPUT_DATAMODEL);
        } catch {}

        // Read and validate the changeset
        const raw = await fs.readFile(INPUT_CHANGESET, "utf-8");
        const parsed = JSON.parse(raw);

        console.log("Parsed", parsed)

        const zodResult = AIChangesetSchema.safeParse(parsed);

        if (!zodResult.success) {
            throw zodResult.error;
        }

        const changeset = zodResult.data!;

        // Create service and perform injection, outputting to new PPTX
        const service = await PowerPointService.createWithSetup();
        const result = await service.injectChangeset(
            INPUT_PPTX,
            changeset,
            OUTPUT_PPTX,
        );

        // Verify result shape and status
        expect(result).toBeTruthy();
        expect(result.error).toBeUndefined();
        expect(result.status ?? "success").toBe("success");

        // Verify the new PPTX was created
        const statNew = await fs.stat(OUTPUT_PPTX);
        expect(statNew.size).toBeGreaterThan(0);

        // Verify original PPTX remains untouched in place
        const statOriginal = await fs.stat(INPUT_PPTX);
        expect(statOriginal.size).toBeGreaterThan(0);

        // Write resulting datamodel to datamodel-new.json
        const datamodel = result.datamodel ?? result;
        await fs.writeFile(
            OUTPUT_DATAMODEL,
            result.datamodel,
            "utf-8",
        );

        // Confirm datamodel-new.json exists and is JSON
        const dmRaw = await fs.readFile(OUTPUT_DATAMODEL, "utf-8");
        const dmParsed = JSON.parse(dmRaw);
        expect(dmParsed).toBeTruthy();
    }, 120000);
});
