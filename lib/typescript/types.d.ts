import type { PaintStyle, SkPaint, SkPath } from '@shopify/react-native-skia';
import type { PathDataType } from './core';
/**
 * Custom Skia path to contain more information about the path
 */
export interface SkiaPath {
    path: SkPath;
    paint: SkPaint;
    style: PaintStyle;
    data: PathDataType;
}
//# sourceMappingURL=types.d.ts.map