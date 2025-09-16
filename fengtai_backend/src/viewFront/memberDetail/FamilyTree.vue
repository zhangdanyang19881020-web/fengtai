<template>
	<div class="container">

		<div class="controls">
			<i class="iconfont icon-fangda" @click="zoomIn"></i>
			<i class="iconfont icon-suoxiao" @click="zoomOut"></i>
			<i class="iconfont icon-zhongzhi" @click="resetZoom"></i>
		</div>

		<div class="family-tree">
			<!--         <div class="generation-label generation-0">第一代</div>
            <div class="generation-label generation-1">第二代</div>
            <div class="generation-label generation-2">第三代</div>
            <div class="generation-label generation-3">第四代</div> -->
			<!--  -->
			<svg :width="400 * zoomLevel" :height="300 * zoomLevel" viewBox="0 0 400 300">
				<FamilyNode :node="familyData" :x="200" :y="30" :level="0" :selectedNode="selectedNode"
					@select-node="selectNode" />
			</svg>
		</div>


		<!-- 		<div class="node-info" v-if="selectedNode">
			<h3>成员详细信息</h3>
			<div class="node-details">
				<div class="detail-item">
					<span class="detail-label">姓名：</span>
					{{ selectedNode.name }}
				</div>
				<div class="detail-item">
					<span class="detail-label">称谓：</span>
					{{ selectedNode.title || '无' }}
				</div>
				<div class="detail-item">
					<span class="detail-label">出生年份：</span>
					{{ selectedNode.birthYear }}
				</div>
				<div class="detail-item" v-if="selectedNode.spouse">
					<span class="detail-label">配偶：</span>
					{{ selectedNode.spouse }}
				</div>
				<div class="detail-item">
					<span class="detail-label">后代数量：</span>
					{{ selectedNode.children ? selectedNode.children.length : 0 }}
				</div>
			</div>
		</div> -->

		<!--   <div class="instructions">
            <p><strong>使用说明：</strong>点击族谱中的成员可以查看详细信息，使用放大/缩小按钮调整视图大小。</p>
          </div> -->
	</div>
</template>

<script setup>
	import {
		createApp,
		ref,
		reactive,
		computed,
		onMounted,
		nextTick
	} from 'vue'
	import {
		useStore
	} from 'vuex';
	const store = useStore()

	import FamilyNode from '@/viewFront/memberDetail/FamilyNode.vue'

	// 接收父组件传递的数据
	const props = defineProps({
		familyData: {
			type: Object,
			required: true
		}
	});

	const selectedNode = ref(null);
	const zoomLevel = ref(1);

	const selectNode = (node) => {
		selectedNode.value = node;
	};

	const zoomIn = () => {
		if (zoomLevel.value < 1.5) {
			zoomLevel.value += 0.1;
		}
	};

	const zoomOut = () => {
		if (zoomLevel.value > 0.7) {
			zoomLevel.value -= 0.1;
		}
	};

	const resetZoom = () => {
		zoomLevel.value = 1;
	};
	onMounted(() => {
		nextTick(() => {

		})
	})
</script>

<style lang="scss" scoped>
	/* 	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'SimSun', '宋体', serif;
	}

	body {
		padding: 20px;
		background-color: #f9f3e5;
		color: #333;
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><rect fill="%23866f4d" x="0" y="0" width="100" height="100"/><path d="M0 0L100 100M100 0L0 100" stroke="%23866f4d" stroke-width="1"/></svg>');
	} */

	.container {
		width: 100%;
		margin: 0 auto;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
	}

	.header {
		text-align: center;
		margin-bottom: 30px;
		padding-bottom: 15px;
		border-bottom: 2px solid #b8860b;
	}

	h1 {
		font-size: 32px;
		color: #8b4513;
		margin-bottom: 10px;
		letter-spacing: 5px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.subtitle {
		color: #8b4513;
		font-size: 16px;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
		transform: translateX(-10px) translateY(-26px);

		.iconfont {
			cursor: pointer;
			color: #8b4513;
			// border: none;
			// border-radius: 4px;
			cursor: pointer;
			// transition: background 0.3s;
			// font-family: 'SimSun', '宋体', serif;
		}
	}


	.family-tree {
		width: 100%;
		height: 100%;
		overflow: auto;
		background: #fcf8ee;
		position: relative;
		padding-top:50px;
	}

	.family-svg {
		width: 100%;
		/* Make the SVG fill the container's width */
		height: 100%;
		/* Make the SVG fill the container's height */
		display: block;
		/* Prevents unwanted margins/paddings */
	}

	.node-info {
		margin-top: 25px;
		padding: 20px;
		border-radius: 8px;
		background: #f7f0db;
		border: 1px solid #d4c7a7;
	}

	.node-info h3 {
		margin-bottom: 15px;
		color: #8b4513;
		text-align: center;
		padding-bottom: 10px;
		border-bottom: 1px solid #d4c7a7;
	}

	.node-details {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
	}

	.detail-item {
		padding: 8px 0;
		border-bottom: 1px dashed #d4c7a7;
	}

	.detail-label {
		font-weight: bold;
		color: #8b4513;
		margin-right: 8px;
	}

	.generation-label {
		position: absolute;
		left: 10px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		color: #8b4513;
		font-weight: bold;
		background: #f7f0db;
		padding: 10px 5px;
		border-radius: 4px;
		border: 1px solid #d4c7a7;
	}

	.generation-0 {
		top: 50px;
	}

	.generation-1 {
		top: 170px;
	}

	.generation-2 {
		top: 320px;
	}

	.generation-3 {
		top: 470px;
	}

	.instructions {
		margin-top: 20px;
		padding: 15px;
		background: #f7f0db;
		border-radius: 8px;
		border: 1px solid #d4c7a7;
		font-size: 14px;
		color: #8b4513;
	}
</style>