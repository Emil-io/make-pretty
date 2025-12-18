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
function roundCoordinate(coordinate) {
    return [Math.round(coordinate[0]), Math.round(coordinate[1])];
}
function roundPos(pos) {
    return {
        topLeft: pos.topLeft ? roundCoordinate(pos.topLeft) : undefined,
        bottomRight: pos.bottomRight
            ? roundCoordinate(pos.bottomRight)
            : undefined,
        center: pos.center ? roundCoordinate(pos.center) : undefined,
    };
}
function roundSize(size) {
    return [Math.round(size.w), Math.round(size.h)];
}
export var shapeMapper = function (mapper) {
    return function (shape) {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (shape.shapeType) {
            case "autoShape":
                return (_a = mapper.autoShape) === null || _a === void 0 ? void 0 : _a.call(mapper, shape);
            case "image":
                return (_b = mapper.image) === null || _b === void 0 ? void 0 : _b.call(mapper, shape);
            case "line":
                return (_c = mapper.line) === null || _c === void 0 ? void 0 : _c.call(mapper, shape);
            case "textbox":
                return (_d = mapper.textbox) === null || _d === void 0 ? void 0 : _d.call(mapper, shape);
            case "placeholder":
                return (_e = mapper.placeholder) === null || _e === void 0 ? void 0 : _e.call(mapper, shape);
            case "chart":
                return (_f = mapper.chart) === null || _f === void 0 ? void 0 : _f.call(mapper, shape);
            case "group":
                return (_g = mapper.group) === null || _g === void 0 ? void 0 : _g.call(mapper, shape);
            default:
                return null;
        }
    };
};
var layoutAnalyzerMapper = shapeMapper({
    autoShape: function (shape) {
        var _a, _b;
        return __assign(__assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), shapeType: shape.shapeType }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.rotation) && { rotation: shape.style.rotation })), (((_b = shape.text) === null || _b === void 0 ? void 0 : _b.rawText) && {
            text: shape.text.rawText.slice(0, 100),
        }));
    },
    image: function (shape) {
        var _a, _b;
        return __assign(__assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), shapeType: shape.shapeType }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.autoShapeType) && {
            autoShapeType: shape.style.autoShapeType,
        })), (((_b = shape.style) === null || _b === void 0 ? void 0 : _b.cornerRadius) && {
            cornerRadius: shape.style.cornerRadius,
        }));
    },
    line: function (shape) {
        return __assign(__assign(__assign(__assign(__assign({ id: shape.id, shapeType: shape.shapeType }, (shape.startFrom && { startFrom: shape.startFrom })), (shape.startPos && {
            startPos: roundCoordinate(shape.startPos),
        })), (shape.endFrom && { endFrom: shape.endFrom })), (shape.endPos && { endPos: roundCoordinate(shape.endPos) })), (shape.style.width && { width: shape.style.width }));
    },
    textbox: function (shape) {
        var _a;
        return __assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), shapeType: shape.shapeType, 
            // Only first 60 characters max
            text: shape.rawText.slice(0, 60) +
                (shape.rawText.length > 100 ? "..." : "") }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.rotation) && { rotation: shape.style.rotation }));
    },
    chart: function (shape) {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            shapeType: shape.shapeType,
        };
    },
    placeholder: function (shape) {
        var _a;
        if (!((_a = shape.shape) === null || _a === void 0 ? void 0 : _a.shapeType)) {
            return null;
        }
        return {
            id: shape.id,
            placeholderType: shape.placeholderType,
            shape: shape.shape ? layoutAnalyzerMapper(shape.shape) : null,
        };
    },
});
export function layoutAnalyzerInputTransformer(slide) {
    var shapes = [];
    slide.shapes.forEach(function (shape) {
        var mappedShape = layoutAnalyzerMapper(shape);
        if (mappedShape) {
            shapes.push(mappedShape);
        }
    });
    return {
        slideId: slide.id,
        width: 1280,
        height: 720,
        shapes: shapes,
    };
}
