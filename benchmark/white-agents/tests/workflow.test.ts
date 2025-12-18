import dotenv from "dotenv";
import { describe } from "vitest";
import { runWorkflow } from "../agents/layout-planner";

dotenv.config();

const PPTX_PATH =
    "/Users/paulostarek/Desktop/powerpoint/letmecook/benchmark/white-agents/tests/example2.pptx";
const SLIDE_INDEX = 10;
const PROMPT = "Please convert the three columns to three rows (each column should be a row in the new layout, with the heading being the left of the column (20%), then in the middle the icon and company logos, and the footer being the right of the column (20% width)). Also keep the gap between the rows vertically."; //"Instead of 7x2, make it 7x3, keep gaps in grid. Keep gap between the cells. For all the new cells, just give them placeholder text"; //"Pls make the first column 2x as wide as the others and add a fourth column to the right of the others, keep the gaps and align ofc"; //"Instead of 7x2, make it 5x3, keep gaps in grid";

describe("Workflow", () => {
    it(
        "should run the workflow",
        async () => {
            const now = new Date();
            // Make it ISO format: YYYY-MM-DDTHH:mm
            const formattedDate = now
                .toISOString()
                .slice(0, 16)
                .replace("T", "_");
            const processId = `workflow_${formattedDate}`;
            const result = await runWorkflow({
                processId,
                userPrompt: PROMPT,
                pptxPath: PPTX_PATH,
                slideIndex: SLIDE_INDEX,
            });
            //expect(result).toBeDefined();
        },
        5 * 60 * 1000,
    ); // 5minutes timeout

    afterAll(async () => {
        // wait 5 secs
        await new Promise((resolve) => setTimeout(resolve, 5000));
    });
});
