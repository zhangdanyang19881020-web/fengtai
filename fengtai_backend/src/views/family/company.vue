<template>
	<div ref="chartRef" class="orgchart-container"></div>
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

	// 示例组织数据
	const orgData = {
		name: "总公司",
		children: [{
				name: "技术部",
				children: [{
						name: "前端组"
					},
					{
						name: "后端组"
					}
				]
			},
			{
				name: "产品部"
			},
			{
				name: "运营部"
			}
		]
	};

	// 给每个节点随机生成人数
	function assignRandomCount(node) {
		node.count = Math.floor(Math.random() * 50) + 5; // 5~54 人
		if (node.children) {
			node.children.forEach(assignRandomCount);
		}
	}
	assignRandomCount(orgData);

	const initChart = () => {
		chartInstance = echarts.init(chartRef.value);

		const option = {
			tooltip: {
				trigger: "item",
				formatter: function(params) {
					return `${params.data.name} 人数：${params.data.count}`;
				}
			},
			series: [{
				type: "tree",
				data: [orgData],
				top: "5%",
				left: "10%",
				bottom: "5%",
				right: "10%",
				symbolSize: 15,
				orient: 'vertical',
				label: {
					position: "top",
					verticalAlign: "middle",
					align: "right"
				},
				lineStyle: {
					color: "#555",
					width: 2
				},
				expandAndCollapse: true,
				animationDuration: 550,
				animationDurationUpdate: 750
			}]
		};

		chartInstance.setOption(option);
		window.addEventListener("resize", resizeChart);
	};

	const resizeChart = () => chartInstance && chartInstance.resize();

	onMounted(initChart);
	onBeforeUnmount(() => {
		window.removeEventListener("resize", resizeChart);
		chartInstance && chartInstance.dispose();
	});
</script>

<style scoped>
	.orgchart-container {
		width: 100%;
		height: 100vh;
	}
</style>