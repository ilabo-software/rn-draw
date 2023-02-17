"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPaint = exports.drawPoint = exports.convertIntColor = exports.convertInnerPathsToStandardPaths = exports.convertInnerPathToStandardPath = exports.convertCorePathsToSkiaPaths = exports.convertCorePathToSkiaPath = exports.SVGStrokeJoinToSkia = exports.SVGStrokeJoin = exports.SVGStrokeCapToSkia = exports.SVGStrokeCap = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
/* eslint-disable no-alert, no-console */

/**
 * Helper function to convert Skia path colors to useful data
 *
 * @param color Skia color
 * @returns The color as HEX string and opacity
 */
const convertIntColor = color => {
  const hex = color.toString(16);
  return {
    opacity: parseInt(hex.substring(0, 2), 16) / 255,
    color: hex.substring(2)
  };
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
 */
exports.convertIntColor = convertIntColor;
const SVGStrokeCap = {
  [_reactNativeSkia.StrokeCap.Butt]: 'butt',
  [_reactNativeSkia.StrokeCap.Round]: 'round',
  [_reactNativeSkia.StrokeCap.Square]: 'square'
};

/**
 * Helper object to convert from standardized core stroke cap to Skia stroke cap
 */
exports.SVGStrokeCap = SVGStrokeCap;
const SVGStrokeCapToSkia = {
  butt: _reactNativeSkia.StrokeCap.Butt,
  round: _reactNativeSkia.StrokeCap.Round,
  square: _reactNativeSkia.StrokeCap.Square
};

/**
 * A subset of https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
 */
exports.SVGStrokeCapToSkia = SVGStrokeCapToSkia;
const SVGStrokeJoin = {
  [_reactNativeSkia.StrokeJoin.Bevel]: 'bevel',
  [_reactNativeSkia.StrokeJoin.Miter]: 'miter',
  [_reactNativeSkia.StrokeJoin.Round]: 'round'
};

/**
 * Helper object to convert from standardized core stroke join to Skia stroke join
 */
exports.SVGStrokeJoin = SVGStrokeJoin;
const SVGStrokeJoinToSkia = {
  bevel: _reactNativeSkia.StrokeJoin.Bevel,
  miter: _reactNativeSkia.StrokeJoin.Miter,
  round: _reactNativeSkia.StrokeJoin.Round
};
exports.SVGStrokeJoinToSkia = SVGStrokeJoinToSkia;
const convertInnerPathToStandardPath = _ref => {
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
    filled: style === _reactNativeSkia.PaintStyle.Fill,
    data: [data]
  };
};
exports.convertInnerPathToStandardPath = convertInnerPathToStandardPath;
const convertInnerPathsToStandardPaths = paths => paths.map(convertInnerPathToStandardPath);
exports.convertInnerPathsToStandardPaths = convertInnerPathsToStandardPaths;
const setPaint = (paint, data) => {
  paint.setColor(_reactNativeSkia.Skia.Color(data.color));
  paint.setStrokeWidth(data.thickness);
  paint.setAlphaf(data.opacity);
  paint.setStyle(data.filled ? _reactNativeSkia.PaintStyle.Fill : _reactNativeSkia.PaintStyle.Stroke);
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
exports.setPaint = setPaint;
const drawPoint = (path, _ref2, _ref3) => {
  let [x1, y1] = _ref2;
  let [x2, y2] = _ref3;
  const xMid = (x1 + x2) / 2;
  const yMid = (y1 + y2) / 2;
  path.quadTo(x1, y1, xMid, yMid);
};
exports.drawPoint = drawPoint;
const convertCorePathToSkiaPath = path => {
  const newPaint = _reactNativeSkia.Skia.Paint();
  setPaint(newPaint, {
    ...path
  });
  const newPath = _reactNativeSkia.Skia.Path.Make();
  for (let i = 0; i < path.data.length - 1; i++) {
    drawPoint(newPath, path.data[i][0], path.data[i + 1][0]); // TODO: support multiple paths
  }

  return {
    paint: newPaint,
    path: newPath,
    style: path.filled ? _reactNativeSkia.PaintStyle.Fill : _reactNativeSkia.PaintStyle.Stroke,
    data: path.data[0] // TODO: support multiple paths
  };
};
exports.convertCorePathToSkiaPath = convertCorePathToSkiaPath;
const convertCorePathsToSkiaPaths = paths => paths.map(convertCorePathToSkiaPath);
exports.convertCorePathsToSkiaPaths = convertCorePathsToSkiaPaths;
//# sourceMappingURL=utils.js.map