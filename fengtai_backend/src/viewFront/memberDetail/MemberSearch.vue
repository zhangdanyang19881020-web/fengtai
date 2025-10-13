<template>
	<div class="member-detail">
		<div class="arrow-left" @click="goBack">
			<el-icon>
				<ArrowLeft />
			</el-icon>
		</div>
		<div class="detail-logo"></div>
		<div class="inner-top"></div>
		<div class="inner-bottom"></div>
		<!-- <div class="bottom-light--brown"></div> -->

		<div class="main-box">
			<div class="main-box--inner">
				<div class="map-box">
					<MapDemoSearch></MapDemoSearch>
				</div>

				<div class="home-view--box">
					<div class="home-view--header">
						最新动态
					</div>

					<div class="no-data" v-if="newsList&&newsList.value&&newsList.value.length==0">
						暂无数据
					</div>
					<div v-else>
						<div class="home-view--list">
							<div class="home-view--item" v-for="item in newsList.value" :key="item.activityId"
								@click="goActivityDetail(item)">
								<el-image class="home-view--img" :fit="fit" :src="item.headImg">
									<template #error>
										<div class="image-slot">
											<el-icon><icon-picture /></el-icon>
										</div>
									</template>
								</el-image>
								<div class="home-view--title">
									{{item.title}}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="height:20px"></div>

			</div>
			<div style="height:20px"></div>
		</div>
	</div>
</template>

<script setup>
	import {
		Picture as IconPicture,
		ArrowLeft
	} from '@element-plus/icons-vue'
	import FamilyTree from '@/viewFront/memberDetail/FamilyTree.vue'
	import MapDemoSearch from '@/viewFront/memberDetail/MapDemoSearch.vue'
	import moment from 'moment'
	import {
		ref,
		reactive,
		computed,
		onMounted,
		nextTick,
		onUnmounted
	} from "vue";
	import {
		dataApi
	} from "@/utils/api";
	// echart ⬇️
	import * as echarts from 'echarts';

	const scrollContainer = ref(null);
	import {
		useRoute,
		useRouter
	} from 'vue-router';

	const route = useRoute();
	const router = useRouter();
	import {
		useStore
	} from 'vuex';
	const store = useStore();
	const goBack = () => {
		router.go(-1);
	}
	import {
		debounce
	} from 'lodash-es';
	// 响应式变量
	const memberDetailOb = ref({});
	const loading = ref(true);
	const error = ref(null);
	const defaultImg = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
	const birthday = computed(() => {
		return moment(memberDetailOb.value.birthMonth).format("YYYY-MM")
	})
	const fit = ref('contain')
	// 动画start

	const translateX = ref(0); // Initialize the translation value to 0

	const moveDistance = 180; // The distance to move the images
	const interval = 2000; // Interval for moving (in milliseconds)
	let intervalId = null; // To store the interval ID for clearing it
	let intervalId0 = null;

	// Function to move the list every second
	const moveList = () => {
		translateX.value -= moveDistance; // Move the list to the left by 170px

		if (Math.abs(translateX.value) >= moveDistance) {
			// Reset to original position if it's fully moved
			// Remove the first item and append it to the end of the array
			const removedItem = homeViewList.value.shift(); // Remove the first item
			homeViewList.value.push(removedItem); // Append the removed item to the end of the array
			translateX.value = 0;
			// console.log('removedItem', removedItem)

		}


		// // Check if the list has moved beyond its total width
		if (Math.abs(translateX.value) >= homeViewList.value.length * moveDistance) {
			// Reset to original position if it's fully moved
			// const removedItem = homeViewList.value.shift(); // Remove the first item
			// homeViewList.value.push(removedItem);
		}
	};


	// 动画end

	const goActivityList = (item) => {
		// console.log('goActivityList',item)
		router.push({
			name: 'activityList',
			query: {
				year: item.year,
				userId: route.params.id
			}
		})
	}
	const goActivityDetail = (item) => {
		// console.log('goActivityDetail')
		setTimeout(() => {
			router.push({
				name: 'activityDetail',
				params: {
					id: item.activityId,

				}
			})
		}, 1000)
	}


	const years = reactive([])
	const activeYear = ref(null);

	const isDataLoaded = ref(false);
	const familyData = ref({})

	const getRelationShip = async () => {
		let params = {
			id: route.params.id
		}
		const result = await dataApi.getRealtionDetail(params);
		if (result.code == 200) {
			if (result.data.length > 0) {
				familyData.value = result.data[0];
				isDataLoaded.value = true;
				console.log('familyData', familyData)
			}
			store.commit('realtionDetailX', result.data);

		}
	}

	// const familyData3 = computed(() => {
	// 	console.log('familyData3', store.state.realtionDetailX)
	// 	return store.state.realtionDetailX[0]
	// });

	const newsList = reactive([])
	const getNewsList = async () => {
		let params = {
			"title": "",
			"startTime": "",
			"endTime": "",
			"pageSize": 100,
			"pageIndex": 1,
			"year": "",
			"userId": ""
		}
		const result = await dataApi.newsList(params)
		if (result.code == 200) {
			newsList.value = result.data.pageData;
			console.log('newsList', newsList.value)
		}
	}

	const homeViewList = reactive([])
	const homeViewPreList = reactive([])

	const getHomeView = async (ob) => {
		let params = {
			"targetId": ob.region.id,
			"targetType": 1,
			"pageSize": 100,
			"pageIndex": 1
		}
		const result = await dataApi.homeViewList(params);
		console.log('homViewList', result)
		if (result.code == 200) {
			homeViewList.value = result.data.pageData;
			homeViewPreList.value = result.data.pageData.map(x => {
				return x.imgUrl;
			})
			console.log('homeViewList', homeViewList)
		}

	}

	// 获取台胞详情
	const getDetail = async () => {
		try {
			// 获取路由参数中的 id
			const params = {
				id: route.params.id
			};
			const result = await dataApi.memberDetail(params);

			if (result.code === 200 && result.data) {
				memberDetailOb.value = result.data; // 假设接口返回的数据存储在 result.data

				years.value = result.data.year;
				// console.log('years', years.value);
				// if (years.value.length > 0) {
				// 	nextTick(() => {
				// 		const container = scrollContainer.value;
				// 		console.log('container',container)
				// 		if (container) {
				// 			container.scrollLeft = container.scrollWidth;
				// 		}
				// 	});
				// }
				store.commit('memberDetailOb', memberDetailOb.value);
				getHomeView(memberDetailOb.value)
			} else {
				error.value = '未找到相关数据';
			}
		} catch (err) {
			console.error('获取台胞详情失败:', err);
			error.value = '数据加载失败，请稍后重试';
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {

		getDetail(); // 在组件挂载时调用
		getRelationShip();
		getNewsList();

		// 等待 DOM 更新后执行，确保元素可用
		nextTick(() => {
			// setTimeout(() => {
			// 	const container = scrollContainer.value;
			// 	console.log('container--',container)
			// 	if (container) {
			// 		// 将 scrollLeft 设置为 scrollWidth，实现滚动到最右边
			// 		requestAnimationFrame(() => {
			// 			container.scrollLeft = container.scrollWidth; // 滚动到最右边
			// 		});
			// 	}
			// }, 3000)

			const container = document.getElementById('scrollContainerId');
			// console.log('container-id--',container)
			if (container) {
				container.scrollLeft = container.scrollWidth; // 滚动到最右边
			}
			// Trigger animation every second
			// intervalId = setInterval(moveList, interval);

		});


	});

	onUnmounted(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}

	});
</script>

<style lang='scss' scoped>
	.member-detail::before {
		content: "";
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('@/static/f-Images/home-bg.jpg') repeat center center / cover;
		z-index: -1;
		/* 放到最底层 */
	}

	.member-detail {
		margin: 100%;
		height: 100%;
		/* 确保整个页面视口的高度 */


		.no-data {
			margin: 50px 0;
		}

		.friend-linker {
			display: flex;
			align-items: center;
			color: #9c331a;
			padding: 10px 20px;
			background: rgba(215, 195, 137, 0.2);
			font-size: 14px;

			.friend-linker--item {
				width: 50%;
				color: #9c331a;

				.grey {
					color: rgba(0, 0, 0, 0.3);
				}
			}
		}

		/* 移除默认的页面边距 */
		.arrow-left {
			position: absolute;
			top: 38px;
			left: 10px;
			cursor: pointer;
			z-index: 40;
			font-size: 30px;
			color: #651d00;

			&:hover {
				color: #9a2e03;
			}
		}

		.detail-logo {
			background: url('@/static/f-Images/webp/small-logo.webp') no-repeat;
			position: absolute;
			background-size: contain;
			width: 100%;
			height: 40px;
			top: 35px;
			left: 50%;
			z-index: 10;
			transform: translateX(-70px);
		}

		.inner-top {
			background: url('@/static/f-Images/inner-top.jpg') no-repeat;
			background-size: contain;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 300px;
		}

		.inner-bottom {
			background: url('@/static/f-Images/inner-bottom-2.jpg') no-repeat;
			background-size: contain;
			position: fixed;
			bottom: -50px;
			left: 0;
			width: 100%;
			height: 250px;
			z-index: 1;
		}

		.bottom-light--brown {
			position: fixed;
			background: linear-gradient(to top, rgba(122, 76, 0, 1) 0%, rgba(122, 76, 0, 0) 100%);
			width: 100%;
			height: 300px;
			bottom: -180px;
			left: 0;
			z-index: 30;
		}


		.main-box::-webkit-scrollbar {
			width: 6px;
			/* 设置滚动条的宽度 */
		}

		.main-box::-webkit-scrollbar-thumb {
			background: rgba(194, 136, 66, 0.3);
			/* 滑块的颜色 */
			border-radius: 3px;
		}

		.main-box::-webkit-scrollbar-track {
			background: #f1f1f1;
			/* 滚动条轨道的颜色 */
		}

		.main-box {
			width: 100%;
			position: absolute;
			z-index: 30;
			top: 95px;
			bottom: 100px;
			left: 0;

			/* 	overflow-x: hidden;
			overflow-y: auto; */
			.main-box--inner {
				position: relative;
				background: #fcf9f4;
				border-radius: 10px;
				margin-bottom: 50px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
				overflow-x: hidden;
			}


			.header-info {
				display: flex;
				justify-content: flex-start;
				color: #333;
				gap: 5px;
				margin: 0 20px 0 20px;
				transform: translateY(20px);

				.header-avatar {
					margin-right: 10px;
				}

				.header-name--box {
					line-height: 25px;

					.header-name {
						font-size: 16px;
						font-weight: bold;
						color: #333;
					}

					.header-birth {
						font-size: 14px;
						color: #727171;
					}
				}

			}

			.map-box {
				position: relative;
				width: 100%;
				height: 360px;
			}


			/* 	@media (max-width: 768px) {
				.header-info {}
			} */


		}

	}
</style>