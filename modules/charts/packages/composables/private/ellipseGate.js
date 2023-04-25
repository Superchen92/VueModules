let startX,
  startY,
  endX,
  endY,
  targetId = 0;
let gateObj = null;
let rotatedPoints = [];
import chartStatus from './status';
import { commonConfig } from '../../constant';
import { checkDragable } from '../utils';

//椭圆门
export function getEllipse(gate) {
  gateObj = JSON.parse(gate.params);
  const option = {
    id: gate.id,
    type: 'group',
    name: 'ellipseGate',
    draggable: checkDragable(gate),
    originX: gateObj.x + commonConfig.offsetLeftPixel,
    originY: gateObj.y + commonConfig.offsetTopPixel,
    //rotation: Math.PI / (180 / gateObj.angle),
    $action: 'replace',
    children: [
      {
        type: 'circle',
        x: gateObj.x + commonConfig.offsetLeftPixel,
        y: gateObj.y + commonConfig.offsetTopPixel,
        scaleX: gateObj.sx,
        scaleY: gateObj.sy,
        rotation: Math.PI / (180 / gateObj.angle),
        shape: {
          r: gateObj.r,
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
        },
        z: 99999,
        zlevel: 2,
        cursor: checkDragable(gate) ? 'move' : 'default',
      },
    ],
    ondragstart: (e) => {
      if (chartStatus.showRotateButton != '') return;
      startX = e.offsetX;
      startY = e.offsetY;
      chartStatus.targetGate.status = 'drag';
      chartStatus.dragStart.value = true;
    },
    ondragend: (e) => {
      if (chartStatus.showRotateButton != '') return;
      endX = e.offsetX;
      endY = e.offsetY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      if (diffX == 0 && diffY == 0) {
        chartStatus.targetGate.status = 'stop';
      } else {
        const circle = JSON.parse(gate.params);
        chartStatus.targetGate.gateId = e.target.id;
        chartStatus.targetGate.status = 'dragEnd';
        circle.x = diffX > 0 ? circle.x + diffX : circle.x - Math.abs(diffX);
        circle.y = diffY > 0 ? circle.y + diffY : circle.y - Math.abs(diffY);
        chartStatus.targetGate.movedPoints = circle;
        chartStatus.canExportData.value = true;
      }
    },
  };

  //编辑模式添加辅助道具
  if (chartStatus.mode == 'edit' && gate.id == chartStatus.editGateId) {
    const rectOption = calculateRect(gateObj);
    option.children.push(rectOption);
    const helpPointsOption = calculateHelpPoints(rectOption.shape.points);
    option.children.push(helpPointsOption);
    const rotateButton = calculateRotateButton(rectOption.shape.points);
    option.children.push(rotateButton);
  }

  return option;
}

//计算矩形框
function calculateRect(circleObj) {
  const rectLength = [
    [circleObj.x - circleObj.r * circleObj.sx, circleObj.y - circleObj.r * circleObj.sy],
    [circleObj.x + circleObj.r * circleObj.sx, circleObj.y - circleObj.r * circleObj.sy],
  ];
  const rectWidth = [
    [circleObj.x + circleObj.r * circleObj.sx, circleObj.y + circleObj.r * circleObj.sy],
    [circleObj.x - circleObj.r * circleObj.sx, circleObj.y + circleObj.r * circleObj.sy],
  ];
  const rectPoints = [
    ...rectLength,
    ...rectWidth,
    [circleObj.x - circleObj.r * circleObj.sx, circleObj.y - circleObj.r * circleObj.sy],
  ];

  const rectOption = {
    type: 'polyline',
    originX: circleObj.x + commonConfig.offsetLeftPixel,
    originY: circleObj.y + commonConfig.offsetTopPixel,
    rotation: Math.PI / (180 / gateObj.angle),
    shape: {
      points: rectPoints.map((point) => {
        point[0] += commonConfig.offsetLeftPixel;
        point[1] += commonConfig.offsetTopPixel;
        return point;
      }),
    },
  };
  return rectOption;
}

//计算辅助点
function calculateHelpPoints(points) {
  const helpPointsOption = {
    type: 'group',
    children: [],
    originX: gateObj.x + commonConfig.offsetLeftPixel,
    originY: gateObj.y + commonConfig.offsetTopPixel,
    rotation: Math.PI / (180 / gateObj.angle),
  };
  //points = [[159,79],[257,113],[257,193],[159,193]]
  points.forEach((point, index) => {
    if (index == 4) {
      return;
    } else {
      helpPointsOption.children.push({
        id: index,
        type: 'circle',
        x: point[0],
        y: point[1],
        shape: {
          r: 3,
        },
        zlevel: 3,
        draggable: true,

        ondragstart: (e) => {
          rotatedPoints = [];
          startX = e.offsetX;
          startY = e.offsetY;

          //移动开始时，获取旋转后的点坐标
          e.target.parent._children.forEach((pointInfo) => {
            const point = [];
            point.push(pointInfo.transform[4]);
            point.push(pointInfo.transform[5]);
            rotatedPoints.push(point);
          });
          chartStatus.targetGate.gateId = e.target.parent.parent.id;
        },
        ondrag: (e) => {
          chartStatus.targetGate.status = 'draging';
          const dragPoints = calculateDragPoints(e);
          chartStatus.targetGate.movedPoints = calculateCircle(dragPoints);
          chartStatus.canExportData.value = true;
        },
        ondragend: (e) => {
          chartStatus.targetGate.status = 'dragEnd';
          const dragPoints = calculateDragPoints(e);
          chartStatus.targetGate.movedPoints = calculateCircle(dragPoints);
          chartStatus.canExportData.value = true;
        },
      });
    }
  });
  helpPointsOption.children.push({
    id: '556655',
    type: 'circle',
    x: gateObj.x + commonConfig.offsetLeftPixel,
    y: gateObj.y + commonConfig.offsetTopPixel,
  });

  return helpPointsOption;
}

//计算旋转点
function calculateRotateButton(points) {
  const rotateButton = {
    type: 'group',
    children: [],
    zlevel: 3,
    originX: gateObj.x + commonConfig.offsetLeftPixel,
    originY: gateObj.y + commonConfig.offsetTopPixel,
    rotation: Math.PI / (180 / gateObj.angle),
  };
  points.forEach((point, index) => {
    if (index == 4) {
      return;
    } else {
      const rotateButtonOpt = {
        type: 'image',
        id: `rotate${index}`,

        style: {
          image:
            chartStatus.showRotateButton == `rotate${index}`
              ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOSA4bC00IDRoM2MwIDMuMzEtMi42OSA2LTYgNi0xLjAxIDAtMS45Ny0uMjUtMi44LS43bC0xLjQ2IDEuNDZDOC45NyAxOS41NCAxMC40MyAyMCAxMiAyMGM0LjQyIDAgOC0zLjU4IDgtOGgzbC00LTR6TTYgMTJjMC0zLjMxIDIuNjktNiA2LTYgMS4wMSAwIDEuOTcuMjUgMi44LjdsMS40Ni0xLjQ2QzE1LjAzIDQuNDYgMTMuNTcgNCAxMiA0Yy00LjQyIDAtOCAzLjU4LTggOEgxbDQgNCA0LTRINnoiLz48L3N2Zz4='
              : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0iI0Q2RDZENiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOSA4bC00IDRoM2MwIDMuMzEtMi42OSA2LTYgNi0xLjAxIDAtMS45Ny0uMjUtMi44LS43bC0xLjQ2IDEuNDZDOC45NyAxOS41NCAxMC40MyAyMCAxMiAyMGM0LjQyIDAgOC0zLjU4IDgtOGgzbC00LTR6TTYgMTJjMC0zLjMxIDIuNjktNiA2LTYgMS4wMSAwIDEuOTcuMjUgMi44LjdsMS40Ni0xLjQ2QzE1LjAzIDQuNDYgMTMuNTcgNCAxMiA0Yy00LjQyIDAtOCAzLjU4LTggOEgxbDQgNCA0LTRINnoiLz48L3N2Zz4=',
          opacity: chartStatus.showRotateButton == `rotate${index}` ? 1 : 0.1,
          x: point[0],
          y: point[1],
        },
        zlevel: 3,
      };

      if (index == 0) {
        rotateButtonOpt.style.x = point[0] - 20;
        rotateButtonOpt.style.y = point[1] - 20;
      }
      if (index == 1) {
        rotateButtonOpt.style.y = point[1] - 20;
      }
      if (index == 2) {
        rotateButtonOpt.style.y = point[1] + 5;
      }
      if (index == 3) {
        rotateButtonOpt.style.x = point[0] - 20;
        rotateButtonOpt.style.y = point[1] + 5;
      }
      rotateButton.children.push(rotateButtonOpt);
    }
  });

  return rotateButton;
}

//计算拖动点
function calculateDragPoints(e) {
  targetId = Number(e.target.id);
  endX = e.offsetX;
  endY = e.offsetY;
  const diffX = endX - startX;
  const diffY = endY - startY;
  const newHelpPoints = JSON.parse(JSON.stringify(rotatedPoints));

  newHelpPoints[targetId][0] =
    diffX > 0 ? newHelpPoints[targetId][0] + diffX : newHelpPoints[targetId][0] - Math.abs(diffX);
  newHelpPoints[targetId][1] =
    diffY > 0 ? newHelpPoints[targetId][1] + diffY : newHelpPoints[targetId][1] - Math.abs(diffY);

  return newHelpPoints;
}

//计算圆
function calculateCircle(points) {
  //console.log(points)
  let r,
    sx,
    sy,
    disX,
    disY = 0;
  if (targetId == 0) {
    disX = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[targetId + 1][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[targetId + 1][1]), 2)
    );
    disY = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[3][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[3][1]), 2)
    );
  } else if (targetId == 3) {
    disY = Math.sqrt(
      Math.pow(Math.abs(points[0][0] - points[targetId][0]), 2) +
        Math.pow(Math.abs(points[0][1] - points[targetId][1]), 2)
    );
    disX = Math.sqrt(
      Math.pow(Math.abs(points[targetId - 1][0] - points[targetId][0]), 2) +
        Math.pow(Math.abs(points[targetId - 1][1] - points[targetId][1]), 2)
    );
  } else if (targetId == 1) {
    disY = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[targetId + 1][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[targetId + 1][1]), 2)
    );
    disX = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[targetId - 1][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[targetId - 1][1]), 2)
    );
  } else {
    disX = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[targetId + 1][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[targetId + 1][1]), 2)
    );
    disY = Math.sqrt(
      Math.pow(Math.abs(points[targetId][0] - points[targetId - 1][0]), 2) +
        Math.pow(Math.abs(points[targetId][1] - points[targetId - 1][1]), 2)
    );
  }

  if (disY > disX) {
    r = disX / 2;
  } else {
    r = disY / 2;
  }

  sx = disX / 2 / r;
  sy = disY / 2 / r;

  const circleObj = {
    // x: (points[0][0] + disX / 2) - commonConfig.offsetLeftPixel,
    // y: (points[0][1] + disY / 2) - commonConfig.offsetTopPixel,
    x: points[4][0] - commonConfig.offsetLeftPixel,
    y: points[4][1] - commonConfig.offsetTopPixel,
    r: r,
    sx: sx,
    sy: sy,
    angle: gateObj.angle,
  };
  //console.log(circleObj)
  return circleObj;
}
