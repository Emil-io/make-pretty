import { cloneDeep } from "lodash";
import { AITSlide } from "../../../../../../api/server/src/schemas/base";

export function mapDatamodelForAlignment(datamodel: AITSlide) {
    const slide = cloneDeep(datamodel);

    const { id, index } = slide;

    return {
        slideIndex: index,
        slideId: id,

        shapes: slide.shapes.map((shape) => {
            switch (shape.shapeType) {
                case "textbox":
                    return {
                        id: shape.id,
                        pos: shape.pos,
                        size: shape.size,
                        shapeType: shape.shapeType,
                        ...(shape.style?.rotation && {
                            rotation: shape.style?.rotation,
                        }),
                    };
                case "image":
                    return {
                        id: shape.id,
                        pos: shape.pos,
                        size: shape.size,
                        shapeType: shape.shapeType,
                        ...(shape.style?.rotation && {
                            rotation: shape.style?.rotation,
                        }),
                    };
                case "autoShape":
                    return {
                        id: shape.id,
                        pos: shape.pos,
                        size: shape.size,
                        shapeType: shape.shapeType,
                        ...(shape.text && { text: shape.text }),
                        ...(shape.style?.rotation && {
                            rotation: shape.style?.rotation,
                        }),
                        ...(shape.style?.fill && {
                            background: shape.style?.fill,
                        }),
                        ...(shape.style?.border && {
                            border: shape.style?.border,
                        }),
                    };

                case "chart":
                    return {
                        id: shape.id,
                        pos: shape.pos,
                        size: shape.size,
                        shapeType: shape.shapeType,
                        ...(shape.style?.rotation && {
                            rotation: shape.style?.rotation,
                        }),
                        ...(shape.style?.transparency && {
                            transparency: shape.style?.transparency,
                        }),
                    };

                case "group":
                    return {
                        id: shape.id,
                        pos: shape.pos,
                        size: shape.size,
                        shapeType: shape.shapeType,
                        items: shape.items,
                        ...(shape.style?.rotation && {
                            rotation: shape.style?.rotation,
                        }),
                    };

                case "line":
                    return {
                        id: shape.id,
                        shapeType: shape.shapeType,
                        ...(shape.startFrom && { startFrom: shape.startFrom }),
                        ...(shape.startPos && { startPos: shape.startPos }),
                        ...(shape.endFrom && { endFrom: shape.endFrom }),
                        ...(shape.endPos && { endPos: shape.endPos }),
                        ...(shape.style.width && {
                            width: shape.style.width,
                        }),
                        ...(shape.style.beginArrowStyle && {
                            beginArrowStyle: shape.style.beginArrowStyle,
                        }),
                        ...(shape.style.endArrowStyle && {
                            endArrowStyle: shape.style.endArrowStyle,
                        }),
                    };

                default:
                    return shape;
            }
        }),
    };
}
