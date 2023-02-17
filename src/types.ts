import type { PaintStyle, IPaint, IPath } from '@shopify/react-native-skia';
import type { PathDataType } from './core';

/**
 * Custom Skia path to contain more information about the path
 */
export interface SkiaPath {
  path: IPath; // TODO: support multiple paths
  paint: IPaint;
  style: PaintStyle;
  data: PathDataType; // TODO: support multiple paths
}
