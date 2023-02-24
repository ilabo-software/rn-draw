"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawingTool = void 0;
/**
 *  A point [x, y]
 */
/**
 * An array of points making up a path [x, y][]
 */
/**
 * Shape to be used at the end of open sub paths
 */
/**
 * Shape to be used at the corners of paths
 */
/**
 * Grouped data paths of the same color, thickness, opacity, filled, cap, and join drawn
 * consecutively
 */
/**
 * Tool used on the canvas
 */
let DrawingTool;
/**
 * React props for a general `Canvas` component
 */
exports.DrawingTool = DrawingTool;
(function (DrawingTool) {
  DrawingTool["Brush"] = "brush";
  DrawingTool["Eraser"] = "eraser";
})(DrawingTool || (exports.DrawingTool = DrawingTool = {}));
//# sourceMappingURL=types.js.map