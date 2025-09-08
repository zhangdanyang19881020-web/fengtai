<template>
  <div class="ft-container" @dblclick="resetView">
    <div
      class="ft-canvas"
      :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }"
      ref="canvasRef"
      @mousedown="onPanStart"
      @wheel.prevent="onWheel"
    >
      <ul class="ft-tree" v-if="rootState">
        <FamilyNode
          :node="rootState"
          :collapsible="collapsible"
          :line-color="lineColor"
          :node-width="nodeWidth"
          :node-height="nodeHeight"
          @toggle="onToggle"
          @select="onSelect"
        />
      </ul>
    </div>

    <div v-if="showControls" class="ft-controls">
      <button class="ft-btn" @click="zoomIn">＋</button>
      <button class="ft-btn" @click="zoomOut">－</button>
      <button class="ft-btn" @click="resetView">重置</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'

const FamilyNode = defineComponent({
  name: 'FamilyNode',
  props: {
    node: { type: Object, required: true },
    collapsible: { type: Boolean, default: true },
    lineColor: { type: String, default: '#CBD5E1' },
    nodeWidth: { type: Number, default: 180 },
    nodeHeight: { type: Number, default: 72 }
  },
  emits: ['toggle', 'select'],
  setup(props, { emit }) {
    const toggle = () => {
      if (!props.collapsible) return
      props.node.collapsed = !props.node.collapsed
      emit('toggle')
    }
    const onSelect = () => emit('select', props.node)

    return () => (
      <li class="ft-li">
        <div
          class="ft-card"
          style={{ width: props.nodeWidth + 'px', height: props.nodeHeight + 'px' }}
          data-node-id={String(props.node.id)}
        >
          <div class="ft-card-main" onClick={onSelect}>
            {props.node.avatar
              ? <img class="ft-avatar" src={props.node.avatar} alt={props.node.name}/>
              : null}
            <div class="ft-meta">
              <div class="ft-name">{props.node.name}</div>
              {props.node.spouse ? <div class="ft-spouse">配偶：{props.node.spouse}</div> : null}
              {(props.node.birth || props.node.death)
                ? <div class="ft-date">{props.node.birth || ''}{props.node.death ? ' - ' + props.node.death : ''}</div>
                : null}
              {props.node.note ? <div class="ft-note">{props.node.note}</div> : null}
            </div>
          </div>
          <div class="ft-card-actions">
            {props.collapsible && props.node.children?.length
              ? <button class="ft-toggle" onClick={toggle}>{props.node.collapsed ? '展开' : '折叠'}</button>
              : null}
          </div>
        </div>

        {props.node.children?.length
          ? <ul
              class={['ft-children', props.node.collapsed ? 'ft-collapsed' : ''].join(' ')}
              style={{ '--ft-line-color': props.lineColor }}
            >
              {props.node.children.map(child =>
                <FamilyNode
                  node={child}
                  collapsible={props.collapsible}
                  lineColor={props.lineColor}
                  nodeWidth={props.nodeWidth}
                  nodeHeight={props.nodeHeight}
                  onToggle={() => emit('toggle')}
                  onSelect={(n) => emit('select', n)}
                />
              )}
            </ul>
          : null}
      </li>
    )
  }
})

export default defineComponent({
  name: 'FamilyTree',
  components: { FamilyNode },
  props: {
    root: { type: Object, required: true },
    collapsible: { type: Boolean, default: true },
    showControls: { type: Boolean, default: true },
    lineColor: { type: String, default: '#CBD5E1' },
    nodeWidth: { type: Number, default: 180 },
    nodeHeight: { type: Number, default: 72 }
  },
  emits: ['select', 'update:root'],
  setup(props, { emit }) {
    const rootState = reactive(JSON.parse(JSON.stringify(props.root)))
    watch(() => props.root, (val) => {
      Object.assign(rootState, JSON.parse(JSON.stringify(val)))
    }, { deep: true })

    const canvasRef = ref(null)
    const pan = reactive({ x: 0, y: 0 })
    const zoom = ref(1)

    function resetView() { pan.x = 0; pan.y = 0; zoom.value = 1 }
    function zoomIn() { zoom.value = Math.min(2.5, zoom.value * 1.2) }
    function zoomOut() { zoom.value = Math.max(0.4, zoom.value * 0.8) }

    // 拖拽
    let isPanning = false
    let start = { x: 0, y: 0 }
    function onPanStart(e) {
      isPanning = true
      start = { x: e.clientX - pan.x, y: e.clientY - pan.y }
      window.addEventListener('mousemove', onPanMove)
      window.addEventListener('mouseup', onPanEnd)
    }
    function onPanMove(e) {
      if (!isPanning) return
      pan.x = e.clientX - start.x
      pan.y = e.clientY - start.y
    }
    function onPanEnd() {
      isPanning = false
      window.removeEventListener('mousemove', onPanMove)
      window.removeEventListener('mouseup', onPanEnd)
    }

    // 滚轮缩放
    function onWheel(e) {
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      zoom.value = Math.min(2.5, Math.max(0.4, zoom.value * factor))
    }

    function onToggle() { emit('update:root', rootState) }
    function onSelect(node) { emit('select', node) }

    return {
      rootState, canvasRef, pan, zoom,
      resetView, zoomIn, zoomOut,
      onPanStart, onWheel,
      onToggle, onSelect
    }
  }
})
</script>

<style scoped>
/* 省略样式（和之前 TypeScript 版一致） */
</style>
