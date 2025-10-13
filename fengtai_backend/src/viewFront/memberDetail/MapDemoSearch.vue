<template>
	<div class="map-demo">
		<div class="map">
			<FenghuaMapSearch ref="mapRef" v-if="geojson" :geojson="geojson" :people="people"
				@streetMapClick="streetMapClickFn" />
			<div v-else class="placeholder">正在加载地图数据...</div>
		</div>
		<transition name="el-zoom-in-top">
			<div class="street-box" v-if="streetOb.regionName">
				<div class="street-name" v-if="streetOb.regionName">{{streetOb.regionName}}</div>
				<ul class="village-list">
					<li class="village-item" v-for="(item,index) in streetOb.subRegions" :key="index">
						{{item.regionName}}
					</li>
				</ul>
			</div>
		</transition>
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
	const streetMapClickFn = (params,streetMemberCountArr) => {
		console.log('xxxxwwxx', params,streetMemberCountArr)
		streetOb.value = streetMemberCountArr.find(x => x.regionName == params.name);
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
		box-sizing: border-box;

		.map {
			width: calc(100% + 80px);
			border-radius: 8px;
			overflow: hidden;
			transform: translateX(-40px);
		}
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

	.street-box {
		box-sizing: border-box;
		width: calc(100% - 30px);
		margin: 0 15px 15px 15px;
		border: 1px solid #ede3d1;
		border-radius: 10px;
		overflow: hidden;

		.street-name {
			padding: 10px;
			background: #ede3d1;
			color: #5b1107;
		}

		.village-list {
			list-style: none;
			padding: 0;

			.village-item {
				padding: 7px 10px;
				color: #842012;
				margin:5px 10px;
				.village-item--span{
					color:rgba(0,0,0,0.3);
				}

				&:hover {
					background: rgba(237, 227, 209, 0.5);
				}
			}
		}
	}
</style>