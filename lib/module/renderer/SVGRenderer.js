import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
const SVGRenderer = _ref => {
  let {
    paths,
    height,
    width
  } = _ref;
  return /*#__PURE__*/React.createElement(Svg, {
    height: height,
    width: width
  }, paths.map((_ref2, i) => {
    let {
      color,
      path,
      thickness,
      opacity,
      combine
    } = _ref2;
    return combine ? /*#__PURE__*/React.createElement(SVGRendererPath, {
      key: i,
      path: path,
      color: color,
      thickness: thickness,
      opacity: opacity
    }) : path.map((svgPath, j) => /*#__PURE__*/React.createElement(Path, {
      key: `${i}-${j}`,
      d: svgPath,
      fill: "none",
      stroke: color,
      strokeWidth: thickness,
      strokeLinecap: "round",
      opacity: opacity,
      strokeLinejoin: "round"
    }));
  }));
};
const SVGRendererPath = _ref3 => {
  let {
    path,
    color,
    thickness,
    opacity
  } = _ref3;
  const memoizedPath = useMemo(() => (path === null || path === void 0 ? void 0 : path.join(' ')) ?? '', [path]);
  return /*#__PURE__*/React.createElement(Path, {
    d: memoizedPath,
    fill: "none",
    stroke: color,
    strokeWidth: thickness,
    strokeLinecap: "round",
    opacity: opacity,
    strokeLinejoin: "round"
  });
};
export default SVGRenderer;
//# sourceMappingURL=SVGRenderer.js.map