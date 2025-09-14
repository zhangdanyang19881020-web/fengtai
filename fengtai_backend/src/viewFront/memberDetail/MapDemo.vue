<script setup>
import { ref, onMounted } from 'vue'
import FenghuaMap from '@/components/FenghuaMap.vue'

const mapRef = ref()
const geojson = ref(null)
const people = ref([])

function highlightByPerson(person) {
  const areaName = person.village || person.town
  mapRef.value?.highlightAreaByName(areaName)
}

onMounted(async () => {
  // 从 public 加载真实文件（你可以替换为自己的路径与文件）
  try {
    console.log('Loading data...')
    const [geoRes, peopleRes] = await Promise.all([
      fetch('/data/330213.geojson'),
      fetch('/data/people.json')
    ])
    geojson.value = await geoRes.json()
    people.value = await peopleRes.json()
    console.log('Data loaded:', { geojson: geojson.value, people: people.value })
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<template>
  <div class="map-demo">
<!--    <div class="sidebar">
      <h3>人员列表</h3>
      <ul>
        <li v-for="p in people" :key="p.name" @click="highlightByPerson(p)">
          <span class="name">{{ p.name }}</span>
          <span class="affix">（{{ p.town }}{{ p.village ? ' - ' + p.village : '' }}）</span>
        </li>
      </ul>
    </div> -->
    <div class="map">
      <FenghuaMap ref="mapRef" v-if="geojson" :geojson="geojson" :people="people" />
      <div v-else class="placeholder">正在加载地图数据...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-demo {
  height: 300px;
  box-sizing: border-box;
}
.sidebar {
  /* border: 1px solid #eee; */
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}
.sidebar ul {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.sidebar li {
  padding: 8px 6px;
  border-radius: 6px;
  cursor: pointer;
}
.sidebar li:hover { background: #f0f6ff; }
.sidebar .name { font-weight: 600; }
.sidebar .affix { color: #666; margin-left: 4px; }
.map { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.placeholder { padding: 24px; color: #999; }
</style>
