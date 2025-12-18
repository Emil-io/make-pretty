import * as fs from "fs/promises";
import * as path from "path";
import type { LlmJudgeQuestion } from "../agents/types";

const CACHE_FILENAME = "llm-judge-questions.md";

/**
 * Markdown frontmatter metadata
 */
interface QuestionCacheMetadata {
    slideId: number;
    caseId: string;
    taskPrompt: string;
    generatedAt: string;
    questionCount: number;
}

/**
 * Save questions to Markdown file in test directory
 */
export async function cacheQuestionsToMarkdown(
    testDirectory: string,
    metadata: Omit<QuestionCacheMetadata, "questionCount">,
    questions: LlmJudgeQuestion[]
): Promise<void> {
    const cachePath = path.join(testDirectory, CACHE_FILENAME);

    const frontmatter = `---
slideId: ${metadata.slideId}
caseId: ${metadata.caseId}
taskPrompt: "${metadata.taskPrompt.replace(/"/g, '\\"')}"
generatedAt: "${metadata.generatedAt}"
questionCount: ${questions.length}
---`;

    const questionsMarkdown = questions
        .map(
            (q, i) => `
## Question ${i + 1}: ${q.id}
**Category**: ${q.category || "general"}
**Weight**: ${q.weight}
**Question**: ${q.question}
`
        )
        .join("\n");

    const content = `${frontmatter}

# LLM Judge Questions
${questionsMarkdown}`;

    await fs.writeFile(cachePath, content, "utf-8");
}

/**
 * Load questions from Markdown file if it exists
 */
export async function loadCachedQuestionsFromMarkdown(
    testDirectory: string
): Promise<{ metadata: QuestionCacheMetadata; questions: LlmJudgeQuestion[] } | null> {
    const cachePath = path.join(testDirectory, CACHE_FILENAME);

    try {
        const content = await fs.readFile(cachePath, "utf-8");
        return parseQuestionsMarkdown(content);
    } catch (error) {
        // File doesn't exist or can't be read
        return null;
    }
}

/**
 * Parse questions from Markdown content
 */
function parseQuestionsMarkdown(content: string): {
    metadata: QuestionCacheMetadata;
    questions: LlmJudgeQuestion[];
} {
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
        throw new Error("Invalid cache file: missing frontmatter");
    }

    const frontmatterText = frontmatterMatch[1];
    const metadata = parseFrontmatter(frontmatterText);

    // Extract questions
    const questionsSection = content.substring(frontmatterMatch[0].length);
    const questions = parseQuestions(questionsSection);

    return { metadata, questions };
}

/**
 * Parse YAML frontmatter
 */
function parseFrontmatter(frontmatter: string): QuestionCacheMetadata {
    const lines = frontmatter.split("\n");
    const data: any = {};

    for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
            const [, key, value] = match;
            // Remove quotes if present
            const cleanValue = value.replace(/^["']|["']$/g, "");

            if (key === "slideId" || key === "questionCount") {
                data[key] = parseInt(cleanValue, 10);
            } else {
                data[key] = cleanValue;
            }
        }
    }

    return data as QuestionCacheMetadata;
}

/**
 * Parse questions from Markdown sections
 */
function parseQuestions(content: string): LlmJudgeQuestion[] {
    const questions: LlmJudgeQuestion[] = [];

    // Match question sections
    const questionRegex = /## Question \d+: ([^\n]+)\n\*\*Category\*\*: ([^\n]+)\n\*\*Weight\*\*: ([^\n]+)\n\*\*Question\*\*: ([^\n]+)/g;

    let match;
    while ((match = questionRegex.exec(content)) !== null) {
        const [, id, category, weight, question] = match;

        questions.push({
            id: id.trim(),
            question: question.trim(),
            category: category.trim() as any,
            weight: parseFloat(weight.trim()),
        });
    }

    return questions;
}

/**
 * Check if cached questions exist for a test directory
 */
export async function hasCachedQuestions(testDirectory: string): Promise<boolean> {
    const cachePath = path.join(testDirectory, CACHE_FILENAME);
    try {
        await fs.access(cachePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Delete cached questions
 */
export async function deleteCachedQuestions(testDirectory: string): Promise<void> {
    const cachePath = path.join(testDirectory, CACHE_FILENAME);
    try {
        await fs.unlink(cachePath);
    } catch {
        // File doesn't exist, ignore
    }
}
