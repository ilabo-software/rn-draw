import { IPath, StrokeCap, StrokeJoin, IPaint } from '@shopify/react-native-skia';
import type { StrokeCap as CoreStrokeCap, StrokeJoin as CoreStrokeJoin, PathType, PointDataType } from './core';
import type { SkiaPath } from './types';
/**
 * Helper function to convert Skia path colors to useful data
 *
 * @param color Skia color
 * @returns The color as HEX string and opacity
 */
export declare const convertIntColor: (color: number) => {
    color: string;
    opacity: number;
};
/**
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
 */
export declare const SVGStrokeCap: {
    [key in StrokeCap]: CoreStrokeCap;
};
/**
 * Helper object to convert from standardized core stroke cap to Skia stroke cap
 */
export declare const SVGStrokeCapToSkia: {
    [key in CoreStrokeCap]: StrokeCap;
};
/**
 * A subset of https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
 */
export declare const SVGStrokeJoin: {
    [key in StrokeJoin]: CoreStrokeJoin;
};
/**
 * Helper object to convert from standardized core stroke join to Skia stroke join
 */
export declare const SVGStrokeJoinToSkia: {
    [key in CoreStrokeJoin]: StrokeJoin;
};
export declare const convertInnerPathToStandardPath: ({ paint, path, style, data, }: SkiaPath) => PathType;
export declare const convertInnerPathsToStandardPaths: (paths: SkiaPath[]) => PathType[];
export declare const setPaint: (paint: IPaint, data: {
    color: string;
    thickness: number;
    opacity: number;
    filled?: boolean;
    cap: CoreStrokeCap;
    join: CoreStrokeJoin;
}) => void;
/**
 * Calculate and draw a smooth curve
 *
 * @param path
 * @param point1
 * @param point2
 */
export declare const drawPoint: (path: IPath, [x1, y1]: PointDataType, [x2, y2]: PointDataType) => void;
export declare const convertCorePathToSkiaPath: (path: PathType) => SkiaPath;
export declare const convertCorePathsToSkiaPaths: (paths: PathType[]) => SkiaPath[];
//# sourceMappingURL=utils.d.ts.map