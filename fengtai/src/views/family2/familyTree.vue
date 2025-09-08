<template>
  <div class="family-tree">
    <svg :width="width" :height="height">
      <!-- 绘制连接线 -->
      <g class="links">
        <path
          v-for="link in links"
          :key="link.id"
          :d="generatePath(link)"
          stroke="#8b4513"
          stroke-width="2"
          fill="none"
        />
      </g>

      <!-- 绘制节点 -->
      <g class="nodes">
        <FamilyNode
          v-for="node in flatNodes"
          :key="node.id"
          :node="node"
          @node-mounted="updateNodePosition"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import FamilyNode from "./familyNode.vue";

export default {
  components: { FamilyNode },
  setup() {
    const width = 1200;
    const height = 800;

    // 示例数据
    const familyData = reactive({
      id: 1,
      label: "爷爷",
      children: [
        {
          id: 2,
          label: "父亲",
          children: [
            {
              id: 3,
              label: "我",
              children: [
                { id: 4, label: "儿子" },
                { id: 5, label: "女儿" }
              ]
            }
          ]
        }
      ]
    });

    // 扁平化节点，保存坐标
    const flatNodes = reactive([]);
    const nodePositions = reactive({});

    const updateNodePosition = ({ id, x, y }) => {
      nodePositions[id] = { x, y };
    };

    // 生成父子之间的连线数据
    const links = computed(() => {
      const result = [];
      function traverse(node) {
        if (!node.children) return;
        node.children.forEach((child) => {
          result.push({ id: `${node.id}-${child.id}`, source: node.id, target: child.id });
          traverse(child);
        });
      }
      traverse(familyData);
      return result;
    });

    // 曲线路径生成
    const generatePath = (link) => {
      const s = nodePositions[link.source];
      const t = nodePositions[link.target];
      if (!s || !t) return "";
      const midY = (s.y + t.y) / 2;
      return `M${s.x},${s.y} C${s.x},${midY} ${t.x},${midY} ${t.x},${t.y}`;
    };

    return { width, height, familyData, flatNodes, updateNodePosition, links, generatePath };
  }
};
</script>

<style scoped>
.family-tree {
  width: 100%;
  height: 100%;
  background: #fcf8ee;
  border: 1px solid #d4c7a7;
  border-radius: 8px;
}
</style>
