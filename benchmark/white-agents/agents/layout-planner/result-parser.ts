import { runCouplerAgent } from "../layout-coupler/agent";
import { runExecutorAgent } from "../layout-executor/agent";
import { runRelayouterAgent } from "../layout-replaner/agent";
import { StepContext, StepType, type Step } from "./types";

export const runStep = async (
    processId: string,
    step: Step,
    ctx: StepContext,
) => {
    switch (step.type) {
        case StepType.relayouter: {
            const res = await runRelayouterAgent(processId, step, ctx);

            ctx.updateStep(step.id, res);

            return res;
        }
        case StepType.coupler: {
            const res = await runCouplerAgent(processId, step, ctx);

            ctx.updateStep(step.id, res);

            return res;
        }
        case StepType.executor: {
            const res = await runExecutorAgent(processId, step, ctx);

            await ctx.updateDatamodelFromChangeset(res.result);

            ctx.updateStep(step.id, {
                ...step,
                result: res.result,
            });

            return res;
        }
        default: {
            throw new Error(
                // @ts-ignore
                `[layout-planner]: Unknown step type: ${step.type}`,
            );
        }
    }
};
