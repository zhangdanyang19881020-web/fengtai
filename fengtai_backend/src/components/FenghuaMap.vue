<template>
	<div ref="chartRef" class="map-container"></div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount
	} from "vue";
	import * as echarts from "echarts";

	const chartRef = ref(null);
	let chartInstance = null;

	const initChart = async () => {
		// 加载 GeoJSON
		const res = await fetch("./data/330213.geojson");
		const geoJson = await res.json();

		// 注册地图
		echarts.registerMap("fenghua", geoJson);

		chartInstance = echarts.init(chartRef.value);

		const option = {
			tooltip: {
				trigger: "item",
				// formatter: "{b} 台胞100人", // 显示镇/街道名称
				formatter: function(params) {
					// params.name 是镇/街道名称
					const randomNum = Math.floor(Math.random() * 5000) + 1; // 随机人数 500~5500
					return `${params.name} 台胞${randomNum} 人`;
				}
			},
			series: [{
				type: "map",
				map: "fenghua",
				label: {
					show: true,
					fontSize: 12,
					color: "#333",
				},
				itemStyle: {
					areaColor: "#fdf6e3", // 背景色
					borderColor: "#8b5e3c", // 边界色
				},
				emphasis: {
					label: {
						color: "#000",
						fontWeight: "bold"
					},
					itemStyle: {
						areaColor: "#e6b422"
					}, // 高亮色
				},
			}, ],
		};

		chartInstance.setOption(option);

		// 响应式大小
		window.addEventListener("resize", resizeChart);
	};

	const resizeChart = () => {
		chartInstance && chartInstance.resize();
	};

	onMounted(() => {
		initChart();
	});

	onBeforeUnmount(() => {
		window.removeEventListener("resize", resizeChart);
		chartInstance && chartInstance.dispose();
	});
</script>

<style scoped>
	.map-container {
		width: 100%;
		height: 100vh;
		/* 或者你自己设定的高度 */
	}
</style>