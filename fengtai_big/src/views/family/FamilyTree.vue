<template>
        <div class="container">
          <div class="header">
            <h1>蒋氏族谱</h1>
            <div class="subtitle">传承家风 · 弘扬美德</div>
          </div>
          
          <div class="controls">
            <button @click="zoomIn">放大</button>
            <button @click="zoomOut">缩小</button>
            <button @click="resetZoom">重置</button>
          </div>
          
          <div class="family-tree">
            <div class="generation-label generation-0">第一代</div>
            <div class="generation-label generation-1">第二代</div>
            <div class="generation-label generation-2">第三代</div>
            <div class="generation-label generation-3">第四代</div>
            
            <svg 
              :width="1000 * zoomLevel" 
              :height="650 * zoomLevel" 
              viewBox="0 0 1000 650"
            >
              <FamilyNode 
                :node="familyData" 
                :x="500" 
                :y="50" 
                :level="0"
                :selectedNode="selectedNode"
                @select-node="selectNode"
              />
            </svg>
          </div>
          
          <div class="node-info" v-if="selectedNode">
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
          </div>

          <div class="instructions">
            <p><strong>使用说明：</strong>点击族谱中的成员可以查看详细信息，使用放大/缩小按钮调整视图大小。</p>
          </div>
        </div>
</template>

<script>
	import {
		createApp,
		ref,
		reactive
	} from 'vue'
	import FamilyNode from '@/components/FamilyNode.vue'

	export default {
		components: {
			FamilyNode
		},
		setup() {
			// 修正数据结构：蒋维功有子女，属于第四层级
			const familyData = reactive({
				id: 1,
				name: '蒋生娥',
				title: '爷爷',
				birthYear: '1940',
				spouse: '',
				children: [{
					id: 2,
					name: '蒋孝天',
					title: '父亲',
					birthYear: '1965',
					spouse: '王惠菊',
					children: [{
						id: 3,
						name: '蒋维功',
						title: '',
						birthYear: '1990',
						spouse: '',
						children: [{
								id: 4,
								name: '蒋得明',
								title: '儿子',
								birthYear: '2015',
								spouse: '',
								children: []
							},
							{
								id: 5,
								name: '蒋得恩',
								title: '女儿',
								birthYear: '2018',
								spouse: '',
								children: []
							}
						]
					}]
				}]
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

			return {
				familyData,
				selectedNode,
				zoomLevel,
				selectNode,
				zoomIn,
				zoomOut,
				resetZoom
			};
		},
	}
</script>

<style>
	* {
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
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		background: #fcf8ee;
		border-radius: 8px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
		padding: 25px;
		border: 1px solid #d4c7a7;
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
		justify-content: center;
		gap: 15px;
		margin-bottom: 25px;
	}

	button {
		padding: 8px 20px;
		background: #8b4513;
		color: #fcf8ee;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.3s;
		font-family: 'SimSun', '宋体', serif;
	}

	button:hover {
		background: #a0522d;
	}

	.family-tree {
		width: 100%;
		height: 700px;
		border: 1px solid #d4c7a7;
		border-radius: 8px;
		overflow: auto;
		background: #fcf8ee;
		padding: 20px;
		position: relative;
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