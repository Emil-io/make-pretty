// Helper: extract a property value from a shape in a slide
export function getShapeProperty(presentation, slideId, shapeId, key) {
    var slide = presentation.slides.find(function (s) { return s.id === slideId; });
    if (!slide)
        throw new Error("Slide ".concat(slideId, " not found"));
    var shape = slide.shapes.find(function (s) { return s.id === shapeId; });
    if (!shape)
        throw new Error("Shape ".concat(shapeId, " not found on slide ").concat(slideId));
    // Support nested keys (e.g., "pos.x" -> shape.pos.x)
    var keys = key.split('.');
    var value = shape;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        value = value === null || value === void 0 ? void 0 : value[k];
    }
    return value;
}
// Helper: get slide by ID
export function getSlide(presentation, slideId) {
    var slide = presentation.slides.find(function (s) { return s.id === slideId; });
    if (!slide)
        throw new Error("Slide ".concat(slideId, " not found"));
    return slide;
}
// Helper: get shapes from slide with optional filtering
export function getShapes(presentation, slideId, filter) {
    var slide = getSlide(presentation, slideId);
    var shapes = slide.shapes;
    // Apply filters if provided
    if (filter) {
        if (filter.shapeType) {
            shapes = shapes.filter(function (s) { return s.shapeType === filter.shapeType; });
        }
        if (filter.autoShapeType) {
            shapes = shapes.filter(function (s) { return s.autoShapeType === filter.autoShapeType; });
        }
    }
    return shapes;
}
