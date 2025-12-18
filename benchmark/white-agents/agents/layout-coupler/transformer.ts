// Combine our layout analysis and the datamodel to show each shape in their relative positioning of their layout/container

import { AITShape } from "../../../../api/server/src/schemas/base/schemas";
import { AITAutoShape } from "../../../../api/server/src/schemas/base/schemas/autoshape";
import { AITChartShape } from "../../../../api/server/src/schemas/base/schemas/chart";
import { AITGroupShape } from "../../../../api/server/src/schemas/base/schemas/group";
import { AITImageShape } from "../../../../api/server/src/schemas/base/schemas/image";
import { AITLineShape } from "../../../../api/server/src/schemas/base/schemas/line";
import { AITPlaceholderShape } from "../../../../api/server/src/schemas/base/schemas/placeholder";
import { AITextboxShape } from "../../../../api/server/src/schemas/base/schemas/text";
import {
    AITPos,
    AITSize,
} from "../../../../api/server/src/schemas/common/shape";
import { Layout } from "../layout-analyzer/types";

export const getLayoutWithRelativeShapes = (
    originalLayout: Layout,
    datamodel: AITShape[],
) => {
    const shapes = new Map<string | number, AITShape>();

    datamodel.forEach((shape) => {
        shapes.set(shape.id, shape);
    });

    function processLayoutRecursive(layout: Layout) {
        if (layout.multi === false) {
            const shapesOfLayout =
                layout.s
                    ?.map((id) => shapes.get(id))
                    .filter((shape) => shape !== undefined) ?? [];

            // Now remove from shapes map
            shapesOfLayout.forEach((shape) => {
                shapes.delete(shape.id);
            });

            const layoutTopLeft = layout.b[0];

            const coordinateShiftedShapes = shapesOfLayout.map((shape) =>
                coordinateTransformMapper(layoutTopLeft)(shape),
            );

            // Now transform all positions of the shapes to be relative to the layout top left. this includes the pos: {topLeft, bottomRight, center}, startPos, endPos
            const transformedShapes = layoutCouplerInputTransformer(
                coordinateShiftedShapes,
            );

            return {
                id: layout.id,
                name: layout.name,
                type: layout.type,
                multi: layout.multi,
                b: layout.b,
                s: layout.s,
                sl: layout.sl?.map((sublayout) =>
                    processLayoutRecursive(sublayout),
                ),
                shapes: transformedShapes,
            };
        } else {
            const transformedSublayouts = layout.sl?.map((sublayout) =>
                processLayoutRecursive(sublayout),
            );

            const childLayouts = layout.b.map((child) => {
                const shapesOfLayout =
                    child[3]
                        ?.map((id) => shapes.get(id))
                        .filter((shape) => shape !== undefined) ?? [];

                // Now remove from shapes map
                shapesOfLayout.forEach((shape) => {
                    shapes.delete(shape.id);
                });

                const coordinateShiftedShapes = shapesOfLayout.map((shape) =>
                    coordinateTransformMapper(child[1])(shape),
                );
                const transformedShapes = layoutCouplerInputTransformer(
                    coordinateShiftedShapes,
                );

                return {
                    id: child[0],
                    b: child[1],
                    type: layout.type,
                    s: child[3],
                    shapes: transformedShapes,
                };
            });

            return {
                id: layout.id,
                name: layout.name,
                type: layout.type,
                multi: layout.multi,
                s: layout.s,
                sl: transformedSublayouts,
                b: childLayouts,
            };
        }
    }

    return processLayoutRecursive(originalLayout);
};

const coordinateTransformMapper = (layoutTopLeft: [number, number]) =>
    shapeMapper({
        autoShape: (shape) => {
            return {
                ...shape,
                pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                },
            } satisfies AITAutoShape;
        },
        image: (shape) => {
            return {
                ...shape,
                pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                },
            } satisfies AITImageShape;
        },
        line: (shape) => {
            return {
                ...shape,
                startPos: shape.startPos
                    ? relCoordinate(shape.startPos, layoutTopLeft)
                    : undefined,
                endPos: shape.endPos
                    ? relCoordinate(shape.endPos, layoutTopLeft)
                    : undefined,
            } satisfies AITLineShape;
        },
        textbox: (shape) => {
            return {
                ...shape,
                pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                },
            } satisfies AITextboxShape;
        },
        chart: (shape) => {
            return {
                ...shape,
                pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                },
            } satisfies AITChartShape;
        },
        group: (shape) => shape,
        placeholder: (shape) => {
            return {
                ...shape,
                shape: shape.shape
                    ? coordinateTransformMapper(layoutTopLeft)(shape.shape)
                    : undefined,
            } satisfies AITPlaceholderShape;
        },
    });

function relCoordinate(
    coordinate: [number, number],
    relativeTo: [number, number],
): [number, number] {
    return roundCoordinate([
        coordinate[0] - relativeTo[0],
        coordinate[1] - relativeTo[1],
    ]);
}

function roundCoordinate(coordinate: [number, number]): [number, number] {
    return [Math.round(coordinate[0]), Math.round(coordinate[1])];
}

function roundPos(pos: AITPos): AITPos {
    return {
        topLeft: pos.topLeft ? roundCoordinate(pos.topLeft) : undefined,
        bottomRight: pos.bottomRight
            ? roundCoordinate(pos.bottomRight)
            : undefined,
        center: pos.center ? roundCoordinate(pos.center) : undefined,
    };
}

function roundSize(size: AITSize): AITSize {
    return { w: Math.round(size.w), h: Math.round(size.h) } as AITSize;
}

export const shapeMapper =
    (mapper: {
        autoShape?: (shape: AITAutoShape) => any;
        image?: (shape: AITImageShape) => any;
        line?: (shape: AITLineShape) => any;
        textbox?: (shape: AITextboxShape) => any;
        placeholder?: (shape: AITPlaceholderShape) => any;
        chart?: (shape: AITChartShape) => any;
        group?: (shape: AITGroupShape) => any;
    }) =>
    (shape: AITShape) => {
        switch (shape.shapeType) {
            case "autoShape":
                return mapper.autoShape?.(shape);
            case "image":
                return mapper.image?.(shape);
            case "line":
                return mapper.line?.(shape);
            case "textbox":
                return mapper.textbox?.(shape);
            case "placeholder":
                return mapper.placeholder?.(shape);
            case "chart":
                return mapper.chart?.(shape);
            case "group":
                return mapper.group?.(shape);
            default:
                return null;
        }
    };

const layoutCouplerMapper = shapeMapper({
    autoShape: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
            shapeType: shape.shapeType,
            ...(shape.style?.border && { border: shape.style.border }),
            ...(shape.style?.fill && { fill: shape.style.fill }),
            ...(shape.style?.rotation && { rotation: shape.style.rotation }),
            ...(shape.style?.transparency && {
                transparency: shape.style.transparency,
            }),
            ...(shape.text?.xml && {
                xml: shape.text.xml,
            }),
        };
    },
    image: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
            shapeType: shape.shapeType,

            ...(shape.style?.border && { border: shape.style.border }),
            ...(shape.style?.rotation && { rotation: shape.style.rotation }),
            ...(shape.style?.transparency && {
                transparency: shape.style.transparency,
            }),
            ...(shape.style?.autoShapeType && {
                autoShapeType: shape.style.autoShapeType,
            }),
            ...(shape.style?.cornerRadius && {
                cornerRadius: shape.style.cornerRadius,
            }),
        };
    },
    line: (shape) => {
        return {
            id: shape.id,
            shapeType: shape.shapeType,
            ...(shape.startFrom && { startFrom: shape.startFrom }),
            ...(shape.startPos && {
                startPos: roundCoordinate(shape.startPos),
            }),
            ...(shape.endFrom && { endFrom: shape.endFrom }),
            ...(shape.endPos && { endPos: roundCoordinate(shape.endPos) }),
            ...(shape.style.width && { width: shape.style.width }),
            ...(shape.style.color && { color: shape.style.color }),
        };
    },
    textbox: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
            shapeType: shape.shapeType,
            // Only first 60 characters max
            //text: shape.rawText.slice(0, 100),
            xml: shape.xml,
            ...(shape.style?.border && { border: shape.style.border }),
            ...(shape.style?.fill && { fill: shape.style.fill }),
            ...(shape.style?.rotation && { rotation: shape.style.rotation }),
        };
    },
    chart: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
            shapeType: shape.shapeType,
        };
    },
    placeholder: (shape) => {
        if (!shape.shape?.shapeType) {
            return null;
        }

        return {
            id: shape.id,
            placeholderType: shape.placeholderType,
            shape: shape.shape ? layoutCouplerMapper(shape.shape) : null,
        };
    },
});

function layoutCouplerInputTransformer(shapes: AITShape[]) {
    return shapes.map((shape) => layoutCouplerMapper(shape));
}
