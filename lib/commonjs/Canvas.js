"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeSkia = require("@shopify/react-native-skia");
var _core = require("./core");
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Canvas = /*#__PURE__*/(0, _react.forwardRef)((_ref, ref) => {
  let {
    color = _core.DEFAULT_BRUSH_COLOR,
    thickness = _core.DEFAULT_THICKNESS,
    opacity = _core.DEFAULT_OPACITY,
    filled,
    cap = _core.DEFAULT_STROKE_CAP,
    join = _core.DEFAULT_STROKE_JOIN,
    initialPaths = [],
    style,
    height,
    width,
    eraserSize = _core.DEFAULT_ERASER_SIZE,
    tool = _core.DEFAULT_TOOL,
    onPathsChange,
    backgroundColor = _core.DEFAULT_CANVAS_BACKGROUND_COLOR,
    debug,
    shareStrokeProperties,
    touchDisabled = false
  } = _ref;
  const prevPointRef = (0, _react.useRef)();
  const skiaViewRef = (0, _react.useRef)(null);
  const skRectMaxX = (0, _react.useRef)([]);
  const skRectMaxY = (0, _react.useRef)([]);
  const paths = (0, _react.useMemo)(() => (0, _utils.convertCorePathsToSkiaPaths)(initialPaths), [initialPaths]);
  const pathPaint = (0, _react.useMemo)(() => {
    const p = _reactNativeSkia.Skia.Paint();
    (0, _utils.setPaint)(p, {
      color,
      thickness,
      opacity,
      filled,
      cap,
      join
    });
    return p;
  }, [color, thickness, opacity, filled, cap, join]);
  let eraserPoint = (0, _react.useMemo)(() => ({
    x: 0,
    y: 0,
    erasing: false
  }), []);
  const canvasPaint = _reactNativeSkia.Skia.Paint();
  canvasPaint.setColor(_reactNativeSkia.Skia.Color(backgroundColor));
  const eraserPaint = _reactNativeSkia.Skia.Paint();
  eraserPaint.setColor(_reactNativeSkia.Skia.Color('#000000'));
  eraserPaint.setStyle(_reactNativeSkia.PaintStyle.Fill);
  const undo = (0, _react.useCallback)(() => {
    var _skiaViewRef$current;
    skRectMaxX.current.pop();
    skRectMaxY.current.pop();
    paths.length = Math.max(0, paths.length - 1);
    (_skiaViewRef$current = skiaViewRef.current) === null || _skiaViewRef$current === void 0 ? void 0 : _skiaViewRef$current.redraw();
  }, [paths, skiaViewRef]);
  const clear = (0, _react.useCallback)(() => {
    var _skiaViewRef$current2;
    paths.length = 0;
    (_skiaViewRef$current2 = skiaViewRef.current) === null || _skiaViewRef$current2 === void 0 ? void 0 : _skiaViewRef$current2.redraw();
    skRectMaxX.current = [];
    skRectMaxY.current = [];
  }, [paths, skiaViewRef]);
  const getPaths = (0, _react.useCallback)(() => (0, _utils.convertInnerPathsToStandardPaths)(paths), [paths]);
  const addPath = (0, _react.useCallback)(path => {
    paths.push((0, _utils.convertCorePathToSkiaPath)(path));
  }, [paths]);
  const addPaths = (0, _react.useCallback)(corePaths => {
    paths.push(...(0, _utils.convertCorePathsToSkiaPaths)(corePaths));
  }, [paths]);
  const setPaths = (0, _react.useCallback)(corePaths => {
    paths.splice(0, paths.length, ...(0, _utils.convertCorePathsToSkiaPaths)(corePaths));
  }, [paths]);
  const getDistance = (x1, y1, x2, y2) => {
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x * x + y * y);
  };
  const getSvg = (0, _react.useCallback)(() => (0, _core.getSvgHelper)(getPaths(), width, height), [getPaths, width, height]);
  const getImageSnapshot = (0, _react.useCallback)(() => {
    if (skRectMaxX.current.length === 0 || skRectMaxY.current.length === 0) return;
    if (skiaViewRef.current) {
      var _skiaViewRef$current3;
      let xSnapshot = 0;
      let ySnapshot = 0;
      paths.forEach(_ref2 => {
        let {
          path
        } = _ref2;
        const skRect = path.computeTightBounds();
        if (xSnapshot === 0) {
          xSnapshot = skRect.x;
        }
        if (skRect.x < xSnapshot) {
          xSnapshot = skRect.x;
        }
        if (ySnapshot === 0) {
          ySnapshot = skRect.y;
        }
        if (skRect.y < ySnapshot) {
          ySnapshot = skRect.y;
        }
      });
      const widthSnapshot = getDistance(xSnapshot, ySnapshot, skRectMaxX.current[skRectMaxX.current.length - 1], ySnapshot) + 20;
      const heightSnapshot = getDistance(xSnapshot, ySnapshot, xSnapshot, skRectMaxY.current[skRectMaxY.current.length - 1]) + 20;
      const image = (_skiaViewRef$current3 = skiaViewRef.current) === null || _skiaViewRef$current3 === void 0 ? void 0 : _skiaViewRef$current3.makeImageSnapshot({
        width: _reactNative.PixelRatio.getPixelSizeForLayoutSize(widthSnapshot),
        height: _reactNative.PixelRatio.getPixelSizeForLayoutSize(heightSnapshot),
        x: _reactNative.PixelRatio.getPixelSizeForLayoutSize(xSnapshot - 10),
        y: _reactNative.PixelRatio.getPixelSizeForLayoutSize(ySnapshot - 10)
      });
      const data = image.encodeToBase64(_reactNativeSkia.ImageFormat.PNG, 100);
      const url = `data:image/png;base64,${data}`;
      return url;
    }
    return null;
  }, [paths]);
  (0, _react.useImperativeHandle)(ref, () => ({
    undo,
    clear,
    getPaths,
    addPath,
    addPaths,
    setPaths,
    getSvg,
    getImageSnapshot
  }));
  const erasingPaths = (0, _react.useCallback)((x, y) => {
    const reversedPaths = [...paths].reverse();
    reversedPaths.forEach((_ref3, index) => {
      let {
        path
      } = _ref3;
      if (path.contains(x, y)) {
        paths.splice(reversedPaths.length - index - 1, 1);
      }
    });
  }, [paths]);
  const touchHandler = (0, _reactNativeSkia.useTouchHandler)({
    onStart: _ref4 => {
      let {
        x,
        y
      } = _ref4;
      if (touchDisabled) return;
      if (tool === _core.DrawingTool.Eraser) {
        erasingPaths(x, y);
        eraserPoint = {
          x,
          y,
          erasing: true
        };
      } else {
        const path = _reactNativeSkia.Skia.Path.Make();
        path.setIsVolatile(true);
        paths.push({
          path,
          paint: pathPaint,
          style: filled ? _reactNativeSkia.PaintStyle.Fill : _reactNativeSkia.PaintStyle.Stroke,
          data: [[x, y]]
        });
        path.moveTo(x, y);
        prevPointRef.current = [x, y];
      }
    },
    onActive: _ref5 => {
      let {
        x,
        y
      } = _ref5;
      if (touchDisabled) return;
      if (tool === _core.DrawingTool.Eraser) {
        erasingPaths(x, y);
        eraserPoint = {
          x,
          y,
          erasing: true
        };
      } else {
        // Get current path object
        const {
          path
        } = paths[paths.length - 1];
        (0, _utils.drawPoint)(path, prevPointRef.current, [x, y]);

        // push max X of path
        if (skRectMaxX.current.length === 0 || skRectMaxX.current[skRectMaxX.current.length - 1] < x) {
          skRectMaxX.current.push(x);
        }
        if (skRectMaxY.current.length === 0 || skRectMaxY.current[skRectMaxY.current.length - 1] < y) {
          skRectMaxY.current.push(y);
        }
        prevPointRef.current = [x, y];
        paths[paths.length - 1].data.push([x, y]);
      }
    },
    onEnd: () => {
      if (touchDisabled) return;
      eraserPoint.erasing = false;
      onPathsChange && onPathsChange((0, _utils.convertInnerPathsToStandardPaths)(paths));
    }
  }, [pathPaint, tool, onPathsChange, touchDisabled]);
  const onDraw = (0, _reactNativeSkia.useDrawCallback)((canvas, info) => {
    if (!touchDisabled) {
      // Update from pending touches
      touchHandler(info.touches);
    }

    // Clear screen
    // canvas.drawPaint(canvasPaint);

    // Draw paths
    if (shareStrokeProperties) {
      paths.forEach(_ref6 => {
        let {
          path
        } = _ref6;
        return canvas.drawPath(path, pathPaint);
      });
    } else {
      paths.forEach(_ref7 => {
        let {
          path,
          paint
        } = _ref7;
        canvas.drawPath(path, paint);
      });
    }
    if (eraserPoint.erasing) {
      canvas.drawCircle(eraserPoint.x, eraserPoint.y, eraserSize, eraserPaint);
    }
  }, [pathPaint, canvasPaint, eraserPaint, eraserPoint, eraserSize, paths, touchDisabled, shareStrokeProperties]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeSkia.SkiaView, {
    ref: skiaViewRef,
    style: [styles.skia, style, {
      width,
      height
    }],
    onDraw: onDraw,
    debug: debug
  });
});
const styles = _reactNative.StyleSheet.create({
  skia: {
    overflow: 'hidden'
  }
});
var _default = Canvas;
exports.default = _default;
//# sourceMappingURL=Canvas.js.map