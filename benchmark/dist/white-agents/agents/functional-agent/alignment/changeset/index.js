/**
 * PowerPoint Changeset Schema Definitions
 *
 * This module provides comprehensive schema definitions for PowerPoint changeset operations.
 * All schemas are built using Zod for runtime validation and TypeScript type generation.
 */
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { AlignChangesetSchema } from "./schemas/changeset.js";
extendZodWithOpenApi(z);
export { AlignChangesetSchema };
