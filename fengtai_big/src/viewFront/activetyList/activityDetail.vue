<template>
	<div class="activity-list">
		<div class="header">
			活动详情
		</div>
		<div class="activity-detail" v-if="activityDetailOb.value">
			<div class="activity-detail--title">{{activityDetailOb.value.title}}</div>
			<div class="activity-detail--time">{{activityDetailOb.value.activityTime}}</div>
			<div class="red-line"></div>
			<el-image :src="activityDetailOb.value.indexImgUrl"></el-image>
			<div class="activity-detail--content" v-html="activityDetailOb.value.text"></div>
		</div>

		<div class="footer">
			<button @click="goBack" class="back-button">返回</button>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		reactive,
		nextTick
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	const route = useRoute()
	const router = useRouter()
	import {
		dataApi
	} from '@/utils/api.js'

	const activityDetailOb = reactive({})

	const getActivityDetail = async () => {
		let params = {
			activityId: route.params.id
		}
		const result = await dataApi.newsDetail(params);
		if (result.code == 200) {
			activityDetailOb.value = result.data;
			console.log('activityDetailOb', activityDetailOb)
		}
	}

	const goBack = () => {
		// handle the "back" button action
		// console.log('Returning to previous page...');
		router.go(-1);
	};
	onMounted(() => {
		nextTick(() => {
			getActivityDetail();
		})

	})
</script>

<style lang="scss" scoped>
	.activity-list {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		margin: 0 auto;
		background-color: #f6f1e5;

		.header {
			text-align: center;
			margin-bottom: 20px;
			// background: #fcf9f4;
			background: url('@/static/f-Images/header.jpg');
			background-size: cover;
			background-position: left bottom;
			height: 60px;
			line-height: 60px;
			width: 100%;
			box-shadow: 0 3px 10px #d2c8b7;
			color: #4d2d07;
			font-weight: bold;
			font-size: 18px;

		}

		.activity-detail {
			margin: 10px;
			background: #fcf9f4;
			border-radius: 10px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
			padding: 10px 15px;
			height: calc(100% - 150px);
			overflow-y: auto;

			.activity-detail--title {
				font-size: 18px;
				font-weight: bold;
				color: #000;
				margin-bottom: 10px;
			}

			.activity-detail--time {
				font-size: 12px;
				color: #333;
				margin-bottom: 10px;
			}

			.red-line {
				width: 100%;
				height: 1px;
				background: #9c331a;
				margin-bottom: 10px;
			}

			.activity-detail--content {
				font-size: 14px;
				color: #333;

			}
		}

		.footer {
			position: absolute;
			width: 100%;
			bottom: 0;
			left: 0;
			text-align: center;
			// background: #fcf9f4;
			height: 60px;
			line-height: 60px;
			width: 100%;
			box-shadow: 0 -3px 10px #d2c8b7;
			background: url('@/static/f-Images/header.jpg');
			background-position: right center;
			background-size: cover;
			color: #4d2d07;
			font-weight: bold;
			font-size: 20px;

			.back-button {
				padding: 7px 35px;
				background-color: #c28842;
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;

				.back-button:hover {
					background-color: #be873d;
				}
			}

		}

	}
</style>