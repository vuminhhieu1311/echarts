
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import * as layout from '../../util/layout.js';
import { parsePercent, linearMap } from '../../util/number.js';
import { isFunction } from 'zrender/lib/core/util.js';

function getViewRect(seriesModel, api) {
  return layout.getLayoutRect(seriesModel.getBoxLayoutParams(), {
    width: api.getWidth(),
    height: api.getHeight()
  });
}

function getSortedIndices(data, sort) {
  var valueDim = data.mapDimension('value');
  var valueArr = data.mapArray(valueDim, function (val) {
    return val;
  });
  var indices = [];
  var isAscending = sort === 'ascending';

  for (var i = 0, len = data.count(); i < len; i++) {
    indices[i] = i;
  } // Add custom sortable function & none sortable opetion by "options.sort"


  if (isFunction(sort)) {
    indices.sort(sort);
  } else if (sort !== 'none') {
    indices.sort(function (a, b) {
      return isAscending ? valueArr[a] - valueArr[b] : valueArr[b] - valueArr[a];
    });
  }

  return indices;
}

function labelLayout(data) {
  var seriesModel = data.hostModel;
  var orient = seriesModel.get('orient');
  data.each(function (idx) {
    var itemModel = data.getItemModel(idx);
    var labelModel = itemModel.getModel('label');
    var labelPosition = labelModel.get('position');
    var labelLineModel = itemModel.getModel('labelLine');
    var layout = data.getItemLayout(idx);
    var points = layout.points;
    var isLabelInside = labelPosition === 'inner' || labelPosition === 'inside' || labelPosition === 'center' || labelPosition === 'insideLeft' || labelPosition === 'insideRight';
    var textAlign;
    var textX;
    var textY;
    var linePoints;

    if (isLabelInside) {
      if (labelPosition === 'insideLeft') {
        textX = (points[0][0] + points[3][0]) / 2 + 5;
        textY = (points[0][1] + points[3][1]) / 2;
        textAlign = 'left';
      } else if (labelPosition === 'insideRight') {
        textX = (points[1][0] + points[2][0]) / 2 - 5;
        textY = (points[1][1] + points[2][1]) / 2;
        textAlign = 'right';
      } else {
        textX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
        textY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
        textAlign = 'center';
      }

      linePoints = [[textX, textY], [textX, textY]];
    } else {
      var x1 = void 0;
      var y1 = void 0;
      var x2 = void 0;
      var y2 = void 0;
      var labelLineLen = labelLineModel.get('length');

      if (process.env.NODE_ENV !== 'production') {
        if (orient === 'vertical' && ['top', 'bottom'].indexOf(labelPosition) > -1) {
          labelPosition = 'left';
          console.warn('Position error: Funnel chart on vertical orient dose not support top and bottom.');
        }

        if (orient === 'horizontal' && ['left', 'right'].indexOf(labelPosition) > -1) {
          labelPosition = 'bottom';
          console.warn('Position error: Funnel chart on horizontal orient dose not support left and right.');
        }
      }

      if (labelPosition === 'left') {
        // Left side
        x1 = (points[3][0] + points[0][0]) / 2;
        y1 = (points[3][1] + points[0][1]) / 2;
        x2 = x1 - labelLineLen;
        textX = x2 - 5;
        textAlign = 'right';
      } else if (labelPosition === 'right') {
        // Right side
        x1 = (points[1][0] + points[2][0]) / 2;
        y1 = (points[1][1] + points[2][1]) / 2;
        x2 = x1 + labelLineLen;
        textX = x2 + 5;
        textAlign = 'left';
      } else if (labelPosition === 'top') {
        // Top side
        x1 = (points[3][0] + points[0][0]) / 2;
        y1 = (points[3][1] + points[0][1]) / 2;
        y2 = y1 - labelLineLen;
        textY = y2 - 5;
        textAlign = 'center';
      } else if (labelPosition === 'bottom') {
        // Bottom side
        x1 = (points[1][0] + points[2][0]) / 2;
        y1 = (points[1][1] + points[2][1]) / 2;
        y2 = y1 + labelLineLen;
        textY = y2 + 5;
        textAlign = 'center';
      } else if (labelPosition === 'rightTop') {
        // RightTop side
        x1 = orient === 'horizontal' ? points[3][0] : points[1][0];
        y1 = orient === 'horizontal' ? points[3][1] : points[1][1];

        if (orient === 'horizontal') {
          y2 = y1 - labelLineLen;
          textY = y2 - 5;
          textAlign = 'center';
        } else {
          x2 = x1 + labelLineLen;
          textX = x2 + 5;
          textAlign = 'top';
        }
      } else if (labelPosition === 'rightBottom') {
        // RightBottom side
        x1 = points[2][0];
        y1 = points[2][1];

        if (orient === 'horizontal') {
          y2 = y1 + labelLineLen;
          textY = y2 + 5;
          textAlign = 'center';
        } else {
          x2 = x1 + labelLineLen;
          textX = x2 + 5;
          textAlign = 'bottom';
        }
      } else if (labelPosition === 'leftTop') {
        // LeftTop side
        x1 = points[0][0];
        y1 = orient === 'horizontal' ? points[0][1] : points[1][1];

        if (orient === 'horizontal') {
          y2 = y1 - labelLineLen;
          textY = y2 - 5;
          textAlign = 'center';
        } else {
          x2 = x1 - labelLineLen;
          textX = x2 - 5;
          textAlign = 'right';
        }
      } else if (labelPosition === 'leftBottom') {
        // LeftBottom side
        x1 = orient === 'horizontal' ? points[1][0] : points[3][0];
        y1 = orient === 'horizontal' ? points[1][1] : points[2][1];

        if (orient === 'horizontal') {
          y2 = y1 + labelLineLen;
          textY = y2 + 5;
          textAlign = 'center';
        } else {
          x2 = x1 - labelLineLen;
          textX = x2 - 5;
          textAlign = 'right';
        }
      } else {
        // Right side or Bottom side
        x1 = (points[1][0] + points[2][0]) / 2;
        y1 = (points[1][1] + points[2][1]) / 2;

        if (orient === 'horizontal') {
          y2 = y1 + labelLineLen;
          textY = y2 + 5;
          textAlign = 'center';
        } else {
          x2 = x1 + labelLineLen;
          textX = x2 + 5;
          textAlign = 'left';
        }
      }

      if (orient === 'horizontal') {
        x2 = x1;
        textX = x2;
      } else {
        y2 = y1;
        textY = y2;
      }

      linePoints = [[x1, y1], [x2, y2]];
    }

    layout.label = {
      linePoints: linePoints,
      x: textX,
      y: textY,
      verticalAlign: 'middle',
      textAlign: textAlign,
      inside: isLabelInside
    };
  });
}

function rateLabelLayout(data) {
  data.each(function (idx) {
    var layout = data.getItemLayout(idx);
    var points = layout.ratePoints;
    var isLabelInside = true;
    var textX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
    var textY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
    var textAlign = 'center';
    var linePoints = [[textX, textY], [textX, textY]];
    layout.rateLabel = {
      linePoints: linePoints,
      x: textX,
      y: textY,
      verticalAlign: 'middle',
      textAlign: textAlign,
      inside: isLabelInside
    };
  });
}

export default function funnelLayout(ecModel, api) {
  ecModel.eachSeriesByType('funnel', function (seriesModel) {
    // data about
    var data = seriesModel.getData();
    var valueDim = data.mapDimension('value');
    var valueArr = data.mapArray(valueDim, function (val) {
      return val;
    });
    var valueSum = valueArr.reduce(function (pre, cur) {
      return pre + cur;
    }); // direction about

    var sort = seriesModel.get('sort');
    var orient = seriesModel.get('orient'); // size and pos about

    var viewRect = getViewRect(seriesModel, api);
    var viewWidth = viewRect.width;
    var viewHeight = viewRect.height;
    var x = viewRect.x;
    var y = viewRect.y;
    var indices = getSortedIndices(data, sort);
    var gap = seriesModel.get('gap');
    var gapSum = gap * (data.count() - 1); // mapping mode about

    var dynamicHeight = seriesModel.get('dynamicHeight');
    var showRate = seriesModel.get('showRate'); // size extent based on orient and mapping mode
    // determine the width extent of the funnel piece  when dynamicHeight is false
    // determine the height extent of the funnel piece when dynamicHeight if true

    var isHorizontal = orient === 'horizontal';
    var size = dynamicHeight ? isHorizontal ? viewWidth - gapSum : viewHeight - gapSum : isHorizontal ? viewHeight : viewWidth;
    var sizeExtent = [parsePercent(seriesModel.get('minSize'), size), size];

    if (!dynamicHeight) {
      sizeExtent[1] = parsePercent(seriesModel.get('maxSize'), size);
    } // data extent


    var dataExtent = data.getDataExtent(valueDim);
    var min = seriesModel.get('min');
    var max = seriesModel.get('max');

    if (min == null) {
      min = Math.min(dataExtent[0], 0);
    }

    if (max == null) {
      max = dataExtent[1];
    } // determine the height of the funnel


    var viewSize = dynamicHeight ? isHorizontal ? viewHeight : viewWidth : isHorizontal ? viewWidth : viewHeight;
    var itemSize = (viewSize - gapSum) / data.count();

    if (dynamicHeight) {
      viewSize = parsePercent(seriesModel.get('maxSize'), viewSize);
    }

    var funnelAlign = seriesModel.get('funnelAlign'); // adjust related param

    if (sort === 'ascending') {
      // From bottom to top
      itemSize = -itemSize;
      gap = -gap;

      if (orient === 'horizontal') {
        x += viewWidth;
      } else {
        y += viewHeight;
      }

      indices = indices.reverse();
    }

    var getLinePoints = function (offset, itemSize) {
      // do not caculate line width in this func
      if (orient === 'horizontal') {
        var itemHeight = itemSize;
        var y0 = void 0;

        switch (funnelAlign) {
          case 'top':
            y0 = y;
            break;

          case 'center':
            y0 = y + (viewHeight - itemHeight) / 2;
            break;

          case 'bottom':
            y0 = y + (viewHeight - itemHeight);
            break;
        }

        return [[offset, y0], [offset, y0 + itemHeight]];
      }

      var itemWidth = itemSize;
      var x0;

      switch (funnelAlign) {
        case 'left':
          x0 = x;
          break;

        case 'center':
          x0 = x + (viewWidth - itemWidth) / 2;
          break;

        case 'right':
          x0 = x + viewWidth - itemWidth;
          break;
      }

      return [[x0, offset], [x0 + itemWidth, offset]];
    };

    var getItemSize = function (idx) {
      var itemVal = data.get(valueDim, idx) || 0;
      var itemSize = linearMap(itemVal, [min, max], sizeExtent, true);
      return itemSize;
    }; // exit shape control


    var exitWidth = parsePercent(seriesModel.get('exitWidth'), 100); // dy height funnel piece about

    var setDynamicHeightPoints = null;

    if (dynamicHeight) {
      setDynamicHeightPoints = function () {
        var dyminSize = parsePercent(seriesModel.get('minSize'), 100);
        var dymaxSize = dyminSize < 100 ? sizeExtent[1] * 100 / (100 - dyminSize) : sizeExtent[1];
        var resSize = dymaxSize;
        return function (index, idx, pos, pieceHeight) {
          var start = getLinePoints(pos, resSize / dymaxSize * viewSize);
          index === indices.length - 1 && exitWidth === 100 || (resSize += sort === 'ascending' ? pieceHeight : -pieceHeight);
          var end = getLinePoints(pos + pieceHeight, resSize / dymaxSize * viewSize);
          data.setItemLayout(idx, {
            points: start.concat(end.slice().reverse())
          });
        };
      }();
    } // rate funnel about


    var setRatePiecePoint = null;

    if (showRate) {
      var getConverRate_1 = function () {
        var firstVal;
        var firstName;
        var firstDataIndex; // get rate fixed decimal places

        var ratePrecision = seriesModel.get(['rateLabel', 'precision']);
        var overallRatePrecision = seriesModel.get(['overallRateLabel', 'precision']);
        return function (index, idx, nextIdx) {
          var val = data.get(valueDim, idx) || 0;
          var nextVal = data.get(valueDim, nextIdx) || 0;
          var preName = data.getName(idx);
          var nextName = data.getName(nextIdx);
          var preDataIndex = idx;
          var nextDataIndex = nextIdx;
          var rate = nextVal / val;
          rate = (rate * 100).toFixed(ratePrecision) + '%';

          if (index === 0) {
            firstVal = val;
            firstName = data.getName(idx);
            firstDataIndex = idx;
          } else if (index === indices.length - 1) {
            var lastVal = val;
            rate = lastVal / firstVal;
            rate = (rate * 100).toFixed(overallRatePrecision) + '%';
            nextName = preName;
            preName = firstName;
            preDataIndex = firstDataIndex;
            nextDataIndex = idx;
          }

          preDataIndex = preDataIndex + 1;
          nextDataIndex = nextDataIndex + 1;
          return {
            rate: rate,
            nextName: nextName,
            preName: preName,
            preDataIndex: preDataIndex,
            nextDataIndex: nextDataIndex
          };
        };
      }();

      setRatePiecePoint = function (index, idx, nextIdx, pos, pieceHeight) {
        // get this size
        var itemSize = getItemSize(idx);
        var exitSize = itemSize;

        if (exitWidth != null && index === indices.length - 1) {
          exitSize = itemSize * (exitWidth > 100 ? 100 : exitWidth) / 100;
        } // data piece


        var dataStart = getLinePoints(pos, itemSize);
        var dataEnd = getLinePoints(pos + pieceHeight / 2, exitSize); // rate piece

        var nextSize = getItemSize(index === indices.length - 1 && exitWidth === 100 ? idx : nextIdx);
        var rateStart = getLinePoints(pos + pieceHeight / 2, itemSize);
        var rateEnd = getLinePoints(pos + pieceHeight, nextSize); // rate string about

        var _a = getConverRate_1(index, idx, nextIdx),
            rate = _a.rate,
            nextName = _a.nextName,
            preName = _a.preName,
            preDataIndex = _a.preDataIndex,
            nextDataIndex = _a.nextDataIndex;

        data.setItemLayout(idx, {
          points: dataStart.concat(dataEnd.slice().reverse()),
          ratePoints: rateStart.concat(rateEnd.slice().reverse()),
          isLastPiece: index === indices.length - 1,
          rate: rate,
          nextName: nextName,
          preName: preName,
          preDataIndex: preDataIndex,
          nextDataIndex: nextDataIndex
        });
      };
    } // get the height of funnel piece


    var getPieceHeight = function (pieceHeight, idx) {
      // get funnel piece height pass to getLinePoints func based on data value
      var val = data.get(valueDim, idx) || 0;

      if (dynamicHeight) {
        // in dy height, user can't set itemHeight or itemWidth
        pieceHeight = linearMap(val, [0, valueSum], [0, size], true);
        pieceHeight = sort === 'ascending' ? -pieceHeight : pieceHeight;
        return pieceHeight;
      } // default mapping or show rate pieceHeight


      if (pieceHeight == null) {
        pieceHeight = itemSize;
      } else {
        pieceHeight = parsePercent(pieceHeight, orient === 'horizontal' ? viewWidth : viewHeight);
        pieceHeight = sort === 'ascending' ? -pieceHeight : pieceHeight;
      }

      return pieceHeight;
    }; // set the line piont of the funnel piece


    var setLayoutPoints = function (index, idx, nextIdx, pieceHeight, pos) {
      // The subsequent funnel shape modification will be done in this func.
      // We don’t need to concern direction when we use this function to set points.
      if (dynamicHeight) {
        setDynamicHeightPoints(index, idx, pos, pieceHeight);
        return;
      } else if (showRate && sort !== 'none') {
        setRatePiecePoint(index, idx, nextIdx, pos, pieceHeight);
        return;
      }

      var start = getLinePoints(pos, getItemSize(idx)); // get end line width;

      var nIdx = index === indices.length - 1 && exitWidth === 100 ? idx : nextIdx;
      var end = getLinePoints(pos + pieceHeight, getItemSize(nIdx));
      data.setItemLayout(idx, {
        points: start.concat(end.slice().reverse())
      });
    };

    for (var i = 0; i < indices.length; i++) {
      var idx = indices[i];
      var nextIdx = indices[i + 1];
      var itemModel = data.getItemModel(idx);

      if (orient === 'horizontal') {
        var width = getPieceHeight(itemModel.get(['itemStyle', 'width']), idx);
        setLayoutPoints(i, idx, nextIdx, width, x);
        x += width + gap;
      } else {
        var height = getPieceHeight(itemModel.get(['itemStyle', 'height']), idx);
        setLayoutPoints(i, idx, nextIdx, height, y);
        y += height + gap;
      }
    }

    labelLayout(data);

    if (showRate && !dynamicHeight && sort !== 'none') {
      rateLabelLayout(data);
    }
  });
}