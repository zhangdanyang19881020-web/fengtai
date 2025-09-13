<template>
	<el-dialog v-model="dialogVisible" title="" width="90%" :before-close="handleClose" class="custom-dialog">
		<div class="dialog-content">
			<!-- 顶部信息 -->
			<div class="header-info">
				<span>目前已为您联系到 <span class="highlight">{{ relativeCount }}</span> 位台胞</span>
			</div>

			<!-- 亲戚列表 -->
			<el-scrollbar class="relative-list" :style="{'height':scrollHeight+'px'}">
				<el-row v-for="(relative, index) in relatives" :key="index" class="relative-item"
					@click="activeMember(relative,index)">
					<el-col :span="4" class="relative-avatar">
						<el-avatar v-if="relative.headImgUrl" :src="relative.headImgUrl" :size="40"></el-avatar>
						<el-avatar v-else :size="40"
							src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
					</el-col>
					<el-col :span="14" class="relative-info">
						<div class="name-tr">
							<label>{{ relative.name }}</label>
							<el-tag type="danger" v-if="relative.gender=='female'">女</el-tag>
							<el-tag type="primary" v-else-if="relative.gender=='male'">男</el-tag>
							<el-tag type="info" v-else>--</el-tag>
						</div>
						<div>{{ relative.address }}</div>
					</el-col>
					<el-col :span="6" class="relative-year">
						<div>{{ relative.brithMonth }}</div>
					</el-col>
				</el-row>
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
		onMounted
	} from "vue";
	import {
		ElDialog,
		ElButton,
		ElAvatar,
		ElRow,
		ElCol,
		ElScrollbar,
		ElMessage
	} from "element-plus";
	import {
		dataApi
	} from "@/utils/api";
	import {
		useRouter
	} from 'vue-router';

	const router = useRouter();
	// 弹窗状态
	const dialogVisible = ref(false);

	// 亲戚数据
	const relatives = ref([]);
	const relativeCount = ref(0);

	const scrollHeight = computed(() => {
		const windowHeight = document.documentElement.clientHeight;
		console.log(windowHeight); // 输出浏览器可视区域的高度（以像素为单位）
		return windowHeight - 400;
	})

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
	const activeMemberOb = reactive({})
	const activeMember = (relative, index) => {
		activeMemberOb.value = relative;
		console.log('activeMemberOb', activeMemberOb)
	}
	// 刷新查询
	const choosePeople = () => {
		// 在这里添加重新查询的逻辑，刷新亲戚数据
		router.push({
			path: `/memberDetail/${activeMemberOb.value.id}`
		});
	

	};

	const open = (searchedPeopleList) => {
		dialogVisible.value = true;
		relatives.value = searchedPeopleList;
		console.log('searchedPeopleList--open', searchedPeopleList)
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
			.relative-item {
				margin-bottom: 12px;
				background: #fff;
				border-radius: 8px;
				padding: 10px;
				box-shadow: 0 1px 0 rgba(139, 69, 19, 0.2);

				&:hover {
					background: 0 rgba(139, 69, 19, 0.1);
				}
			}
		}


	}

	.name-tr {
		display: flex;
		margin-bottom: 3px;

		label {
			font-size: 15px;
		}

		.el-tag {
			margin-left: 5px;
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