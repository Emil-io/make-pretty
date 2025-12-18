#!/usr/bin/env tsx

/**
 * Scenario Test Runner
 *
 * This test file runs PowerPoint scenarios through AI analysis and validation.
 * It processes PowerPoint files, generates changesets via AI, injects them,
 * and validates the results against test protocols.
 */

import dotenv from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";
import {
    TestSummary,
    WhiteAgentRunner,
} from "../white-agents/runtime/index.js";
import { parseTestConfig, REGISTERED_AGENTS } from "./config.test.js";

dotenv.config();

// Parse test configuration
const config = parseTestConfig();

// Test suite
describe("Scenario Tests", () => {
    let testRunner: WhiteAgentRunner;
    let testSummary: TestSummary | null = null;

    beforeAll(async () => {
        console.log(`🤖 Running tests with agent: ${config.agent}`);

        // 1. Get agent class (dynamically selected)
        const AgentClass = REGISTERED_AGENTS[config.agent];

        // 2. Create runner with configuration (no agent/ppApi in constructor)
        testRunner = new WhiteAgentRunner({
            systemPromptName: config.systemPrompt,
            scenarioFilter: config.scenario,
            caseFilter: config.case,
        });

        // 3. Run all tests with agent class (creates fresh instances per test)
        testSummary = await testRunner.runAllTests(AgentClass);
    }, 180_000); // 3 minutes timeout

    it("should run all test cases", () => {
        expect(testSummary).toBeDefined();
        expect(testSummary!.totalTests).toBeGreaterThan(0);
    }, 180_000);

    it("should have some passing tests", () => {
        expect(testSummary).toBeDefined();
        expect(testSummary!.passedTests).toBeGreaterThan(0);
    }, 180_000);

    it("should complete within reasonable time", () => {
        expect(testSummary).toBeDefined();
        expect(testSummary!.executionTime).toBeLessThan(300000); // 5 minutes
    }, 180_000);

    // Individual test case validations
    it("should handle individual test cases", () => {
        expect(testSummary).toBeDefined();
        testSummary!.results.forEach((result) => {
            if (result.success) {
                expect(result.outputPath).toBeDefined();
                expect(result.executionTime).toBeGreaterThan(0);
            } else {
                console.warn(
                    `Test case ${result.caseId} failed: ${result.error}`,
                );
            }
        });
    }, 180_000);
});
