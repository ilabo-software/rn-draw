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
export let DrawingTool;

/**
 * React props for a general `Canvas` component
 */
(function (DrawingTool) {
  DrawingTool["Brush"] = "brush";
  DrawingTool["Eraser"] = "eraser";
})(DrawingTool || (DrawingTool = {}));
//# sourceMappingURL=types.js.map