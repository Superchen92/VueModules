import { getPolygonOpt, polygonHelpOpt } from "./private/polygonGate";
import { getCrossGateOpt } from "./private/crossGate";
import { getEllipse } from "./private/ellipseGate";
import { getLineGateOpt, getVerticalLineGateOpt } from "./private/lineGate";
import { commonConfig } from "../constant/index";

//初始化
const gateMethods = new Map();
gateMethods.set("rectGate", (gate) => {
	return getPolygonOpt(gate);
});
gateMethods.set("polygonsGate", (gate) => {
	return getPolygonOpt(gate);
});
gateMethods.set("crossGate", (gate) => {
	return getCrossGateOpt(gate);
});
gateMethods.set("ellipseGate", (gate) => {
	return getEllipse(gate);
});
gateMethods.set("verticalLineGate", (gate) => {
	return getVerticalLineGateOpt(gate);
});
gateMethods.set("lineSegmentGate", (gate) => {
	return getLineGateOpt(gate);
});

//获取门配置
export function getGatesOpt(gates) {
	const gatesOpt = {
		name: "gates",
		type: "group",
		children: [],
	};

	if (gates && gates.length > 0) {
		gates.forEach((gate) => {
			gatesOpt.children.push(gateMethods.get(gate.type)(gate));
		});
	}

	return gatesOpt;
}

//获取门编辑辅助配置
export function getGatesHelp(gateHelp) {
	const gateHelpOpt = {
		name: "gatesHelp",
		type: "group",
		children: [],
	};
	gateHelpOpt.children.push(polygonHelpOpt(gateHelp));
	return gateHelpOpt;
}

//绘制X轴坐标轴标签
export function getAxisXlabel(axisX) {
	const labels = {
		name: "axisX",
		type: "group",
		cursor: "default",
		children: [],
	};
	labels.children.push(getAxisXname(axisX.name, axisX.unit));
	axisX.scales.forEach((label) => {
		if (label.text === "") {
			labels.children.push(getXmicroTick(label));
		} else {
			labels.children.push(getXTick(label));
		}
	});
	return labels;
}

//获取X轴名称
const getAxisXname = (name, unit) => {
	return {
		type: "group",
		children: [
			{
				type: "text",
				x: commonConfig.gridWidth / 2,
				y: commonConfig.gridHeight + commonConfig.offsetTopPixel + 25,
				style: {
					text: name,
					font: '13px "STHeiti", sans-serif',
				},
				cursor: "default",
			},
			{
				type: "text",
				x: commonConfig.gridWidth + 15,
				y: commonConfig.gridHeight + commonConfig.offsetTopPixel + 25,
				style: {
					text: unit,
					font: '13px "STHeiti", sans-serif',
				},
				cursor: "default",
			},
		],
	};
};

//获取X轴小刻度
const getXmicroTick = (label) => {
	return {
		type: "group",
		x: label.position + commonConfig.offsetLeftPixel,
		y: commonConfig.gridHeight + commonConfig.offsetTopPixel,
		cursor: "default",
		children: [
			{
				type: "line",
				shape: {
					x: 0,
					y: 0,
					x1: 0,
					y1: 5,
				},
				style: {
					lineWidth: 1,
				},
				cursor: "default",
			},
		],
	};
};

//获取X轴大刻度
const getXTick = (label) => {
	const numArr = label.text.split("^");
	return {
		type: "group",
		x: label.position + commonConfig.offsetLeftPixel,
		y: commonConfig.gridHeight + commonConfig.offsetTopPixel,
		cursor: "default",
		children: [
			{
				type: "line",
				shape: {
					x: 0,
					y: 0,
					x1: 0,
					y1: 7,
				},
				style: {
					lineWidth: 1,
				},
				cursor: "default",
			},
			{
				type: "group",
				x: numArr.length > 1 ? -10 : -4,
				y: 8,
				cursor: "default",
				children: [
					{
						type: "text",
						y: 2,
						style: {
							text: numArr[0],
							font: '13px "STHeiti", sans-serif',
						},
						cursor: "default",
					},
					{
						type: "text",
						x: 16,
						y: 0,
						style: {
							text: numArr[1],
							font: '8px "STHeiti", sans-serif',
						},
						cursor: "default",
					},
				],
			},
		],
	};
};

//绘制Y轴坐标轴
export function getAxisYlabel(axisY) {
	const labels = {
		name: "axisY",
		type: "group",
		children: [],
		cursor: "default",
	};
	labels.children.push(getAxisYname(axisY.name, axisY.unit));
	axisY.scales.forEach((label) => {
		if (label.text === "") {
			labels.children.push(getYmicroTick(label));
		} else {
			labels.children.push(getYTick(label));
		}
	});
	return labels;
}

//获取Y轴名称
const getAxisYname = (name, unit) => {
	return {
		type: "group",
		children: [
			{
				type: "text",
				x: 0,
				y: (commonConfig.gridHeight + commonConfig.chartAddHeight) / 2,
				style: {
					text: `${name}`,
					font: '13px "STHeiti", sans-serif',
				},
				cursor: "default",
				rotation: Math.PI / 2,
			},
			{
				type: "text",
				x: 0,
				y: commonConfig.offsetTopPixel + 30,
				style: {
					text: `${unit}`,
					font: '13px "STHeiti", sans-serif',
				},
				cursor: "default",
				rotation: Math.PI / 2,
			},
		],
	};
};

//获取Y轴小刻度
const getYmicroTick = (label) => {
	return {
		type: "group",
		x: commonConfig.offsetLeftPixel - 5,
		y: label.position + commonConfig.offsetTopPixel,
		cursor: "default",
		children: [
			{
				type: "line",
				shape: {
					x: 0,
					y: 0,
					x1: 5,
					y1: 0,
				},
				style: {
					lineWidth: 1,
				},
				cursor: "default",
			},
		],
	};
};

//获取Y轴大刻度
const getYTick = (label) => {
	const numArr = label.text.split("^");
	return {
		type: "group",
		x: commonConfig.offsetLeftPixel - 7,
		y: label.position + commonConfig.offsetTopPixel,
		cursor: "default",
		children: [
			{
				type: "line",
				shape: {
					x: 0,
					y: 0,
					x1: 7,
					y1: 0,
				},
				style: {
					lineWidth: 1,
				},
				cursor: "default",
			},
			{
				type: "group",
				x: -18,
				y: -6,
				cursor: "default",
				children: [
					{
						type: "text",
						y: 2,
						style: {
							text: numArr[0],
							font: '13px "STHeiti", sans-serif',
						},
						cursor: "default",
					},
					{
						type: "text",
						x: 16,
						y: 0,
						style: {
							text: numArr[1],
							font: '8px "STHeiti", sans-serif',
						},
						cursor: "default",
					},
				],
			},
		],
	};
};
