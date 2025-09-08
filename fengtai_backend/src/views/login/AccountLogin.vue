<template>
	<div class="login-page">
		<div class="login-main">
			<!-- <img class="brand-logo" src="@/assets/login/login-logo.png" alt="logo" /> -->
			<div class="login-card">
				<div class="brand">
					<h2 class="brand-title">欢迎登录</h2>
				</div>
				<el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="login-form">
					<el-form-item label="账号" prop="username">
						<el-input v-model="form.username" placeholder="请输入账号" clearable />
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="form.password" type="password" show-password placeholder="请输入密码" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" class="login-button" :loading="submitting"
							@click="onSubmit">登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		defineComponent,
		reactive,
		ref
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'
	import {
		userApi,
	} from '@/utils/api.js'

	import {
		ElMessage
	} from 'element-plus'
	
	import {
		getUserInfo
	} from '@/utils/token'

	export default defineComponent({
		name: 'Login',
		setup() {
			const router = useRouter()
			const formRef = ref(null)
			const submitting = ref(false)


			const form = reactive({
				username: '',
				password: ''
			})
			const rules = {
				username: [{
					required: true,
					message: '请输入账号',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}]
			}

			async function onSubmit() {
				if (!formRef.value) return
				await formRef.value.validate(async (valid) => {
					if (!valid) return
					submitting.value = true
					try {
						// TODO: 调用实际登录接口
						// await new Promise(r => setTimeout(r, 600))	
						// router.replace('/')
						console.log('form.value', form)
						// 登录接口会自动保存 token
						const result = await userApi.login(form)
						console.log('result--', result)
						if (result.access_token) {
							const userInfo = await userApi.getUserInfo();
							console.log('userInfo', userInfo)
							getUserInfo(userInfo);
							router.push('/table');
						}
						// responseData.value = JSON.stringify(result, null, 2)
						ElMessage.success('登录成功，Token 已自动保存！')

					} finally {
						submitting.value = false
					}
				})
			}

			return {
				form,
				rules,
				formRef,
				submitting,
				onSubmit
			}
		}
	})
</script>

<style lang="scss" scoped>
	.login-page {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #e6f0ff 0%, #f7faff 100%);

		.login-main {
			.brand-logo {
				width: 250px;
				height: 38px;
				margin-bottom: 30px;
			}
		}
	}

	.login-card {
		width: 400px;
		padding: 32px;
		border-radius: 16px;
		background: #fff;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	}

	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 16px;
	}



	.brand-title {
		margin: 12px 0 0;
		font-size: 20px;
		font-weight: 600;
		color: #1f2d3d;
	}

	.login-form {
		margin-top: 12px;
	}

	.login-button {
		width: 100%;
	}
</style>