<template>
	<div class="activity-list">
		<div class="header">
			活动列表
		</div>
		<ul class="activity-items">
			<li v-for="(item, index) in activities" :key="item.activityId" class="activity-item">
				<div class="activity-title">
					<span>{{ item.title }}</span>
				</div>
				<div class="activity-date">
					<span>{{ item.activityTime }}</span>
				</div>
			</li>
		</ul>
		<div class="footer">
			<button @click="goBack" class="back-button">返回</button>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		reactive
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

	const activities = reactive([])
	const getNewsList = async () => {
		let params = {
			"title": "",
			"startTime": "",
			"endTime": "",
			"pageSize": 100,
			"pageIndex": 1,
			"year": route.query.year,
			"userId": route.query.userId
		}
		const result = await dataApi.newsList(params)
		if (result.code == 200) {
			activities.length = 0; // Clear existing data
			activities.push(...result.data.pageData); // Add new data
			console.log('activities', activities.value)
		}
	}

	const goBack = () => {
		// handle the "back" button action
		console.log('Returning to previous page...');
	};
	onMounted(() => {
		getNewsList();
	})
</script>

<style lang="scss" scoped>
	.activity-list {
		width: 100%;
		height: 100%;
		position: relative;
		margin: 0 auto;
		background-color: #f9f8f5;
		border-radius: 8px;
	}

	.header {
		text-align: center;
		margin-bottom: 20px;
		// background: #fcf9f4;
		background: url('@/static/f-Images/header.jpg');
		background-size: cover;
		height: 60px;
		line-height: 60px;
		width: 100%;
		box-shadow: 0 3px 10px #d2c8b7;
		color: #4d2d07;
		font-weight: bold;
		font-size: 18px;

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
			padding: 7px 30px;
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


	.activity-items {
		list-style: none;
		padding: 0;
		margin: 5px 10px;

		.activity-item {
			display: flex;
			justify-content: space-between;
			padding: 10px 15px;
			background: #fff;
			border-radius: 4px;
			margin-bottom: 7px;
			box-shadow: 0 3px 3px #f6f1e6;
			font-size: 14px;

			&:hover {
				background: #efe5d4;
			}
		}
	}



	.activity-title {
		font-size: 16px;
		color: #333;
	}

	.activity-date {
		font-size: 14px;
		color: #888;
	}
</style>