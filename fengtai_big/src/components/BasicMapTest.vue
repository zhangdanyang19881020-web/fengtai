<template>
  <div class="basic-map-test">
    <h2>基础地图测试</h2>
    <div class="status">{{ status }}</div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)
const status = ref('准备中...')

onMounted(async () => {
  try {
    status.value = '正在加载高德地图...'
    
    // 动态导入，避免构建时错误
    const AMapLoader = await import('@amap/amap-jsapi-loader')
    
    status.value = '正在初始化地图...'
    
    const AMap = await AMapLoader.default.load({
      key: '2c902c096aec5c3664eb27f7425ad153',
      securityKey: '4202a15eb97e7315a0be11b3b8c2aac1',
      version: '2.0',
      plugins: []
    })
    
    status.value = '正在创建地图实例...'
    
    // 创建地图
    const map = new AMap.Map(mapContainer.value, {
      center: [116.397428, 39.90923],
      zoom: 10
    })
    
    status.value = '地图创建成功！'
    
    // 添加标记
    const marker = new AMap.Marker({
      position: [116.397428, 39.90923],
      title: '北京'
    })
    map.add(marker)
    
    status.value = '地图测试完成！'
    
  } catch (error) {
    status.value = '错误: ' + error.message
    console.error('地图加载失败:', error)
  }
})
</script>

<style scoped>
.basic-map-test {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.status {
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
  font-family: monospace;
}

.map-container {
  flex: 1;
  min-height: 400px;
  border: 2px solid #ccc;
  border-radius: 4px;
}
</style>
