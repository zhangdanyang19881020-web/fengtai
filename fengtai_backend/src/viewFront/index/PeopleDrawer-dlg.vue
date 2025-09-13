<template>
	<el-dialog v-model="dialogVisible" title="" width="90%" :before-close="handleClose" class="custom-dialog">
		<div class="dialog-content">
			<!-- 顶部信息 -->
			<div class="header-info">
				<span>目前已为您联系到 <span class="highlight">{{ relativeCount }}</span> 位亲戚</span>
			</div>

			<!-- 亲戚列表 -->
			<el-scrollbar class="relative-list">
				<el-row v-for="(relative, index) in relatives" :key="index" class="relative-item">
					<el-col :span="2" class="relative-avatar">
						<el-avatar :src="relative.avatar" size="small"></el-avatar>
					</el-col>
					<el-col :span="16" class="relative-info">
						<div>{{ relative.name }}</div>
						<div>{{ relative.address }}</div>
					</el-col>
					<el-col :span="6" class="relative-year">
						<div>{{ relative.year }}</div>
					</el-col>
				</el-row>
			</el-scrollbar>

			<!-- 重新查询按钮 -->
			<div class="footer">
				<el-button type="primary" @click="handleRefresh">重新查询</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		ElDialog,
		ElButton,
		ElAvatar,
		ElRow,
		ElCol,
		ElScrollbar
	} from "element-plus";

	// 弹窗状态
	const dialogVisible = ref(false);

	// 亲戚数据
	const relatives = ref([{
			avatar: "https://i.pravatar.cc/100?img=1",
			name: "蒋维功",
			address: "奉化溪口二村",
			year: "1952.08"
		},
		{
			avatar: "https://i.pravatar.cc/100?img=2",
			name: "蒋维功",
			address: "奉化溪口一村",
			year: "1952.08"
		},
		{
			avatar: "https://i.pravatar.cc/100?img=3",
			name: "蒋维功",
			address: "奉化溪口三村",
			year: "1952.08"
		},
		// 可以根据实际需求继续添加数据
	]);

	// 显示的亲戚数量
	const relativeCount = ref(relatives.value.length);

	// 关闭弹窗
	const handleClose = () => {
		dialogVisible.value = false;
	};

	// 刷新查询
	const handleRefresh = () => {
		// 在这里添加重新查询的逻辑，刷新亲戚数据
		ElMessage.success("重新查询中...");
	};

	const open = (searchedPeopleList) => {
		dialogVisible.value = true;
		relatives.value = searchedPeopleList;
		console.log('searchedPeopleList', searchedPeopleList)
	}
</script>

<style scoped>
	.custom-dialog {}

	.el-dialog__header {
		background-color: #f6f6f6;
		padding: 16px;
	}

	.dialog-content {
		padding: 20px;
	}

	.header-info {
		font-size: 16px;
		margin-bottom: 20px;
	}

	.highlight {
		color: #ff7f50;
	}

	.relative-item {
		margin-bottom: 12px;
	}

	.relative-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.relative-info {
		font-size: 14px;
	}

	.relative-year {
		font-size: 14px;
		text-align: right;
	}

	.footer {
		text-align: center;
		margin-top: 20px;
	}
</style>