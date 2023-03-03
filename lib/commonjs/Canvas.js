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
    paths.length = Math.max(0, paths.length - 1);
    (_skiaViewRef$current = skiaViewRef.current) === null || _skiaViewRef$current === void 0 ? void 0 : _skiaViewRef$current.redraw();
  }, [paths, skiaViewRef]);
  const clear = (0, _react.useCallback)(() => {
    var _skiaViewRef$current2;
    paths.length = 0;
    (_skiaViewRef$current2 = skiaViewRef.current) === null || _skiaViewRef$current2 === void 0 ? void 0 : _skiaViewRef$current2.redraw();
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
  const getSvg = (0, _react.useCallback)(() => (0, _core.getSvgHelper)(getPaths(), width, height), [getPaths, width, height]);
  (0, _react.useImperativeHandle)(ref, () => ({
    undo,
    clear,
    getPaths,
    addPath,
    addPaths,
    setPaths,
    getSvg
  }));
  const erasingPaths = (0, _react.useCallback)((x, y) => {
    const reversedPaths = [...paths].reverse();
    reversedPaths.forEach((_ref2, index) => {
      let {
        path
      } = _ref2;
      if (path.contains(x, y)) {
        paths.splice(reversedPaths.length - index - 1, 1);
      }
    });
  }, [paths]);
  const touchHandler = (0, _reactNativeSkia.useTouchHandler)({
    onStart: _ref3 => {
      let {
        x,
        y
      } = _ref3;
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
    onActive: _ref4 => {
      let {
        x,
        y
      } = _ref4;
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
        prevPointRef.current = [x, y];
        paths[paths.length - 1].data.push([x, y]);
      }
    },
    onEnd: () => {
      eraserPoint.erasing = false;
      onPathsChange && onPathsChange((0, _utils.convertInnerPathsToStandardPaths)(paths));
    }
  }, [pathPaint, tool, onPathsChange]);
  const onDraw = (0, _reactNativeSkia.useDrawCallback)((canvas, info) => {
    if (!touchDisabled) {
      // Update from pending touches
      touchHandler(info.touches);
    }

    // Clear screen
    // canvas.drawPaint(canvasPaint);

    // Draw paths
    if (shareStrokeProperties) {
      paths.forEach(_ref5 => {
        let {
          path
        } = _ref5;
        return canvas.drawPath(path, pathPaint);
      });
    } else {
      paths.forEach(_ref6 => {
        let {
          path,
          paint
        } = _ref6;
        canvas.drawPath(path, paint);
      });
    }
    if (eraserPoint.erasing) {
      canvas.drawCircle(eraserPoint.x, eraserPoint.y, eraserSize, eraserPaint);
    }
  }, [pathPaint, canvasPaint, eraserPaint, eraserPoint, eraserSize, paths, touchDisabled, shareStrokeProperties]);

  // useEffect(
  //   () =>
  //     onPathsChange && onPathsChange(convertInnerPathsToStandardPaths(paths)),
  //   [paths, onPathsChange]
  // );

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