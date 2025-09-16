<template>
	<div class="activity-list">
		<div class="header">
			活动列表
		</div>
		<ul class="activity-items--list" @scroll="handleScroll">
			<li v-for="(item, index) in activities" :key="item.activityId" class="activity-item">
				<div class="activity-title">
					<span>{{ item.title }}</span>
				</div>
				<div class="activity-date">
					<span>{{ item.activityTime }}</span>
				</div>
			</li>
			<div v-loading="isLoading"></div>
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
	const isLoading = ref(false); // Flag to prevent multiple API calls
	const pageIndex = ref(1); // Track current page index
	const totalPage = ref(0);
	const activities = reactive([])
	const getNewsList = async (page) => {
		let params = {
			"title": "",
			"startTime": "",
			"endTime": "",
			"pageSize": 13,
			"pageIndex": page,
			"year": route.query.year,
			"userId": route.query.userId
		}
		const result = await dataApi.newsList(params)
		if (result.code == 200) {
			if (page == 1) {
				activities.length = 0;
			}
			activities.push(...result.data.pageData); // Add new data
			totalPage.value = result.data.totalPage;
			isLoading.value = false;
			console.log('activities', activities.value)
		}
	}
	// Handle the scroll event
	const handleScroll = (event) => {
		const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
		if (bottom && !isLoading.value && pageIndex.value < totalPage.value) {
			// When the bottom is reached and data is not already loading, load more data
			pageIndex.value++;
			isLoading.value = true;
			getNewsList(pageIndex.value);
		} 
	}
	const goBack = () => {
		// handle the "back" button action
		// console.log('Returning to previous page...');
		router.go(-1);
	};
	onMounted(() => {
		getNewsList(pageIndex.value);
	})
</script>

<style lang="scss" scoped>
	.activity-list {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		margin: 0 auto;
		background-color: #f9f8f5;

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

		.activity-items--list {
			list-style: none;
			padding: 0;
			margin: 5px 10px;
			height: calc(100% - 150px);
			overflow-y: auto;

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