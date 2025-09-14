<template>
	<div class="member-detail">
		<div class="detail-logo"></div>
		<div class="inner-top"></div>
		<div class="inner-bottom"></div>
		<div class="bottom-light--brown"></div>
		<div class="main-box">{{memberDetailOb}}</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		defineExpose,
		computed,
		onMounted
	} from "vue";
	import {
		dataApi
	} from "@/utils/api";
	import {
		useRoute
	} from 'vue-router';

	const route = useRoute();
	// 响应式变量
	const memberDetailOb = ref({});
	const loading = ref(true);
	const error = ref(null);
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
	});
</script>

<style lang='scss' scoped>
	.member-detail {
		width: 100%;
		height: 100%;
		background: url('@/static/f-images/home-bg.jpg') repeat;
		position: relative;

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
			width: calc(100% - 40px);
			position: absolute;
			z-index: 3;
			top: 100px;
			left: 20px;
			background: #fff;
			border-radius: 8px;
		}
	}
</style>