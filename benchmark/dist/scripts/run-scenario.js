#!/usr/bin/env tsx
/**
 * Scenario Test Runner Script
 *
 * This script handles command line arguments and runs the scenario tests
 * with proper filtering for cases and scenarios.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c;
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// Parse command line arguments
var args = process.argv.slice(2);
var caseArg = ((_a = args.find(function (arg) { return arg.startsWith("--case="); })) === null || _a === void 0 ? void 0 : _a.split("=")[1]) || null;
var scenarioArg = ((_b = args.find(function (arg) { return arg.startsWith("--scenario=") || arg.startsWith("-s="); })) === null || _b === void 0 ? void 0 : _b.split("=")[1]) || null;
var sysPromptArg = ((_c = args.find(function (arg) { return arg.startsWith("--sys-prompt="); })) === null || _c === void 0 ? void 0 : _c.split("=")[1]) || "prompt";
console.log("\uD83D\uDD0D Running scenario test with:", {
    case: caseArg,
    scenario: scenarioArg,
    sysPrompt: sysPromptArg
});
// Set environment variables
var env = __assign(__assign({}, process.env), { CASE: caseArg || "", SCENARIO: scenarioArg || "", SYS_PROMPT: sysPromptArg });
// Run vitest with the scenario test
var vitestProcess = spawn("npx", ["vitest", "run", "scenarios/scenario.test.ts"], {
    cwd: path.join(__dirname, ".."),
    env: env,
    stdio: "inherit"
});
vitestProcess.on("close", function (code) {
    process.exit(code || 0);
});
vitestProcess.on("error", function (error) {
    console.error("Failed to start vitest:", error);
    process.exit(1);
});
