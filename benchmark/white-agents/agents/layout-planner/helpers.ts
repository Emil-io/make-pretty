import { runStep } from "./result-parser";
import { Step, StepContext } from "./types";

export type PromiseOrValue<T> = Promise<T> | T;

export const runInParallel = (
    processId: string,
    steps: Step[],
    context: StepContext,
    callback: (step: Step, result: any) => PromiseOrValue<void>,
) => {
    return Promise.allSettled(
        steps.map(async (step) => {
            const result = await runStep(processId, step, context);
            await callback(step, result);
        }),
    );
};
