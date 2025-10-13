<template>
	<div ref="chartSearchRef" class="map-container"></div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount,
		computed,
		nextTick,
		reactive
	} from "vue";
	import {
		useStore
	} from 'vuex'
	const store = useStore();



	import * as echarts from "echarts";
	import {
		dataApi
	} from "@/utils/api";

	// const props = defineProps({
	// 	highlightAreaByName: Function, // Accepting the passed function as a prop
	// });

	const chartSearchRef = ref(null);
	let chartInstance = null;

	const highlightAreaByName = (areaName) => {
		// console.log('highlightAreaByName', areaName)
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

	const streetMemberCountArr = reactive([]);
	const getStreetMemberCount = async () => {
		const result = await dataApi.getStreetMemberCount()
		if (result.code == 200) {
			streetMemberCountArr.value = result.data;
			initChart();
		} else {
			streetMemberCountArr.value = []
		}
		console.log('streetMemberCountArr', streetMemberCountArr.value)
	}
	// 示例：countFn 根据区域名获取对应的台胞人数
	const countFn = (params) => {
		const regionName = params.name;
		const region = streetMemberCountArr.value.find(x => x.regionName === regionName);
		const count = region ? region.regionCount : 0;
		// console.log(`countFn--区域: ${regionName}, 台胞人数: ${count}`); // 打印调试
		return count;
	};


	const getColorByCount = (count) => {
		console.log('getColorByCount--', count)
		if (count >= 150) {
			return "#8B0000"; // 深红色
		} else if (count >= 101 && count < 150) {
			return "#FF6347"; // 红色
		} else if (count >= 50 && count < 100) {
			return "#FFA500"; // 橘红色
		} else if (count >= 1 && count < 50) {
			return "#FFFFE0"; // 浅黄色
		} else {
			return "#D3D3D3"; // 灰色
		}
	}

	const initChart = async () => {

		// 加载 GeoJSON
		const res = await fetch("./data/330213.geojson");
		const geoJson = await res.json();

		// 注册地图
		echarts.registerMap("fenghua", geoJson);

		chartInstance = echarts.init(chartSearchRef.value);
		const mapData = [];
		console.log('streetMemberCountArr.value', streetMemberCountArr.value)
		streetMemberCountArr.value.forEach(x => {
			mapData.push({
				name: x.regionName,
				value: x.regionCount
			})
		})
		// mapData[0].value = 100;
		// mapData[1].value = 149;
		// mapData[2].value = 200;
		// mapData[3].value = 49;
		console.log('mapData', mapData)
		const option = {
			tooltip: {
				trigger: "item",
				formatter: (params) => {
					// const count = countFn(params);
					const count = countFn(params);
					return `
	                  <div class="z-tooltip" style="padding:5px 10px;">
	                    <div class="z-tooltip--name">
	                      ${params.name}
	                    </div>
	                    <div>
	                      <span>台胞人数：</span>
	                      <span style="color:#ffd700;font-weight:bold;">${count}</span>
	                    </div>
	                  </div>
	                `;
				},
				textStyle: {
					color: "rgba(0,0,0,0.6)",
					fontSize: 14,
				},
				backgroundColor: "#fffbf1",
				borderWidth: 1,
				borderColor: '#cdaf7f',
				extraCssText: "padding:0;",
			},
			visualMap: {
				type: 'piecewise',
				pieces: [{
						max: 0,
						label: '0',
						color: '#D3D3D3'
					},
					{
						min: 1,
						max: 49,
						label: '1-49',
						color: '#FFFFE0'
					},
					{
						min: 50,
						max: 100,
						label: '50-100',
						color: '#FFA500'
					},
					{
						min: 101,
						max: 149,
						label: '101-149',
						color: '#FF6347'
					},
					{
						min: 150,
						label: '150+',
						color: '#8B0000'
					},
				],
				show: false,
			},
			series: [{
				type: "map",
				map: "fenghua",
				roam: true,
				label: {
					show: true,
					fontSize: 12,
					color: "#333",
				},

				itemStyle: {
					areaColor: "#D3D3D3", // 背景色
					borderColor: "#8b5e3c",
				},
				emphasis: {
					label: {
						color: "#000",
						fontWeight: "bold"
					},
					itemStyle: {
						areaColor: "#e6b422"
					},
				},
				data: mapData,
			}],
		};
		chartInstance.setOption(option);
		
		chartInstance.on('click', function(params) {
			console.log('chartInstance-click', params)
		})
		
		window.addEventListener("resize", resizeChart);
	};


	const resizeChart = () => {
		chartInstance && chartInstance.resize();
	};



	onMounted(() => {
		nextTick(() => {
			getStreetMemberCount();
		})
	});

	onBeforeUnmount(() => {
		window.removeEventListener("resize", resizeChart);
		chartInstance && chartInstance.dispose();
	});
	defineExpose({
		highlightAreaByName,
	});
</script>

<style lang="scss" scoped>
	.z-tooltip {
		min-width: 180px;
		background: #fff;
		color: #333;
		border: 1px solid #ff4500;

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