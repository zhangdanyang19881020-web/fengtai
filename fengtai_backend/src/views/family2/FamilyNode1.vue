<template>
  <g>
    <!-- 本人节点 -->
    <rect
      :x="x - nodeWidth/2"
      :y="y - nodeHeight/2"
      :width="nodeWidth"
      :height="nodeHeight"
      fill="#fcf8ee"
      stroke="#8b4513"
      rx="5"
      ry="5"
      @click.stop="selectNode(node)"
    />
    <foreignObject
      :x="x - nodeWidth/2"
      :y="y - nodeHeight/2"
      :width="nodeWidth"
      :height="nodeHeight"
    >
      <input v-if="editing"
        v-model="node.label"
        @blur="editing=false"
        @keyup.enter="editing=false"
        style="width:100%; height:100%; text-align:center; border:none; background:none; font-size:12px;"
      />
      <span v-else
        @dblclick.stop="editing=true"
        style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; cursor:pointer;"
      >{{ node.label }}</span>
    </foreignObject>

    <!-- 配偶节点 -->
    <g v-if="node.spouse">
      <rect
        :x="x + spouseOffset"
        :y="y - nodeHeight/2"
        :width="nodeWidth"
        :height="nodeHeight"
        fill="#f0e68c"
        stroke="#8b4513"
        rx="5"
        ry="5"
        @click.stop="selectNode(node, true)"
      />
      <text
        :x="x + spouseOffset + nodeWidth/2"
        :y="y"
        text-anchor="middle"
        alignment-baseline="middle"
        fill="#8b4513"
        font-size="12"
        style="pointer-events: none;"
      >{{ node.spouse }}</text>
      <line
        :x1="x + nodeWidth/2"
        :y1="y"
        :x2="x + spouseOffset"
        :y2="y"
        stroke="#8b4513"
      />
    </g>

    <!-- 子女 -->
    <FamilyNode
      v-for="(child, index) in node.children || []"
      :key="child.id"
      :node="child"
      :x="x + (index - (node.children.length-1)/2) * childSpacing"
      :y="y + verticalSpacing"
      :level="level + 1"
      :selectedNode="selectedNode"
      @select-node="$emit('select-node', $event)"
      @append-child="$emit('append-child', $event)"
      @delete-node="$emit('delete-node', $event)"
    />

    <!-- 添加子女按钮 -->
    <g v-if="level > 0">
      <rect
        :x="x - 10"
        :y="y + verticalSpacing/2"
        width="20"
        height="20"
        fill="#8b4513"
        rx="4"
        ry="4"
        style="cursor:pointer;"
        @click.stop="addChild(node)"
      />
      <text
        :x="x"
        :y="y + verticalSpacing/2 + 14"
        text-anchor="middle"
        alignment-baseline="middle"
        fill="#fff"
        font-size="14"
        style="pointer-events: none;"
      >+</text>

      <!-- 删除按钮 -->
      <rect
        :x="x + 30"
        :y="y + verticalSpacing/2"
        width="20"
        height="20"
        fill="#a52a2a"
        rx="4"
        ry="4"
        style="cursor:pointer;"
        @click.stop="deleteNode(node)"
      />
      <text
        :x="x + 40"
        :y="y + verticalSpacing/2 + 14"
        text-anchor="middle"
        alignment-baseline="middle"
        fill="#fff"
        font-size="14"
        style="pointer-events: none;"
      >×</text>
    </g>
  </g>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  node: Object,
  x: Number,
  y: Number,
  level: Number,
  selectedNode: Object
})

const emit = defineEmits(['select-node', 'append-child', 'delete-node'])

const nodeWidth = 80
const nodeHeight = 30
const spouseOffset = 100
const verticalSpacing = 100
const childSpacing = 120

const editing = ref(false)

const selectNode = (node, isSpouse=false) => {
  emit('select-node', { ...node, isSpouse })
}

const addChild = (node) => {
  const newId = Date.now()
  if (!node.children) node.children = []
  node.children.push({ id: newId, label: '新成员', children: [] })
  emit('append-child', node)
}

const deleteNode = (node) => {
  emit('delete-node', node)
}
</script>
