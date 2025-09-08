<template>
  <div class="timeline-container">
    <div class="timeline" ref="timeline">
      <!-- 循环生成年份节点 -->
      <div
        v-for="year in years"
        :key="year"
        class="year-item"
        :class="{ active: activeYear === year }"
        @click="setActiveYear(year)"
      >
        {{ year }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 生成从1949年到2025年的年份数组
      years: Array.from({ length: 2025 - 1949 + 1 }, (_, index) => 1949 + index),
      activeYear: 2022, // 默认选中的年份
    };
  },
  methods: {
    // 设置选中的年份
    setActiveYear(year) {
      this.activeYear = year;
    },
  },
};
</script>

<style scoped>
.timeline-container {
  width: 100%;
  overflow-x: auto;
  padding: 20px;
  background-color: #fef4b3; /* 背景颜色和图片样式相似 */
}

.timeline {
  display: flex;
  gap: 20px;
  padding: 10px;
  cursor: pointer;
}

.year-item {
  padding: 10px 15px;
  background-color: #ffcc00; /* 默认年份节点的背景颜色 */
  border-radius: 12px;
  font-weight: bold;
  color: #000;
  transition: background-color 0.3s, transform 0.3s;
  text-align: center;
}

.year-item.active {
  background-color: #ff5733; /* 激活年份节点的背景颜色 */
  color: white;
  transform: scale(1.2); /* 激活时放大效果 */
}

.year-item:hover {
  background-color: #f9a825;
}
</style>
