import chartStatus from './status';
import { commonConfig } from '../../constant/index';
import { checkDragable } from '../utils';

let startX,
  startY,
  endX,
  endY = 0;

//线段门
export function getLineGateOpt(gate) {
  console.log(JSON.parse(gate.params));
  const points = JSON.parse(gate.params);
  const option = {
    id: gate.id,
    type: 'group',
    name: 'lineSegmentGate',
    draggable: checkDragable(gate),
    $action: 'replace',
    children: [
      {
        type: 'line',
        shape: {
          x1: points[0][0] + commonConfig.offsetLeftPixel,
          y1: points[0][1] + commonConfig.offsetTopPixel,
          x2: points[1][0] + commonConfig.offsetLeftPixel,
          y2: points[1][1] + commonConfig.offsetTopPixel,
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
          fill: gate.subs[0].color,
          stroke: gate.subs[0].color,
          lineWidth: 1,
        },
        z: 99999,
        zlevel: 3,
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
      endX = e.offsetX;
      endY = e.offsetY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      if (diffX == 0 && diffY == 0) {
        chartStatus.targetGate.status = 'stop';
      } else {
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
    },
  };

  if (chartStatus.mode == 'edit' && gate.id == chartStatus.editGateId) {
    JSON.parse(gate.params).forEach((point, index) => {
      option.children.push({
        id: `${gate.id}_${index}`,
        type: 'circle',
        x: point[0] + commonConfig.offsetLeftPixel,
        y: point[1] + commonConfig.offsetTopPixel,
        draggable: 'horizontal',
        shape: {
          r: 3,
        },
        zlevel: 4,
        ondragstart(e) {
          chartStatus.targetGate.gateId = e.target.parent.id;
        },
        ondrag(e) {
          chartStatus.targetGate.status = 'draging';
          chartStatus.targetGate.type = 'lineGate';
          const newPoints = JSON.parse(gate.params);
          newPoints[e.target.id.charAt(e.target.id.length - 1)][0] = e.offsetX - commonConfig.offsetLeftPixel;
          chartStatus.targetGate.movedPoints = newPoints;
          chartStatus.canExportData.value = true;
        },
      });
    });
  }

  return option;
}

//X、Y轴平行门
export function getVerticalLineGateOpt(gate) {
  const point = JSON.parse(gate.params);
  const option = {
    id: gate.id,
    name: 'lineGate',
    type: 'group',
    draggable: checkDragable(gate) ? 'horizontal' : false,
    cursor: checkDragable(gate) ? 'e-resize' : 'default',
    children: [
      {
        type: 'line',
        shape: {
          x1: point[0] + commonConfig.offsetLeftPixel,
          y1: point[1] + commonConfig.offsetTopPixel,
          x2: point[0] == 0 ? commonConfig.offsetLeftPixel : point[0] + commonConfig.offsetLeftPixel,
          y2:
            point[1] == 0
              ? commonConfig.gridHeight + commonConfig.offsetTopPixel
              : point[1] + commonConfig.offsetTopPixel,
        },
        z: 99999,
        zlevel: 3,
        cursor: checkDragable(gate) ? 'e-resize' : 'default',
      },
      {
        type: 'text',
        style: {
          text: gate.subs[0].value == '' ? [gate.subs[0].name + '\n'] : [gate.subs[0].name + '\n' + gate.subs[0].value],
          fill: gate.subs[0].color,
        },
        x: point[0],
        y: commonConfig.gridHeight / 2,
        z: 99999,
        cursor: checkDragable(gate) ? 'e-resize' : 'default',
        zlevel: 3,
      },
      {
        type: 'text',
        style: {
          text: gate.subs[1].value == '' ? [gate.subs[1].name + '\n'] : [gate.subs[1].name + '\n' + gate.subs[1].value],
          fill: gate.subs[1].color,
        },
        x: commonConfig.offsetLeftPixel + point[0] + 5,
        y: commonConfig.gridHeight / 2,
        z: 99999,
        cursor: checkDragable(gate) ? 'e-resize' : 'default',
        zlevel: 3,
      },
    ],
    ondragstart: (e) => {
      startX = e.offsetX;
      chartStatus.targetGate.status = 'drag';
      chartStatus.dragStart.value = true;
    },
    ondragend: (e) => {
      endX = e.offsetX;
      const diffX = endX - startX;

      if (diffX == 0) {
        chartStatus.targetGate.status = 'stop';
      } else {
        const moevEndX = diffX > 0 ? JSON.parse(gate.params)[0] + diffX : JSON.parse(gate.params)[0] - Math.abs(diffX);
        chartStatus.targetGate.gateId = e.target.id;
        chartStatus.targetGate.type = 'verticalLineGate';
        chartStatus.targetGate.status = 'dragEnd';
        //chartStatus.targetGate.movedPoints = [moevEndX, 0];
        console.log(moevEndX);
        if (moevEndX <= 0) {
          chartStatus.targetGate.movedPoints = [0, 0];
        } else {
          chartStatus.targetGate.movedPoints = [moevEndX, 0];
        }

        chartStatus.canExportData.value = true;
      }
    },
  };
  return option;
}
