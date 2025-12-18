/**
 * Convert PNG buffer to base64 string for vision API
 */
export function convertPngToBase64(pngBuffer: Buffer): string {
    return pngBuffer.toString('base64');
}

/**
 * Convert base64 string back to PNG buffer
 */
export function convertBase64ToPng(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
}
