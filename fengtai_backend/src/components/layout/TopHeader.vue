<template>
	<div class="top-header">
		<div class="header-title"> {{route.meta.title}}</div>
		<div class="header-actions">

			<el-space size="large">

				<el-dropdown popper-class="z-dropdown" trigger="click" @command="onCommand">
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
		getUserInfo,
		clearTokens
	} from '@/utils/token'
	import {
		defineComponent,
		ref,
		reactive,
		computed,
	} from 'vue'
	import {
		ElMessageBox,
		ElMessage
	} from 'element-plus'
	import {
		useRouter,
		useRoute
	} from 'vue-router'
	export default defineComponent({
		name: 'TopHeader',
		setup() {
			const router = useRouter() // 在 setup 函数内获取 router 对象

			// 路由信息读取
			const route = useRoute() // 使用 `useRoute` 获取当前路由

			// 给一个兜底对象，避免 null
			const rawUser = getUserInfo() || {
				username: '未登录',
				phone: '',
				avatarUrl: ''
			}
			const UserInfo = reactive(rawUser)

			// 这些字段也做兜底，避免 undefined
			const userName = computed(() => UserInfo.username || '未登录')
			const phone = computed(() => UserInfo.phone || '—')
			const avatarUrl = computed(() => UserInfo.avatarUrl || '')
			const userInitial = computed(() => (userName.value?.charAt(0) || 'U'))

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
							clearTokens(); //清除所有token
							router.push('/') // 跳转到登录页面
						}).catch(() => {})
						break
				}
			}

			return {
				route,
				UserInfo,
				userName,
				phone,
				avatarUrl,
				userInitial,

				onCommand
			}
		},
	})
</script>

<style lang="scss" scoped>
	.top-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);

		.header-title {
			font-size:16px;
			font-weight: bold;
			color: #333;
		}

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