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
		<div class="bottom-light--brown"></div>

		<div class="main-box">
			<div class="main-box--inner">
				<div class="header-info">
					<el-avatar class="header-avatar" :size="50" :src="memberDetailOb.headImg || defaultImg" />
					<div class="header-name--box">
						<div class="header-name">{{memberDetailOb.name}}</div>
						<div class="header-birth">{{birthday}}</div>
					</div>
				</div>
				<div class="map-box">
					<MapDemo></MapDemo>
				</div>

				<div class="timeline">
					<div v-for="item in years.value" :key="item" class="timeline-item"
						:class="{ active: item.enable==1 }" @click="">
						<span>{{ item.year }}</span>
						<div class="dot"></div>
					</div>
					<div class="hr"></div>
				</div>

				<div class="home-view--box">
					<div class="home-view--header">
						家乡风貌
					</div>

					<div class="no-data" v-if="homeViewList&&homeViewList.value&&homeViewList.value.length==0">
						暂无数据
					</div>
					<div v-else>
						<el-carousel :interval="4000" type="card" height="150px" indicator-position="none">
							<el-carousel-item v-for="item in homeViewList.value" :key="item.id">
								<div class="home-view--item">
									<el-image class="home-view--img" :fit="fit" :src="item.imgUrl">
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
							</el-carousel-item>
						</el-carousel>
					</div>
				</div>


				<div class="home-view--box">
					<div class="home-view--header">
						家族故事
					</div>

					<div class="personal-info" v-if="memberDetailOb.info">
						{{memberDetailOb.info}}
					</div>
					<div class="no-data" v-else>
						暂无数据
					</div>
				</div>

				<div class="home-view--box">
					<div class="home-view--header">
						故土寻根
					</div>


					<div class="" v-if="isDataLoaded">
						<family-tree :familyData="familyData"></family-tree>
					</div>
					<!-- 			<div class="no-data" >
						暂无数据
					</div> -->
				</div>

				<div class="home-view--box">
					<div class="home-view--header">
						最新动态
					</div>

					<div class="no-data" v-if="newsList&&newsList.value&&newsList.value.length==0">
						暂无数据
					</div>
					<div v-else>
						<el-carousel :interval="4000" type="card" height="150px" indicator-position="none">
							<el-carousel-item v-for="item in newsList.value" :key="item.activityId">
								<div class="home-view--item">
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
							</el-carousel-item>
						</el-carousel>
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
	import MapDemo from '@/viewFront/memberDetail/MapDemo.vue'
	import moment from 'moment'
	import {
		ref,
		reactive,
		computed,
		onMounted,
		nextTick
	} from "vue";
	import {
		dataApi
	} from "@/utils/api";
	// echart ⬇️
	import * as echarts from 'echarts';


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

	// 响应式变量
	const memberDetailOb = ref({});
	const loading = ref(true);
	const error = ref(null);
	const defaultImg = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
	const birthday = computed(() => {
		return moment(memberDetailOb.value.birthMonth).format("YYYY-MM")
	})
	const fit = ref('contain')

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
			"userId": route.params.id
		}
		const result = await dataApi.newsList(params)
		if (result.code == 200) {
			newsList.value = result.data.pageData;
			console.log('newsList', newsList.value)
		}
	}

	const homeViewList = reactive([])

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
				console.log('years', years.value);
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


	});
</script>

<style lang='scss' scoped>
	.member-detail {

		height: auto;
		/* 确保整个页面视口的高度 */
		margin: 0;

		.no-data {
			margin: 50px 0;
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
			background: url('@/static/f-Images/inner-bottom.jpg') no-repeat;
			background-size: contain;
			position: fixed;
			bottom: 0;
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
			width: calc(100% - 10px);
			position: absolute;
			z-index: 30;
			top: 95px;
			bottom: 100px;
			left: 5px;


			/* 	overflow-x: hidden;
			overflow-y: auto; */
			.main-box--inner {
				position: relative;
				background: #fcf9f4;
				border-radius: 10px;
				margin-bottom: 50px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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


			@media (max-width: 768px) {
				.header-info {}
			}


		}

	}
</style>