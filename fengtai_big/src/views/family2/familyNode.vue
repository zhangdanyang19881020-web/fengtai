<template>
  <g
    class="family-node"
    :transform="`translate(${x},${y})`"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <rect
      :width="120"
      :height="50"
      rx="10"
      ry="10"
      :fill="hover ? '#f7e3b1' : '#f9f3e5'"
      stroke="#8b4513"
      stroke-width="2"
    />
    <text
      x="60"
      y="28"
      text-anchor="middle"
      fill="#8b4513"
      style="font-size:14px;font-weight:bold;"
    >
      {{ node.label }}
    </text>
  </g>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  props: { node: Object },
  emits: ["node-mounted"],
  setup(props, { emit }) {
    const x = ref(0);
    const y = ref(0);
    const hover = ref(false);

    // 简单排布：父子纵向，兄弟横向（可再优化）
    onMounted(() => {
      // 假设直接按 id 简单分布
      x.value = props.node.id * 150;
      y.value = props.node.id * 80;
      emit("node-mounted", { id: props.node.id, x: x.value + 60, y: y.value + 25 });
    });

    return { x, y, hover };
  }
};
</script>
