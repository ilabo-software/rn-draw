/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert, no-console */

import { PaintStyle, StrokeCap, StrokeJoin, Skia } from '@shopify/react-native-skia';
/**
 * Helper function to convert Skia path colors to useful data
 *
 * @param color Skia color
 * @returns The color as HEX string and opacity
 */
export const convertIntColor = color => {
  const hex = color.toString(16);
  return {
    opacity: parseInt(hex.substring(0, 2), 16) / 255,
    color: hex.substring(2)
  };
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
 */
export const SVGStrokeCap = {
  [StrokeCap.Butt]: 'butt',
  [StrokeCap.Round]: 'round',
  [StrokeCap.Square]: 'square'
};

/**
 * Helper object to convert from standardized core stroke cap to Skia stroke cap
 */
export const SVGStrokeCapToSkia = {
  butt: StrokeCap.Butt,
  round: StrokeCap.Round,
  square: StrokeCap.Square
};

/**
 * A subset of https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
 */
export const SVGStrokeJoin = {
  [StrokeJoin.Bevel]: 'bevel',
  [StrokeJoin.Miter]: 'miter',
  [StrokeJoin.Round]: 'round'
};

/**
 * Helper object to convert from standardized core stroke join to Skia stroke join
 */
export const SVGStrokeJoinToSkia = {
  bevel: StrokeJoin.Bevel,
  miter: StrokeJoin.Miter,
  round: StrokeJoin.Round
};
export const convertInnerPathToStandardPath = _ref => {
  let {
    paint,
    path,
    style,
    data
  } = _ref;
  const rawColor = paint.getColor();
  const {
    color,
    opacity
  } = convertIntColor(rawColor);
  return {
    color,
    thickness: paint.getStrokeWidth(),
    path: [path.toSVGString()],
    opacity,
    cap: SVGStrokeCap[paint.getStrokeCap()],
    join: SVGStrokeJoin[paint.getStrokeJoin()],
    filled: style === PaintStyle.Fill,
    data: [data]
  };
};
export const convertInnerPathsToStandardPaths = paths => paths.map(convertInnerPathToStandardPath);
export const setPaint = (paint, data) => {
  paint.setColor(Skia.Color(data.color));
  paint.setStrokeWidth(data.thickness);
  paint.setAlphaf(data.opacity);
  paint.setStyle(data.filled ? PaintStyle.Fill : PaintStyle.Stroke);
  paint.setStrokeCap(SVGStrokeCapToSkia[data.cap]);
  paint.setStrokeJoin(SVGStrokeJoinToSkia[data.join]);
};

/**
 * Calculate and draw a smooth curve
 *
 * @param path
 * @param point1
 * @param point2
 */
export const drawPoint = (path, _ref2, _ref3) => {
  let [x1, y1] = _ref2;
  let [_x2, _y2] = _ref3;
  // const xMid = (x1 + x2) / 2;
  // const yMid = (y1 + y2) / 2;

  path.quadTo(x1, y1, x1, y1);
};
export const convertCorePathToSkiaPath = path => {
  const newPaint = Skia.Paint();
  setPaint(newPaint, {
    ...path
  });
  const newPath = Skia.Path.Make();
  for (let i = 0; i < path.data.length - 1; i++) {
    const data = path.data;
    if (data) {
      var _data$i, _data;
      const point1 = data === null || data === void 0 ? void 0 : (_data$i = data[i]) === null || _data$i === void 0 ? void 0 : _data$i[0];
      const point2 = data === null || data === void 0 ? void 0 : (_data = data[i + 1]) === null || _data === void 0 ? void 0 : _data[0];
      if (point1 && point2) {
        drawPoint(newPath, point1, point2); // TODO: support multiple paths
      }
    }
  }

  return {
    paint: newPaint,
    path: newPath,
    style: path.filled ? PaintStyle.Fill : PaintStyle.Stroke,
    data: path.data[0] // TODO: support multiple paths
  };
};

export const convertCorePathsToSkiaPaths = paths => paths.map(convertCorePathToSkiaPath);
//# sourceMappingURL=utils.js.map