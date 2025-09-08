<template>
  <div class="amap-container">
    <div ref="mapContainer" class="map-container"></div>
    <div class="map-controls">
      <div class="people-list">
        <h3>人员分布</h3>
        <div class="map-info">
          <p>点击人员查看位置</p>
          <p>点击城市标记查看详情</p>
        </div>
        <ul>
          <li 
            v-for="person in people" 
            :key="person.name" 
            @click="highlightPerson(person)"
            :class="{ active: selectedPerson?.name === person.name }"
          >
            <span class="name">{{ person.name }}</span>
            <span class="location">{{ person.town }}{{ person.village ? ' - ' + person.village : '' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { amapConfig, locationData } from '@/config/amap.js'

// Props
const props = defineProps({
  people: {
    type: Array,
    default: () => []
  }
})

// 响应式数据
const mapContainer = ref(null)
const selectedPerson = ref(null)
let map = null
let markers = []
let infoWindow = null

// 使用配置文件中的坐标数据

// 初始化地图
const initMap = async () => {
  try {
    console.log('开始初始化高德地图...')
    console.log('API Key:', amapConfig.key)
    
    const AMap = await AMapLoader.load({
      key: amapConfig.key,
      securityKey: amapConfig.securityKey,
      version: amapConfig.version,
      plugins: amapConfig.plugins
    })

    console.log('高德地图API加载成功')

    // 创建地图实例 - 显示中国地图
    map = new AMap.Map(mapContainer.value, {
      center: [104.114129, 37.550339], // 中国中心坐标
      zoom: 5, // 显示整个中国
      mapStyle: amapConfig.mapStyle,
      viewMode: '3D' // 3D视图
    })

    console.log('地图实例创建成功')

    // 添加控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())

    // 创建信息窗体
    infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30)
    })

    // 添加中国地图标记
    addChinaMarkers(AMap)
    
    // 添加人员标记
    addPeopleMarkers(AMap)

    console.log('高德地图初始化成功')
  } catch (error) {
    console.error('高德地图初始化失败:', error)
    console.error('错误详情:', error.message)
  }
}

// 添加中国地图标记
const addChinaMarkers = (AMap) => {
  // 主要城市标记
  const cities = [
    { name: '北京', position: [116.397428, 39.90923], color: '#FF6B6B' },
    { name: '上海', position: [121.473701, 31.230416], color: '#4ECDC4' },
    { name: '广州', position: [113.264385, 23.129163], color: '#45B7D1' },
    { name: '深圳', position: [114.085947, 22.547], color: '#96CEB4' },
    { name: '杭州', position: [120.153576, 30.287459], color: '#FFEAA7' },
    { name: '成都', position: [104.066541, 30.572269], color: '#DDA0DD' },
    { name: '西安', position: [108.948024, 34.263161], color: '#98D8C8' },
    { name: '武汉', position: [114.298572, 30.584355], color: '#F7DC6F' }
  ]

  cities.forEach(city => {
    const marker = new AMap.Marker({
      position: city.position,
      title: city.name,
      content: `
        <div style="
          background: ${city.color};
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${city.name}
        </div>
      `
    })

    // 点击城市标记显示信息
    marker.on('click', () => {
      infoWindow.setContent(`
        <div style="padding: 10px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${city.name}</h4>
          <p style="margin: 0; color: #666; font-size: 12px;">
            坐标: ${city.position[0]}, ${city.position[1]}
          </p>
        </div>
      `)
      infoWindow.open(map, city.position)
    })

    map.add(marker)
  })
}

// 添加人员标记
const addPeopleMarkers = (AMap) => {
  props.people.forEach(person => {
    const location = locationData[person.town] || locationData[person.village]
    if (location) {
      const marker = new AMap.Marker({
        position: location.center,
        title: person.name,
        content: createMarkerContent(person),
        zIndex: 100 // 确保人员标记在最上层
      })

      // 点击标记显示信息
      marker.on('click', () => {
        showPersonInfo(person)
      })

      markers.push(marker)
      map.add(marker)
    }
  })
}

// 创建标记内容
const createMarkerContent = (person) => {
  return `
    <div class="custom-marker">
      <div class="marker-icon">👤</div>
      <div class="marker-name">${person.name}</div>
    </div>
  `
}

// 显示人员信息
const showPersonInfo = (person) => {
  const location = locationData[person.town] || locationData[person.village]
  if (location && infoWindow) {
    const content = `
      <div class="info-window">
        <h4>${person.name}</h4>
        <p>所属：${person.town}${person.village ? ' - ' + person.village : ''}</p>
      </div>
    `
    infoWindow.setContent(content)
    infoWindow.open(map, location.center)
  }
}

// 高亮人员
const highlightPerson = (person) => {
  selectedPerson.value = person
  const location = locationData[person.town] || locationData[person.village]
  
  if (location) {
    // 移动地图到该位置，但保持合适的缩放级别
    map.setCenter(location.center)
    map.setZoom(10) // 适中的缩放级别，可以看到周围区域
    
    // 显示信息窗口
    showPersonInfo(person)
  }
}

// 重置到中国全貌
const resetToChina = () => {
  if (map) {
    map.setCenter([104.114129, 37.550339]) // 中国中心坐标
    map.setZoom(5) // 显示整个中国
    selectedPerson.value = null
    if (infoWindow) {
      infoWindow.close()
    }
  }
}

// 组件挂载
onMounted(async () => {
  await nextTick()
  console.log('组件挂载，地图容器:', mapContainer.value)
  if (mapContainer.value) {
    console.log('地图容器尺寸:', {
      width: mapContainer.value.offsetWidth,
      height: mapContainer.value.offsetHeight
    })
    initMap()
  } else {
    console.error('地图容器未找到')
  }
})

// 组件卸载
onUnmounted(() => {
  if (map) {
    map.destroy()
  }
})

// 暴露方法给父组件
defineExpose({ 
  highlightAreaByName: highlightPerson, 
  resetToChina 
})
</script>

<style scoped>
.amap-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.map-container {
  flex: 1;
  height: 100vh;
  min-height: 500px;
  width: 100%;
}

.map-controls {
  width: 300px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
}

.people-list h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.map-info {
  background: #e6f7ff;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  border-left: 3px solid #1890ff;
}

.map-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.people-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.people-list li {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.people-list li:hover {
  background: #f0f6ff;
  border-color: #1890ff;
}

.people-list li.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.people-list .name {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.people-list .location {
  display: block;
  font-size: 12px;
  color: #666;
}

/* 自定义标记样式 */
:deep(.custom-marker) {
  text-align: center;
  background: white;
  border: 2px solid #1890ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

:deep(.marker-icon) {
  font-size: 16px;
  line-height: 1;
}

:deep(.marker-name) {
  font-size: 10px;
  color: #333;
  font-weight: 600;
  margin-top: 2px;
}

/* 信息窗口样式 */
:deep(.info-window) {
  padding: 10px;
  min-width: 150px;
}

:deep(.info-window h4) {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

:deep(.info-window p) {
  margin: 0;
  color: #666;
  font-size: 12px;
}
</style>
