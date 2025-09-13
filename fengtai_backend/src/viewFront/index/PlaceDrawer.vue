<template>
	<el-dialog v-model="dialogVisible" title="" width="90%" :before-close="handleClose" class="custom-dialog">
		<div class="dialog-content">
			<!-- 顶部信息 -->
			<div class="header-info">
				<span>目前已为您联系到 <span class="highlight">{{ relativeCount }}</span> 位台胞</span>
			</div>

			<!-- 亲戚列表 -->
			<el-scrollbar class="relative-list" :style="{'height':scrollHeight+'px'}">
				<place-item :placeList="placeList"></place-item>
			</el-scrollbar>

			<!-- 重新查询按钮 -->
			<div class="footer">
				<div class="search-btn" @click="choosePeople">选择</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		defineExpose,
		computed,
		onMounted,
		defineProps
	} from "vue";
	import {
		ElDialog,
		ElButton,
		ElAvatar,
		ElRow,
		ElCol,
		ElScrollbar
	} from "element-plus";
	import {
		dataApi
	} from "@/utils/api";
	
	import PlaceItem from '@/components/front/PlaceItem.vue'

	// 弹窗状态
	const dialogVisible = ref(false);

	// 获取父组件传递的 prop
	// const props = defineProps({
	// 	regionList: Array, // 这里定义了父组件传递的属性及其类型
	// });
	// 解构获取传递的 prop
	// const { regionList } = defineProps();


	// 亲戚数据
	const placeList = ref([]);
	const relativeCount = ref(0);

	const scrollHeight = computed(() => {
		const windowHeight = document.documentElement.clientHeight;
		console.log(windowHeight); // 输出浏览器可视区域的高度（以像素为单位）
		return windowHeight - 400;
	})
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

	// 关闭弹窗
	const handleClose = () => {
		dialogVisible.value = false;
	};

	// 刷新查询
	const choosePeople = () => {
		// 在这里添加重新查询的逻辑，刷新亲戚数据
		ElMessage.success("选中...");
	};

	const open = (regionList) => {
		dialogVisible.value = true;
		placeList.value = regionList.map(x=>{
			return {
				...x,
				childrenShow:false
			}
		})
		console.log('placeList',placeList)
	}
	defineExpose({
		open,
	})
	onMounted(() => {
		relativeCountFn()
	})
</script>

<style lang="scss" scoped>
	.custom-dialog {
		.search-btn {
			margin: 0 auto;
		}

		.relative-list {
		
		}


	}



	.el-dialog__header {
		background-color: #f6f6f6;
		padding: 16px;
	}

	.dialog-content {
		padding: 20px;
	}

	.header-info {
		font-size: 16px;
		font-size: 20px;
		text-align: center;
		color: #3d3d3d;
		transform: translateY(-25px);
	}

	.highlight {
		color: #ff7f50;
	}



	.relative-avatar {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.relative-info {
		font-size: 14px;
		color: #727171;
	}

	.relative-year {
		font-size: 14px;
		text-align: right;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		color: #727171;
	}

	.footer {
		text-align: center;
		margin-top: 20px;
	}
</style>