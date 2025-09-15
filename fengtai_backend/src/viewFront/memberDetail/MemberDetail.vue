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
				<div v-for="item in years.value" :key="item" class="timeline-item" :class="{ active: item.enable==1 }"
					@click="">
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
					<el-carousel :interval="4000" type="card" height="150px">
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


		</div>
	</div>
</template>

<script setup>
	import {
		Picture as IconPicture,
		ArrowLeft
	} from '@element-plus/icons-vue'
	import MapDemo from '@/viewFront/memberDetail/MapDemo.vue'
	import moment from 'moment'
	import {
		ref,
		reactive,
		defineExpose,
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

		nextTick(() => {

		})
	});
</script>

<style lang='scss' scoped>
	.member-detail {
		background: url('@/static/f-Images/home-bg.jpg') repeat;
		background-size: cover;
		/* 背景图覆盖整个页面 */
		background-position: center center;
		/* 背景图居中显示 */
		/* 背景图从右下角开始 */
		background-attachment: fixed;
		/* 背景图固定在页面视口，不随滚动移动 */
		height: 100vh;
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

		.main-box {
			width: calc(100% - 10px);
			height: 100%;
			position: absolute;
			z-index: 5;
			top: 100px;
			bottom: 100px;
			left: 5px;
			background: #fcf9f4;
			border-radius: 10px;
			margin-bottom: 50px;

			.header-info {
				position: relative;
				display: flex;
				justify-content: flex-start;
				color: #333;
				gap: 5px;
				margin: 20px;
				height: 100px;

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
				position: absolute;
				top: 70px;
				left: 0;
				width: 100%;
				height: 360px;
			}


			@media (max-width: 768px) {
				.header-info {}
			}


		}

	}
</style>