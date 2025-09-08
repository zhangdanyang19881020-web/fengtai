<template>
	<div class="top-header">
		<div class="header-actions">
			<el-space size="large">
				<el-link type="info" @click="onHelp">帮助</el-link>
				<el-link type="info" @click="onFeedback">意见收集</el-link>
				<el-dropdown trigger="click" @command="onCommand">
					<span class="user-entry">
						<el-avatar :size="28" :src="avatarUrl">{{ userInitial }}</el-avatar>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item disabled>
								<div class="user-brief">
									<div class="user-name">{{ userName }}</div>
									<div class="user-phone">{{ phone }}</div>
								</div>
							</el-dropdown-item>
							<el-dropdown-item divided command="profile">个人设置</el-dropdown-item>
							<el-dropdown-item command="company">公司名称：{{ companyName }}</el-dropdown-item>
							<el-dropdown-item divided command="logout">
								退出登录
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-space>
		</div>
	</div>
</template>


<script>
	import {
		defineComponent,
		ref
	} from 'vue'
	import {
		ElMessageBox,
		ElMessage
	} from 'element-plus'
	export default defineComponent({
		name: 'TopHeader',
		setup() {
			const userName = ref('张三')
			const phone = ref('138****0000')
			const companyName = ref('演示科技有限公司')
			const avatarUrl = ref('')
			const userInitial = ref(userName.value.charAt(0))

			const onHelp = () => {
				ElMessage.info('打开帮助中心')
			}

			const onFeedback = () => {
				ElMessageBox.prompt('请填写您的意见或建议：', '意见收集', {
						confirmButtonText: '提交',
						cancelButtonText: '取消',
						inputType: 'textarea',
					})
					.then(({
						value
					}) => {
						ElMessage.success('感谢反馈！')
						console.log('feedback:', value)
					})
					.catch(() => {})
			}

			const onCommand = (cmd) => {
				switch (cmd) {
					case 'profile':
						ElMessage.info('进入个人设置')
						break
					case 'company':
						ElMessage.info(`当前公司：${companyName.value}`)
						break
					case 'logout':
						ElMessageBox.confirm('确定要退出登录吗？', '提示', {
							confirmButtonText: '退出',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							ElMessage.success('已退出登录')
							// TODO: 在此处执行实际登出逻辑，如清理 Token、跳转登录页
						}).catch(() => {})
						break
				}
			}

			return {
				userName,
				phone,
				companyName,
				avatarUrl,
				userInitial,
				onHelp,
				onFeedback,
				onCommand
			}
		},
	})
</script>

<style lang="scss" scoped>
	.top-header {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		
	}

	.header-actions {
		display: flex;
		align-items: center;
	}

	.user-entry {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	.user-brief {
		padding: 4px 0;
		text-align: left;

		.user-name {
			font-weight: 600;
		}

		.user-phone {
			font-size: 12px;
			color: #909399;
		}
	}
</style>