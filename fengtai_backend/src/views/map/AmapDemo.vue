<template>
  <div class="amap-demo">
    <div class="header">
      <h1>中国地图 - 高德地图版</h1>
      <div class="controls">
        <button @click="refreshData" :disabled="loading">
          {{ loading ? '加载中...' : '刷新数据' }}
        </button>
        <button @click="resetMap">重置地图</button>
      </div>
    </div>
    
    <div class="content">
      <AmapFenghua :people="people" ref="amapRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AmapFenghua from '@/components/AmapFenghua.vue'

// 响应式数据
const people = ref([])
const loading = ref(false)
const amapRef = ref(null)

// 模拟人员数据
const mockPeople = [
  { name: '张三', town: '锦屏街道', village: '' },
  { name: '李四', town: '岳林街道', village: '' },
  { name: '王五', town: '西坞街道', village: '' },
  { name: '赵六', town: '锦屏街道', village: '东门村' },
  { name: '钱七', town: '岳林街道', village: '西门村' },
  { name: '孙八', town: '西坞街道', village: '南门村' }
]

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 尝试从API加载，失败则使用模拟数据
    try {
      const response = await fetch('/data/people.json')
      if (response.ok) {
        people.value = await response.json()
      } else {
        throw new Error('API not available')
      }
    } catch (error) {
      console.log('使用模拟数据:', error.message)
      people.value = mockPeople
    }
  } catch (error) {
    console.error('数据加载失败:', error)
    people.value = mockPeople
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 重置地图
const resetMap = () => {
  if (amapRef.value && amapRef.value.resetToChina) {
    amapRef.value.resetToChina()
  }
}

// 组件挂载
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.amap-demo {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.controls button:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.content {
  flex: 1;
  overflow: hidden;
}
</style>
