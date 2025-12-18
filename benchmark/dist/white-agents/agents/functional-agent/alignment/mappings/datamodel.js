var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { cloneDeep } from "lodash";
export function mapDatamodelForAlignment(datamodel) {
    var slide = cloneDeep(datamodel);
    var id = slide.id, index = slide.index;
    return {
        slideIndex: index,
        slideId: id,
        shapes: slide.shapes.map(function (shape) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            switch (shape.shapeType) {
                case "textbox":
                    return __assign({ id: shape.id, pos: shape.pos, size: shape.size, shapeType: shape.shapeType }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.rotation) && {
                        rotation: (_b = shape.style) === null || _b === void 0 ? void 0 : _b.rotation,
                    }));
                case "image":
                    return __assign({ id: shape.id, pos: shape.pos, size: shape.size, shapeType: shape.shapeType }, (((_c = shape.style) === null || _c === void 0 ? void 0 : _c.rotation) && {
                        rotation: (_d = shape.style) === null || _d === void 0 ? void 0 : _d.rotation,
                    }));
                case "autoShape":
                    return __assign(__assign(__assign(__assign({ id: shape.id, pos: shape.pos, size: shape.size, shapeType: shape.shapeType }, (shape.text && { text: shape.text })), (((_e = shape.style) === null || _e === void 0 ? void 0 : _e.rotation) && {
                        rotation: (_f = shape.style) === null || _f === void 0 ? void 0 : _f.rotation,
                    })), (((_g = shape.style) === null || _g === void 0 ? void 0 : _g.fill) && {
                        background: (_h = shape.style) === null || _h === void 0 ? void 0 : _h.fill,
                    })), (((_j = shape.style) === null || _j === void 0 ? void 0 : _j.border) && {
                        border: (_k = shape.style) === null || _k === void 0 ? void 0 : _k.border,
                    }));
                case "chart":
                    return __assign(__assign({ id: shape.id, pos: shape.pos, size: shape.size, shapeType: shape.shapeType }, (((_l = shape.style) === null || _l === void 0 ? void 0 : _l.rotation) && {
                        rotation: (_m = shape.style) === null || _m === void 0 ? void 0 : _m.rotation,
                    })), (((_o = shape.style) === null || _o === void 0 ? void 0 : _o.transparency) && {
                        transparency: (_p = shape.style) === null || _p === void 0 ? void 0 : _p.transparency,
                    }));
                case "group":
                    return __assign({ id: shape.id, pos: shape.pos, size: shape.size, shapeType: shape.shapeType, items: shape.items }, (((_q = shape.style) === null || _q === void 0 ? void 0 : _q.rotation) && {
                        rotation: (_r = shape.style) === null || _r === void 0 ? void 0 : _r.rotation,
                    }));
                case "line":
                    return __assign(__assign(__assign(__assign(__assign(__assign(__assign({ id: shape.id, shapeType: shape.shapeType }, (shape.startFrom && { startFrom: shape.startFrom })), (shape.startPos && { startPos: shape.startPos })), (shape.endFrom && { endFrom: shape.endFrom })), (shape.endPos && { endPos: shape.endPos })), (shape.style.width && {
                        width: shape.style.width,
                    })), (shape.style.beginArrowStyle && {
                        beginArrowStyle: shape.style.beginArrowStyle,
                    })), (shape.style.endArrowStyle && {
                        endArrowStyle: shape.style.endArrowStyle,
                    }));
                default:
                    return shape;
            }
        }),
    };
}
