<template>
	<li class="ft-li">
		<div class="ft-card" :style="{ width: nodeWidth + 'px', height: nodeHeight + 'px' }" 
			:data-node-id="String(node.id)">
			<div class="ft-card-main" @click="$emit('select', node)">
				<img v-if="node.avatar" class="ft-avatar" :src="node.avatar" :alt="node.name" />
				<div class="ft-meta">
					<div class="ft-name">{{ node.name }}</div>
					<div v-if="node.spouse" class="ft-spouse">配偶：{{ node.spouse }}</div>
					<div v-if="node.birth || node.death" class="ft-date">
						{{ node.birth || '' }}{{ node.death ? ' - ' + node.death : '' }}
					</div>
					<div v-if="node.note" class="ft-note">{{ node.note }}</div>
				</div>
			</div>
			<div class="ft-card-actions">
				<button v-if="collapsible && node.children?.length" class="ft-toggle" @click="toggle">
					{{ node.collapsed ? '展开' : '折叠' }}
				</button>
			</div>
		</div>

		<ul v-if="node.children?.length" :class="['ft-children', node.collapsed ? 'ft-collapsed' : '']"
			:style="{ '--ft-line-color': lineColor }">
			<FamilyNode v-for="child in node.children"  :key="child.id" :node="child" :collapsible="collapsible"
				:line-color="lineColor" :node-width="nodeWidth" :node-height="nodeHeight" @toggle="$emit('toggle')"
				@select="$emit('select', $event)" />
		</ul>
	</li>
</template>

<script>
	export default {
		name: 'FamilyNode',

		props: {
			node: {
				type: Object,
				required: true
			},
			collapsible: {
				type: Boolean,
				default: true
			},
			lineColor: {
				type: String,
				default: '#CBD5E1'
			},
			nodeWidth: {
				type: Number,
				default: 180
			},
			nodeHeight: {
				type: Number,
				default: 72
			}
		},
		emits: ['toggle', 'select'],
		
		mounted(){
			
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