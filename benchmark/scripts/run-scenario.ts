#!/usr/bin/env tsx

/**
 * Scenario Test Runner Script
 * 
 * This script handles command line arguments and runs the scenario tests
 * with proper filtering for cases and scenarios.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const caseArg = args.find((arg) => arg.startsWith("--case="))?.split("=")[1] || null;
const scenarioArg = args.find((arg) => arg.startsWith("--scenario=") || arg.startsWith("-s="))?.split("=")[1] || null;
const sysPromptArg = args.find((arg) => arg.startsWith("--sys-prompt="))?.split("=")[1] || "prompt";

console.log(`🔍 Running scenario test with:`, {
    case: caseArg,
    scenario: scenarioArg,
    sysPrompt: sysPromptArg
});

// Set environment variables
const env = {
    ...process.env,
    CASE: caseArg || "",
    SCENARIO: scenarioArg || "",
    SYS_PROMPT: sysPromptArg
};

// Run vitest with the scenario test
const vitestProcess = spawn("npx", ["vitest", "run", "scenarios/scenario.test.ts"], {
    cwd: path.join(__dirname, ".."),
    env,
    stdio: "inherit"
});

vitestProcess.on("close", (code) => {
    process.exit(code || 0);
});

vitestProcess.on("error", (error) => {
    console.error("Failed to start vitest:", error);
    process.exit(1);
});
