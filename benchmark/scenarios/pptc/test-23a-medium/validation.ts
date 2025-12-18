import { TChangesetTestProtocol } from "../../../evaluation/schemas";

export const Test: TChangesetTestProtocol = [
    // Count tests - verify 7 years exist after adding 2 more
    {
        name: "count_shapes",
        description: "There should be 7 year label textboxes (2015-2021)",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "20" },
        expected: 7,
    },

    // Count number badges (should be 7 after adding 06 and 07)
    {
        name: "count_shapes",
        description: "There should be 7 number badge textboxes (01-07)",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "0" },
        expected: 7,
    },

    // Alignment tests - upper row years should be horizontally aligned (2016, 2018, 2020)
    {
        name: "filtered_equality",
        description: "Upper row year labels (2016, 2018, 2020) should be horizontally aligned",
        slideId: 286,
        filters: [
            { shapeType: "textbox", rawText: "2016" },
            { shapeType: "textbox", rawText: "2018" },
            { shapeType: "textbox", rawText: "2020" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 3,
    },

    // Lower row years should be horizontally aligned (2015, 2017, 2019, 2021)
    {
        name: "filtered_equality",
        description: "Lower row year labels (2015, 2017, 2019, 2021) should be horizontally aligned",
        slideId: 286,
        filters: [
            { shapeType: "textbox", rawText: "2015" },
            { shapeType: "textbox", rawText: "2017" },
            { shapeType: "textbox", rawText: "2019" },
            { shapeType: "textbox", rawText: "2021" },
        ],
        key: "pos.topLeft[1]",
        minMatchCount: 4,
    },

    // Year labels should have equal size
    {
        name: "filtered_equality",
        description: "All year label textboxes should have equal width",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "20" },
        key: "size.w",
        minMatchCount: 7,
    },
    {
        name: "filtered_equality",
        description: "All year label textboxes should have equal height",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "20" },
        key: "size.h",
        minMatchCount: 7,
    },

    // Horizontal spacing - all years should be evenly spaced
    {
        name: "filtered_spacing",
        description: "Year labels should have equal horizontal spacing",
        slideId: 286,
        filter: { shapeType: "textbox", rawTextContains: "20" },
        direction: "horizontal",
        minMatchCount: 7,
    },

    // LLM Judge for semantic validation
    {
        name: "llm_judge",
        description: "LLM evaluation of timeline extension",
        slideId: 286,
        autoGenerate: true,
        criteria: "Evaluate if two additional years (2020 and 2021) were properly inserted into the timeline chart, maintaining consistent styling and layout.",
        focusAreas: [
            "Two new years (2020 and 2021) are added after 2019",
            "New years follow the alternating up/down pattern of existing years",
            "New years have matching visual styling (font, color, size) as existing years",
            "New number badges (06, 07) are added with consistent styling",
            "New content sections ('Add a main point' / 'Elaborate') are included for new years",
            "Connector arrows/lines are added between new timeline entries",
            "Overall timeline maintains visual balance and professional appearance",
        ],
        expectedChanges: [
            "Two new year labels (2020, 2021) added to timeline",
            "New number badges and content groups for each new year",
            "Connectors added between 2019-2020 and 2020-2021",
            "Timeline extended while maintaining alternating layout pattern",
        ],
    },
];
