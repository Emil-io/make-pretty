import { tool } from "@langchain/core/tools";
import Yoga, { Align, Node } from "yoga-layout";
import z from "zod";

// Define spacing enum with reasonable percentages
export const Spacing = {
    tight: 0.05, // 5% spacing
    medium: 0.1, // 10% spacing
    wide: 0.2, // 20% spacing
    cavernous: 0.4, // 40% spacing
} as const;

export type SpacingType = keyof typeof Spacing;

// Define flex direction types using yoga enums
export const FlexDirection = {
    row: Yoga.FLEX_DIRECTION_ROW,
    column: Yoga.FLEX_DIRECTION_COLUMN,
    rowReverse: Yoga.FLEX_DIRECTION_ROW_REVERSE,
    columnReverse: Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
} as const;

export type FlexDirectionType = keyof typeof FlexDirection;

// Define flex wrap types using yoga enums
export const FlexWrap = {
    nowrap: Yoga.WRAP_NO_WRAP,
    wrap: Yoga.WRAP_WRAP,
    wrapReverse: Yoga.WRAP_WRAP_REVERSE,
} as const;

export type FlexWrapType = keyof typeof FlexWrap;

// Define justify content types using yoga enums
export const JustifyContent = {
    flexStart: Yoga.JUSTIFY_FLEX_START,
    flexEnd: Yoga.JUSTIFY_FLEX_END,
    center: Yoga.JUSTIFY_CENTER,
    spaceBetween: Yoga.JUSTIFY_SPACE_BETWEEN,
    spaceAround: Yoga.JUSTIFY_SPACE_AROUND,
    spaceEvenly: Yoga.JUSTIFY_SPACE_EVENLY,
} as const;

export type JustifyContentType = keyof typeof JustifyContent;

// Define align items types using yoga enums
export const AlignItems = {
    flexStart: Yoga.ALIGN_FLEX_START,
    flexEnd: Yoga.ALIGN_FLEX_END,
    center: Yoga.ALIGN_CENTER,
    baseline: Yoga.ALIGN_BASELINE,
    stretch: Yoga.ALIGN_STRETCH,
} as const;

export type AlignItemsType = keyof typeof AlignItems;

// Define align content types using yoga enums
export const AlignContent = {
    flexStart: Yoga.ALIGN_FLEX_START,
    flexEnd: Yoga.ALIGN_FLEX_END,
    center: Yoga.ALIGN_CENTER,
    spaceBetween: Yoga.ALIGN_SPACE_BETWEEN,
    spaceAround: Yoga.ALIGN_SPACE_AROUND,
    stretch: Yoga.ALIGN_STRETCH,
} as const;

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
    alignSelf?: Align;
}

// Define boundary coordinates interface
export interface BoundaryCoordinates {
    leftX: number;
    rightX: number;
    topY: number;
    bottomY: number;
}

// Define flex layout parameters
export interface FlexLayoutParameters {
    direction: FlexDirectionType;
    wrap?: FlexWrapType;
    justifyContent?: JustifyContentType;
    alignItems?: AlignItemsType;
    alignContent?: Align;
    gap?: number;
    boundary: BoundaryCoordinates;
    items: Item[];
}

// Define result interface
export interface AlignmentResult {
    items: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    totalWidth: number;
    totalHeight: number;
    spacing: number;
}

export const flexLayoutingFunction = (
    params: z.infer<typeof FlexLayoutingToolInput>,
): AlignmentResult => {
    const {
        direction,
        wrap = FlexWrap.nowrap,
        justifyContent = JustifyContent.flexStart,
        alignItems: alignItemsValue = AlignItems.stretch,
        alignContent = AlignContent.stretch,
        gap = 0,
        boundary,
        items,
    } = params;

    // Calculate boundary dimensions
    const boundaryWidth = boundary.rightX - boundary.leftX;
    const boundaryHeight = boundary.bottomY - boundary.topY;

    // Calculate total space needed by items (including gaps)
    const totalItemWidth = items.reduce((sum, item) => sum + item.width, 0);
    const totalItemHeight = items.reduce((sum, item) => sum + item.height, 0);
    const totalGapWidth = gap * Math.max(0, items.length - 1);
    const totalGapHeight = gap * Math.max(0, items.length - 1);

    // Calculate scale factors to fit within boundary
    const scaleX = boundaryWidth / (totalItemWidth + totalGapWidth);
    const scaleY = boundaryHeight / (totalItemHeight + totalGapHeight);
    const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down

    // Scale items if they would overflow
    const scaledItems = items.map((item) => ({
        ...item,
        width: item.width * scale,
        height: item.height * scale,
    }));

    // Create yoga layout instance
    const yoga = Yoga.Node.createDefault();

    // Set container properties
    yoga.setWidth(boundaryWidth);
    yoga.setHeight(boundaryHeight);
    yoga.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
    yoga.setPosition(Yoga.EDGE_LEFT, boundary.leftX);
    yoga.setPosition(Yoga.EDGE_TOP, boundary.topY);

    // Set flex properties
    yoga.setFlexDirection(FlexDirection[direction]);
    yoga.setFlexWrap(FlexWrap[wrap]);
    yoga.setJustifyContent(JustifyContent[justifyContent]);
    yoga.setAlignItems(AlignItems[alignItemsValue]);
    yoga.setAlignContent(AlignContent[alignContent]);

    if (gap > 0) {
        yoga.setGap(Yoga.GUTTER_ALL, gap * scale); // Scale gap proportionally
    }

    // Create child nodes for each scaled item
    const childNodes: Node[] = [];
    for (const item of scaledItems) {
        const childNode = Yoga.Node.createDefault();

        // Set item dimensions (now scaled)
        childNode.setWidth(item.width);
        childNode.setHeight(item.height);

        // Set flex properties if provided
        if (item.flexGrow !== undefined) {
            childNode.setFlexGrow(item.flexGrow);
        }
        if (item.flexShrink !== undefined) {
            childNode.setFlexShrink(item.flexShrink);
        }
        if (item.flexBasis !== undefined) {
            childNode.setFlexBasis(item.flexBasis);
        }
        if (item.alignSelf !== undefined) {
            childNode.setAlignSelf(item.alignSelf);
        }

        yoga.insertChild(childNode, childNodes.length);
        childNodes.push(childNode);
    }

    // Calculate layout
    yoga.calculateLayout(boundaryWidth, boundaryHeight, Yoga.DIRECTION_LTR);

    // Extract results
    const result: AlignmentResult["items"] = [];
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

    // Clean up
    childNodes.forEach((node) => node.free());
    yoga.free();

    return {
        items: result,
        totalWidth: totalWidth - boundary.leftX,
        totalHeight: totalHeight - boundary.topY,
        spacing: gap * scale,
    };
};

export const FlexLayoutingToolInput = z
    .object({
        description: z
            .string()
            .optional()
            .describe(
                "A description of the layout to be created. This is used to help the model understand the layout and create a more accurate layout. If you added `virtual-items`, describe the logical group of shapes or (if not too many) the shape ids that form one functional region.",
            ),
        direction: z.enum(FlexDirection),
        wrap: z.enum(FlexWrap).optional(),
        justifyContent: z.enum(JustifyContent).optional(),
        alignItems: z.enum(AlignItems).optional(),
        alignContent: z.enum(AlignContent).optional(),
        gap: z.number().optional(),
        boundary: z.object({
            leftX: z.number(),
            rightX: z.number(),
            topY: z.number(),
            bottomY: z.number(),
        }),
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
                alignSelf: z.enum(AlignItems).optional(),
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

/**
 * Layouts items within a boundary using flexbox layout
 */
export const flexLayouting = tool(
    (params): string => {
        const result = flexLayoutingFunction(
            params as z.infer<typeof FlexLayoutingToolInput>,
        );

        return JSON.stringify(result, null, 1);
    },
    {
        name: "flex-layouting",
        description:
            "Layouts items within a boundary using (css) flexbox layout. Items are automatically scaled down to fit within the boundary if they would overflow, ensuring all items always fit within the specified boundaries.",
        schema: FlexLayoutingToolInput,
        verbose: true,
    },
);
