import React, { useImperativeHandle, useMemo, useRef, forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Skia, useDrawCallback, useTouchHandler, PaintStyle, SkiaView, ImageFormat } from '@shopify/react-native-skia';
import { DEFAULT_BRUSH_COLOR, DEFAULT_ERASER_SIZE, DEFAULT_OPACITY, DEFAULT_STROKE_CAP, DEFAULT_STROKE_JOIN, DEFAULT_THICKNESS, DEFAULT_TOOL, DEFAULT_CANVAS_BACKGROUND_COLOR, DrawingTool, getSvgHelper } from './core';
import { convertCorePathsToSkiaPaths, convertCorePathToSkiaPath, convertInnerPathsToStandardPaths, drawPoint, setPaint } from './utils';
const Canvas = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
    color = DEFAULT_BRUSH_COLOR,
    thickness = DEFAULT_THICKNESS,
    opacity = DEFAULT_OPACITY,
    filled,
    cap = DEFAULT_STROKE_CAP,
    join = DEFAULT_STROKE_JOIN,
    initialPaths = [],
    style,
    height,
    width,
    eraserSize = DEFAULT_ERASER_SIZE,
    tool = DEFAULT_TOOL,
    onPathsChange,
    backgroundColor = DEFAULT_CANVAS_BACKGROUND_COLOR,
    debug,
    shareStrokeProperties,
    touchDisabled = false
  } = _ref;
  const prevPointRef = useRef();
  const skiaViewRef = useRef(null);
  const paths = useMemo(() => convertCorePathsToSkiaPaths(initialPaths), [initialPaths]);
  const pathPaint = useMemo(() => {
    const p = Skia.Paint();
    setPaint(p, {
      color,
      thickness,
      opacity,
      filled,
      cap,
      join
    });
    return p;
  }, [color, thickness, opacity, filled, cap, join]);
  let eraserPoint = useMemo(() => ({
    x: 0,
    y: 0,
    erasing: false
  }), []);
  const canvasPaint = Skia.Paint();
  canvasPaint.setColor(Skia.Color(backgroundColor));
  const eraserPaint = Skia.Paint();
  eraserPaint.setColor(Skia.Color('#000000'));
  eraserPaint.setStyle(PaintStyle.Fill);
  const undo = useCallback(() => {
    var _skiaViewRef$current;
    paths.length = Math.max(0, paths.length - 1);
    (_skiaViewRef$current = skiaViewRef.current) === null || _skiaViewRef$current === void 0 ? void 0 : _skiaViewRef$current.redraw();
  }, [paths, skiaViewRef]);
  const clear = useCallback(() => {
    var _skiaViewRef$current2;
    paths.length = 0;
    (_skiaViewRef$current2 = skiaViewRef.current) === null || _skiaViewRef$current2 === void 0 ? void 0 : _skiaViewRef$current2.redraw();
  }, [paths, skiaViewRef]);
  const getPaths = useCallback(() => convertInnerPathsToStandardPaths(paths), [paths]);
  const addPath = useCallback(path => {
    paths.push(convertCorePathToSkiaPath(path));
  }, [paths]);
  const addPaths = useCallback(corePaths => {
    paths.push(...convertCorePathsToSkiaPaths(corePaths));
  }, [paths]);
  const setPaths = useCallback(corePaths => {
    paths.splice(0, paths.length, ...convertCorePathsToSkiaPaths(corePaths));
  }, [paths]);
  const getSvg = useCallback(() => getSvgHelper(getPaths(), width, height), [getPaths, width, height]);
  const getImageSnapshot = useCallback(() => {
    if (skiaViewRef.current) {
      var _skiaViewRef$current3;
      const image = (_skiaViewRef$current3 = skiaViewRef.current) === null || _skiaViewRef$current3 === void 0 ? void 0 : _skiaViewRef$current3.makeImageSnapshot();
      const data = image.encodeToBase64(ImageFormat.PNG, 100);
      const url = `data:image/png;base64,${data}`;
      return url;
    }
    return null;
  }, []);
  useImperativeHandle(ref, () => ({
    undo,
    clear,
    getPaths,
    addPath,
    addPaths,
    setPaths,
    getSvg,
    getImageSnapshot
  }));
  const erasingPaths = useCallback((x, y) => {
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
  const touchHandler = useTouchHandler({
    onStart: _ref3 => {
      let {
        x,
        y
      } = _ref3;
      if (tool === DrawingTool.Eraser) {
        erasingPaths(x, y);
        eraserPoint = {
          x,
          y,
          erasing: true
        };
      } else {
        const path = Skia.Path.Make();
        path.setIsVolatile(true);
        paths.push({
          path,
          paint: pathPaint,
          style: filled ? PaintStyle.Fill : PaintStyle.Stroke,
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
      if (tool === DrawingTool.Eraser) {
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
        drawPoint(path, prevPointRef.current, [x, y]);
        prevPointRef.current = [x, y];
        paths[paths.length - 1].data.push([x, y]);
      }
    },
    onEnd: () => {
      eraserPoint.erasing = false;
      onPathsChange && onPathsChange(convertInnerPathsToStandardPaths(paths));
    }
  }, [pathPaint, tool, onPathsChange]);
  const onDraw = useDrawCallback((canvas, info) => {
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

  return /*#__PURE__*/React.createElement(SkiaView, {
    ref: skiaViewRef,
    style: [styles.skia, style, {
      width,
      height
    }],
    onDraw: onDraw,
    debug: debug
  });
});
const styles = StyleSheet.create({
  skia: {
    overflow: 'hidden'
  }
});
export default Canvas;
//# sourceMappingURL=Canvas.js.map