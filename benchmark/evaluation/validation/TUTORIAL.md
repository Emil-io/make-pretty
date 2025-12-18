# Guide: Writing validation.ts for Benchmarks

## Overview
This guide documents everything learned about the BigSure benchmark validation system, providing a step-by-step process for writing validation.ts files for any test scenario.

---

## Quick Start Checklist

To create a validation.ts file for a benchmark test:

1. ✅ Read the `prompt.md` file to understand the task
2. ✅ Read the `datamodel.json` file to understand shape structure
3. ✅ Count shapes by type (images, textboxes, autoShapes)
4. ✅ Identify what needs validation (alignment, sizing, spacing, etc.)
5. ✅ Choose appropriate test types from the available options
6. ✅ Write static tests (counts, alignment, spacing)
7. ✅ Add LLM judge for semantic/subjective validation
8. ✅ Keep LLM judge focusAreas proportional to task complexity

---

## Step-by-Step Process

### Step 1: Read the Prompt
**Location**: `benchmark/scenarios/<category>/<test-name>/prompt.md`

**Purpose**: Understand what the task is asking for.

**Questions to answer**:
- What is the main action? (align, duplicate, resize, delete, create, etc.)
- What shapes are affected? (boxes, text, images, specific objects)
- What properties matter? (position, size, spacing, color, etc.)
- Are there specific requirements? (margins, percentages, relationships)

**Example**:
- test-37a: "align the 4 headings and put them at the position of the first box"
- test-37b: "align the text in the 4 boxes"

### Step 2: Analyze the Datamodel
**Location**: `benchmark/scenarios/<category>/<test-name>/datamodel.json`

**Purpose**: Understand the slide structure and available shapes.

**What to extract**:
```typescript
{
  id: number;           // slideId for test references
  shapes: Array<{
    id: number;         // shapeId for specific shape tests
    shapeType: string;  // "image", "textbox", "autoShape", "line", "placeholder"
    pos: {
      topLeft: [X, Y],
      center: [X, Y]
    },
    size: { w, h },
    details?: {
      autoShapeType: string,  // "roundRect", "oval", etc.
      cornerRadius: number
    }
  }>
}
```

**Count shapes by type**:
```bash
# Count images
grep '"shapeType": "image"' datamodel.json | wc -l

# Count textboxes
grep '"shapeType": "textbox"' datamodel.json | wc -l

# Count autoShapes
grep '"shapeType": "autoShape"' datamodel.json | wc -l
```

**Identify patterns**:
- Are shapes in a grid? (same X or Y coordinates)
- Are shapes evenly spaced? (consistent gaps)
- Are shapes the same size? (same w/h values)
- Are there shape groups? (multiple with same autoShapeType)

### Step 3: Choose Test Types

Based on task requirements, select from these test categories:

#### A. Count Tests
**When**: Need to verify number of shapes exists
**Test**: `count_shapes`
```typescript
{
  name: "count_shapes",
  description: "There should be exactly 11 image shapes",
  slideId: 274,
  filter: { shapeType: "image" },  // Optional
  expected: 11,
}
```

**Filters**:
- `{ shapeType: "image" }` - Count images
- `{ shapeType: "textbox" }` - Count textboxes
- `{ autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE }` - Count specific autoShapes
- No filter - Count all shapes

#### B. Alignment Tests
**When**: Shapes should be aligned horizontally or vertically

**Horizontal alignment** (same row):
```typescript
{
  name: "filtered_equality",
  description: "Shapes should be horizontally aligned at same Y coordinate",
  slideId: 274,
  filter: { shapeType: "image" },
  key: "pos.topLeft[1]",  // Y coordinate
  minMatchCount: 4,
}
```

**Vertical alignment** (same column):
```typescript
{
  name: "filtered_equality",
  description: "Shapes should be vertically aligned at same X coordinate",
  slideId: 274,
  filter: { shapeType: "textbox" },
  key: "pos.topLeft[0]",  // X coordinate
  minMatchCount: 2,
}
```

**Multi-filter alignment** (checking equality between specific text values):
```typescript
// Check that items "01" and "04" have the same X coordinate (column alignment)
{
  name: "filtered_equality",
  description: "Column 1: Items 01 and 04 should be vertically aligned",
  slideId: 260,
  filters: [
    { shapeType: "textbox", rawText: "01" },
    { shapeType: "textbox", rawText: "04" },
  ],
  key: "pos.topLeft[0]",
  minMatchCount: 2, // Required by schema but not used for multi-filter
}

// Check that items "01", "02", "03" have the same Y coordinate (row alignment)
{
  name: "filtered_equality",
  description: "Row 1: Items 01, 02, 03 should be horizontally aligned",
  slideId: 260,
  filters: [
    { shapeType: "textbox", rawText: "01" },
    { shapeType: "textbox", rawText: "02" },
    { shapeType: "textbox", rawText: "03" },
  ],
  key: "pos.topLeft[1]",
  minMatchCount: 3,
}
```

**When to use multi-filter vs single filter**:
- **Single filter** (`filter`): Use when checking that shapes matching one criteria align (e.g., all images, all textboxes with substring)
- **Multi-filter** (`filters`): Use when checking alignment between specific, distinct groups identified by text content (e.g., "01" aligns with "04", "02" aligns with "05")

**Center alignment**:
```typescript
{
  name: "filtered_equality",
  description: "Shapes centered in their boxes",
  slideId: 274,
  filter: { shapeType: "textbox" },
  key: "pos.center[0]",  // Center X
  minMatchCount: 4,
}
```

#### C. Size Tests
**When**: Shapes should have equal dimensions

**Equal width**:
```typescript
{
  name: "filtered_equality",
  description: "All boxes should have equal width",
  slideId: 274,
  filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE },
  key: "size.w",
  minMatchCount: 4,
}
```

**Equal height**:
```typescript
{
  name: "filtered_equality",
  description: "All boxes should have equal height",
  slideId: 274,
  filter: { shapeType: "image" },
  key: "size.h",
  minMatchCount: 4,
}
```

#### D. Spacing Tests
**When**: Shapes should be evenly spaced

**Horizontal spacing with filter**:
```typescript
{
  name: "filtered_spacing",
  description: "Boxes should have equal horizontal spacing",
  slideId: 274,
  filter: { shapeType: "image" },
  direction: "horizontal",
  minMatchCount: 4,
}
```

**Vertical spacing with filter**:
```typescript
{
  name: "filtered_spacing",
  description: "Boxes should have equal vertical spacing",
  slideId: 274,
  filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL },
  direction: "vertical",
  minMatchCount: 2,
}
```

**Filtered spacing with perpendicular grouping**:
When checking spacing in layouts with multiple rows or columns, use `groupByPerpendicularPosition` to ensure spacing is only checked within the same row (for horizontal spacing) or column (for vertical spacing):

```typescript
{
  name: "filtered_spacing",
  description: "Movie images in each row should have equal horizontal spacing",
  slideId: 269,
  filter: { shapeType: "image" },
  direction: "horizontal",
  minMatchCount: 4,
  groupByPerpendicularPosition: true, // Groups by Y position (same row) before checking spacing
}
```

**Key features**:
- **`groupByPerpendicularPosition: true`**: Automatically groups shapes by their perpendicular coordinate before checking spacing
  - For `direction: "horizontal"`: Groups by Y position (same row) with 50px tolerance
  - For `direction: "vertical"`: Groups by X position (same column) with 50px tolerance
- **Prevents mixing rows/columns**: Without this option, the test might mix shapes from different rows/columns when checking spacing
- **Finds largest equally-spaced group**: Within each row/column, finds the largest sequence of equally-spaced shapes

**Spacing test with specific shape IDs**:
When you know the exact shape IDs (e.g., for lines or specific elements), use `equal_spacing`:

```typescript
{
  name: "equal_spacing",
  description: "The 4 vertical lines should have consistent horizontal spacing",
  slideId: 275,
  shapeIds: [1038, 1039, 1040, 1041], // Specific shape IDs (works with lines, images, etc.)
  direction: "horizontal", // or "vertical"
  // Note: For lines, uses startPos[0] for horizontal spacing
  // For other shapes, uses pos.topLeft[0] for horizontal spacing
}
```

**Key features**:
- **Works with lines**: Lines use `startPos`/`endPos` instead of `pos.topLeft`/`pos.bottomRight`
- **Automatic shape type detection**: The test automatically handles lines vs. other shapes
- **For horizontal spacing on lines**: Uses X coordinate of `startPos`
- **For vertical spacing on lines**: Uses Y coordinate of `startPos`
- **Tolerance**: 5px for spacing equality checks

#### E. Line Validation Tests
**When**: Need to validate line shapes for verticality, equal length, or positioning

**Line verticality and equal length**:
```typescript
{
  name: "line_validation",
  description: "Lines should be vertical, have equal length, and divide textboxes",
  slideId: 270,
  filter: { shapeType: "line" }, // Filter for lines (defaults to shapeType: "line")
  checkVerticality: true, // Check that each line is vertical (startPos[0] == endPos[0])
  checkEqualLength: true, // Check that all lines have equal length (calculated dynamically)
  checkDividesTextboxes: true, // Check that lines divide textboxes properly
  textboxFilter: {
    shapeType: "textbox",
    rawTextContains: "Elaborate", // Filter for textboxes to check division
  },
}
```

**Key features**:
- **Verticality check**: Verifies each line individually is vertical (startPos X == endPos X within tolerance)
- **Length calculation**: Dynamically calculates line length using `√((endX-startX)² + (endY-startY)²)` - NEVER uses hardcoded values
- **Division check**: Verifies lines are positioned between consecutive textboxes
- **Tolerance**: Uses 10px tolerance for verticality/length, 30px for division positioning

**Line length equality with specific shape IDs**:
When you need to check that specific lines have equal length, use `all_are_equal` with the `calculated.length` property:

```typescript
{
  name: "all_are_equal",
  description: "The 4 vertical lines should have equal length (~173.3px)",
  objects: [
    { slideId: 275, shapeId: 1038, key: "calculated.length" },
    { slideId: 275, shapeId: 1039, key: "calculated.length" },
    { slideId: 275, shapeId: 1040, key: "calculated.length" },
    { slideId: 275, shapeId: 1041, key: "calculated.length" },
  ],
  // Note: calculated.length uses √((endX-startX)² + (endY-startY)²) to compute line length dynamically
  // Tolerance is 5px (NUMERIC_TOLERANCE in equality.test.ts)
}
```

**Key features**:
- **`calculated.length`**: Special property key that computes line length from `startPos` and `endPos`
- **Dynamic calculation**: Always calculates length, never uses hardcoded values
- **Works with lines only**: The `calculated.length` property only works for shapes with `shapeType: "line"`
- **Tolerance**: 5px for numeric comparisons

#### F. Boundary Tests
**When**: Shapes should respect margins

```typescript
{
  name: "within_boundaries",
  description: "All shapes should respect 10px margin from slide edges",
  slideId: 274,
  minMargin: 10,
}
```

#### G. Distribution Tests
**When**: Shapes should fill slide appropriately

```typescript
{
  name: "slide_fill_distribution",
  description: "Shapes should fill at least 60% of slide width",
  slideId: 274,
  filter: { shapeType: "image" },
  minFillPercentage: 60,
}
```

#### H. Table Tests
**When**: Testing table structures (rows, columns, content)

**Table existence**:
```typescript
{
  name: "count_shapes",
  description: "There should be exactly 1 table shape",
  slideId: 266,
  filter: { shapeType: "table" },
  expected: 1,
}
```

**Table dimensions (using includes test)**:
```typescript
// Check number of columns
{
  name: "includes",
  description: "Table should have exactly 5 columns after adding Q1",
  slideId: 266,
  shapeId: 243,
  key: "columns",
  expected: 5,
}

// Check number of rows
{
  name: "includes",
  description: "Table should have 7 rows",
  slideId: 266,
  shapeId: 243,
  key: "rows",
  expected: 7,
}
```

**Table cell content (accessing specific cells)**:
```typescript
// Check first cell text (row 0, col 0)
{
  name: "includes",
  description: "First cell should contain '1ST QUARTER'",
  slideId: 266,
  shapeId: 243,
  key: "cells[0].text",
  expected: "1ST QUARTER",
}

// Check specific cell by finding it in the cells array
// Note: cells are stored in row-major order (all row 0 cells, then all row 1 cells, etc.)
// For a 4-column table: cell at row 1, col 2 is at index 1*4 + 2 = 6
{
  name: "includes",
  description: "Cell at row 1, col 2 should contain 'July'",
  slideId: 266,
  shapeId: 243,
  key: "cells[6].text",
  expected: "July",
}
```

**Table formatting properties**:
```typescript
{
  name: "includes",
  description: "Table should have first row formatting",
  slideId: 266,
  shapeId: 243,
  key: "firstRow",
  expected: true,
}
```

**Important Notes**:
- Tables are extracted with the following structure:
  - `rows`: Number of rows in the table
  - `columns`: Number of columns in the table
  - `cells`: Array of all cells with `text`, `rowIndex`, `colIndex`
  - `firstRow`, `firstCol`, `horzBanding`, `vertBanding`: Formatting properties

- **Cell indexing**: Cells are stored in a flat array in row-major order:
  - Cell at (row, col) is at index: `row * numColumns + col`
  - First row cells: indices 0 to (columns-1)
  - Second row cells: indices (columns) to (2*columns-1)
  - etc.

- **Use includes test for table properties**: The `includes` test is best for checking table structure (rows, columns, cell text) because it checks specific shape properties by shapeId.

- **For content validation**: Use LLM judge when checking if table content matches semantic requirements (e.g., "Q1 months should be January, February, March").

Example table shape in datamodel:
```json
{
  "id": 243,
  "shapeType": "table",
  "rows": 7,
  "columns": 4,
  "cells": [
    { "text": "1ST QUARTER", "rowIndex": 0, "colIndex": 0 },
    { "text": "2ND QUARTER", "rowIndex": 0, "colIndex": 1 },
    { "text": "3RD QUARTER", "rowIndex": 0, "colIndex": 2 },
    { "text": "4TH QUARTER", "rowIndex": 0, "colIndex": 3 },
    { "text": "January", "rowIndex": 1, "colIndex": 0 },
    { "text": "April", "rowIndex": 1, "colIndex": 1 }
  ],
  "firstRow": false,
  "firstCol": false,
  "horzBanding": false,
  "vertBanding": false
}
```

#### I. LLM Judge
**When**: Need semantic/subjective validation

```typescript
{
  name: "llm_judge",
  description: "LLM evaluation of task completion and design quality",
  slideId: 274,
  autoGenerate: true,
  criteria: "Brief statement of what to evaluate",
  focusAreas: [
    "Specific aspect 1",
    "Specific aspect 2",
    "Specific aspect 3",
    // Keep proportional to task complexity (3-6 items for simple tasks)
  ],
  expectedChanges: [
    "Expected change 1",
    "Expected change 2",
    // Keep brief (2-4 items)
  ],
}
```

### Step 4: Filter Selection Guide

**Use `shapeType` when**:
- Filtering broad categories: images, textboxes, lines, placeholders, tables
- Don't care about specific autoShape subtypes
- Working with non-autoShape types

**Values**: `"image"`, `"textbox"`, `"autoShape"`, `"line"`, `"placeholder"`, `"table"`

**Use `autoShapeType` when**:
- Need precise shape matching (roundRect vs oval vs rectangle)
- Working specifically with autoShapes
- Geometry matters for the test

**Values**: Import from enum:
```typescript
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";

// Common values:
AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE  // "roundRect"
AI_MSO_AUTO_SHAPE_TYPE.OVAL               // "oval"
AI_MSO_AUTO_SHAPE_TYPE.RECTANGLE          // "rect"
```

**Use `rawText` when**:
- Need exact text match (e.g., `rawText: "01"` matches only textbox with exactly "01")
- Filtering for specific numbered items or labels
- Used in multi-filter tests to check alignment between specific text values

**Use `rawTextContains` when**:
- Need substring match (e.g., `rawTextContains: "0"` matches "01", "02", "03", etc.)
- Filtering for a group of related textboxes
- Used in single filter tests to find all shapes with similar text patterns

**Schema Support**: As of the recent update, filters accept both:
- Enum values: `AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE`
- Datamodel strings: `"image"`, `"textbox"`, `"roundRect"`

### Step 5: Common Patterns

#### Pattern: Horizontal Row of Shapes
```typescript
// Count
{ name: "count_shapes", filter: { ... }, expected: 4 },

// Y-alignment (same row)
{ name: "filtered_equality", key: "pos.topLeft[1]", minMatchCount: 4 },

// Equal width
{ name: "filtered_equality", key: "size.w", minMatchCount: 4 },

// Equal height
{ name: "filtered_equality", key: "size.h", minMatchCount: 4 },

// Equal spacing
{ name: "filtered_spacing", direction: "horizontal", minMatchCount: 4 },
```

#### Pattern: 2x2 Grid
```typescript
// Top row alignment
{ name: "filtered_equality", key: "pos.topLeft[1]", minMatchCount: 2 },

// Bottom row alignment
{ name: "filtered_equality", key: "pos.topLeft[1]", minMatchCount: 2 },

// Left column alignment
{ name: "filtered_equality", key: "pos.topLeft[0]", minMatchCount: 2 },

// Right column alignment
{ name: "filtered_equality", key: "pos.topLeft[0]", minMatchCount: 2 },

// Equal sizing
{ name: "filtered_equality", key: "size.w", minMatchCount: 4 },
{ name: "filtered_equality", key: "size.h", minMatchCount: 4 },

// Horizontal spacing
{ name: "filtered_spacing", direction: "horizontal", minMatchCount: 2 },

// Vertical spacing
{ name: "filtered_spacing", direction: "vertical", minMatchCount: 2 },
```

#### Pattern: Mixed Shape Types
```typescript
// Count each type separately
{ name: "count_shapes", filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE }, expected: 3 },
{ name: "count_shapes", filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL }, expected: 2 },

// Test each type independently
{ name: "filtered_equality", filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE }, key: "size.w", minMatchCount: 3 },
{ name: "filtered_equality", filter: { autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.OVAL }, key: "size.w", minMatchCount: 2 },
```

#### Pattern: Grid with Numbered Items (using text-based filtering)
```typescript
// Count numbered items using substring match
{
  name: "count_shapes",
  filter: { shapeType: "textbox", rawTextContains: "0" }, // Matches "01", "02", "03", etc.
  expected: 6,
},

// Column alignment: Check that "01" and "04" have same X coordinate
{
  name: "filtered_equality",
  description: "Column 1: Items 01 and 04 aligned vertically",
  filters: [
    { shapeType: "textbox", rawText: "01" },
    { shapeType: "textbox", rawText: "04" },
  ],
  key: "pos.topLeft[0]",
  minMatchCount: 2, // Required but not used for multi-filter
},

// Row alignment: Check that "01", "02", "03" have same Y coordinate
{
  name: "filtered_equality",
  description: "Row 1: Items 01, 02, 03 aligned horizontally",
  filters: [
    { shapeType: "textbox", rawText: "01" },
    { shapeType: "textbox", rawText: "02" },
    { shapeType: "textbox", rawText: "03" },
  ],
  key: "pos.topLeft[1]",
  minMatchCount: 3,
},
```

### Step 6: LLM Judge Guidelines

**Complexity mapping**:
- **Simple task** (1 action): 2-4 focus areas, 2-3 expected changes
  - Example: "align the text in the 4 boxes"
- **Medium task** (2-3 actions): 4-6 focus areas, 3-4 expected changes
  - Example: "align headings, align boxes, add arrows"
- **Complex task** (4+ actions): 6-8 focus areas, 4-5 expected changes

**Focus areas should cover**:
- Main task objectives (what was asked)
- Alignment/positioning requirements
- Visual quality/coherence
- Professional appearance

**Example - Simple task (test-37b)**:
```typescript
criteria: "Evaluate if text in the 4 SWOT boxes is properly centered horizontally within their quadrants.",
focusAreas: [
  "All text elements (letters, titles, descriptions) are centered horizontally within their boxes",
  "Text in the same row is horizontally aligned across boxes",
  "Text in the same column is vertically aligned across boxes",
  "Visual symmetry and professional appearance of the SWOT grid"
],
expectedChanges: [
  "All text centered horizontally within the 4 SWOT quadrants",
  "Consistent alignment across rows and columns",
  "Improved visual balance and symmetry"
],
```

**Example - Medium task (test-37a)**:
```typescript
criteria: "Evaluate if the slide successfully completes the requested task: aligning 4 headings to the position of the first box, aligning all boxes horizontally, and duplicating arrows between boxes.",
focusAreas: [
  "All 4 'ADD A MAIN POINT' headings are aligned at the same vertical position as the first large box",
  "All 4 large image boxes are horizontally aligned at the same Y-coordinate",
  "Arrows are properly placed between all adjacent boxes (3 arrows total between 4 boxes)",
  "Visual spacing and distribution of elements creates a balanced timeline layout",
  "Text elements (headings and descriptions) are consistently positioned relative to their boxes",
  "Overall design maintains coherence and professional appearance"
],
expectedChanges: [
  "Headings repositioned to align with first box position",
  "Boxes aligned horizontally at same Y-coordinate",
  "Additional arrows duplicated and placed between boxes",
  "Consistent spacing between timeline elements"
],
```

---

## Complete Template

```typescript
import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // 1. Count tests
    {
        name: "count_shapes",
        description: "Verify shape counts",
        slideId: SLIDE_ID,
        filter: { shapeType: "TYPE" },  // or autoShapeType
        expected: COUNT,
    },

    // 2. Alignment tests
    {
        name: "filtered_equality",
        description: "Horizontal/vertical alignment",
        slideId: SLIDE_ID,
        filter: { shapeType: "TYPE" },
        key: "pos.topLeft[1]",  // or [0] for vertical, or center
        minMatchCount: N,
    },

    // 3. Size tests
    {
        name: "filtered_equality",
        description: "Equal width/height",
        slideId: SLIDE_ID,
        filter: { shapeType: "TYPE" },
        key: "size.w",  // or size.h
        minMatchCount: N,
    },

    // 4. Spacing tests
    {
        name: "filtered_spacing",
        description: "Equal spacing",
        slideId: SLIDE_ID,
        filter: { shapeType: "TYPE" },
        direction: "horizontal",  // or "vertical"
        minMatchCount: N,
    },

    // 5. Boundary test
    {
        name: "within_boundaries",
        description: "Respect margins",
        slideId: SLIDE_ID,
        minMargin: 10,
    },

    // 6. Distribution test (optional)
    {
        name: "slide_fill_distribution",
        description: "Fill slide width",
        slideId: SLIDE_ID,
        filter: { shapeType: "TYPE" },
        minFillPercentage: 60,
    },

    // 7. LLM Judge
    {
        name: "llm_judge",
        description: "LLM evaluation of task completion",
        slideId: SLIDE_ID,
        autoGenerate: true,
        criteria: "Brief statement of what to evaluate",
        focusAreas: [
            "Focus area 1",
            "Focus area 2",
            "Focus area 3",
        ],
        expectedChanges: [
            "Expected change 1",
            "Expected change 2",
        ],
    },
];
```

---

## Advanced Techniques

### Combining Tests for Complex Layouts

**When to use specific shape IDs vs. filters:**

Sometimes filtered tests aren't precise enough. For layouts with ungrouped elements of different sizes, use specific shape ID tests to compare "apples with apples."

**Example - Horizontal Layout Transformation (test-39e)**:

Task: Transform a vertical statistic layout to horizontal (left/center/right positioning).

**Challenge**: 6 textboxes total (3 large statistics + 3 small descriptions), not grouped, different sizes.

**Solution**: Combine multiple test types for precision:

```typescript
// 1. Count test (verify nothing deleted/added)
{
    name: "count_shapes",
    filter: { shapeType: "textbox" },
    expected: 9,
},

// 2. Position tests with numerical comparisons (verify horizontal positioning)
// Note: Use greater_than/less_than instead of function predicates with includes
{
    name: "less_than",
    description: "'2 out of 5' should be on left third (X < 640)",
    slideId: 271,
    shapeId: 17,
    key: "pos.topLeft[0]",
    expected: 640, // Left third (1920/3)
},
{
    name: "greater_than",
    description: "'12 million' should be on right third (X > 1280)",
    slideId: 271,
    shapeId: 19,
    key: "pos.topLeft[0]",
    expected: 1280, // Right third (2*1920/3)
},
{
    name: "greater_than",
    description: "'95%' center X should be greater than 640",
    slideId: 271,
    shapeId: 21,
    key: "pos.center[0]",
    expected: 640, // Center third start
},
{
    name: "less_than",
    description: "'95%' center X should be less than 1280",
    slideId: 271,
    shapeId: 21,
    key: "pos.center[0]",
    expected: 1280, // Center third end
},

// 3. Equality tests (verify Y-alignment within groups)
{
    name: "all_are_equal",
    description: "Large statistics aligned at same Y",
    objects: [
        { slideId: 271, shapeId: 17, key: "pos.topLeft[1]" }, // "2 out of 5"
        { slideId: 271, shapeId: 21, key: "pos.topLeft[1]" }, // "95%"
        { slideId: 271, shapeId: 19, key: "pos.topLeft[1]" }, // "12 million"
    ],
},
{
    name: "all_are_equal",
    description: "Description texts aligned at same Y",
    objects: [
        { slideId: 271, shapeId: 16, key: "pos.topLeft[1]" }, // Left desc
        { slideId: 271, shapeId: 20, key: "pos.topLeft[1]" }, // Center desc
        { slideId: 271, shapeId: 18, key: "pos.topLeft[1]" }, // Right desc
    ],
},
```

**Key insights:**
- ⚠️ **IMPORTANT**: The `includes` test does NOT support function predicates in the current implementation
- Use `greater_than` and `less_than` tests instead for range checks
- Use `all_are_equal` with specific shapeIds to test alignment within semantic groups
- Divide slide into thirds for left/center/right positioning (1920px width ÷ 3 = 640px)
- Test similar elements together (large stats separate from descriptions)

**Corrected approach for range checks:**
```typescript
// ❌ WRONG - Function predicates don't work with includes test
{
    name: "includes",
    key: "pos.topLeft[0]",
    expected: (x: number) => x < 640, // This will fail!
}

// ✅ CORRECT - Use numerical value tests instead
{
    name: "less_than",
    description: "Shape should be on left side (X < 640)",
    slideId: 271,
    shapeId: 17,
    key: "pos.topLeft[0]",
    expected: 640,
}

// For range checks (e.g., 640 < x < 1280), use two tests:
{
    name: "greater_than",
    description: "Shape center X should be greater than 900px",
    slideId: 258,
    shapeId: 10,
    key: "pos.center[0]",
    expected: 900,
},
{
    name: "less_than",
    description: "Shape center X should be less than 1020px",
    slideId: 258,
    shapeId: 10,
    key: "pos.center[0]",
    expected: 1020,
}
```

---

## Key Takeaways

1. **Always start with counts** - Verify structure before testing details
2. **Use filtered tests** - More flexible than specific shape IDs
3. **Use text-based filtering** - Filter by `rawText` (exact) or `rawTextContains` (substring) to target shapes by content
4. **Use multi-filter for specific pairs** - Use `filters` array to check equality between specific text values (e.g., "01" and "04")
5. **Avoid absolute coordinates** - Use relative relationships and text-based filtering instead of hardcoded shape IDs or pixel values
6. **Never overfit to groundtruth** - Multiple valid results are possible; use relative checks and tolerance
7. **Extend the system, don't relax tests** - If current tests don't support what you need, create new test types (like `line_validation`) rather than reducing `minMatchCount` or relaxing requirements
8. **Calculate values dynamically** - Never use hardcoded values from groundtruth; calculate lengths, positions, etc. from shape properties
9. **Use appropriate tolerance** - Allow enough tolerance (typically 10px for coordinates, 30px for complex positioning) to handle minor variations
10. **Prefer static tests over LLM judge** - Static tests are more reliable and faster; use LLM judge only for semantic/subjective validation
11. **Use specific shape IDs when needed** - For ungrouped elements with different properties
12. **minMatchCount handles outliers** - Test passes if enough shapes match
13. **Filters by shapeType OR autoShapeType** - Not usually both (now supports "group")
14. **Range checks** - Use `greater_than`/`less_than` tests (NOT function predicates with `includes`)
15. **LLM judge for semantics** - Static tests for measurements, LLM judge for visual/subjective evaluation
16. **Keep LLM judge proportional** - Simple tasks = fewer focus areas
17. **Import enum when needed** - `AI_MSO_AUTO_SHAPE_TYPE` for autoShapes
18. **Test layers**: count → position → align → size → spacing → boundaries → LLM

---

## Reference Files

- **Schema**: `benchmark/evaluation/schemas.ts`
- **Examples**: `benchmark/scenarios/basic-shapes/test-*/validation.ts`
- **Recent work**: `benchmark/scenarios/pptc/test-37a/validation.ts`, `test-37b/validation.ts`
- **Enum**: `api/server/src/schemas/common/enum.ts`

---

## Common Property Paths

| Property | Path | Description |
|----------|------|-------------|
| X position | `pos.topLeft[0]` | Horizontal position (left edge) |
| Y position | `pos.topLeft[1]` | Vertical position (top edge) |
| Center X | `pos.center[0]` | Horizontal center point |
| Center Y | `pos.center[1]` | Vertical center point |
| Width | `size.w` | Shape width |
| Height | `size.h` | Shape height |
| AutoShape type | `details.autoShapeType` | Specific autoShape subtype |
| Corner radius | `details.cornerRadius` | Rounded corner radius |
| Layer order | `zIndex` | Z-index/stacking order |
| Fill color | `style.fill.color` | Background fill color |
| Border width | `style.border.width` | Border line width |
| Line start X | `startPos[0]` | Horizontal start position of line |
| Line start Y | `startPos[1]` | Vertical start position of line |
| Line start X | `startPos[0]` | Horizontal start position of line |
| Line start Y | `startPos[1]` | Vertical start position of line |
| Line end X | `endPos[0]` | Horizontal end position of line |
| Line end Y | `endPos[1]` | Vertical end position of line |
| Calculated line length | `calculated.length` | Dynamically calculated length: √((endX-startX)² + (endY-startY)²) |

**Note**: 
- For line validation (verticality, length), use the `line_validation` test type rather than accessing these properties directly
- For checking specific line lengths, use `all_are_equal` with `calculated.length` property
- For line spacing, use `equal_spacing` with line shape IDs (automatically handles `startPos` vs `pos.topLeft`)

---

## Troubleshooting

**TypeScript errors on filters?**
- Use datamodel strings: `"image"`, `"textbox"`, `"autoShape"`, `"line"`, `"placeholder"`, `"table"`, `"group"`
- Or import enum: `AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE`
- Both are supported as of recent schema updates
- Note: `"group"` shapeType was added to support grouped shapes in datamodel

**Tests failing with "not enough matches"?**
- Check `minMatchCount` - should be <= total matching shapes
- Use filtered tests instead of specific shape IDs
- Verify filter is correct for your shapes

**LLM judge not running?**
- Ensure `context` is provided with all required fields
- Check `testDirectory` contains test files
- Verify `initialPresentationPath` and `presentationPath` exist

**Numeric tolerance issues?**
- Tests use 1px tolerance for numeric comparisons
- Positions within 1px are considered equal
- This accounts for floating point rounding

**Function predicates not working with `includes` test?**
- The `includes` test does NOT support function predicates (e.g., `expected: (x: number) => x < 640`)
- Use `greater_than`, `less_than`, `greater_than_or_equal`, or `less_than_or_equal` tests instead
- For range checks, combine multiple numerical tests (e.g., `greater_than: 900` AND `less_than: 1020`)

**Boundary test failing for decorative elements?**
- Some shapes (like decorative images) may intentionally extend beyond slide boundaries
- If this is acceptable for your use case, consider omitting the boundary test
- The LLM judge can assess visual quality including boundary respect

**How to check alignment between specific text values?**
- Use multi-filter `filtered_equality` with `filters` array (not `filter`)
- Example: Check that "01" and "04" align vertically:
  ```typescript
  {
    name: "filtered_equality",
    filters: [
      { shapeType: "textbox", rawText: "01" },
      { shapeType: "textbox", rawText: "04" },
    ],
    key: "pos.topLeft[0]",
    minMatchCount: 2, // Required but not used for multi-filter
  }
  ```
- This checks that shapes matching each filter have equal property values (within 10px tolerance)
- Works with numeric properties only (coordinates, sizes, etc.)

**Avoiding hardcoded shape IDs and absolute coordinates?**
- Use text-based filtering (`rawText` or `rawTextContains`) to identify shapes by content
- Use multi-filter tests to check relationships between specific text values
- Use relative alignment checks (`filtered_equality` with `minMatchCount`) instead of exact pixel values
- This makes validation flexible and works with any valid layout implementation

**Current tests don't support what you need?**
- **DO**: Extend the validation system by creating new test types (e.g., `line_validation` for checking line verticality and length)
- **DON'T**: Relax existing tests (e.g., reducing `minMatchCount` from 3 to 1) or remove validation requirements
- **DON'T**: Use hardcoded values from groundtruth - always calculate dynamically from shape properties
- **Example**: To check that lines are vertical, we created `line_validation` test type that:
  - Checks each line individually (startPos[0] == endPos[0] within tolerance)
  - Calculates line length dynamically: `√((endX-startX)² + (endY-startY)²)`
  - Verifies lines divide textboxes using relative positioning
  - Uses appropriate tolerance (10px for verticality/length, 30px for division)

**Overfitting to groundtruth?**
- **NEVER** use absolute coordinates or hardcoded values from groundtruth files
- **ALWAYS** use relative relationships and calculated values
- **ALWAYS** allow sufficient tolerance (10px for coordinates, more for complex positioning)
- **REMEMBER**: Multiple valid results are possible - validation should accept any correct implementation
- **Example**: Line length should be calculated from startPos/endPos, not hardcoded as "327.6px"
