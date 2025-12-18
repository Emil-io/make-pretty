import { z } from "zod";
import { AITSlide } from "../../../../api/server/src/schemas/base";
import { AITChangesetSchema } from "../../../../api/server/src/schemas/changeset/schemas/changeset";
import { Layout } from "../layout-analyzer/types";

export interface StepState {
    stepGraph: Step[];

    originalLayout: Layout;
    currentLayout: Layout;
    promptCtx: string | null;

    datamodel: AITSlide;
    checkpoints: StepCheckpoint[];
    accomplishedSteps: Step[];
}

export interface StepContext extends StepState {
    pptxPath: string;
    slideId: number;
    updateCurrLayout: (layout: Layout) => void;
    updateDatamodelFromChangeset: (
        changeset: AITChangesetSchema,
    ) => Promise<void>;
    updateStep: (stepId: string, step: Step) => Step[];
}

export interface StepCheckpoint {
    stepId?: string;
    currentLayout: Layout;
    currentDatamodel: AITSlide;
}

export enum StepType {
    relayouter = "relayouter", // Manipulate layout structure, i.e., transform columns into rows, rows into grids, etc.
    coupler = "coupler", // Returns generic layouts that can be used by subsequent steps to conform to shared design/layout decisions that they must not come up individually.
    executor = "executor", // Manipulate layout content, i.e., add/remove shapes, change shape properties, etc. Will have access to the changeset API (based on the scope of the step)
}

export type ShapeId = string | number;

export interface StepBase {
    id: string;
    type: StepType;
    task: string; // The specific instruction or operation for this step.
    next?: string[]; // Step ids
    dependsOn?: string[]; // Step ids that this step depends on
    add_context?: string; // Context to add to the step. Will be added to the context of the agent.

    result?: any;
}

export interface RelayouterStep extends StepBase {
    type: StepType.relayouter;
    next: string[];
    expected_layout_ids: string[]; // The relayouter should make sure that the extected ids are part of the layout tree
}

export interface CouplerStep extends StepBase {
    type: StepType.coupler;
    next: string[];
}

export interface ExecuterStep extends StepBase {
    type: StepType.executor;
    task: string;
    next?: string[]; // Not required to have subsequent steps
    layoutId: string; // The layout this step is limited to. Will be the ultimate coordinate system for the step and only shapes within this layout can be seen by the step.
}

export type Step = RelayouterStep | CouplerStep | ExecuterStep;

export interface LayoutPlannerResult {
    summary: string;
    steps: Step[];
}

export const RelayouterStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.relayouter),
    task: z.string(),
    expected_layout_ids: z.array(z.string()),
    next: z.array(z.string()),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});

export const CouplerStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.coupler),
    task: z.string(),
    next: z.array(z.string()),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});

export const ExecuterStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.executor),
    task: z.string(),
    layoutId: z.string(),
    next: z.array(z.string()).optional(),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});

export const StepSchema = z.discriminatedUnion("type", [
    RelayouterStepSchema,
    CouplerStepSchema,
    ExecuterStepSchema,
]);

export const LayoutPlannerResultSchema = z.object({
    summary: z.string(),
    steps: z.array(StepSchema),
});

// Beispiel #1

// Prompt:
// Add a fourth column

// Existing layout:

const example1: Step[] = [
    {
        id: "get_four_column_layout",
        type: StepType.relayouter,
        task: "Based on the available boundaries, setup a four column layout with equal width columns. Remain equal spacing between columns. Take up full width and height.",
        expected_layout_ids: ["col1", "col2", "col3", "col4"],
        next: ["get_common_column_layout"],
    },
    {
        id: "get_common_column_layout",
        type: StepType.coupler,
        task: "Return a common column layout for the four equal columns. They should look as closely as possible to the existing columns, but should take into account how the new width will affect the layout.",
        next: [
            "realign-col1-content",
            "realign-col2-content",
            "realign-col3-content",
            "create-col4-content",
        ],
    },
    {
        id: "realign-col1-content",
        type: StepType.executor,
        task: "Realign the content of column 1 to the new layout.",
        layoutId: "col1",
    },
    {
        id: "realign-col2-content",
        type: StepType.executor,
        task: "Realign the content of column 2 to the new layout.",
        layoutId: "col2",
    },
    {
        id: "realign-col3-content",
        type: StepType.executor,
        task: "Realign the content of column 3 to the new layout.",
        layoutId: "col3",
    },
    {
        id: "create-col4-content",
        type: StepType.executor,
        task: "Create the content of column 4",
        layoutId: "col4",
    },
];

const prompt2 =
    "Add another col to the table and make the rationale text smaller/shorter. Measures shouldnt change.";

export const example2: Step[] = [
    {
        id: "update_table_layout",
        type: StepType.relayouter,
        task: "Based on the available boundaries, update the table layout to add another column. Make the rationale text smaller/shorter. Measures shouldnt change.",
        expected_layout_ids: [
            "header_4",
            "header_3",
            "cell_1_3",
            "cell_2_3",
            "cell_3_3",
            "cell_4_3",
            "cell_1_4",
            "cell_2_4",
            "cell_3_4",
            "cell_4_4",
        ],
        next: ["update_table_content"],
    },
    {
        id: "resize_existing_col_header",
        type: StepType.executor,
        task: "Resize the existing column header to fit the new layout.",
        layoutId: "header_3",
    },
    {
        id: "resize_existing_rationale_cells_text",
        type: StepType.executor,
        task: "Resize the existing rationale cells text to fit the new layout. Pressumably, the width will get smaller, while height should remain the same.",
        layoutId: "cell_4_3",
    },
    {
        id: "create_new_col_header",
        type: StepType.executor,
        task: "Create the new column header. The header should be same height/layout as the existing headers.",
        layoutId: "header_4",
    },
    {
        id: "create_new_rationale_cells",
        type: StepType.executor,
        task: "Create the new rationale cells. The cells should be same height/layout as the existing cells.",
        layoutId: "cell_1_4",
    },
    {
        id: "create_new_rationale_cells",
        type: StepType.executor,
        task: "Create a textbox for the new rationale cell.",
        layoutId: "cell_2_4",
    },
    {
        id: "create_new_rationale_cells",
        type: StepType.executor,
        task: "Create a textbox for the new rationale cell.",
        layoutId: "cell_3_4",
    },
    {
        id: "create_new_rationale_cells",
        type: StepType.executor,
        task: "Create a textbox for the new rationale cell.",
        layoutId: "cell_4_4",
    },
];
