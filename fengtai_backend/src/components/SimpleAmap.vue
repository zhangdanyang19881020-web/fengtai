<template>
  <div class="simple-amap">
    <div ref="mapContainer" class="map-container"></div>
    <div class="debug-info">
      <p>地图状态: {{ mapStatus }}</p>
      <p>容器尺寸: {{ containerSize }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 动态导入，避免构建时错误
let AMapLoader = null
let amapConfig = null

// 异步加载配置和库
const loadDependencies = async () => {
  try {
    AMapLoader = await import('@amap/amap-jsapi-loader')
    const configModule = await import('@/config/amap.js')
    amapConfig = configModule.amapConfig
    console.log('地图配置:', amapConfig)
    return true
  } catch (error) {
    console.error('加载依赖失败:', error)
    return false
  }
}

const mapContainer = ref(null)
const mapStatus = ref('未初始化')
const containerSize = ref('0x0')
let map = null

const initMap = async () => {
  try {
    mapStatus.value = '正在加载依赖...'
    
    // 先加载依赖
    const depsLoaded = await loadDependencies()
    if (!depsLoaded) {
      throw new Error('依赖加载失败')
    }
    
    mapStatus.value = '正在加载API...'
    console.log('开始加载高德地图API...')
    console.log('使用的API Key:', amapConfig.key)
    console.log('安全密钥:', amapConfig.securityKey)
    
    // 验证配置
    if (!amapConfig.key) {
      throw new Error('API Key 未配置')
    }
    
    if (!amapConfig.securityKey) {
      throw new Error('安全密钥未配置')
    }
    
    const AMap = await AMapLoader.default.load({
      key: amapConfig.key,
      securityKey: amapConfig.securityKey,
      version: amapConfig.version,
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    })

    mapStatus.value = 'API加载成功，正在创建地图...'
    console.log('高德地图API加载成功')

    // 创建地图实例
    map = new AMap.Map(mapContainer.value, {
      center: [116.397428, 39.90923], // 北京坐标
      zoom: 10,
      mapStyle: 'amap://styles/normal'
    })

    mapStatus.value = '地图创建成功'
    console.log('地图创建成功')

    // 添加控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())

    // 添加一个测试标记
    const marker = new AMap.Marker({
      position: [116.397428, 39.90923],
      title: '北京'
    })
    map.add(marker)

    mapStatus.value = '地图初始化完成'
    console.log('地图初始化完成')

  } catch (error) {
    mapStatus.value = '初始化失败: ' + error.message
    console.error('地图初始化失败:', error)
    
    // 检查是否是API Key类型错误
    if (error.message.includes('INVALID_USER_KEY') || error.message.includes('INVALID_USER_SCODE')) {
      mapStatus.value = 'API Key错误：请使用"Web端(JS API)"类型的Key'
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      mapStatus.value = 'API配额超限：请检查Key使用量'
    } else if (error.message.includes('ACCESS_DENIED')) {
      mapStatus.value = '访问被拒绝：请检查域名白名单设置'
    }
  }
}

onMounted(async () => {
  await nextTick()
  
  if (mapContainer.value) {
    containerSize.value = `${mapContainer.value.offsetWidth}x${mapContainer.value.offsetHeight}`
    console.log('地图容器:', mapContainer.value)
    console.log('容器尺寸:', containerSize.value)
    
    // 延迟一点时间确保容器完全渲染
    setTimeout(() => {
      initMap()
    }, 100)
  } else {
    mapStatus.value = '地图容器未找到'
    console.error('地图容器未找到')
  }
})
</script>

<style scoped>
.simple-amap {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  min-height: 400px;
  background: #f0f0f0;
  border: 2px solid #ccc;
}

.debug-info {
  padding: 10px;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  font-size: 12px;
  color: #666;
}

.debug-info p {
  margin: 2px 0;
}
</style>
