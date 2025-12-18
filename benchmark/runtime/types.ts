// Types for the Agent Beats API

export interface SubmitChangesetRequest {
    caseId: string;
    whiteAgentId: string;
    changeset: any;
}

export interface SubmitChangesetResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface TestResult {
    caseId: string;
    success: boolean;
    passed: number;
    failed: number;
    errors: Array<{
        testName: string;
        message?: string;
        actual?: any;
        expected?: any;
    }>;
}

export interface GetResultsResponse {
    whiteAgentId: string;
    score: number;
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    tests: TestResult[];
}

export interface GetTestCaseResponse {
    caseId: string;
    datamodel: any;
    prompt: string;
}

export interface GetTestCaseIdsResponse {
    ids: string[];
}

export interface RestartResponse {
    success: boolean;
    message?: string;
    error?: string;
}
