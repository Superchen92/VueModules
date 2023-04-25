import { commonConfig } from '../../constant';
import chartStatus from './status';
import { checkDragable } from '../utils';

let verticalStartY,
  verticalEndY,
  horizontalStartX,
  horizontalEndX = 0;

//获取十字门
export function getCrossGateOpt(gate) {
  const points = JSON.parse(gate.params);
  const option = {
    id: gate.id,
    type: 'group',
    name: 'crossGate',
    children: [
      {
        type: 'line',
        $action: 'replace',
        draggable: checkDragable(gate) ? 'vertical' : false,
        shape: {
          x1: commonConfig.offsetLeftPixel,
          y1: points[1] + commonConfig.offsetTopPixel,
          x2: commonConfig.gridWidth + commonConfig.offsetLeftPixel,
          y2: points[1] + commonConfig.offsetTopPixel,
        },
        style: {
          stroke: 'black',
          lineWidth: 1,
        },
        z: 99999,
        zlevel: 2,
        cursor: checkDragable(gate) ? 'n-resize' : 'default',
        ondragstart: (e) => {
          verticalStartY = e.offsetY;
          chartStatus.targetGate.status = 'drag';
          chartStatus.dragStart.value = true;
        },
        ondragend: (e) => {
          verticalEndY = e.offsetY;
          const diffY = verticalEndY - verticalStartY;
          if (diffY == 0) {
            chartStatus.targetGate.status = 'stop';
          } else {
            chartStatus.targetGate.gateId = gate.id;
            chartStatus.targetGate.type = 'crossGate';
            chartStatus.targetGate.status = 'dragEnd';
            chartStatus.targetGate.movedPoints = (() => {
              const newPoint = [];
              newPoint[0] = points[0];
              newPoint[1] = diffY > 0 ? points[1] + diffY : points[1] - Math.abs(diffY);
              return newPoint;
            })();
            chartStatus.canExportData.value = true;
          }
        },
      },
      {
        type: 'line',
        $action: 'replace',
        draggable: checkDragable(gate) ? 'horizontal' : false,
        shape: {
          x1: points[0] + commonConfig.offsetLeftPixel,
          y1: commonConfig.gridHeight + commonConfig.offsetTopPixel,
          x2: points[0] + commonConfig.offsetLeftPixel,
          y2: commonConfig.offsetTopPixel,
        },
        style: {
          stroke: 'black',
          lineWidth: 1,
        },
        z: 99999,
        zlevel: 2,
        cursor: checkDragable(gate) ? 'e-resize' : 'default',
        ondragstart: (e) => {
          horizontalStartX = e.offsetX;
          chartStatus.targetGate.status = 'drag';
          chartStatus.dragStart.value = true;
        },
        ondragend: (e) => {
          horizontalEndX = e.offsetX;
          const diffX = horizontalEndX - horizontalStartX;
          if (diffX == 0) {
            chartStatus.targetGate.status = 'stop';
          } else {
            chartStatus.targetGate.gateId = gate.id;
            chartStatus.targetGate.type = 'crossGate';
            chartStatus.targetGate.status = 'dragEnd';
            chartStatus.targetGate.movedPoints = (() => {
              const newPoint = [];
              newPoint[1] = points[1];
              newPoint[0] = diffX > 0 ? points[0] + diffX : points[0] - Math.abs(diffX);
              return newPoint;
            })();
            chartStatus.canExportData.value = true;
          }
        },
      },
      {
        type: 'text',
        $action: 'replace',
        style: {
          text: gate.subs[0].value == '' ? gate.subs[0].name + '\n' : gate.subs[0].name + '\n' + gate.subs[0].value,
          fill: gate.subs[0].color,
        },
        x: commonConfig.offsetLeftPixel + 5,
        y: commonConfig.offsetTopPixel,
        z: 99999,
        zlevel: 2,
        cursor: 'default',
      },
      {
        type: 'text',
        $action: 'replace',
        style: {
          text: gate.subs[1].value == '' ? gate.subs[1].name + '\n' : gate.subs[1].name + '\n' + gate.subs[1].value,
          fill: gate.subs[1].color,
        },
        x: commonConfig.gridWidth,
        y: commonConfig.offsetTopPixel,
        z: 99999,
        zlevel: 2,
        cursor: 'default',
      },
      {
        type: 'text',
        $action: 'replace',
        style: {
          text: gate.subs[2].value == '' ? gate.subs[2].name + '\n' : gate.subs[2].name + '\n' + gate.subs[2].value,
          fill: gate.subs[2].color,
        },
        x: commonConfig.gridWidth,
        y: commonConfig.gridHeight - 5,
        z: 99999,
        zlevel: 2,
        cursor: 'default',
      },
      {
        type: 'text',
        $action: 'replace',
        style: {
          text: gate.subs[3].value == '' ? gate.subs[3].name + '\n' : gate.subs[3].name + '\n' + gate.subs[3].value,
          fill: gate.subs[3].color,
        },
        x: commonConfig.offsetLeftPixel + 5,
        y: commonConfig.gridHeight - 5,
        z: 99999,
        zlevel: 2,
        cursor: 'default',
      },
    ],
  };
  return option;
}
