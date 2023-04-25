const seriesMap = new Map();
seriesMap.set("lines", (chart) => {
	return getLinesConf(chart);
});
seriesMap.set("pie", (chart) => {
	return getPieConf(chart);
});
seriesMap.set("bars", (chart) => {
	return getBarsConf(chart);
});

export function getSeriesOpt(chart) {
	return seriesMap.get(chart.type)(chart);
}

//获取折线图配置
function getLinesConf(chart) {
	return {
		title: {
			text: chart.title,
			textStyle: {
				color: "#fff",
			},
		},
		legend: {
			data: chart.labels,
			align: "right",
			right: 0,
			textStyle: {
				color: "white",
			},
		},

		xAxis: {
			type: "category",
			boundaryGap: false,
			data: chart.axisData,
		},
		yAxis: {
			show: false,
			type: "value",
		},
		series: chart.seriesData.map((serie) => {
			return {
				name: serie.label,
				type: "line",
				lineStyle: {
					type: "solid",
					color: serie.color,
				},
				animation: false,
				smooth: true,
				label: { show: true, color: "#fff" },
				areaStyle: serie.areaStyle ? {} : null,
				data: serie.data,
			};
		}),
	};
}

//获取饼图配置
function getPieConf(chart) {
	return {
		title: {
			text: chart.title,
			textStyle: {
				color: "#fff",
			},
		},
		series: [
			{
				type: "pie",
				radius: [5, 50],
				label: {
					show: true,
					position: "outside",
					color: "white",
					textBorderWidth: 0,
					formatter: "{b}: \n{number|{d}}%\n{c}",
					rich: {
						number: {
							lineHeight: 20,
						},
					},
				},
				data: chart.seriesData,
			},
		],
	};
}

//获取柱状图配置
function getBarsConf(chart) {
	return {
		title: {
			text: chart.title,
			textStyle: {
				color: "#fff",
			},
		},
		legend: {
			textStyle: {
				color: "white",
			},
			align: "right",
			right: 10,
			top: 20,
		},
		xAxis: {
			type: "value",
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			splitLine: {
				show: false,
			},
			show: true,
			axisLabel: { show: true },
			type: "category",
			data: chart.axisData,
		},
		series: chart.seriesData.map((item) => {
			return {
				type: "bar",
				name: item.name,
				data: item.data,
				barWidth: item.width,
				label: {
					color: "#fff",
					show: item.showlabel,
					position: "outside",
				},
			};
		}),
	};
}
