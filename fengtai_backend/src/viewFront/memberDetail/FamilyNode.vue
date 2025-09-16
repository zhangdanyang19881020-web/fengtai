<template>
	<g>
		<!-- 连接线 -->
		<line v-if="level > 0" :x1="x" :y1="y - nodeHeight/2" :x2="x" :y2="y - verticalSpacing/2" stroke="#8b4513"
			stroke-width="2" />

		<!-- 节点矩形 -->
		<rect :x="x - nodeWidth/2" :y="y - nodeHeight/2" :width="nodeWidth" :height="nodeHeight"
			:fill="isSelected ? '#e6d2b5' : '#f7f0db'" stroke="#8b4513" stroke-width="2" rx="5" @click="onClick"
			style="cursor: pointer;" />

		<!-- 配偶矩形 -->
		<rect v-if="node.sameLevel.length>0&&node.sameLevel[0].relationshipName=='配偶'" :x="x + nodeWidth/2 + 5"
			:y="y - nodeHeight/2" :width="nodeWidth" :height="nodeHeight" fill="#f7f0db" stroke="#8b4513"
			stroke-width="2" rx="5" style="cursor: pointer;" />

		<!-- 连接配偶的线 -->
		<line v-if="node.sameLevel.length>0&&node.sameLevel[0].relationshipName=='配偶'" :x1="x + nodeWidth/2" :y1="y"
			:x2="x + nodeWidth/2 + 5" :y2="y" stroke="#8b4513" stroke-width="2" />



		<!-- 姓名 -->
		<text :x="x" :y="y - 10" text-anchor="middle" fill="#8b4513"
			style="font-size: 14px; pointer-events: none; font-weight: bold;">
			{{ node.relatedName }}
		</text>

		<!-- 称谓 -->
		<text :x="x" :y="y + 10" text-anchor="middle" fill="#8b4513" style="font-size: 12px; pointer-events: none;">
			{{ node.relationshipName }}
		</text>

		<!-- 配偶姓名 -->
		<text v-if="node.sameLevel.length>0&&node.sameLevel[0].relationshipName=='配偶'"
			:x="x + nodeWidth/2 + 5 + nodeWidth/2" :y="y - 10" text-anchor="middle" fill="#8b4513"
			style="font-size: 14px; pointer-events: none; font-weight: bold;">
			{{node.sameLevel[0].relatedName }}
		</text>

		<!-- 子节点 -->
		<g v-if="node.children && node.children.length">
			<!-- 连接子节点的水平线 -->
			<line :x1="x - ((node.children.length - 1) * horizontalSpacing) / 2" :y1="y + verticalSpacing/2"
				:x2="x + ((node.children.length - 1) * horizontalSpacing) / 2" :y2="y + verticalSpacing/2"
				stroke="#8b4513" stroke-width="2" />

			<!-- 连接到水平线的垂直线 -->
			<line :x1="x" :y1="y + nodeHeight/2" :x2="x" :y2="y + verticalSpacing/2" stroke="#8b4513"
				stroke-width="2" />

			<!-- 递归渲染子节点 -->
			<FamilyNode v-for="(child, index) in node.children" :key="child.id" :node="child"
				:x="x - ((node.children.length - 1) * horizontalSpacing) / 2 + index * horizontalSpacing"
				:y="y + verticalSpacing" :level="level + 1" :selectedNode="selectedNode"
				@select-node="$emit('select-node', $event)" />
		</g>
	</g>
</template>

<script>
	export default {
		name: 'FamilyNode',
		props: ['node', 'x', 'y', 'level', 'selectedNode'],
		emits: ['select-node'],
		setup(props, {
			emit
		}) {
			const nodeWidth = 100;
			const nodeHeight = 60;
			const verticalSpacing = 120;

			const onClick = () => {
				emit('select-node', props.node);
			};

			// 动态计算水平间距，根据子节点数量调整
			const getHorizontalSpacing = (childrenCount) => {
				if (childrenCount <= 1) return 0;
				if (childrenCount === 2) return 200;
				if (childrenCount === 3) return 150;
				return 400 / childrenCount;
			};

			return {
				nodeWidth,
				nodeHeight,
				verticalSpacing,
				getHorizontalSpacing,
				onClick
			};
		},

		computed: {
			isSelected() {
				return this.selectedNode && this.selectedNode.id === this.node.id;
			},
			horizontalSpacing() {
				return this.getHorizontalSpacing(this.node.children ? this.node.children.length : 0);
			}
		},

		mounted() {

		},

		methods: {
			toggle() {
				if (!this.collapsible) return
				this.node.collapsed = !this.node.collapsed
				this.$emit('toggle')
			}
		}
	}
</script>