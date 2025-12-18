import { AITPres } from "../../../api/server/src/schemas/base";

// Helper: extract a property value from a shape in a slide
export function getShapeProperty(
    presentation: AITPres,
    slideId: number,
    shapeId: number,
    key: string
): any {
    const slide = presentation.slides.find((s: any) => s.id === slideId);
    if (!slide) throw new Error(`Slide ${slideId} not found`);
    
    const shape = (slide.shapes as any[]).find((s: any) => s.id === shapeId);
    if (!shape) throw new Error(`Shape ${shapeId} not found on slide ${slideId}`);
    
    // Support calculated properties for lines
    if (key === "calculated.length" && shape.shapeType === "line") {
        const startPos = shape.startPos as [number, number] | undefined;
        const endPos = shape.endPos as [number, number] | undefined;
        if (!startPos || !endPos) {
            throw new Error(`Line ${shapeId} is missing startPos or endPos`);
        }
        // Calculate line length: √((endX-startX)² + (endY-startY)²)
        return Math.sqrt(
            Math.pow(endPos[0] - startPos[0], 2) +
            Math.pow(endPos[1] - startPos[1], 2)
        );
    }
    
    // Support nested keys (e.g., "pos.x" -> shape.pos.x)
    // Also support array indices (e.g., "pos.topLeft[1]" -> shape.pos.topLeft[1])
    const keys = key.split('.');
    let value: any = shape;
    for (const k of keys) {
        if (k.includes('[') && k.includes(']')) {
            // Handle array access like "topLeft[1]"
            const baseKey = k.split('[')[0];
            const indexStr = k.split('[')[1].split(']')[0];
            const index = parseInt(indexStr, 10);
            value = value?.[baseKey]?.[index];
        } else {
            value = value?.[k];
        }
    }
    return value;
}

// Helper: get slide by ID
export function getSlide(presentation: AITPres, slideId: number): any {
    const slide = presentation.slides.find((s: any) => s.id === slideId);
    if (!slide) throw new Error(`Slide ${slideId} not found`);
    return slide;
}

// Helper: recursively get all shapes from a slide, including shapes inside groups
// Returns a flat list of all shapes (top-level and nested)
function getAllShapesRecursive(shapes: any[]): any[] {
    const allShapes: any[] = [];
    const seenIds = new Set<number>();
    
    function collectShapes(shapesToProcess: any[]): void {
        for (const shape of shapesToProcess) {
            // Avoid duplicates
            if (seenIds.has(shape.id)) {
                continue;
            }
            seenIds.add(shape.id);
            allShapes.push(shape);
            
            // If it's a group, recursively get shapes from its items
            if (shape.shapeType === "group" && shape.items && Array.isArray(shape.items)) {
                // Find child shapes by their IDs from the original shapes array
                // Note: child shapes should be in the top-level array too
                const childShapes = shapesToProcess.filter((s: any) => 
                    (shape.items.includes(String(s.id)) || shape.items.includes(s.id)) && !seenIds.has(s.id)
                );
                if (childShapes.length > 0) {
                    collectShapes(childShapes);
                }
            }
        }
    }
    
    collectShapes(shapes);
    return allShapes;
}

// Helper: get shapes from slide with optional filtering
export function getShapes(
    presentation: AITPres, 
    slideId: number, 
    filter?: { 
        shapeType?: any; 
        autoShapeType?: any; 
        otherAutoShapeType?: any; 
        fillColor?: any;
        rawText?: string;
        rawTextContains?: string;
        pos?: {
            topLeft?: [number, number];
        };
    }
): any[] {
    const slide = getSlide(presentation, slideId);
    // Get all shapes recursively (including shapes inside groups)
    let shapes = getAllShapesRecursive(slide.shapes as any[]);
    
    // Apply filters if provided
    if (filter) {
        if (filter.shapeType) {
            shapes = shapes.filter((s: any) => s.shapeType === filter.shapeType);
        }
        if (filter.autoShapeType) {
            shapes = shapes.filter((s: any) => s.details?.autoShapeType === filter.autoShapeType);
        }
        if (filter.otherAutoShapeType) {
            shapes = shapes.filter((s: any) => s.details?.otherAutoShapeType === filter.otherAutoShapeType);
        }
        if (filter.fillColor) {
            shapes = shapes.filter((s: any) => s.style?.fill?.color === filter.fillColor);
        }
        if (filter.rawText !== undefined) {
            // Exact match on rawText (trimmed)
            shapes = shapes.filter((s: any) => {
                const text = s.rawText?.trim() || "";
                return text === filter.rawText;
            });
        }
        if (filter.rawTextContains !== undefined) {
            // Substring match on rawText
            shapes = shapes.filter((s: any) => {
                const text = s.rawText?.trim() || "";
                return text.includes(filter.rawTextContains);
            });
        }
        if (filter.pos?.topLeft !== undefined) {
            // Filter by similar Y position (within 100px tolerance)
            // This is useful for filtering shapes in the same row
            // The X coordinate in topLeft is ignored (only Y is used for filtering)
            const targetY = filter.pos.topLeft[1];
            const tolerance = 100; // 100px tolerance for Y position (allows for alignment variations)
            shapes = shapes.filter((s: any) => {
                const shapeY = s.pos?.topLeft?.[1];
                if (shapeY === undefined) return false;
                return Math.abs(shapeY - targetY) <= tolerance;
            });
        }
    }
    
    return shapes;
}

