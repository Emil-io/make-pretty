import { Mutex } from "async-mutex";
import fs from "fs";
import path from "path";
import { AITSlide } from "../../../../api/server/src/schemas/base";
import { AITChangesetSchema } from "../../../../api/server/src/schemas/changeset/schemas/changeset";
import { getDatamodelFromChangeset } from "../../../../api/server/src/services/shared/datamodel/transformers/apply-changeset";
import { getChangesetFromDataModels } from "../../../../api/server/src/services/shared/datamodel/transformers/get-diff";
import { createPowerPointServiceWithHealthCheck } from "../../../../api/server/src/services/addin/powerpoint";
import {
    getLayoutByIdFromGraph,
    getOutputDir,
    getShapeIdsFromLayout,
} from "../../helpers";
import { runLayoutAnalyzerAgent } from "../layout-analyzer/agent";
import { previewLayout } from "../layout-analyzer/preview-layout";
import { Layout } from "../layout-analyzer/types";
import { runLayoutSelectorAgent } from "../layout-selector/agent";
import { runPlannerAgent } from "./agent";
import { PromiseOrValue, runInParallel } from "./helpers";
import { Step, StepCheckpoint, StepContext, StepState } from "./types";

export class LayoutStepState {
    processId: string;
    stepGraph: Step[];

    originalDatamodel: AITSlide;
    datamodel: AITSlide;
    s;
    layout: Layout;
    error?: Error;

    checkpoints: StepCheckpoint[] = [];

    dmMutex = new Mutex();
    pptxPath: string;
    slideId: number;

    constructor({
        processId,
        stepGraph,
        datamodel,
        layout,
        pptxPath,
        slideId,
    }: {
        processId: string;
        stepGraph: Step[];
        datamodel: AITSlide;
        layout: Layout;
        pptxPath: string;
        slideId: number;
    }) {
        this.processId = processId;
        this.stepGraph = stepGraph;
        this.datamodel = datamodel;
        this.layout = layout;
        this.currLayout = layout;
        this.originalDatamodel = datamodel;
        this.pptxPath = pptxPath;
        this.slideId = slideId;
    }

    private currLayout: Layout;

    getState(): StepState {
        return {
            stepGraph: this.stepGraph,
            originalLayout: this.layout,
            currentLayout: this.currLayout,
            promptCtx: null,
            datamodel: this.datamodel,
            checkpoints: this.checkpoints,
            accomplishedSteps: this.pastSteps,
        };
    }

    updateStep(stepId: string, step: Step): Step[] {
        this.stepGraph = this.stepGraph.map((s) =>
            s.id === stepId ? step : s,
        );

        return this.stepGraph;
    }

    getContext(): StepContext {
        return {
            stepGraph: this.stepGraph,
            pptxPath: this.pptxPath,
            slideId: this.slideId,
            originalLayout: this.layout,
            currentLayout: this.currLayout,
            promptCtx: null,
            datamodel: this.datamodel,
            checkpoints: this.checkpoints,
            accomplishedSteps: this.pastSteps,
            updateCurrLayout: this.updateCurrLayout.bind(this),
            updateDatamodelFromChangeset: this.updateDatamodel.bind(this),
            updateStep: this.updateStep.bind(this),
        };
    }

    private updateCurrLayout(layout: Layout) {
        this.currLayout = layout;
    }

    private async updateDatamodel(changeset: AITChangesetSchema) {
        await this.dmMutex.runExclusive(async () => {
            try {
                this.datamodel = getDatamodelFromChangeset(
                    this.datamodel,
                    changeset,
                );
            } catch (error) {
                console.error(
                    `[layout-planner]: Error updating datamodel: ${error}`,
                );
                throw error;
            }
        });
    }

    async makeCheckpoint(stepId?: string) {
        const state = this.getState();
        this.checkpoints.push({
            stepId: stepId ?? undefined,
            currentLayout: this.currLayout,
            currentDatamodel: this.datamodel,
        });
        return;
    }

    async stop() {
        this.stopRequested = true;
    }
    private stopRequested = false;
    private maxIterations = 10;

    public getCurrentSteps(): Step[] {
        // A step is current if it is not in "next" and not in "past" yet
        const currentStepIds = new Set<string>();
        this.stepGraph.forEach((s) => {
            if (
                !this.nextSteps.map((s) => s.id).includes(s.id) &&
                !this.pastSteps.map((s) => s.id).includes(s.id)
            ) {
                currentStepIds.add(s.id);
            }
        });
        return this.stepGraph.filter((s) => currentStepIds.has(s.id));
    }

    private getNextSteps(step: Step | null): Step[] {
        // If null, find all steps that are not in "next" of any other step
        if (step === null) {
            const allNextSteps = new Set<string>();
            this.stepGraph.forEach((s) => {
                if (s.next) {
                    s.next.forEach((n) => allNextSteps.add(n));
                }
            });
            return this.stepGraph.filter((s) => !allNextSteps.has(s.id));
        }

        // If a step is provided, find all steps that are in "next" of the provided step
        const nextCandidates = step.next ?? [];
        return this.stepGraph.filter((s) => nextCandidates.includes(s.id));
    }

    private setNextSteps(steps: Step[]) {
        // Filter out steps whose id already exists in pastSteps or are already in nextSteps
        const pastStepIds = new Set(this.pastSteps.map((s) => s.id));
        const nextStepIds = new Set(this.nextSteps.map((s) => s.id));

        const newSteps = steps.filter((s) => {
            // Skip if this step was already in pastSteps or nextSteps
            if (pastStepIds.has(s.id) || nextStepIds.has(s.id)) return false;
            // If the step has dependencies, check all of them are already accomplished
            if (Array.isArray(s.dependsOn) && s.dependsOn.length > 0) {
                return s.dependsOn.every((depId: string) =>
                    pastStepIds.has(depId),
                );
            }
            // No dependencies, can be included
            return true;
        });

        // Add qualified new steps to nextSteps instead of overwriting
        this.nextSteps.push(...newSteps);
    }

    private pastSteps: Step[] = [];
    private nextSteps: Step[] = [];

    public getLatestChangeset(): AITChangesetSchema {
        const outputDir = getOutputDir(this.processId);

        // Save original datamodel to file system
        try {
            const originalDatamodelPath = path.join(
                outputDir,
                "original-datamodel.json",
            );
            fs.writeFileSync(
                originalDatamodelPath,
                JSON.stringify(this.originalDatamodel, null, 2),
            );
        } catch (error) {
            console.error(
                `[layout-planner]: Error saving original datamodel: ${error}`,
            );
            throw error;
        }

        // Save current datamodel to file system
        try {
            const currentDatamodelPath = path.join(
                outputDir,
                "current-datamodel.json",
            );

            fs.writeFileSync(
                currentDatamodelPath,
                JSON.stringify(this.datamodel, null, 2),
            );
        } catch (error) {
            console.error(
                `[layout-planner]: Error saving current datamodel: ${error}`,
            );
            throw error;
        }

        return getChangesetFromDataModels(
            this.originalDatamodel,
            this.datamodel,
        );
    }

    async run(
        onStepStart?: (steps: Step[], ctx: StepState) => PromiseOrValue<void>,
        onStepComplete?: (
            steps: Step[],
            ctx: StepState,
        ) => PromiseOrValue<void>,
    ) {
        this.nextSteps.push(...this.getNextSteps(null));

        let iterations = 0;
        while (
            this.nextSteps.length > 0 &&
            !this.stopRequested &&
            iterations <= this.maxIterations
        ) {
            const currSteps: Step[] = [];
            while (this.nextSteps.length > 0) {
                currSteps.push(this.nextSteps.shift()!);
            }

            iterations++;

            const context = this.getContext();

            try {
                onStepStart?.(currSteps, context);
                const res = await runInParallel(
                    this.processId,
                    currSteps,
                    context,
                    async (step, result) => {
                        this.pastSteps.push(step);
                        this.setNextSteps(this.getNextSteps(step));
                        this.makeCheckpoint(step.id);
                    },
                );
                const firstError = res.find(
                    (r) => r.status === "rejected",
                )?.reason;
                if (firstError) {
                    console.error(`[layout-planner]: Error: ${firstError}`);
                    //throw new Error(firstError);
                }
                onStepComplete?.(currSteps, context);
            } catch (error) {
                this.error = error as Error;
                console.error(`[layout-planner]: Error: ${error}`);
                throw error;
            }
        }

        const outputDir = getOutputDir(this.processId);

        // Save all checkpoints to file system
        try {
            const checkpointsPath = path.join(outputDir, "checkpoints.json");
            fs.writeFileSync(
                checkpointsPath,
                JSON.stringify(this.checkpoints, null, 2),
            );
        } catch (error) {
            console.error(
                `[layout-planner]: Error saving checkpoints: ${error}`,
            );
        }

        // Save the final datamodel
        try {
            const finalDatamodelPath = path.join(
                outputDir,
                "final-datamodel.json",
            );
            fs.writeFileSync(
                finalDatamodelPath,
                JSON.stringify(this.datamodel, null, 2),
            );
        } catch (error) {
            console.error(
                `[layout-planner]: Error saving final datamodel: ${error}`,
            );
        }

        try {
            const res = this.getLatestChangeset();
            const changesetPath = path.join(outputDir, "changeset.json");
            fs.writeFileSync(changesetPath, JSON.stringify(res, null, 2));
        } catch (error) {
            console.error(`[layout-planner]: Error saving changeset: ${error}`);
        }

        const totalSteps = this.pastSteps.length;
        console.info(`[layout-planner]: Completed ${totalSteps} steps`);
    }
}

export const runWorkflow = async ({
    userPrompt,
    processId,
    pptxPath,
    slideIndex,
}: {
    userPrompt: string;
    processId: string;
    pptxPath: string;
    slideIndex: number;
}) => {
    const service = await createPowerPointServiceWithHealthCheck();

    const datamodel = await service.getSlideByIndex(pptxPath, slideIndex);

    const snapshot = await service.getSlideSnapshotByIndex(
        pptxPath,
        slideIndex,
    );

    const layoutAnalyzerOutput = await runLayoutAnalyzerAgent({
        snapshotBase64: snapshot.pngBytes.toString("base64"),
        datamodel,
        processId,
    });

    await previewLayout(
        processId,
        "layout-analyzer-visualization",
        pptxPath,
        datamodel.id,
        layoutAnalyzerOutput.layout,
    );

    // Update the datamodel shape names by the layoutAnalyzerOutput.imgMapping
    if (layoutAnalyzerOutput.imgMapping) {
        // imgMapping is a Record<string, string> with string keys
        const mapping = layoutAnalyzerOutput.imgMapping;
        datamodel.shapes = datamodel.shapes.map((s) => {
            const idKey = String(s.id);
            return mapping.hasOwnProperty(idKey)
                ? { ...s, name: mapping[idKey] }
                : s;
        });
    }

    /*
    // Load layout from file system
    const layoutPath =
        "/Users/paulostarek/Desktop/powerpoint/letmecook/benchmark/white-agents/agents/layout-planner/test_layout.json";
    const layoutAnalyzerOutput = JSON.parse(
        fs.readFileSync(layoutPath, "utf8"),
    ) as { layout: Layout };*/

    const layoutSelectorOutput = await runLayoutSelectorAgent({
        prompt: userPrompt,
        layoutSchema: layoutAnalyzerOutput.layout,
        processId,
    });

    const narrowedDownLayout = getLayoutByIdFromGraph(
        layoutSelectorOutput.main,
        layoutAnalyzerOutput.layout,
    );

    // Now create a narrowed-down datamodel only including the shapes from the layout.
    const narrowedDownShapeIds = getShapeIdsFromLayout(narrowedDownLayout);

    const narrowedDownDatamodel = {
        ...datamodel,
        shapes: datamodel.shapes.filter((s) =>
            narrowedDownShapeIds.includes(s.id),
        ),
    } satisfies AITSlide;

    // Now create a plan for the layout changes.
    const plan = await runPlannerAgent(
        processId,
        narrowedDownDatamodel,
        narrowedDownLayout,
        layoutSelectorOutput.main,
        userPrompt,
    );

    const graph = new LayoutStepState({
        processId,
        stepGraph: plan.steps,
        datamodel: narrowedDownDatamodel,
        layout: narrowedDownLayout,
        pptxPath,
        slideId: datamodel.id,
    });

    // save graph to file system
    const outputDir = getOutputDir(processId);
    const graphPath = path.join(outputDir, "graph.json");
    // Write graph to file system
    fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));

    await graph.run(
        (steps, ctx) => {
            console.info(
                `[layout-planner]: Starting steps: ${steps.map((s) => s.id).join(", ")}`,
            );
            return;
        },
        (steps, ctx) => {
            console.info(
                `[layout-planner]: Completed steps: ${steps.map((s) => s.id).join(", ")}`,
            );
            return;
        },
    );

    // Apply latest changeset to the actual slide
    const changeset = graph.getLatestChangeset();

    const outputPath = path.join(outputDir, "result.pptx");

    const result = await service.injectChangeset(
        pptxPath,
        changeset,
        outputPath,
        datamodel.id,
    );

    console.info(`[layout-planner]: Result saved to: ${result.outputPath}`);

    return;
};
