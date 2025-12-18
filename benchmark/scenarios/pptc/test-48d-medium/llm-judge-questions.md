---
slideId: 275
caseId: pptc/test-48d
taskPrompt: "Add yellow lines as the existing one to all 4 points."
generatedAt: "2025-12-15T21:23:25.132Z"
questionCount: 6
---

# LLM Judge Questions

## Question 1: q1
**Category**: structure
**Weight**: 1
**Question**: Are there exactly 4 short vertical lines on the slide that match the specified style (color #FFD525, width ~2.65px, solid dash style)?


## Question 2: q2
**Category**: formatting
**Weight**: 1
**Question**: Do all 4 lines (identified in q1) have the exact color #FFD525?


## Question 3: q3
**Category**: formatting
**Weight**: 1
**Question**: Do all 4 lines (identified in q1) have a solid dash style?


## Question 4: q4
**Category**: formatting
**Weight**: 1
**Question**: Do all 4 lines (identified in q1) have a width between 2.6px and 2.7px (approximately 2.65px) and are they perfectly vertical (startPos X coordinate equals endPos X coordinate)?


## Question 5: q5
**Category**: layout
**Weight**: 1
**Question**: Do all 4 lines (identified in q1) have a length between 170px and 176px (approximately 173px, calculated as `abs(startPos.y - endPos.y)`)?


## Question 6: q6
**Category**: layout
**Weight**: 1
**Question**: Are the 4 lines (identified in q1) positioned such that each line is horizontally centered above one of the 'Add a main point' text boxes and extends downwards from the black horizontal bar?
