<template>
	<el-dialog v-model="dialogVisible" title="" width="90%" :before-close="handleClose" class="custom-dialog">
		<div class="dialog-content">
			<!-- 顶部信息 -->
			<div class="header-info">
				<span>请选择街道/镇/村搜索台胞</span>
			</div>
			<!-- 亲戚列表 -->
			<el-scrollbar class="relative-list" :style="{'height':scrollHeight+'px'}">
				<place-item :level="0" :placeList="placeList"></place-item>
			</el-scrollbar>

			<!-- 重新查询按钮 -->
			<div class="footer">
				<div class="search-btn" @click="choosePlace">选择</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted,
	} from "vue";
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
	import {
		dataApi
	} from "@/utils/api";
	import {
		useStore
	} from 'vuex';
	const store = useStore();

	// 定义 `emit` 事件
	const emit = defineEmits();

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

	// // 使用 computed 获取 Vuex store 中的数据
	// const choosedPlace = computed(() => {
	// 	const street = store.getters.choosedStreet;
	// 	const village = store.getters.choosedVillage;
	// 	return [street, village];
	// });



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
	const choosePlace = async () => {
		// 在这里添加重新查询的逻辑，刷新亲戚数据	
		let params = {
			serachType: 1,
			val: store.getters.choosedStreet.id + '-' + store.getters.choosedVillage.id
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
				emit('choosePlaceEv', result.data); // 触发父组件的事件
			}
		} else {
			ElMessage({
				message: result.message,
				type: 'error',
			});
		}
	};
	// 读取 state
	const placeSearchVal = computed(() => store.state.placeSearchVal)

	const open = (regionList) => {
		dialogVisible.value = true;
		// console.log('regionList',regionList)
		placeList.value = regionList.map(x => {
			if (x.name.indexOf(placeSearchVal.value) > -1) {
				// console.log("item", x)
				store.commit('setChoosedStreet', x);
				return {
					...x,
					childrenShow: true,
				}

			} else {
				return {
					...x,
					childrenShow: false,
					active: false,
				}
			}

		})
		initChoose()
		// console.log('placeList', placeList)
		// console.log('placeSearchVal', placeSearchVal)
	}



	const initChoose = () => {
		placeList.value.forEach(item => {

		})
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

		.relative-list {}


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