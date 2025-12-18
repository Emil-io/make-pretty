import { z } from "zod";
export var StepType;
(function (StepType) {
    StepType["relayouter"] = "relayouter";
    StepType["coupler"] = "coupler";
    StepType["executor"] = "executor";
})(StepType || (StepType = {}));
export var RelayouterStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.relayouter),
    task: z.string(),
    expected_layout_ids: z.array(z.string()),
    next: z.array(z.string()),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});
export var CouplerStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.coupler),
    task: z.string(),
    next: z.array(z.string()),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});
export var ExecuterStepSchema = z.object({
    id: z.string(),
    type: z.literal(StepType.executor),
    task: z.string(),
    layoutId: z.string(),
    next: z.array(z.string()).optional(),
    dependsOn: z.array(z.string()).optional(),
    add_context: z.string().optional(),
});
export var StepSchema = z.discriminatedUnion("type", [
    RelayouterStepSchema,
    CouplerStepSchema,
    ExecuterStepSchema,
]);
export var LayoutPlannerResultSchema = z.object({
    summary: z.string(),
    steps: z.array(StepSchema),
});
// Beispiel #1
// Prompt:
// Add a fourth column
// Existing layout:
var example1 = [
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
var prompt2 = "Add another col to the table and make the rationale text smaller/shorter. Measures shouldnt change.";
export var example2 = [
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
