import type { PaintStyle, IPaint, IPath } from '@shopify/react-native-skia';
import type { PathDataType } from './core';
/**
 * Custom Skia path to contain more information about the path
 */
export interface SkiaPath {
    path: IPath;
    paint: IPaint;
    style: PaintStyle;
    data: PathDataType;
}
//# sourceMappingURL=types.d.ts.map