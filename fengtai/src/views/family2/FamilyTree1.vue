<template>
  <div class="container">
    <div class="controls">
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut">缩小</button>
      <button @click="resetZoom">重置</button>
    </div>

    <svg viewBox="0 0 1200 700" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }">
      <FamilyNode
        :node="treeData[0]"
        :x="600"
        :y="50"
        :level="0"
        :selectedNode="selectedNode"
        @select-node="selectNode"
        @append-child="updateTree"
        @delete-node="handleDelete"
      />
    </svg>

    <div class="node-info" v-if="selectedNode">
      <h3>成员详细信息</h3>
      <div class="node-details">
        <div><strong>姓名：</strong>{{ selectedNode.label }}</div>
        <div v-if="selectedNode.spouse"><strong>配偶：</strong>{{ selectedNode.spouse }}</div>
        <div><strong>子女数量：</strong>{{ selectedNode.children ? selectedNode.children.length : 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import FamilyNode from './FamilyNode.vue'

const treeData = reactive([
  {
    id: 1,
    label: "祖辈",
    children: [
      {
        id: 2,
        label: "爷爷",
        children: [
          { id: 3, label: "奶奶" },
          {
            id: 4,
            label: "父亲",
            spouse: "王惠菊",
            children: [
              {
                id: 5,
                label: "我",
                children: [
                  { id: 6, label: "儿子" },
                  { id: 7, label: "女儿" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])

const selectedNode = ref(null)
const zoomLevel = ref(1)

const selectNode = (node) => selectedNode.value = node
const zoomIn = () => { if (zoomLevel.value < 2) zoomLevel.value += 0.1 }
const zoomOut = () => { if (zoomLevel.value > 0.5) zoomLevel.value -= 0.1 }
const resetZoom = () => zoomLevel.value = 1

const updateTree = (node) => {
  // reactive 自动响应，不需要做额外处理
}

const handleDelete = (node) => {
  const deleteRecursively = (parent) => {
    if (!parent.children) return
    const index = parent.children.findIndex(c => c.id === node.id)
    if (index >= 0) {
      parent.children.splice(index, 1)
      return true
    }
    for (const child of parent.children) {
      if (deleteRecursively(child)) return true
    }
  }
  deleteRecursively(treeData[0])
}
</script>

<style>
.container { padding: 20px; background: #fcf8ee; }
.controls { margin-bottom: 10px; }
button { margin-right: 10px; padding: 5px 12px; cursor:pointer; }
.node-info { margin-top: 20px; padding: 10px; border: 1px solid #d4c7a7; background: #f7f0db; }
</style>
