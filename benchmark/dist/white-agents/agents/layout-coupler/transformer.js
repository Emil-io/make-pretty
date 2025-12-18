// Combine our layout analysis and the datamodel to show each shape in their relative positioning of their layout/container
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
export var getLayoutWithRelativeShapes = function (originalLayout, datamodel) {
    var shapes = new Map();
    datamodel.forEach(function (shape) {
        shapes.set(shape.id, shape);
    });
    function processLayoutRecursive(layout) {
        var _a, _b, _c, _d;
        if (layout.multi === false) {
            var shapesOfLayout = (_b = (_a = layout.s) === null || _a === void 0 ? void 0 : _a.map(function (id) { return shapes.get(id); }).filter(function (shape) { return shape !== undefined; })) !== null && _b !== void 0 ? _b : [];
            // Now remove from shapes map
            shapesOfLayout.forEach(function (shape) {
                shapes.delete(shape.id);
            });
            var layoutTopLeft_1 = layout.b[0];
            var coordinateShiftedShapes = shapesOfLayout.map(function (shape) {
                return coordinateTransformMapper(layoutTopLeft_1)(shape);
            });
            // Now transform all positions of the shapes to be relative to the layout top left. this includes the pos: {topLeft, bottomRight, center}, startPos, endPos
            var transformedShapes = layoutCouplerInputTransformer(coordinateShiftedShapes);
            return {
                id: layout.id,
                name: layout.name,
                type: layout.type,
                multi: layout.multi,
                b: layout.b,
                s: layout.s,
                sl: (_c = layout.sl) === null || _c === void 0 ? void 0 : _c.map(function (sublayout) {
                    return processLayoutRecursive(sublayout);
                }),
                shapes: transformedShapes,
            };
        }
        else {
            var transformedSublayouts = (_d = layout.sl) === null || _d === void 0 ? void 0 : _d.map(function (sublayout) {
                return processLayoutRecursive(sublayout);
            });
            var childLayouts = layout.b.map(function (child) {
                var _a, _b;
                var shapesOfLayout = (_b = (_a = child[3]) === null || _a === void 0 ? void 0 : _a.map(function (id) { return shapes.get(id); }).filter(function (shape) { return shape !== undefined; })) !== null && _b !== void 0 ? _b : [];
                // Now remove from shapes map
                shapesOfLayout.forEach(function (shape) {
                    shapes.delete(shape.id);
                });
                var coordinateShiftedShapes = shapesOfLayout.map(function (shape) {
                    return coordinateTransformMapper(child[1])(shape);
                });
                var transformedShapes = layoutCouplerInputTransformer(coordinateShiftedShapes);
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
var coordinateTransformMapper = function (layoutTopLeft) {
    return shapeMapper({
        autoShape: function (shape) {
            return __assign(__assign({}, shape), { pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                } });
        },
        image: function (shape) {
            return __assign(__assign({}, shape), { pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                } });
        },
        line: function (shape) {
            return __assign(__assign(__assign({}, shape), (shape.startPos && {
                startPos: relCoordinate(shape.startPos, layoutTopLeft),
            })), (shape.endPos && {
                endPos: relCoordinate(shape.endPos, layoutTopLeft),
            }));
        },
        textbox: function (shape) {
            return __assign(__assign({}, shape), { pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                } });
        },
        chart: function (shape) {
            return __assign(__assign({}, shape), { pos: {
                    topLeft: shape.pos.topLeft
                        ? relCoordinate(shape.pos.topLeft, layoutTopLeft)
                        : undefined,
                    bottomRight: shape.pos.bottomRight
                        ? relCoordinate(shape.pos.bottomRight, layoutTopLeft)
                        : undefined,
                    center: shape.pos.center
                        ? relCoordinate(shape.pos.center, layoutTopLeft)
                        : undefined,
                } });
        },
        group: function (shape) { return shape; },
        placeholder: function (shape) {
            return __assign(__assign({}, shape), { shape: shape.shape
                    ? coordinateTransformMapper(layoutTopLeft)(shape.shape)
                    : undefined });
        },
    });
};
function relCoordinate(coordinate, relativeTo) {
    return roundCoordinate([
        coordinate[0] - relativeTo[0],
        coordinate[1] - relativeTo[1],
    ]);
}
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
    return { w: Math.round(size.w), h: Math.round(size.h) };
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
var layoutCouplerMapper = shapeMapper({
    autoShape: function (shape) {
        var _a, _b, _c, _d, _e;
        return __assign(__assign(__assign(__assign(__assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), name: shape.name, shapeType: shape.shapeType }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.border) && { border: shape.style.border })), (((_b = shape.style) === null || _b === void 0 ? void 0 : _b.fill) && { fill: shape.style.fill })), (((_c = shape.style) === null || _c === void 0 ? void 0 : _c.rotation) && { rotation: shape.style.rotation })), (((_d = shape.style) === null || _d === void 0 ? void 0 : _d.transparency) && {
            transparency: shape.style.transparency,
        })), (((_e = shape.text) === null || _e === void 0 ? void 0 : _e.xml) && {
            xml: shape.text.xml,
        }));
    },
    image: function (shape) {
        var _a, _b, _c, _d, _e;
        return __assign(__assign(__assign(__assign(__assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), name: shape.name, shapeType: shape.shapeType }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.border) && { border: shape.style.border })), (((_b = shape.style) === null || _b === void 0 ? void 0 : _b.rotation) && { rotation: shape.style.rotation })), (((_c = shape.style) === null || _c === void 0 ? void 0 : _c.transparency) && {
            transparency: shape.style.transparency,
        })), (((_d = shape.style) === null || _d === void 0 ? void 0 : _d.autoShapeType) && {
            autoShapeType: shape.style.autoShapeType,
        })), (((_e = shape.style) === null || _e === void 0 ? void 0 : _e.cornerRadius) && {
            cornerRadius: shape.style.cornerRadius,
        }));
    },
    line: function (shape) {
        return __assign(__assign(__assign(__assign(__assign(__assign({ id: shape.id, shapeType: shape.shapeType }, (shape.startFrom && { startFrom: shape.startFrom })), (shape.startPos && {
            startPos: roundCoordinate(shape.startPos),
        })), (shape.endFrom && { endFrom: shape.endFrom })), (shape.endPos && { endPos: roundCoordinate(shape.endPos) })), (shape.style.width && { width: shape.style.width })), (shape.style.color && { color: shape.style.color }));
    },
    textbox: function (shape) {
        var _a, _b, _c;
        return __assign(__assign(__assign({ id: shape.id, pos: roundPos(shape.pos), size: roundSize(shape.size), name: shape.name, shapeType: shape.shapeType, 
            // Only first 60 characters max
            //text: shape.rawText.slice(0, 100),
            xml: shape.xml }, (((_a = shape.style) === null || _a === void 0 ? void 0 : _a.border) && { border: shape.style.border })), (((_b = shape.style) === null || _b === void 0 ? void 0 : _b.fill) && { fill: shape.style.fill })), (((_c = shape.style) === null || _c === void 0 ? void 0 : _c.rotation) && { rotation: shape.style.rotation }));
    },
    chart: function (shape) {
        return {
            id: shape.id,
            pos: roundPos(shape.pos),
            size: roundSize(shape.size),
            name: shape.name,
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
            shape: shape.shape ? layoutCouplerMapper(shape.shape) : null,
        };
    },
});
function layoutCouplerInputTransformer(shapes) {
    return shapes.map(function (shape) { return layoutCouplerMapper(shape); });
}
