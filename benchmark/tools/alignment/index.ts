import { tool } from "@langchain/core/tools";
import z from "zod";
import { getColumnAlignmentFunction } from "./helpers/column-helper";
import { getRowAlignmentFunction } from "./helpers/row-helper";

// Define interfaces
export interface GridItem {
    id: string;
    width?: number;
    height?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | "100%";
    alignSelf?:
        | "auto"
        | "flex-start"
        | "flex-end"
        | "center"
        | "baseline"
        | "stretch";
}

export interface GridRow {
    id: string;
    cells: GridCell[];
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | "100%";
}

export interface GridCell {
    id: string;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | "100%";

    width?: number;
    height?: number;
}

export interface BoundaryCoordinates {
    leftX: number;
    rightX: number;
    topY: number;
    bottomY: number;
}

export interface GridAlignmentResult {
    items: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    totalWidth: number;
    totalHeight: number;
    gridColumns: number;
    gridRows: number;
}

export const getAlignmentFunction = (
    params: z.infer<typeof GetAlignmentToolInput>,
): GridAlignmentResult => {
    const {
        boundary,
        rows,
        padding = 0.05,
        gap = 0.05,
        disableRowGap = false,
        disableColGap = false,
    } = params;

    // Calculate boundary dimensions
    const boundaryWidth = boundary.rightX - boundary.leftX;
    const boundaryHeight = boundary.bottomY - boundary.topY;

    // Calculate padding values (as percentage of boundary dimensions)
    const paddingX = boundaryWidth * padding;
    const paddingY = boundaryHeight * padding;

    // Calculate gap value based on the smaller dimension of the boundary
    const smallerDimension = Math.min(boundaryWidth, boundaryHeight);
    const gapPx = smallerDimension * gap;

    // Apply gap conditionally based on disable flags
    const rowGapPx = disableRowGap ? 0 : gapPx;
    const colGapPx = disableColGap ? 0 : gapPx;

    // Create padded boundary
    const paddedBoundary = {
        leftX: boundary.leftX + paddingX,
        rightX: boundary.rightX - paddingX,
        topY: boundary.topY + paddingY,
        bottomY: boundary.bottomY - paddingY,
    };

    // Handle empty grid
    if (rows.length === 0) {
        return {
            items: [],
            totalWidth: boundaryWidth,
            totalHeight: boundaryHeight,
            gridColumns: 0,
            gridRows: 0,
        };
    }

    // Calculate total number of columns (max cells in any row)
    const maxColumns = Math.max(...rows.map((row) => row.cells.length));

    // Step 1: Use getColumnAlignmentFunction to layout rows vertically
    // Create virtual items representing each row
    const rowItems = rows.map((row) => {
        // Check if any cell in the row has an explicit height
        const rowHeight = row.cells.find(
            (cell) => cell.height !== undefined,
        )?.height;

        // If row has explicit height from cells but no flexBasis, use height as flexBasis (fixed height)
        let flexBasis = row.flexBasis;
        if (flexBasis === undefined && rowHeight !== undefined) {
            flexBasis = rowHeight;
        }

        return {
            id: row.id,
            width: paddedBoundary.rightX - paddedBoundary.leftX,
            height: rowHeight ?? 100, // Use cell height if provided, otherwise placeholder
            flexGrow: row.flexGrow ?? (flexBasis !== undefined ? 0 : 1), // Don't grow if flexBasis is set
            flexShrink: row.flexShrink ?? 1,
            flexBasis: flexBasis,
        };
    });

    const rowLayout = getColumnAlignmentFunction({
        boundary: paddedBoundary,
        fullWidth: true,
        fullHeight: true,
        gap: rowGapPx,
        items: rowItems,
    });

    // Step 2: For each row, use getRowAlignmentFunction to layout cells horizontally
    const result: GridAlignmentResult["items"] = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const rowBounds = rowLayout.items[rowIndex];

        // Create a boundary for this row
        const rowBoundary = {
            leftX: rowBounds.x,
            rightX: rowBounds.x + rowBounds.width,
            topY: rowBounds.y,
            bottomY: rowBounds.y + rowBounds.height,
        };

        // Convert cells to items for row alignment
        const cellItems = row.cells.map((cell) => {
            // If cell has explicit width but no flexBasis, use width as flexBasis (fixed width)
            // If cell has explicit height but no flexBasis, let flex handle it
            let flexBasis = cell.flexBasis;
            if (flexBasis === undefined && cell.width !== undefined) {
                // Use width as flexBasis for fixed-width cells
                flexBasis = cell.width;
            }

            return {
                id: cell.id,
                width: cell.width ?? 100, // Placeholder, will be determined by flex
                height: cell.height ?? rowBounds.height,
                flexGrow: cell.flexGrow ?? (flexBasis !== undefined ? 0 : 1), // Don't grow if flexBasis is set
                flexShrink: cell.flexShrink ?? 1,
                flexBasis: flexBasis,
            };
        });

        // Layout cells within this row
        const cellLayout = getRowAlignmentFunction({
            boundary: rowBoundary,
            fullWidth: true,
            fullHeight: true,
            gap: colGapPx,
            items: cellItems,
        });

        // Add all cells from this row to the result
        result.push(...cellLayout.items);
    }

    return {
        items: result,
        totalWidth: boundaryWidth,
        totalHeight: boundaryHeight,
        gridColumns: maxColumns,
        gridRows: rows.length,
    };
};

// Define input schema
export const GetAlignmentToolInput = z
    .object({
        description: z.string().optional(),
        boundary: z.object({
            leftX: z.number(),
            rightX: z.number(),
            topY: z.number(),
            bottomY: z.number(),
        }),
        rows: z.array(
            z.object({
                id: z.string(),
                cells: z.array(
                    z.object({
                        id: z.string(),
                        width: z.number().optional(),
                        height: z.number().optional(),
                        flexGrow: z.number().default(1).optional(),
                        flexShrink: z.number().default(1).optional(),
                        flexBasis: z
                            .union([z.number(), z.literal("100%")])
                            .default("100%")
                            .optional(),
                        alignSelf: z
                            .enum([
                                "auto",
                                "flex-start",
                                "flex-end",
                                "center",
                                "baseline",
                                "stretch",
                            ])
                            .optional(),
                    }),
                ),
                flexGrow: z.number().default(1).optional(),
                flexShrink: z.number().default(1).optional(),
                flexBasis: z
                    .union([z.number(), z.literal("100%")])
                    .default("100%")
                    .optional(),
            }),
        ),
        padding: z.number().default(0.05).optional(), // Default 5% padding (percentage of boundary dimensions)
        gap: z.number().default(0.05).optional(), // Gap between rows and columns (percentage of smaller boundary dimension, default 5%)
        disableRowGap: z.boolean().default(false).optional(), // Disable gap between rows
        disableColGap: z.boolean().default(false).optional(), // Disable gap between columns
    })
    .refine(
        (data) =>
            data.boundary.rightX > data.boundary.leftX &&
            data.boundary.bottomY > data.boundary.topY,
        {
            message: "Boundary must have positive width and height",
        },
    );

// Create the tool
export const getAlignmentTool = tool(
    async (params: z.infer<typeof GetAlignmentToolInput>) => {
        const result = getAlignmentFunction(params);
        return {
            description: params.description,
            ...result,
        };
    },
    {
        name: "get-alignment",
        description:
            "Align items in a predefined layout using row and column definitions with flex properties",
        schema: GetAlignmentToolInput,
    },
);

