"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenWidth = exports.screenHeight = exports.DEFAULT_TOOL = exports.DEFAULT_THICKNESS = exports.DEFAULT_STROKE_JOIN = exports.DEFAULT_STROKE_CAP = exports.DEFAULT_OPACITY = exports.DEFAULT_ERASER_SIZE = exports.DEFAULT_CANVAS_BACKGROUND_COLOR = exports.DEFAULT_BRUSH_COLOR = void 0;
var _reactNative = require("react-native");
var _types = require("./types");
const DEFAULT_BRUSH_COLOR = '#000000';
exports.DEFAULT_BRUSH_COLOR = DEFAULT_BRUSH_COLOR;
const DEFAULT_ERASER_SIZE = 5;
exports.DEFAULT_ERASER_SIZE = DEFAULT_ERASER_SIZE;
const DEFAULT_THICKNESS = 3;
exports.DEFAULT_THICKNESS = DEFAULT_THICKNESS;
const DEFAULT_OPACITY = 1;
exports.DEFAULT_OPACITY = DEFAULT_OPACITY;
const DEFAULT_STROKE_CAP = 'round';
exports.DEFAULT_STROKE_CAP = DEFAULT_STROKE_CAP;
const DEFAULT_STROKE_JOIN = 'round';
exports.DEFAULT_STROKE_JOIN = DEFAULT_STROKE_JOIN;
const DEFAULT_TOOL = _types.DrawingTool.Brush;
exports.DEFAULT_TOOL = DEFAULT_TOOL;
const DEFAULT_CANVAS_BACKGROUND_COLOR = '#FFFFFF';
exports.DEFAULT_CANVAS_BACKGROUND_COLOR = DEFAULT_CANVAS_BACKGROUND_COLOR;
const {
  width: screenWidth,
  height: screenHeight
} = _reactNative.Dimensions.get('window');
exports.screenHeight = screenHeight;
exports.screenWidth = screenWidth;
//# sourceMappingURL=constants.js.map