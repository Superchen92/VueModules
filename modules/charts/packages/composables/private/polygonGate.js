let startX,
  startY,
  endX,
  endY = 0;
import chartStatus from './status';
import { commonConfig } from '../../constant';
import { checkDragable } from '../utils';

//获取多边形门
export function getPolygonOpt(gate) {
  const polygonOpt = {
    id: gate.id,
    type: 'group',
    draggable: checkDragable(gate),
    children: [
      {
        type: 'polygon',
        $action: 'replace',
        shape: {
          points: JSON.parse(gate.params).map((point) => {
            point[0] = point[0] + commonConfig.offsetLeftPixel;
            point[1] = point[1] + commonConfig.offsetTopPixel;
            return point;
          }),
        },
        textContent: {
          type: 'text',
          style: {
            text:
              gate.subs[0].value == '' ? [gate.subs[0].name + '\n'] : [gate.subs[0].name + '\n' + gate.subs[0].value],
            fill: gate.subs[0].color,
          },
          cursor: checkDragable(gate) ? 'move' : 'default',
        },
        textConfig: {
          position: 'top',
          insideStroke: gate.subs[0].color,
        },
        style: {
          fill: 'black',
          opacity: 0.5,
          //stroke: "red",
          //lineWidth: chartStatus.mode === "edit" ? 0 : 2,
        },
        z: 99999,
        zlevel: 2,
        cursor: checkDragable(gate) ? 'move' : 'default',
      },
    ],
    ondragstart: (e) => {
      startX = e.offsetX;
      startY = e.offsetY;
      chartStatus.targetGate.status = 'drag';
      chartStatus.dragStart.value = true;
    },
    ondragend: (e) => {
      if (e.target.isGroup) {
        //结束拖拽后计算各个点的坐标
        endX = e.offsetX;
        endY = e.offsetY;
        if (startX == endX && startY == endY) {
          chartStatus.targetGate.status = 'stop';
        } else {
          const diffX = endX - startX;
          const diffY = endY - startY;
          chartStatus.targetGate.gateId = e.target.id;
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.movedPoints = JSON.parse(gate.params).map((point) => {
            const newPoint = [];
            newPoint[0] = diffX > 0 ? point[0] + diffX : point[0] - Math.abs(diffX);
            newPoint[1] = diffY > 0 ? point[1] + diffY : point[1] - Math.abs(diffY);
            return newPoint;
          });
          chartStatus.canExportData.value = true;
        }
      }
    },
  };

  if (gate.type == 'polygonsGate' && chartStatus.mode == 'edit' && gate.id == chartStatus.editGateId) {
    JSON.parse(gate.params).forEach((point, index) => {
      polygonOpt.children.push({
        id: `${gate.id}_${index}`,
        type: 'circle',
        x: point[0] + commonConfig.offsetLeftPixel,
        y: point[1] + commonConfig.offsetTopPixel,
        draggable: true,
        shape: {
          r: 3,
        },
        zlevel: 4,
        ondragstart(e) {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag(e) {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'polygonsGate';
          chartStatus.targetGate.movedPoints = JSON.parse(gate.params).map((point, index) => {
            if (`${gate.id}_${index}` == e.target.id) {
              return [e.offsetX - commonConfig.offsetLeftPixel, e.offsetY - commonConfig.offsetTopPixel];
            } else {
              return point;
            }
          });
          chartStatus.canExportData.value = true;
        },
        ondragend: (e) => {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'polygonsGate';
          chartStatus.targetGate.movedPoints = JSON.parse(gate.params).map((point, index) => {
            if (`${gate.id}_${index}` == e.target.id) {
              return [e.offsetX - commonConfig.offsetLeftPixel, e.offsetY - commonConfig.offsetTopPixel];
            } else {
              return point;
            }
          });
          chartStatus.canExportData.value = true;
        },
      });
    });
  }

  if (gate.type == 'rectGate' && chartStatus.mode == 'edit' && gate.id == chartStatus.editGateId) {
    //如果是矩形使用四条线来处理
    const pointsArr = JSON.parse(gate.params);
    if (pointsArr.length != 4) {
      return;
    }
    polygonOpt.children.push(
      {
        type: 'line',
        id: `${gate.id}_0`,
        shape: {
          x1: pointsArr[0][0] + commonConfig.offsetLeftPixel - 2,
          y1: pointsArr[0][1] + commonConfig.offsetTopPixel + 1,
          x2: pointsArr[1][0] + commonConfig.offsetLeftPixel + 2,
          y2: pointsArr[1][1] + commonConfig.offsetTopPixel + 1,
        },
        draggable: 'vertical',
        cursor: 'n-resize',
        style: {
          lineWidth: 2,
        },
        zlevel: 5,
        ondragstart: (e) => {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag: (e) => {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 0 || index == 1) {
              if (e.offsetY < 0) {
                return [point[0], 0];
              } else if (e.offsetY > commonConfig.gridHeight + commonConfig.offsetTopPixel) {
                return [point[0], commonConfig.gridHeight];
              } else {
                return [point[0], e.offsetY - commonConfig.offsetTopPixel];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
        ondragend(e) {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 0 || index == 1) {
              if (e.offsetY < 0) {
                return [point[0], 0];
              } else if (e.offsetY > commonConfig.gridHeight + commonConfig.offsetTopPixel) {
                return [point[0], commonConfig.gridHeight];
              } else {
                return [point[0], e.offsetY - commonConfig.offsetTopPixel];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
      },
      {
        type: 'line',
        id: `${gate.id}_1`,
        shape: {
          x1: pointsArr[1][0] + commonConfig.offsetLeftPixel + 1,
          y1: pointsArr[1][1] + commonConfig.offsetTopPixel,
          x2: pointsArr[2][0] + commonConfig.offsetLeftPixel + 1,
          y2: pointsArr[2][1] + commonConfig.offsetTopPixel,
        },
        draggable: 'horizontal',
        cursor: 'w-resize',
        zlevel: 2,
        style: {
          lineWidth: 2,
        },
        ondragstart: (e) => {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag: (e) => {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 1 || index == 2) {
              if (e.offsetX > commonConfig.gridWidth + commonConfig.offsetLeftPixel) {
                return [commonConfig.gridWidth, point[1]];
              } else if (e.offsetX < commonConfig.offsetLeftPixel) {
                return [0, point[1]];
              } else {
                return [e.offsetX - commonConfig.offsetLeftPixel, point[1]];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
        ondragend(e) {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 1 || index == 2) {
              if (e.offsetX > commonConfig.gridWidth + commonConfig.offsetLeftPixel) {
                return [commonConfig.gridWidth, point[1]];
              } else if (e.offsetX < commonConfig.offsetLeftPixel) {
                return [0, point[1]];
              } else {
                return [e.offsetX - commonConfig.offsetLeftPixel, point[1]];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
      },
      {
        type: 'line',
        id: `${gate.id}_2`,
        shape: {
          x1: pointsArr[2][0] + commonConfig.offsetLeftPixel + 2,
          y1: pointsArr[2][1] + commonConfig.offsetTopPixel - 1,
          x2: pointsArr[3][0] + commonConfig.offsetLeftPixel - 2,
          y2: pointsArr[3][1] + commonConfig.offsetTopPixel - 1,
        },
        draggable: 'vertical',
        cursor: 'n-resize',
        style: {
          lineWidth: 2,
        },
        zlevel: 2,
        ondragstart: (e) => {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag: (e) => {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 2 || index == 3) {
              if (e.offsetY < 0) {
                return [point[0], 0];
              } else if (e.offsetY > commonConfig.gridHeight + commonConfig.offsetTopPixel) {
                return [point[0], commonConfig.gridHeight];
              } else {
                return [point[0], e.offsetY - commonConfig.offsetTopPixel];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
        ondragend(e) {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 2 || index == 3) {
              if (e.offsetY < 0) {
                return [point[0], 0];
              } else if (e.offsetY > commonConfig.gridHeight + commonConfig.offsetTopPixel) {
                return [point[0], commonConfig.gridHeight];
              } else {
                return [point[0], e.offsetY - commonConfig.offsetTopPixel];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
      },
      {
        type: 'line',
        id: `${gate.id}_3`,
        shape: {
          x1: pointsArr[3][0] + commonConfig.offsetLeftPixel - 1,
          y1: pointsArr[3][1] + commonConfig.offsetTopPixel,
          x2: pointsArr[0][0] + commonConfig.offsetLeftPixel - 1,
          y2: pointsArr[0][1] + commonConfig.offsetTopPixel,
        },
        draggable: 'horizontal',
        cursor: 'w-resize',
        style: {
          lineWidth: 2,
        },
        zlevel: 2,
        ondragstart: (e) => {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag: (e) => {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 3 || index == 0) {
              if (e.offsetX > commonConfig.gridWidth + commonConfig.offsetLeftPixel) {
                return [commonConfig.gridWidth, point[1]];
              } else if (e.offsetX < commonConfig.offsetLeftPixel) {
                return [0, point[1]];
              } else {
                return [e.offsetX - commonConfig.offsetLeftPixel, point[1]];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
        ondragend(e) {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'rectGate';
          chartStatus.targetGate.movedPoints = pointsArr.map((point, index) => {
            if (index == 3 || index == 0) {
              if (e.offsetX > commonConfig.gridWidth + commonConfig.offsetLeftPixel) {
                return [commonConfig.gridWidth, point[1]];
              } else if (e.offsetX < commonConfig.offsetLeftPixel) {
                return [0, point[1]];
              } else {
                return [e.offsetX - commonConfig.offsetLeftPixel, point[1]];
              }
            }
            return point;
          });
          chartStatus.canExportData.value = true;
        },
      }
    );
  }

  return polygonOpt;
}

//获取编辑模式下的多边形
export function polygonHelpOpt(points) {
  const editPolygonOpt = {
    type: 'group',
    children: [],
  };

  if (points.length > 0) {
    points.forEach((point, index) => {
      editPolygonOpt.children.push({
        type: 'circle',
        x: point[0] + commonConfig.offsetLeftPixel,
        y: point[1] + commonConfig.offsetTopPixel,
        draggable: false,
        shape: {
          r: 3,
        },
        zlevel: 4,
        ondragstart(e) {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag(e) {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'polygonsGate';
          chartStatus.targetGate.movedPoints = JSON.parse(gate.params).map((point, index) => {
            if (`${gate.id}_${index}` == e.target.id) {
              return [e.offsetX - commonConfig.offsetLeftPixel, e.offsetY - commonConfig.offsetTopPixel];
            } else {
              return point;
            }
          });
          chartStatus.canExportData.value = true;
        },
        ondragend: (e) => {
          chartStatus.targetGate.status = 'dragEnd';
          chartStatus.targetGate.type = 'polygonsGate';
          chartStatus.targetGate.movedPoints = JSON.parse(gate.params).map((point, index) => {
            if (`${gate.id}_${index}` == e.target.id) {
              return [e.offsetX - commonConfig.offsetLeftPixel, e.offsetY - commonConfig.offsetTopPixel];
            } else {
              return point;
            }
          });
          chartStatus.canExportData.value = true;
        },
      });
    });
    editPolygonOpt.children.push({
      type: 'polyline',
      zlevel: 4,
      shape: {
        points: points.map((point) => {
          point[0] = point[0] + commonConfig.offsetLeftPixel;
          point[1] = point[1] + commonConfig.offsetTopPixel;
          return point;
        }),
      },
    });
    return editPolygonOpt;
  }
}
