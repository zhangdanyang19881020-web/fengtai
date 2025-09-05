<script setup>
import { onMounted, onBeforeUnmount, ref, watch, defineExpose } from 'vue'
import * as echarts from 'echarts'

// Props
const props = defineProps({
  geojson: { type: Object, required: true }, // 奉化区镇/村 GeoJSON
  people: { type: Array, default: () => [] }, // [{ name, town, village }]
  initialHighlight: { type: String, default: '' } // 初始高亮的镇/村名
})

const chartRef = ref(null)
let chart
let mapName = 'fenghua-map'

function initChart() {
  if (!chartRef.value) {
    console.log('chartRef.value is null')
    return
  }
  console.log('Initializing chart with geojson:', props.geojson)
  chart = echarts.init(chartRef.value)
  
  // 注册地图
  try {
    echarts.registerMap(mapName, props.geojson)
    console.log('Map registered successfully')
  } catch (error) {
    console.error('Error registering map:', error)
  }
  
  // 延迟渲染，确保地图注册完成
  setTimeout(() => {
    renderOption()
  }, 200)
}

function renderOption(highlightName) {
  const regions = (props.geojson.features || []).map(f => f.properties && (f.properties.name || f.properties.NAME || f.properties.adname)).filter(Boolean)
  console.log('Regions found:', regions)
  console.log('Highlight name:', highlightName)

  // 如果自定义地图注册失败，使用简单的矩形测试
  if (regions.length === 0) {
    console.log('No regions found, using fallback visualization')
    const option = {
      title: {
        text: '奉化区地图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: [
          { name: '锦屏街道', value: [121.45, 29.65, 1] },
          { name: '岳林街道', value: [121.55, 29.65, 1] },
          { name: '西坞街道', value: [121.45, 29.55, 1] }
        ],
        symbolSize: 20,
        itemStyle: {
          color: '#ffcc00'
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right'
        }
      }],
      xAxis: {
        type: 'value',
        min: 121.3,
        max: 121.7
      },
      yAxis: {
        type: 'value',
        min: 29.4,
        max: 29.8
      }
    }
    chart.setOption(option, true)
    return
  }

  const option = {
    backgroundColor: '#f5f5f5', // 添加背景色
    tooltip: {
      trigger: 'item',
      formatter: params => `${params.name}`
    },
    // 添加网格配置，确保有背景
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '10%',
      containLabel: true,
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      borderWidth: 1
    },
    series: [
      {
        type: 'map',
        map: mapName,
        roam: true,
        // 设置地图中心点和缩放
        center: [121.5, 29.6],
        zoom: 1.2,
        // 设置地图边界
        boundingCoords: [
          [121.3, 29.4], // 西南角
          [121.7, 29.8]  // 东北角
        ],
        // 强制显示地图背景
        aspectScale: 0.75,
        layoutCenter: ['50%', '50%'],
        layoutSize: '80%',
        label: { 
          show: true, 
          color: '#333', 
          fontSize: 12,
          position: 'inside'
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          areaColor: '#E0ECFF'
        },
        emphasis: {
          label: { color: '#000', fontWeight: 'bold' },
          itemStyle: {
            areaColor: '#ffcc00'
          }
        },
        data: regions.map(name => ({ 
          name, 
          value: 1,
          itemStyle: {
            areaColor: name === highlightName ? '#ffcc00' : '#E0ECFF'
          }
        }))
      }
    ]
  }
  console.log('Setting chart option:', option)
  chart.setOption(option, true) // 强制重新渲染
  
  // 检查地图是否正常显示，如果不显示则使用散点图
  setTimeout(() => {
    const chartInstance = chart.getOption()
    if (!chartInstance.series || chartInstance.series.length === 0) {
      console.log('地图未正常显示，切换到散点图模式')
      renderFallbackChart()
    }
  }, 1000)
}

// 散点图备用方案
function renderFallbackChart() {
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: '奉化区地图（散点图模式）',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: params => `${params.name}`
    },
    xAxis: {
      type: 'value',
      min: 121.3,
      max: 121.7,
      name: '经度',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      min: 29.4,
      max: 29.8,
      name: '纬度',
      nameLocation: 'middle',
      nameGap: 50
    },
    series: [{
      type: 'scatter',
      data: [
        { name: '锦屏街道', value: [121.45, 29.65, 1] },
        { name: '岳林街道', value: [121.55, 29.65, 1] },
        { name: '西坞街道', value: [121.45, 29.55, 1] }
      ],
      symbolSize: 30,
      itemStyle: {
        color: '#1890ff',
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}',
        position: 'top',
        fontSize: 12,
        color: '#333'
      },
      emphasis: {
        itemStyle: {
          color: '#ffcc00',
          borderColor: '#ff6600',
          borderWidth: 3
        }
      }
    }]
  }
  chart.setOption(option, true)
}

// 对外暴露：高亮指定镇/村
function highlightAreaByName(name) {
  if (!chart) return
  renderOption(name)
}

defineExpose({ highlightAreaByName })

onMounted(() => {
  console.log('FenghuaMap mounted, geojson:', props.geojson)
  // 延迟初始化，确保DOM已渲染
  setTimeout(() => {
    initChart()
    if (props.initialHighlight) {
      highlightAreaByName(props.initialHighlight)
    }
  }, 100)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart && chart.dispose()
})

function handleResize() {
  chart && chart.resize()
}

watch(() => props.geojson, (geo) => {
  if (!geo) return
  echarts.registerMap(mapName, geo)
  renderOption()
})
</script>

<template>
  <div class="fenghua-map">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<style scoped>
.fenghua-map { width: 100%; height: 100%; }
.chart { width: 100%; height: 520px; }
</style>
