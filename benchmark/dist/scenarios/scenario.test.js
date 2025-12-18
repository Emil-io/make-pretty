#!/usr/bin/env tsx
/**
 * Scenario Test Runner
 *
 * This test file runs PowerPoint scenarios through AI analysis and validation.
 * It processes PowerPoint files, generates changesets via AI, injects them,
 * and validates the results against test protocols.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dotenv from "dotenv";
import { beforeAll, describe, expect, it } from "vitest";
import { WhiteAgentRunner, } from "../white-agents/runtime/index.js";
import { parseTestConfig, REGISTERED_AGENTS } from "./config.test.js";
dotenv.config();
// Parse test configuration
var config = parseTestConfig();
// Test suite
describe("Scenario Tests", function () {
    var testRunner;
    var testSummary = null;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var AgentClass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83E\uDD16 Running tests with agent: ".concat(config.agent));
                    AgentClass = REGISTERED_AGENTS[config.agent];
                    // 2. Create runner with configuration (no agent/ppApi in constructor)
                    testRunner = new WhiteAgentRunner({
                        systemPromptName: config.systemPrompt,
                        scenarioFilter: config.scenario,
                        caseFilter: config.case,
                    });
                    return [4 /*yield*/, testRunner.runAllTests(AgentClass)];
                case 1:
                    // 3. Run all tests with agent class (creates fresh instances per test)
                    testSummary = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 180000); // 3 minutes timeout
    it("should run all test cases", function () {
        expect(testSummary).toBeDefined();
        expect(testSummary.totalTests).toBeGreaterThan(0);
    }, 180000);
    it("should have some passing tests", function () {
        expect(testSummary).toBeDefined();
        expect(testSummary.passedTests).toBeGreaterThan(0);
    }, 180000);
    it("should complete within reasonable time", function () {
        expect(testSummary).toBeDefined();
        expect(testSummary.executionTime).toBeLessThan(300000); // 5 minutes
    }, 180000);
    // Individual test case validations
    it("should handle individual test cases", function () {
        expect(testSummary).toBeDefined();
        testSummary.results.forEach(function (result) {
            if (result.success) {
                expect(result.outputPath).toBeDefined();
                expect(result.executionTime).toBeGreaterThan(0);
            }
            else {
                console.warn("Test case ".concat(result.caseId, " failed: ").concat(result.error));
            }
        });
    }, 180000);
});
