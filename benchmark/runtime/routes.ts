import { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { agentBeatsService } from "./service.js";

export function initializeAgentBeats(app: Express) {
    app.get("/scenarios", async (_req: Request, response: Response) => {
        try {
            const result = await agentBeatsService.getTestCaseIds();
            response.json(result);
        } catch (error) {
            console.error("Error getting test case IDs:", error);
            response.status(500).json({
                error: "Failed to get test case IDs",
                details: error instanceof Error ? error.message : String(error),
            });
        }
    });

    app.get(
        "/scenarios/datamodel/:caseId",
        async (req: Request, response: Response) => {
            const { caseId } = req.params;

            try {
                const result = await agentBeatsService.getTestCaseData(caseId);
                response.json(result);
            } catch (error) {
                console.error(
                    `Error getting test case data for ${caseId}:`,
                    error,
                );
                if (
                    error instanceof Error &&
                    error.message.includes("not found")
                ) {
                    response.status(404).json({
                        error: error.message,
                    });
                } else {
                    response.status(500).json({
                        error: "Failed to get test case data",
                        details:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
                }
            }
        },
    );

    app.post(
        "/scenarios/submit-changeset",
        async (req: Request, response: Response) => {
            try {
                const {
                    caseId,
                    whiteAgentId,
                    changeset: changeset_str,
                } = req.body;

                // Validate required fields
                if (!caseId || !whiteAgentId || !changeset_str) {
                    response.status(400).json({
                        error: "Missing required fields: caseId, whiteAgentId, or changeset",
                    });
                    return;
                }

                const changeset = JSON.parse(changeset_str);

                // Save body with timestamp in __generated__ folder
                const timestamp = Date.now();
                const fileName = `${timestamp}-changeset.json`;
                const generatedDir = path.join(process.cwd(), "__generated__");

                // Ensure __generated__ directory exists
                if (!fs.existsSync(generatedDir)) {
                    fs.mkdirSync(generatedDir, { recursive: true });
                }

                fs.writeFileSync(
                    path.join(generatedDir, fileName),
                    JSON.stringify(changeset, null, 2),
                );

                // Call the service with timeout protection
                console.log("Calling agentBeatsService.submitChangeset...");
                const result = await agentBeatsService.submitChangeset({
                    caseId,
                    whiteAgentId,
                    changeset,
                });

                console.log(
                    "agentBeatsService.submitChangeset result:",
                    result,
                );

                if (!result.success) {
                    console.error("Error submitting changeset:", result.error);
                    response.status(500).json(result);
                    return;
                }

                response.json(result);
            } catch (error) {
                console.error("Error submitting changeset:", error);
                response.status(500).json({
                    success: false,
                    error: "Failed to submit changeset",
                    details:
                        error instanceof Error ? error.message : String(error),
                });
            }
        },
    );

    app.get(
        "/scenarios/results/:whiteAgentId",
        async (req: Request, response: Response) => {
            const { whiteAgentId } = req.params;

            try {
                const result = await agentBeatsService.getResults(whiteAgentId);
                response.json(result);
            } catch (error) {
                console.error(
                    `Error getting results for white agent ${whiteAgentId}:`,
                    error,
                );
                if (
                    error instanceof Error &&
                    error.message.includes("No results found")
                ) {
                    response.status(404).json({
                        error: error.message,
                    });
                } else {
                    response.status(500).json({
                        error: "Failed to get test results",
                        details:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
                }
            }
        },
    );

    app.post("/scenarios/restart", async (req: Request, response: Response) => {
        try {
            const result = await agentBeatsService.restart();
            if (!result.success) {
                response.status(500).json(result);
                return;
            }
            response.json(result);
        } catch (error) {
            console.error("Error clearing generated files:", error);
            response.status(500).json({
                success: false,
                error: "Failed to clear generated files",
                details: error instanceof Error ? error.message : String(error),
            });
        }
    });
}
