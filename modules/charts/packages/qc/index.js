import { h, onMounted } from "vue";
import { initChartsProps } from "../composables/use-charts.js";
import * as echarts from "echarts";
import { commonConfig } from "../constant/index";
import { getQcOpt } from "../composables/use-charts.js";

export default {
	name: "qc",
	props: {
		type: {
			type: String,
			default() {
				return "scatter";
			},
		},
		...initChartsProps,
		limitLineColor: String,
		cvs: Array,
		cvsLabel: Array,
		medians: Array,
		mediansLabel: Array,
		max: Number,
		min: Number,
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

			baseOpt = getQcOpt(props);
			baseOpt.series = [];

			//绘制cvs
			baseOpt.series.push({
				type: "line",
				name: "cvs",
				data: props.cvs,
				lineStyle: {
					color: "#0078d4",
				},
				tooltip: {
					formatter: (obj) => {
						return props.cvsLabel[obj.dataIndex].toString();
					},
				},
			});

			//绘制medians
			//console.log(props.medians)
			baseOpt.series.push({
				type: "line",
				name: "medians",
				data: props.medians,
				lineStyle: {
					color: "#00a870",
				},
				tooltip: {
					formatter: (obj) => {
						return props.mediansLabel[obj.dataIndex].toString();
					},
				},
			});

			//绘制高低线
			console.log(props.max)
			baseOpt.series.push({
				type: "line",
				markLine: {
					silent: true,
					symbol: false,
					animation: false,
					lineStyle: {
						color: props.limitLineColor,
						type: "dashed",
					},
					label: {
						show: false,
					},
					data: [
						{
							yAxis: props.max,
						},
						{
							yAxis: props.min,
						},
					],
				},
			});

			myChart.setOption(baseOpt);
		};

		onMounted(() => {
			initChart();
		});

		return () => {
			return h("div", {
				id: props.id,
			});
		};
	},
};
