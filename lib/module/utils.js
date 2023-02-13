import simplifySvgPath from '@luncheon/simplify-svg-path';
export const createSVGPath = (points, tolerance, roundPoints) => {
  if (points.length > 1) {
    try {
      return simplifySvgPath(points, {
        precision: roundPoints ? 0 : 5,
        tolerance
      });
    } catch (error) {
      console.log(error);
    }
  } else if (points.length === 1) {
    var _points$, _points$2, _points$3, _points$4;
    return `M${points === null || points === void 0 ? void 0 : (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$[0]},${points === null || points === void 0 ? void 0 : (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2[1]} L${points === null || points === void 0 ? void 0 : (_points$3 = points[0]) === null || _points$3 === void 0 ? void 0 : _points$3[0]},${points === null || points === void 0 ? void 0 : (_points$4 = points[0]) === null || _points$4 === void 0 ? void 0 : _points$4[1]}`;
  }
  return '';
};
//# sourceMappingURL=utils.js.map