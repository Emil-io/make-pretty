/**
 * Dummy Agent
 *
 * A simple test agent that always returns an empty changeset.
 * Useful for testing infrastructure without AI costs or delays.
 */

import { Agent, WhiteAgentPPApi } from "../../runtime/index.js";

export class DummyAgent implements Agent {
    private ppApi: WhiteAgentPPApi;

    constructor(ppApi: WhiteAgentPPApi) {
        this.ppApi = ppApi;
    }

    name = "Dummy Agent (No AI)";

    /**
     * Generate an empty changeset (no AI, no changes)
     */
    async generateChangeset(
        datamodel: any,
        userPrompt: string,
        systemPrompt: string,
    ): Promise<any> {
        console.log("🤖 Dummy Agent: Generating empty changeset...");
        console.log(`📝 User prompt: ${userPrompt.substring(0, 100)}...`);

        // Return a schema-valid empty changeset (matches AIChangesetSchema)
        const changeset = {};

        console.log("✅ Empty changeset generated");
        return changeset;
    }
}
