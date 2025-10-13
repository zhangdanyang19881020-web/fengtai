<template>
	<div class="map-demo">
		<div class="map">
			<FenghuaMapSearch ref="mapRef" v-if="geojson" :geojson="geojson" :people="people"
				@streetMapClick="streetMapClickFn" />
			<div v-else class="placeholder">正在加载地图数据...</div>
		</div>
		<div class="street-box">
			<div class="street-name">{{streetOb.name}}</div>
			<ul class="village-list">
				<li class="village" v-for="(item,index) in streetOb.villages" :key="index">
					{{item}}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		reactive
	} from 'vue'
	import FenghuaMapSearch from '@/components/FenghuaMapSearch.vue'
	import rawData from '@/datas/fenghua.json'
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
	const streetOb = ref({
		name: '',
		villages: []
	});
	const streetMapClickFn = (params) => {
		// console.log('xxxxwwxx', params)
		streetOb.value = rawData.subdivisions.find(x => x.name == params.name);
		console.log('streetOb', streetOb.value)
	}

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

		} catch (error) {
			console.error('Error loading data:', error)
		}
	})
</script>



<style lang="scss" scoped>
	.map-demo {
		width: calc(100% + 80px);
		box-sizing: border-box;
		//
	}

	.map {
		border-radius: 8px;
		overflow: hidden;
		transform: translateX(-40px);
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