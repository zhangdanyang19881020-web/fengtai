<template>
	<div class="index-page">
		<div class="moon"></div>
		<div class="top-mountain"></div>
		<div class="bototm-left--house"></div>
		<div class="bototm-right--house"></div>
		<div class="bottom-mountain"></div>
		<div class="bottom-light"></div>
		<div class="denglong"></div>
		<div class="logo"></div>
		<div class="input-box">
			<el-input class="z-input" placeholder="请输入您要查询的姓名/地名" v-model="searchVal"></el-input>
		</div>
		<!-- 搜索下拉框 -->
		<!-- 		<div v-show="showDropdown" class="search-dropdown" :style="{ top: dropdownTop + 'px' }">
			<div class="dropdown-item" v-for="(item, index) in filteredList" :key="index" @click="selectItem(item)">
				{{ item }}
			</div>
		</div> -->
		<div class="search-btn" @click="searchFn">查询</div>
		<!-- 通过props传递searchedPeopleList -->

		<!-- 通过 props 传递 searchedPeopleList；也支持通过 ref 调用 -->
		<PeopleDrawer ref="peopleDrawerRef" v-model:show="peopleDrawerShow" :list="searchedPeopleList" />
		<PlaceDrawer ref="placeDrawerRef" v-model:show="placeDrawerShow" :list="searchedPlaceList" />

	</div>

</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onBeforeUnmount,
		nextTick
	} from 'vue'
	import {
		dataApi
	} from '@/utils/api.js'
	import PeopleDrawer from '@/viewFront/index/PeopleDrawer.vue'
	import PlaceDrawer from '@/viewFront/index/PlaceDrawer.vue'

	// ----------------- state -----------------
	const searchVal = ref('')
	const showDropdown = ref(false)
	const filteredList = ref([])
	const regionStr = ref('');


	const peopleDrawerRef = ref(null);
	const peopleDrawerShow = ref(false); // 控制抽屉显示
	const searchedPeopleList = reactive([]); // 存储搜索结果


	const placeDrawerShow = ref(false);
	const placeDrawerRef = ref(null)
	const searchedPlaceList = reactive([]);

	const getRegionList = async () => {
		try {
			const result = await dataApi.regionList();
			if (result.code === 200 && result.data) {
				regionStr.value = result.data[0].children.map(x => x.name).join(', '); // 拼接地区名称
				console.log('regionStr', regionStr.value);
			} else {
				regionStr.value = '';
			}
		} catch (error) {
			console.error('获取地区列表失败:', error);
			regionStr.value = '';
		}
	}



	// ----------------- search action -----------------
	const searchFn = async () => {
		const val = searchVal.value.trim()
		if (!val) return

		// 地址搜索
		const isPlace = regionStr.value.includes(val);

		console.log('isPlace', isPlace)

		if (isPlace) {
			// TODO: 路由到地址详情页或调用地址搜索 API
			console.log('地址搜索:', val)
			console.log('placeDrawerRef--', placeDrawerRef)
			if (placeDrawerRef.value) {
				placeDrawerRef.value.open()				
			} else {
				// placeDrawerRef.value = true
			}
			return
		} else {
			// 人名搜索
			const params = {
				searchType: 0,
				val: searchVal.value
			}
			try {
				const result = await dataApi.indexSearch(params)
				if (result.code === 200) {
					// Update reactive list in-place
					searchedPeopleList.splice(0, searchedPeopleList.length, ...(result.data || []))

					// Prefer an exposed method if PeopleDrawer provides one
					console.log('peopleDrawerRef', peopleDrawerRef)
					if (peopleDrawerRef.value) {
						peopleDrawerRef.value.open(searchedPeopleList);
					}else{
						
					}
					
				}
			} catch (e) {
				console.error('搜索失败:', e)
			}
		}


	}

	onMounted(() => {
		getRegionList();
	})
</script>

<style lang="scss" scoped>
	.index-page {
		width: 100%;
		height: 100%;
		background: url('../../static/f-Images/home-bg.jpg') 100% 100% repeat;
		background-size: contain;
		position: relative;
		overflow-x: hidden;

		
		.search-btn {
			width: 150px;
			height: 35px;
			line-height: 35px;
			position: absolute;
			top: 460px;
			left: calc(50% - 75px);
			z-index: 15;
		
		}


		.input-box {
			.z-input {
				width: calc(100% - 40px);
				margin: 10px 20px;

				.el-input__wrapper {
					background: none;
				}
			}
		}




		.input-box {
			position: absolute;
			background: url('../../static/f-Images/webp/input-bg.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			left: 10%;
			top: 370px;
			width: 80%;
			height: 50px;
			z-index: 11;
		}

		.moon {
			position: absolute;
			background: url('../../static/f-Images/webp/moon-2.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			right: -20px;
			top: -20px;
			width: 200px;
			height: 200px;
			z-index: 3;
		}

		.bottom-mountain {
			position: absolute;
			background: url('../../static/f-Images/bottom-half-shan.jpg') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.bototm-left--house {
			position: absolute;
			background: url('../../static/f-Images/webp/bottom-left--cloud.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			max-width: 400px;
			z-index: 2;
		}

		.bototm-right--house {
			position: absolute;
			background: url('../../static/f-Images/webp/right-house-2.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			max-width: 400px;
			z-index: 3;
		}

		.top-mountain {
			position: absolute;
			background: url('../../static/f-Images/webp/top-left--sky2.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.bottom-light {
			position: absolute;
			background: url('../../static/f-Images/webp/bototm-light.webp') repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
		}

		.denglong {
			position: absolute;
			background: url('../../static/f-Images/webp/denglong-big.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			top: 70px;
			left: 30%;
			width: 50%;
			height: 50%;
			z-index: 10;
			animation: moveAndDisappear 40s ease-in-out infinite;
		}

		.logo {
			position: absolute;
			background: url('../../static/f-Images/webp/logo-together.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: center top;
			/* 背景图居中 */
			top: 200px;
			left: 60px;
			width: calc(100% - 120px);
			height: 100%;
			z-index: 11;
		}
	}


	@keyframes moveAndDisappear {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}

		100% {
			transform: translateY(-400px) translateX(200px) rotate(30deg);
			opacity: 0;
		}
	}
</style>