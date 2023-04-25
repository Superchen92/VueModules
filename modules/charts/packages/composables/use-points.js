//散点图加载点
export function getScatterPointsOpt(points) {
	const pointsOpt = [];
	points.forEach((point, index) => {
		const pointObj = {
			symbol: "rect",
			symbolSize: 1,
			data: point.values,
			type: "scatter",
			itemStyle: {
				color: point.color,
				opacity: 1,
			},
			large: true,
			largeThreshold: true,
			progressive: 0,
			z: 1,
			zlevel: 1,
		};
		pointsOpt.push(pointObj);
	});
	return pointsOpt;
}

//加载直方图点
export function getHistogramPointsOpt(points) {
	const pointsOpt = [];
	points.forEach((point, index) => {
		const pointObj = {
			type: "line",
			data: point.values,
			smooth: true,
			symbol: "none",
			areaStyle: {
				color: point.color,
				cursor: "default",
			},
			lineStyle: {
				color: point.color,
				width: 0,
			},
			animation: false,
			z: 1,
			zlevel: 1,
			emphasis: {
				disabled: false,
			},
		};
		pointsOpt.push(pointObj);
	});
	return pointsOpt;
}
