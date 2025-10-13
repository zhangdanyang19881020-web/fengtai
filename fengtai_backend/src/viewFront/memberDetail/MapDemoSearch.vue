<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import FenghuaMapSearch from '@/components/FenghuaMapSearch.vue'
	import {
		useStore
	} from 'vuex'
	const store = useStore();

	const mapRef = ref()
	const geojson = ref(null)
	const people = ref([])

	const detailMemberOb = computed(() => {
		return store.state.memberDetailOb;
	})

	function highlightByPerson() {
		// console.log('detailMemberOb.region.name', detailMemberOb)
		const areaName = detailMemberOb.value.region.name;
		if (mapRef) {
			mapRef.value?.highlightAreaByName(areaName)
		}

	}

	// function highlightAreaByCount(person) {
	// 	const areaName = detailMemberOb.value.region.name;
	// 	if (mapRef) {
	// 		mapRef.value?.highlightAreaByCount(areaName)
	// 	}
	// }

	onMounted(async () => {
		// 从 public 加载真实文件（你可以替换为自己的路径与文件）
		try {
			// console.log('Loading data...')
			const [geoRes, peopleRes] = await Promise.all([
				fetch('/data/330213.geojson'),
				fetch('/data/people.json')
			])
			geojson.value = await geoRes.json()
			people.value = await peopleRes.json()
			console.log('Data loaded:', {
				geojson: geojson.value,
				people: people.value
			})
			// setTimeout(() => {
			// 	highlightAreaByCount();
			// }, 800)
			setTimeout(() => {
				// highlightByPerson();
			}, 1000)
		} catch (error) {
			console.error('Error loading data:', error)
		}
	})
</script>

<template>
	<div class="map-demo">
		<div class="map">
			<FenghuaMapSearch ref="mapRef" v-if="geojson" :geojson="geojson" :people="people" />
			<div v-else class="placeholder">正在加载地图数据...</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.map-demo {
		width: calc(100% + 80px);
		box-sizing: border-box;
		transform: translateX(-40px);
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

	.sidebar li:hover {
		background: #f0f6ff;
	}

	.sidebar .name {
		font-weight: 600;
	}

	.sidebar .affix {
		color: #666;
		margin-left: 4px;
	}

	.map {
		border-radius: 8px;
		overflow: hidden;
	}

	.placeholder {
		padding: 24px;
		color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		font-size: 16px;
		justify-content: center;
		margin-top: 80px;
	}
</style>