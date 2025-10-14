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
					<li class="village-item" v-for="(item,index) in streetOb.subRegions" :key="index"
						@click="villageChoose(item,index)">
						{{item.regionName}}
					</li>
				</ul>
			</div>
		</transition>
		<div class="total-members--box">
			<label>目前以为您联系到<span class="highlight">{{relativeCount}}</span>位台胞</label>
		</div>
		<PeopleDrawer ref="peopleDrawerRef" />
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		reactive
	} from 'vue'
	import {
		dataApi
	} from "@/utils/api";
	import FenghuaMapSearch from '@/components/FenghuaMapSearch.vue'
	import rawData from '@/datas/fenghua.json'
	import PeopleDrawer from '@/viewFront/index/PeopleDrawer.vue'
	import {
		useStore
	} from 'vuex'
	import {
		ElDialog,
		ElButton,
		ElAvatar,
		ElRow,
		ElCol,
		ElScrollbar,
		ElMessage,
		ElMessageBox
	} from "element-plus";
	const store = useStore();

	const mapRef = ref()
	const geojson = ref(null)
	const people = ref([])
	const relativeCount = ref(0)
	const peopleDrawerRef = ref(null);

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
	const streetMapClickFn = (params, streetMemberCountArr) => {
		// console.log('xxxxwwxx', params, streetMemberCountArr)
		streetOb.value = streetMemberCountArr.find(x => x.regionName == params.name);
		store.commit('setChoosedStreet', streetOb.value);
		console.log('streetOb', streetOb.value)
	}

	const villageChoose = (item, index) => {
		store.commit('setChoosedVillage', item);
		choosePlace();
	}

	// 刷新查询
	const choosePlace = async () => {
		// 在这里添加重新查询的逻辑，刷新亲戚数据	
		let params = {
			serachType: 1,
			val: store.getters.choosedStreet.regionId + '-' + store.getters.choosedVillage.regionId
		}
		// console.log('params', params)
		const result = await dataApi.indexSearch(params);
		if (result.code == 200) {
			if (result.data.length == 0) {
				ElMessage({
					message: '该村下暂未关联该村祖籍的台胞人员,请选择其他村进行搜索!',
					type: 'error',
				});
			} else {
				ElMessage({
					message: result.message,
					type: 'success',
				});
				choosePlaceFn(result.data)
			}
		} else {
			ElMessage({
				message: result.message,
				type: 'error',
			});
		}
	};
	const choosePlaceFn = (data) => {
		console.log('choosePlaceFn', data);
		if (data.length > 0) {
			if (peopleDrawerRef.value) {
				peopleDrawerRef.value.open(data);
			}
		}
	}
	// 显示的亲戚数量
	const relativeCountFn = async () => {
		// return relatives.value.length
		const result = await dataApi.indexPeopleCount();
		if (result.code == 200) {
			relativeCount.value = result.data
		} else {
			relativeCount.value = '--'
		}

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

			//台胞总人数
			relativeCountFn();

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

		.total-members--box {
			box-sizing: border-box;
			// width: calc(100% - 30px);
			margin: 0 15px 15px 15px;
			border: 1px solid #ede3d1;
			border-radius: 10px;
			background: #ede3d1;
			padding: 5px 15px;

			.highlight {
				color: #842012;
				margin: 0 5px;
			}
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
				margin: 5px 10px;

				.village-item--span {
					color: rgba(0, 0, 0, 0.3);
				}

				&:hover {
					background: rgba(237, 227, 209, 0.5);
				}
			}
		}
	}
</style>