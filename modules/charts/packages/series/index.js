import { h, onMounted, watch, onUnmounted } from "vue";
import { initChartsProps } from "../composables/use-charts.js";
import * as echarts from "echarts";
import { commonConfig } from "../constant/index";
import { getSeriesOpt } from "../composables/use-series.js";

export default {
	name: "series",
	props: {
		type: {
			type: String,
			default() {
				return "scatter";
			},
		},
		title: String,
		labels: Array,
		axisData: Array,
		seriesData: {
			default() {
				return [];
			},
		},
		...initChartsProps,
	},
	setup(props) {
		let myChart,
			baseOpt = null;

		const initChart = () => {
			const chartDom = document.getElementById(props.id);
			commonConfig.gridHeight = props.gridHeight;
			commonConfig.gridWidth = props.gridWidth;

			myChart = new echarts.init(chartDom, null, {
				width: props.gridWidth + commonConfig.chartAddWidth,
				height: props.gridHeight + commonConfig.chartAddHeight,
				renderer: props.renderer,
			});
		};

		onMounted(() => {
			initChart();
			baseOpt = getSeriesOpt(props);
			myChart.setOption(baseOpt);
		});

		onUnmounted(() => {
			myChart.dispose();
		});

		watch(
			() => props.seriesData,
			() => {
				baseOpt = getSeriesOpt(props);
				myChart.setOption(baseOpt);
			},
			{
				deep: true,
			}
		);

		return () => {
			return h("div", {
				id: props.id,
			});
		};
	},
};
