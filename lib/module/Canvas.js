import React, { useImperativeHandle, useMemo, useRef, forwardRef, useCallback } from 'react';
import { PixelRatio, StyleSheet } from 'react-native';
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
  const getDistance = (x1, y1, x2, y2) => {
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x * x + y * y);
  };
  const getSvg = useCallback(() => getSvgHelper(getPaths(), width, height), [getPaths, width, height]);
  const getImageSnapshot = useCallback(() => {
    if (skiaViewRef.current) {
      var _skiaViewRef$current3;
      let xSnapshot = 0;
      let ySnapshot = 0;
      let skRectMaxX = null;
      let skRectMaxY = null;
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
        if (skRectMaxX === null || skRectMaxX.x < skRect.x) {
          skRectMaxX = skRect;
        }
        if (skRectMaxY === null || skRectMaxY.y < skRect.y) {
          skRectMaxY = skRect;
        }
      });
      const widthSnapshot = skRectMaxX.width + getDistance(xSnapshot, ySnapshot, skRectMaxX.x, skRectMaxX.y) + 20;
      const heightSnapshot = skRectMaxY.height + getDistance(xSnapshot, ySnapshot, skRectMaxY.x, skRectMaxY.y) + 20;
      const image = (_skiaViewRef$current3 = skiaViewRef.current) === null || _skiaViewRef$current3 === void 0 ? void 0 : _skiaViewRef$current3.makeImageSnapshot({
        width: PixelRatio.getPixelSizeForLayoutSize(widthSnapshot),
        height: PixelRatio.getPixelSizeForLayoutSize(heightSnapshot),
        x: PixelRatio.getPixelSizeForLayoutSize(xSnapshot - 10),
        y: PixelRatio.getPixelSizeForLayoutSize(ySnapshot - 10)
      });
      const data = image.encodeToBase64(ImageFormat.PNG, 100);
      const url = `data:image/png;base64,${data}`;
      return url;
    }
    return null;
  }, [paths]);
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
    reversedPaths.forEach((_ref3, index) => {
      let {
        path
      } = _ref3;
      if (path.contains(x, y)) {
        paths.splice(reversedPaths.length - index - 1, 1);
      }
    });
  }, [paths]);
  const touchHandler = useTouchHandler({
    onStart: _ref4 => {
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
    onActive: _ref5 => {
      let {
        x,
        y
      } = _ref5;
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