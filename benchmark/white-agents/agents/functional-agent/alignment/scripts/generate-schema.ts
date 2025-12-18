#!/usr/bin/env tsx

/**
 * Generate AlignChangesetSchema YAML
 * 
 * This script calls the main generate-changeset-schema.ts with custom paths
 * to generate the alignment-agent specific changeset schema.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 Generating AlignChangesetSchema YAML...\n");

    // Find the project root (up 5 levels from alignment-agent/scripts to letmecook root)
    const projectRoot = path.resolve(__dirname, "../../../../..");
    const generatorScript = path.join(
        projectRoot,
        "api/server/scripts/generate-changeset-schema.ts",
    );
    const entryPath = path.join(__dirname, "../changeset/schemas/changeset.ts");
    const outputPath = path.join(__dirname, "../changeset/__generated__");

    console.log(`📂 Project root: ${projectRoot}`);
    console.log(`📂 Entry path: ${entryPath}`);
    console.log(`📂 Output path: ${outputPath}\n`);

    // Call the main generator script with custom arguments
    const args = [
        generatorScript,
        "--entry",
        entryPath,
        "--output",
        outputPath,
    ];

    return new Promise<void>((resolve, reject) => {
        const child = spawn("npx", ["tsx", ...args], {
            cwd: projectRoot,
            stdio: "inherit",
            shell: true,
        });

        child.on("close", (code) => {
            if (code === 0) {
                console.log("\n✅ AlignChangesetSchema generated successfully!");
                resolve();
            } else {
                console.error(
                    `\n❌ Generator exited with code ${code}`,
                );
                reject(new Error(`Process exited with code ${code}`));
            }
        });

        child.on("error", (error) => {
            console.error("\n❌ Failed to spawn process:", error);
            reject(error);
        });
    });
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});












