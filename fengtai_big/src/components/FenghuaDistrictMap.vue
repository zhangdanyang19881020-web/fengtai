<template>
  <div class="fenghua-map-container">
    <div class="map-header">
      <h1>宁波市奉化区地图</h1>
      <div class="map-info">
        <p>奉化区地图 - 鼠标悬停或点击镇/街道标签查看信息</p>
        <div class="current-area" v-if="hoveredArea">
          <strong>{{ hoveredArea }}</strong>
        </div>
      </div>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <div class="map-legend">
      <h3>奉化区镇/街道</h3>
      <div class="legend-list">
        <div 
          v-for="area in areaList" 
          :key="area.name"
          class="legend-item"
          @click="highlightArea(area)"
          :class="{ active: hoveredArea === area.name }"
        >
          {{ area.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 动态导入
let AMapLoader = null
let map = null

// 响应式数据
const mapContainer = ref(null)
const hoveredArea = ref('')
const areaList = ref([])

// 奉化区镇/街道数据
const fenghuaAreas = [
  {
    name: '锦屏街道',
    center: [121.45, 29.65],
    boundary: [
      [121.4, 29.6], [121.5, 29.6], [121.5, 29.7], [121.4, 29.7], [121.4, 29.6]
    ],
    description: '锦屏街道位于奉化区中心，是区政府所在地'
  },
  {
    name: '岳林街道',
    center: [121.55, 29.65],
    boundary: [
      [121.5, 29.6], [121.6, 29.6], [121.6, 29.7], [121.5, 29.7], [121.5, 29.6]
    ],
    description: '岳林街道是奉化区重要的商业区域'
  },
  {
    name: '西坞街道',
    center: [121.45, 29.55],
    boundary: [
      [121.4, 29.5], [121.5, 29.5], [121.5, 29.6], [121.4, 29.6], [121.4, 29.5]
    ],
    description: '西坞街道是奉化区的工业重镇'
  },
  {
    name: '溪口镇',
    center: [121.3, 29.7],
    boundary: [
      [121.25, 29.65], [121.35, 29.65], [121.35, 29.75], [121.25, 29.75], [121.25, 29.65]
    ],
    description: '溪口镇是蒋介石故里，历史文化名镇'
  },
  {
    name: '莼湖镇',
    center: [121.6, 29.5],
    boundary: [
      [121.55, 29.45], [121.65, 29.45], [121.65, 29.55], [121.55, 29.55], [121.55, 29.45]
    ],
    description: '莼湖镇是奉化区的重要港口镇'
  },
  {
    name: '尚田镇',
    center: [121.35, 29.4],
    boundary: [
      [121.3, 29.35], [121.4, 29.35], [121.4, 29.45], [121.3, 29.45], [121.3, 29.35]
    ],
    description: '尚田镇是奉化区的农业重镇'
  }
]

// 初始化地图
const initMap = async () => {
  try {
    // 动态导入高德地图
    AMapLoader = await import('@amap/amap-jsapi-loader')
    
    const AMap = await AMapLoader.default.load({
      key: '2c902c096aec5c3664eb27f7425ad153',
      securityKey: '4202a15eb97e7315a0be11b3b8c2aac1',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.InfoWindow']
    })

    // 创建地图实例，以奉化区为中心
    map = new AMap.Map(mapContainer.value, {
      center: [121.5, 29.6], // 奉化区中心
      zoom: 11,
      mapStyle: 'amap://styles/normal',
      // 限制缩放级别，保持合理的缩放范围
      zooms: [8, 16], // 允许更宽的缩放范围
      viewMode: '2D', // 2D视图
      features: ['bg', 'road', 'building', 'point'], // 显示基础要素
      showLabel: true // 显示标签
    })

    // 添加控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())

    // 不添加边界限制，让地图更自然

    // 创建信息窗口
    const infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30),
      closeWhenClickMap: true
    })

    // 添加镇/街道标签（不显示方块区域）
    fenghuaAreas.forEach(area => {
      // 添加区域标签
      const label = new AMap.Text({
        text: area.name,
        position: area.center,
        style: {
          color: '#333',
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '2px solid #1890ff',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }
      })

      // 鼠标悬停效果
      label.on('mouseover', () => {
        hoveredArea.value = area.name
        label.setOptions({
          style: {
            color: '#fff',
            backgroundColor: '#1890ff',
            border: '2px solid #40a9ff',
            transform: 'scale(1.1)'
          }
        })
      })

      // 鼠标离开效果
      label.on('mouseout', () => {
        hoveredArea.value = ''
        label.setOptions({
          style: {
            color: '#333',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '2px solid #1890ff',
            transform: 'scale(1)'
          }
        })
      })

      // 点击显示详细信息
      label.on('click', () => {
        infoWindow.setContent(`
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${area.name}</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${area.description}</p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              坐标: ${area.center[0]}, ${area.center[1]}
            </p>
          </div>
        `)
        infoWindow.open(map, area.center)
      })

      map.add(label)
    })

    // 初始化区域列表
    areaList.value = fenghuaAreas

    console.log('奉化区地图初始化完成')

  } catch (error) {
    console.error('地图初始化失败:', error)
  }
}

// 高亮指定区域
const highlightArea = (area) => {
  if (map) {
    map.setCenter(area.center)
    map.setZoom(12)
    hoveredArea.value = area.name
  }
}

// 组件挂载
onMounted(async () => {
  await nextTick()
  if (mapContainer.value) {
    initMap()
  }
})

// 组件卸载
onUnmounted(() => {
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped>
.fenghua-map-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.map-header {
  background: white;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.map-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.map-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.current-area {
  padding: 8px 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
}

.map-container {
  flex: 1;
  min-height: 500px;
  position: relative;
}

.map-legend {
  width: 300px;
  background: white;
  border-left: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
}

.map-legend h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  padding: 10px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #495057;
}

.legend-item:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.legend-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fenghua-map-container {
    flex-direction: column;
  }
  
  .map-legend {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid #ddd;
  }
  
  .map-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
