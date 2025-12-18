import { AI_MSO_AUTO_SHAPE_TYPE } from "../../../../api/server/src/schemas/common/enum";
import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    {
        name: "count_shapes",
        description: "There should be 6 boxes (3x2 grid)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        expected: 6,
    },
    {
        name: "filtered_equality",
        description: "All 6 boxes should have equal width",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.w",
        minMatchCount: 6,
    },
    {
        name: "filtered_equality",
        description: "All 6 boxes should have equal height",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        key: "size.h",
        minMatchCount: 6,
    },
    {
        name: "filtered_spacing",
        description: "At least 3 boxes should have equal horizontal spacing (one row)",
        slideId: 266,
        filter: {
            autoShapeType: AI_MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        },
        direction: "horizontal",
        minMatchCount: 3,
    },
    {
        name: "within_boundaries",
        description: "All shapes should respect 10px margin from slide edges",
        slideId: 266,
        minMargin: 10,
    },
    {
        name: "llm_judge",
        description: "LLM evaluation of grid expansion and line addition",
        slideId: 266,
        autoGenerate: true,
        criteria: "Evaluate if the 3 boxes have been turned into 6 boxes (3 columns, 2 rows) and resized properly, a new horizontal line has been added that parts the two rows, the two existing vertical lines have been resized to only be as high as the boxes in their row, and copied so there are 4 vertical shorter lines separating the columns without interfering with the horizontal line.",
        focusAreas: [
            "3 boxes expanded to 6 boxes (3x2 grid)",
            "Boxes properly resized",
            "Horizontal line added separating the two rows",
            "Vertical lines resized to match row height",
            "4 vertical lines created separating columns",
            "Lines don't interfere with each other",
            "Proper grid layout and alignment",
        ],
        expectedChanges: [
            "Grid expanded to 3x2",
            "Horizontal line added",
            "Vertical lines resized and copied",
        ],
    },
];
