import Yoga, { Node } from "yoga-layout";
import z from "zod";

// Define boundary coordinates interface
export interface BoundaryCoordinates {
    leftX: number;
    rightX: number;
    topY: number;
    bottomY: number;
}

// Define item interface
export interface Item {
    id: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | "100%";
    alignSelf?: "flexStart" | "flexEnd" | "center" | "baseline" | "stretch";
}

// Define result interface
export interface ColumnAlignmentResult {
    items: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    totalWidth: number;
    totalHeight: number;
}

// Map alignSelf string values to Yoga constants
const mapAlignSelf = (
    alignSelf?: "flexStart" | "flexEnd" | "center" | "baseline" | "stretch",
) => {
    if (!alignSelf) return undefined;
    switch (alignSelf) {
        case "flexStart":
            return Yoga.ALIGN_FLEX_START;
        case "flexEnd":
            return Yoga.ALIGN_FLEX_END;
        case "center":
            return Yoga.ALIGN_CENTER;
        case "baseline":
            return Yoga.ALIGN_BASELINE;
        case "stretch":
            return Yoga.ALIGN_STRETCH;
        default:
            return undefined;
    }
};

export const getColumnAlignmentFunction = (
    params: z.infer<typeof GetColumnAlignmentToolInput>,
): ColumnAlignmentResult => {
    const {
        boundary,
        fullWidth = true,
        fullHeight = true,
        gap = 0,
        items,
    } = params;

    // Calculate boundary dimensions
    const boundaryWidth = boundary.rightX - boundary.leftX;
    const boundaryHeight = boundary.bottomY - boundary.topY;

    // Handle empty items array
    if (items.length === 0) {
        return {
            items: [],
            totalWidth: 0,
            totalHeight: 0,
        };
    }

    // Calculate scale factor if needed
    const totalItemHeight = items.reduce((sum, item) => sum + item.height, 0);
    const totalGapHeight = gap * Math.max(0, items.length - 1);
    const maxItemWidth = Math.max(...items.map((item) => item.width));

    const scaleX = fullWidth ? Math.min(1, boundaryWidth / maxItemWidth) : 1;
    const scaleY = fullHeight
        ? Math.min(1, boundaryHeight / (totalItemHeight + totalGapHeight))
        : 1;
    const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down

    // Scale items if needed
    const scaledItems = items.map((item) => ({
        ...item,
        width: item.width * scale,
        height: item.height * scale,
    }));

    // Create yoga layout container
    const yogaRoot = Yoga.Node.createDefault();
    yogaRoot.setWidth(boundaryWidth);
    yogaRoot.setHeight(boundaryHeight);
    yogaRoot.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    yogaRoot.setAlignItems(Yoga.ALIGN_CENTER); // Center items horizontally in column

    // Set gap if provided
    if (gap > 0) {
        yogaRoot.setGap(Yoga.GUTTER_ALL, gap * scale);
    }

    // Create child nodes for each item
    const childNodes: Node[] = [];
    for (const item of scaledItems) {
        const childNode = Yoga.Node.createDefault();

        // Set item base dimensions
        childNode.setWidth(item.width);

        // For column layout, height is managed by flex properties
        if (item.flexBasis !== undefined) {
            // If flexBasis is explicitly provided, use it
            if (item.flexBasis === "100%") {
                childNode.setFlexBasisPercent(100);
            } else {
                childNode.setFlexBasis(item.flexBasis * scale);
            }
        } else {
            // When flexGrow is provided without flexBasis, use 0 as basis
            // so the space is distributed purely based on flexGrow ratios
            childNode.setFlexBasis(0);
        }

        // Set flex properties if provided
        if (item.flexGrow !== undefined) {
            childNode.setFlexGrow(item.flexGrow);
        } else {
            childNode.setFlexGrow(1); // Default to 1 for column layout
        }

        if (item.flexShrink !== undefined) {
            childNode.setFlexShrink(item.flexShrink);
        } else {
            childNode.setFlexShrink(1);
        }

        if (item.alignSelf !== undefined) {
            const alignValue = mapAlignSelf(item.alignSelf);
            if (alignValue !== undefined) {
                childNode.setAlignSelf(alignValue);
            }
        }

        yogaRoot.insertChild(childNode, childNodes.length);
        childNodes.push(childNode);
    }

    // Calculate layout
    yogaRoot.calculateLayout(boundaryWidth, boundaryHeight, Yoga.DIRECTION_LTR);

    // Extract results
    const result: ColumnAlignmentResult["items"] = [];
    let totalWidth = 0;
    let totalHeight = 0;

    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        const item = scaledItems[i];

        const x = childNode.getComputedLeft();
        const y = childNode.getComputedTop();
        const width = childNode.getComputedWidth();
        const height = childNode.getComputedHeight();

        result.push({
            id: item.id,
            x: boundary.leftX + x,
            y: boundary.topY + y,
            width,
            height,
        });

        totalWidth = Math.max(totalWidth, x + width);
        totalHeight = Math.max(totalHeight, y + height);
    }

    // Clean up yoga nodes
    childNodes.forEach((node) => node.free());
    yogaRoot.free();

    return {
        items: result,
        totalWidth,
        totalHeight,
    };
};

export const GetColumnAlignmentToolInput = z
    .object({
        boundary: z.object({
            leftX: z.number(),
            rightX: z.number(),
            topY: z.number(),
            bottomY: z.number(),
        }),
        fullWidth: z.boolean().default(true).optional(),
        fullHeight: z.boolean().default(true).optional(),
        gap: z.number().default(0).optional(),
        items: z.array(
            z.object({
                id: z.string(),
                width: z.number(),
                height: z.number(),
                x: z.number().optional(),
                y: z.number().optional(),
                flexGrow: z.number().optional(),
                flexShrink: z.number().optional(),
                flexBasis: z.number().or(z.literal("100%")).optional(),
                alignSelf: z
                    .enum([
                        "flexStart",
                        "flexEnd",
                        "center",
                        "baseline",
                        "stretch",
                    ])
                    .optional(),
            }),
        ),
    })
    .refine(
        (data) => {
            // Validate that boundary is valid (rightX > leftX, bottomY > topY)
            if (
                data.boundary.rightX <= data.boundary.leftX ||
                data.boundary.bottomY <= data.boundary.topY
            ) {
                return false;
            }

            // Validate that all items have positive dimensions
            for (const item of data.items) {
                if (item.width <= 0 || item.height <= 0) {
                    return false;
                }
            }

            return true;
        },
        {
            message:
                "Boundary must be valid (rightX > leftX, bottomY > topY) and all items must have positive dimensions. Items will be automatically scaled to fit within boundaries if they would overflow.",
        },
    );






