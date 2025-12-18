import { PowerPointService } from "../../../../api/server/src/services/addin/powerpoint/service";
import type { SlideSnapshot } from "../../../../api/server/src/services/addin/powerpoint/types";

/**
 * Service for retrieving slide snapshots with caching
 */
export class SnapshotService {
    private ppService: PowerPointService;
    private snapshotCache: Map<string, SlideSnapshot>;

    constructor() {
        this.ppService = new PowerPointService({
            baseUrl: process.env.PYTHON_API_URL || "http://localhost:8000",
            timeout: 30000, // 30s for snapshot generation
            enableDebugLogging: false,
        });
        this.snapshotCache = new Map();
    }

    /**
     * Get a slide snapshot by ID with caching
     */
    async getSlideSnapshot(
        presentationPath: string,
        slideId: number
    ): Promise<SlideSnapshot> {
        const cacheKey = `${presentationPath}:${slideId}`;

        if (this.snapshotCache.has(cacheKey)) {
            return this.snapshotCache.get(cacheKey)!;
        }

        const snapshot = await this.ppService.getSlideSnapshotById(
            presentationPath,
            slideId
        );

        this.snapshotCache.set(cacheKey, snapshot);
        return snapshot;
    }

    /**
     * Clear the snapshot cache
     */
    clearCache(): void {
        this.snapshotCache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.snapshotCache.size,
            keys: Array.from(this.snapshotCache.keys()),
        };
    }
}
