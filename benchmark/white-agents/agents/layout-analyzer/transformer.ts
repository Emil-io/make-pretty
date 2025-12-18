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

const layoutAnalyzerMapper = shapeMapper({
    autoShape: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
            shapeType: shape.shapeType,
            //...(shape.style?.border && { border: shape.style.border }),
            //...(shape.style?.fill && { fill: shape.style.fill }),
            ...(shape.style?.rotation && { rotation: shape.style.rotation }),
            /*...(shape.style?.transparency && {
                transparency: shape.style.transparency,
            }),*/
            ...(shape.text?.rawText && {
                text: shape.text.rawText.slice(0, 100),
            }),
        };
    },
    image: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            shapeType: shape.shapeType,
            name: shape.name,

            //...(shape.style?.border && { border: shape.style.border }),
            //...(shape.style?.rotation && { rotation: shape.style.rotation }),
            /*...(shape.style?.transparency && {
                transparency: shape.style.transparency,
            }),*/
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
            //...(shape.style.color && { color: shape.style.color }),
        };
    },
    textbox: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            shapeType: shape.shapeType,
            name: shape.name,
            // Only first 60 characters max
            text: shape.rawText.slice(0, 100),
            //...(shape.style?.border && { border: shape.style.border }),
            //...(shape.style?.fill && { fill: shape.style.fill }),
            ...(shape.style?.rotation && { rotation: shape.style.rotation }),
        };
    },
    chart: (shape) => {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
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
            shape: shape.shape ? layoutAnalyzerMapper(shape.shape) : null,
        };
    },
});

export function layoutAnalyzerInputTransformer(shapes: AITShape[]) {
    return shapes.map((shape) => layoutAnalyzerMapper(shape));
}
