import { h, onMounted, watch } from 'vue';
import { getInitChartOpt, initChartsProps } from '../composables/use-charts.js';
import { getGatesHelp, getGatesOpt, getAxisXlabel, getAxisYlabel } from '../composables/use-graphic.js';
import { getScatterPointsOpt, getHistogramPointsOpt } from '../composables/use-points.js';
import * as echarts from 'echarts';
import chartStatus from '../composables/private/status';
import { commonConfig } from '../constant/index';
export default {
  name: 'charts',
  emits: ['move-end', 'select-target', 'get-click-point', 'drag-start'],
  props: {
    type: {
      type: String,
      default() {
        return 'scatter';
      },
    },
    ...initChartsProps,
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    editGateId: String,
    gates: Array,
    mode: {
      type: String,
      default() {
        return 'readOnly';
      },
    },
  },
  setup(props, { emit }) {
    let myChart,
      baseOpt = null;
    //初始化表格
    const initChart = () => {
      const chartDom = document.getElementById(props.id);
      myChart = new echarts.init(chartDom, null, {
        width: props.gridWidth + commonConfig.chartAddWidth,
        height: props.gridHeight + commonConfig.chartAddHeight,
        renderer: props.renderer,
        devicePixelRatio: Window.devicePixelRatio,
      });
      commonConfig.gridHeight = props.gridHeight;
      commonConfig.gridWidth = props.gridWidth;
      baseOpt = getInitChartOpt(props);
      chartStatus.mode = props.mode;
      if (props.axisX && props.axisY) {
        baseOpt.graphic[0] = getAxisXlabel(props?.axisX);
        baseOpt.graphic[1] = getAxisYlabel(props?.axisY);
      }

      myChart.setOption(baseOpt, {
        replaceMerge: ['graphic'],
      });

      //编辑模式开启全局点击事件
      bindEvent(props.mode);
    };

    //更新点数据
    const updateScatter = () => {
      if (props.data.points) {
        myChart.setOption(
          {
            series:
              props.type == 'scatter' || props.type == 'scatterColor'
                ? getScatterPointsOpt(props.data.points)
                : getHistogramPointsOpt(props.data.points),
          },
          {
            replaceMerge: ['series'],
          }
        );
      }
    };

    //更新门结果数据
    const updateGatesResults = (results) => {
      chartStatus.mode = props.mode;
      chartStatus.editGateId = props.editGateId;
      //因为不是实时回传数据，所以需要判断重绘时机
      if (['stop', 'dragEnd', 'draging'].indexOf(chartStatus.targetGate.status) >= 0 && Array.isArray(results)) {
        const commonGates = [];
        baseOpt.graphic.splice(3, 1);
        results.forEach((item) => {
          commonGates.push(item);
        });
        baseOpt.graphic[2] = getGatesOpt(commonGates);
        myChart.setOption(
          {
            graphic: baseOpt.graphic,
          },
          {
            replaceMerge: ['graphic'],
          }
        );
      }
    };

    //挂载时初始化表格绑定表格事件
    onMounted(() => {
      initChart();
      updateScatter();
      updateGatesResults(props.gates);
    });

    //监听点变化
    watch(
      () => props.data.points,
      (v) => {
        if (v) {
          updateScatter();
          updateGatesResults(props.data.gates);
        }
      },
      {
        deep: true,
      }
    );

    //监听门变化
    watch(
      () => props.gates,
      (v) => {
        if (v) {
          updateGatesResults(v);
        }
      },
      {
        deep: true,
      }
    );

    //X、Y轴发生变化时，重绘
    watch(
      () => [props.axisY, props.axisX],
      () => {
        if (props.axisX && props.axisY) {
          baseOpt.graphic[0] = getAxisXlabel(props?.axisX);
          baseOpt.graphic[1] = getAxisYlabel(props?.axisY);
        }

        myChart.setOption(baseOpt, {
          replaceMerge: ['graphic'],
        });
      }
    );

    //监听事件
    watch(chartStatus.canExportData, (v) => {
      if (v && props.mode != 'readOnly') {
        if (!props.gates) {
          chartStatus.canExportData.value = false;
        }
        props.gates?.forEach((element) => {
          if (element.id == chartStatus.targetGate.gateId) {
            const obj = {
              gateId: chartStatus.targetGate.gateId,
              movedPoints: JSON.stringify(chartStatus.targetGate.movedPoints),
              status: chartStatus.targetGate.status,
            };
            emit('move-end', obj);
            chartStatus.canExportData.value = false;
          }
        });
      }
    });

    //开始移动
    watch(chartStatus.dragStart, (v) => {
      if (v) {
        emit('drag-start', '');
      }
      chartStatus.dragStart.value = false;
    });

    //监听模式变化
    watch(
      () => props.mode,
      (v) => {
        myChart.getZr().off('click');
        bindEvent(v);
      }
    );

    watch(
      () => props.editGateId,
      () => {
        updateGatesResults(props.gates);
      }
    );

    //绑定事件
    const bindEvent = (mode) => {
      if (mode == 'create') {
        myChart.getZr().off('mouseover');
        const points = [];
        myChart.getZr().on('click', (e) => {
          if (props.editGateId != '' && props.id.split('-')[1] == props.editGateId.split('_')[0]) {
            const clickPoint = [e.offsetX - commonConfig.offsetLeftPixel, e.offsetY - commonConfig.offsetTopPixel];
            points.push(clickPoint);

            const clonePoints = JSON.parse(JSON.stringify(points));
            baseOpt.graphic[3] = getGatesHelp(clonePoints);
            console.log(clonePoints);

            myChart.setOption(
              {
                graphic: baseOpt.graphic,
              },
              {
                replaceMerge: ['graphic'],
              }
            );
            if (points.length > 3) {
              const diffX = clickPoint[0] - points[0][0];
              const diffY = clickPoint[1] - points[0][1];
              if (Math.abs(diffX) <= 5 && Math.abs(diffY) <= 5) {
                points.splice(points.length - 1, 1);
                emit('get-click-point', points);
              }
            }
          }
        });
      } else {
        if (mode == 'edit') {
          //编辑模式开启全局点击事件
          myChart.getZr().on('click', (e) => {
            let targetId = '';
            if (e.target) {
              if (e.target.id.toString().indexOf('_') > 0) {
                targetId = e.target.id;
              } else {
                targetId = e.target.parent.id;
              }
              emit('select-target', targetId);
            }
          });

          let rotatepoint = [];
          myChart.getZr().on('mouseover', (e) => {
            if (!chartStatus.canMoveRotateButton) {
              chartStatus.showRotateButton = '';
              updateGatesResults(props.gates);
            }

            if (e.target.id.toString().indexOf('rotate') == 0) {
              chartStatus.showRotateButton = e.target.id;
              updateGatesResults(props.gates);
            }
          });

          let circleObj = null;
          myChart.getZr().on('mousemove', (e) => {
            if (chartStatus.canMoveRotateButton) {
              if (rotatepoint[0] == e.offsetX && rotatepoint[1] == e.offsetY) {
                return;
              } else {
                const gates = [];
                if (!Array.isArray(props.gates)) {
                  return;
                }
                props.gates.forEach((gate, index) => {
                  gates.push(gate);
                  if (gate.id == props.editGateId) {
                    circleObj = JSON.parse(gates[index].params);
                    const startAngle =
                      Math.atan2(
                        circleObj.y + commonConfig.offsetTopPixel - rotatepoint[1],
                        rotatepoint[0] - (circleObj.x + commonConfig.offsetLeftPixel)
                      ) *
                      (180 / Math.PI);
                    const moveAngle =
                      Math.atan2(
                        circleObj.y + commonConfig.offsetTopPixel - e.offsetY,
                        e.offsetX - (circleObj.x + commonConfig.offsetLeftPixel)
                      ) *
                      (180 / Math.PI);
                    const diffAngle = moveAngle - startAngle;
                    circleObj.angle += diffAngle;
                    gates[index].params = JSON.stringify(circleObj);
                  }
                });
                rotatepoint = [e.offsetX, e.offsetY];
                updateGatesResults(gates);
              }
            }
          });

          myChart.getZr().on('mousedown', (e) => {
            //console.log(e)
            if (!e.target) return;
            if (e.target.id === chartStatus.showRotateButton) {
              rotatepoint = [e.offsetX, e.offsetY];
              chartStatus.canMoveRotateButton = true;
            }
          });

          myChart.getZr().on('mouseup', (e) => {
            if (chartStatus.showRotateButton != '') {
              chartStatus.showRotateButton = '';
              chartStatus.canMoveRotateButton = false;
              console.log(circleObj);
              if (circleObj) {
                const obj = {
                  gateId: chartStatus.editGateId,
                  movedPoints: JSON.stringify(circleObj),
                  status: 'dragEnd',
                };
                emit('move-end', obj);
                circleObj = null;
              }
              updateGatesResults(props.gates);
            }
          });
        }
      }
      updateGatesResults(props.gates);
    };

    return () => {
      return h('div', {
        id: props.id,
      });
    };
  },
};
