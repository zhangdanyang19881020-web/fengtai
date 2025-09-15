<template>
	<div ref="chartRef" class="map-container"></div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount,
		computed,
		defineProps,
		defineExpose,
		nextTick
	} from "vue";
	import {
		useStore
	} from 'vuex'
	const store = useStore();



	import * as echarts from "echarts";

	// const props = defineProps({
	// 	highlightAreaByName: Function, // Accepting the passed function as a prop
	// });

	const chartRef = ref(null);
	let chartInstance = null;

	const highlightAreaByName = (areaName) => {
		console.log('highlightAreaByName', areaName)
		if (!chartInstance) return;

		chartInstance.setOption({
			series: [{
				// 不会覆盖其他配置
				type: "map",
				map: "fenghua",
				data: [{
					name: areaName,
					itemStyle: {
						areaColor: "#9c331a",
						borderColor: "#9c331a", // 边界色
					},
					label: {
						color: "#fff",
						fontSize: 12,
						shadowColor: 'rgba(0,0,0,0.6)',
						shadowBlur: 3,
						shadowOffsetX: 3,
						shadowOffsetY: 3,
						textBorderColor: "#f5df21",
						textShadowOffsetX: 3,
					}
				}],
				label: {
					color: "#625b3c",
					fontSize: 12
				}
			}]
		});
	};
	const detailMemberOb = computed(() => {
		return store.state.memberDetailOb;
	})
	console.log('detailMemberOb--xx-', detailMemberOb)

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
				// formatter: (params) => {
				// 	return `${params.name} 台胞 ${detailMemberOb.value.region.count} 人`;
				// },
				formatter: function(params) {
					return `
				      <div class="z-tooltip" style="padding:5px 10px">
				        <div class="z-tooltip--name">
				          ${params.name}
				        </div>
				        <div>
				          <span>台胞人数：</span>
				          <span style="color:#ffd700;font-weight:bold;">${detailMemberOb.value.region.count}</span>
				        </div>
				      </div>
				    `;
				},
				textStyle: {
					color: "rgba(0,0,0,0.6)", // 文字白色
					fontSize: 14, // 字号
				},
				backgroundColor: "#fffbf1", // 半透明背景
				borderWidth: 1,
				borderColor: '#cdaf7f',
				extraCssText: "padding:0;", // 去掉内边距，交给 HTML 控制
				// extraCssText: `
				//      padding: 5px 10px;
				//      border-radius: 20px;
				//      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
				//      backdrop-filter: blur(6px);
				//    `,
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
			}],
		};
		chartInstance.setOption(option);
		// 响应式大小
		window.addEventListener("resize", resizeChart);
	};


	const resizeChart = () => {
		chartInstance && chartInstance.resize();
	};

	onMounted(() => {
		nextTick(() => {
			initChart();
		})

	});

	onBeforeUnmount(() => {
		window.removeEventListener("resize", resizeChart);
		chartInstance && chartInstance.dispose();
	});
	defineExpose({
		highlightAreaByName
	});
</script>

<style lang="scss" scoped>
	.z-tooltip {
		min-width: 180px;
		background: #fff;
		color: #333;
		border: 1px solid #ff4500;
		border-radius: 10px;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
		font-size: 14px;
		line-height: 1.6;
		overflow: hidden;

		.z-tooltip--name {
			font-weight: bold;
			font-size: 16px;
			margin-bottom: 6px;
		}
	}

	/* 移动设备 (<768px) */
	@media (max-width: 767px) {
		.map-container {
			width: 100%;
			height: 350px;
			/* height: 100vh; */
			/* 或者你自己设定的高度 */
		}
	}

	/* 超小移动设备 (<480px) */
	@media (max-width: 480px) {
		.map-container {
			width: 100%;
			height: 350px;
			/* height: 100vh; */
			/* 或者你自己设定的高度 */
		}
	}
</style>