import React, { useMemo } from 'react';
import { createSVGPath } from '../utils';
const RendererHelper = _ref => {
  let {
    currentPath,
    currentColor,
    currentThickness,
    currentOpacity,
    paths,
    height,
    width,
    roundPoints,
    currentPathTolerance,
    Renderer
  } = _ref;
  const mergedPaths = useMemo(() => [...paths, {
    color: currentColor,
    path: [createSVGPath(currentPath, currentPathTolerance, roundPoints)],
    thickness: currentThickness,
    opacity: currentOpacity,
    data: [currentPath]
  }], [currentColor, currentThickness, currentPath, currentOpacity, paths, currentPathTolerance, roundPoints]);
  return /*#__PURE__*/React.createElement(Renderer, {
    height: height,
    width: width,
    paths: mergedPaths
  });
};
export default RendererHelper;
//# sourceMappingURL=RendererHelper.js.map