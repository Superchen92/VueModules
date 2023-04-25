import { commonConfig } from "../constant/index";
export const initChartsProps = {
	id: {
		type: [Number, String],
		required: true,
	},
	renderer: {
		type: String,
		default() {
			return "canvas";
		},
	},
	gridWidth: {
		type: Number,
		default() {
			return 260;
		},
	},
	gridHeight: {
		type: Number,
		default() {
			return 220;
		},
	},
	axisX: Object,
	axisY: Object,
};

//初始化表
export function getInitChartOpt(chartOpt) {
	const option = {
		grid: {
			top: commonConfig.offsetTopPixel,
			left: commonConfig.offsetLeftPixel,
			right: commonConfig.offsetRightPixel,
			width: chartOpt.gridWidth,
			height: chartOpt.gridHeight,
		},
		xAxis: {
			min: 0,
			max: chartOpt.gridWidth,
			minorTick: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: false,
			},
			axisTick: {
				show: false,
			},
		},
		yAxis: {
			min: 0,
			max: chartOpt.gridHeight,
			minorTick: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: false,
			},
			axisTick: {
				show: false,
			},
		},
		graphic: [],
	};
	return option;
}

//获取QC图基础配置
export function getQcOpt(chartOpt) {
	return {
		grid: {
			top: commonConfig.offsetTopPixel,
			left: commonConfig.offsetLeftPixel,
			right: commonConfig.offsetRightPixel,
			width: commonConfig.gridWidth - 20,
			height: commonConfig.gridHeight,
			containLabel: true
		},
		xAxis: {
			minorTick: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: true,
			},
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},
			boundaryGap: false,
			type: chartOpt.axisX.type,
			data:
				chartOpt.axisX.data.length === 1
					? [chartOpt.axisX.data[0], ""]
					: chartOpt.axisX.data,
		},
		yAxis: {
			max: 3,
			min: -3,
			minorTick: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: false,
			},
			axisTick: {
				show: false,
			},
		},
		tooltip: {
			trigger: "item",
		},
	};
}
