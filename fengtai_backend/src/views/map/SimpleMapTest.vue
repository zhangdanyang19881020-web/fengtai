<template>
  <div class="simple-map-test">
    <div class="header">
      <h1>高德地图测试</h1>
      <button @click="refreshMap">刷新地图</button>
    </div>
    <SimpleAmap />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SimpleAmap from '@/components/SimpleAmap.vue'

const refreshMap = () => {
  window.location.reload()
}
</script>

<style scoped>
.simple-map-test {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: #333;
}

.header button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.header button:hover {
  background: #40a9ff;
}
</style>
