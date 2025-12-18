/**
 * White Agent PowerPoint API
 *
 * Provides PowerPoint operations (extract datamodel, inject changeset) for agents.
 * This service executes Python procedures directly (no separate python HTTP server required).
 */

import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { AIChangesetSchema } from "../../../api/server/src/schemas/changeset/schemas/changeset.js";
import type { AITChangesetSchema } from "../../../api/server/src/schemas/changeset/schemas/changeset.js";
import type { AITSlide } from "../../../api/server/src/schemas/base/slide.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// __dirname = <repo>/benchmark/white-agents/runtime
// repo root is 3 levels up
const REPO_ROOT = path.join(__dirname, "..", "..", "..");

// Default Python API directory
const DEFAULT_PYTHON_API_DIR = path.join(REPO_ROOT, "api", "python");

export interface ExtractDatamodelResult {
    success: boolean;
    datamodel?: any;
    error?: string;
}

export interface InjectChangesetResult {
    success: boolean;
    outputPath?: string;
    error?: string;
}

export class WhiteAgentPPApi {
    private pythonApiDir: string;
    private presentationPath: string | undefined;
    private slideId: number | undefined;

    constructor({
        presentationPath,
        pythonApiDir,
    }: {
        presentationPath?: string;
        pythonApiDir?: string;
    }) {
        this.presentationPath = presentationPath;
        this.pythonApiDir = pythonApiDir || DEFAULT_PYTHON_API_DIR;
    }

    /**
     * Extract datamodel from PowerPoint presentation
     */
    async extractDatamodel(): Promise<ExtractDatamodelResult> {
        console.log(`🔍 Extracting datamodel from: ${this.presentationPath}`);

        try {
            if (!this.presentationPath) {
                throw new Error("Presentation path is required");
            }

            const slide = await this.runPythonGetSlideByIndex(
                this.presentationPath,
                0,
            );
            this.slideId = slide.id;

            return {
                success: true,
                datamodel: slide,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error("❌ Failed to extract datamodel:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Inject changeset into PowerPoint presentation
     */
    async injectChangeset(
        changeset: AITChangesetSchema,
        outputPath: string,
        presentationPath?: string,
    ): Promise<InjectChangesetResult> {
        const _presentationPath = presentationPath || this.presentationPath;
        if (!_presentationPath) {
            throw new Error("Presentation path is required");
        }
        console.log(`💉 Injecting changeset into: ${_presentationPath}`);
        console.log(`📁 Output path: ${outputPath}`);

        try {
            const validated = AIChangesetSchema.parse(changeset);
            const slideId =
                this.slideId ??
                (await this.runPythonGetSlideByIndex(_presentationPath, 0)).id;

            await this.runPythonEditSlide({
                presentationPath: _presentationPath,
                outputPath,
                slideId,
                changeset: validated,
            });

            console.log("✅ Changeset injected successfully");
            return {
                success: true,
                outputPath,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error("❌ Failed to inject changeset:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Get the Python API directory path
     */
    getPythonApiDir(): string {
        return this.pythonApiDir;
    }

    private async runPythonGetSlideByIndex(
        presentationPath: string,
        index: number,
    ): Promise<AITSlide> {
        const pythonScript = `
import json
import sys
import io

old_stdout = sys.stdout
sys.stdout = io.StringIO()

try:
    from src.procedures.get_slide import get_slide_by_index
    result = get_slide_by_index("${presentationPath}", ${index})

    sys.stdout = old_stdout
    if result.success:
        print(result.data.model_dump_json())
    else:
        error_msg = result.error.message if result.error else "Unknown error"
        print(json.dumps({"error": f"Failed to extract slide: {error_msg}", "procedure": "get_slide_by_index"}))
except Exception as e:
    sys.stdout = old_stdout
    print(json.dumps({"error": f"Failed to extract slide: {str(e)}", "procedure": "get_slide_by_index"}))
`;

        const raw = await this.execPython(pythonScript);
        const parsed = JSON.parse(raw);
        if (parsed?.error) {
            throw new Error(String(parsed.error));
        }
        return parsed as AITSlide;
    }

    private async runPythonEditSlide(args: {
        presentationPath: string;
        outputPath: string;
        slideId: number;
        changeset: AITChangesetSchema;
    }): Promise<void> {
        const changesetB64 = Buffer.from(
            JSON.stringify(args.changeset),
            "utf8",
        ).toString("base64");

        const pythonScript = `
import base64
import json
import os
import sys
import io

class SuppressOutput:
    def __enter__(self):
        self._original_stdout = sys.stdout
        self._original_stderr = sys.stderr
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
        return self
    def __exit__(self, *args):
        sys.stdout = self._original_stdout
        sys.stderr = self._original_stderr

try:
    from src.procedures.edit_slide import edit_slide
    from src.models.ai_schemas_models import AIChangesetSchema

    changeset_data = json.loads(base64.b64decode(os.environ["CHANGESET_B64"]).decode("utf-8"))
    changeset_obj = AIChangesetSchema(**changeset_data)

    with SuppressOutput():
        result = edit_slide(
            slide_id=${args.slideId},
            changeset=changeset_obj,
            presentation_path="${args.presentationPath}",
            output_path="${args.outputPath}"
        )

    if result.success:
        print(json.dumps({"success": True}))
    else:
        error_msg = result.error.message if result.error else "Unknown error"
        print(json.dumps({"error": f"Failed to inject changeset: {error_msg}", "procedure": "edit_slide"}))
except Exception as e:
    print(json.dumps({"error": f"Failed to inject changeset: {str(e)}", "procedure": "edit_slide"}))
`;

        const raw = await this.execPython(pythonScript, {
            CHANGESET_B64: changesetB64,
        });
        const parsed = JSON.parse(raw);
        if (parsed?.error) {
            throw new Error(String(parsed.error));
        }
    }

    private execPython(
        pythonScript: string,
        extraEnv?: Record<string, string>,
    ): Promise<string> {
        const escaped = pythonScript.replace(/"/g, '\\"');
        const command = `cd "${this.pythonApiDir}" && poetry run python -c "${escaped}"`;

        return new Promise((resolve, reject) => {
            exec(
                command,
                {
                    env: {
                        ...process.env,
                        ...extraEnv,
                        PYTHONPATH: this.pythonApiDir,
                    },
                    maxBuffer: 50 * 1024 * 1024,
                },
                (error, stdout) => {
                    if (error) {
                        reject(
                            new Error(
                                `Python command failed: ${error.message}`,
                            ),
                        );
                        return;
                    }
                    resolve(stdout.trim());
                },
            );
        });
    }
}
