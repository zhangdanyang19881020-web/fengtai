<template>
	<el-dialog v-model="state.newHomeViewDlgShow" title="新建家乡风貌" width="800">
		<div class="new-home--main">
			<div class="new-home--title">
				<el-tag type="primary" size="large">奉化市 / {{dadData.value.searchData.streetStr}}</el-tag>
			</div>
			<div>
				<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
					<!-- 名称 -->
					<el-form-item label="景点名称" prop="title">
						<el-input v-model="form.title" placeholder="请输入家乡景点名称" />
					</el-form-item>

					<!-- 图片上传 -->
					<el-form-item label="景点图片" prop="imgUrl">
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
							:show-file-list="false" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
							<img v-if="form.imgUrl" :src="form.imgUrl" class="uploaded-img" />
							<i v-else class="el-icon-plus avatar-uploader-icon">+</i>
						</el-upload>
					</el-form-item>

					<!-- 按钮 -->
					<el-form-item>
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="resetForm">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	import {
		reactive,
		ref,
		defineProps,
		onMounted,
		toRefs,
	} from 'vue'
	import {
		ElMessage
	} from 'element-plus'
	export default {
		name: 'NewHomeViewDlg',
		components: {},
		setup(props, {
			expose
		}) {
			// ✅ props 就是父组件传过来的参数

			onMounted(() => {
				console.log('props-father-', props)
			})

			const state = reactive({
				newHomeViewDlgShow: false,
			})
			// 可选：提供命令式方法，父组件可直接调用
			const dadData = reactive({})

			function open(getData, patch = {}) {
				dadData.value = getData;
				state.value = Object.assign(getData, patch)
				console.log('dadData=', dadData)

				state.newHomeViewDlgShow = true
			}

			function close() {
				state.newHomeViewDlgShow = false
			}
			//form ⬇️
			const formRef = ref(null)

			// 表单数据
			const form = reactive({
				title: '',
				imgUrl: ''
			})

			// 校验规则
			const rules = {
				title: [{
					required: true,
					message: '请输入景点名称',
					trigger: 'blur'
				}],
				imgUrl: [{
					required: true,
					message: '请上传图片',
					trigger: 'change'
				}]
			}

			// 上传前校验（限制大小、类型）
			const beforeUpload = (file) => {
				const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
				const isLt2M = file.size / 1024 / 1024 < 2

				if (!isJPG) {
					ElMessage.error('只能上传 JPG/PNG 格式的图片!')
				}
				if (!isLt2M) {
					ElMessage.error('上传图片大小不能超过 2MB!')
				}
				return isJPG && isLt2M
			}

			// 上传成功回调
			const handleUploadSuccess = (response, file) => {
				form.imgUrl = URL.createObjectURL(file.raw) // 本地预览
				// 实际业务里要用 response 里的 url
			}

			// 提交表单
			const submitForm = () => {
				formRef.value.validate((valid) => {
					if (valid) {
						ElMessage.success('提交成功')
						console.log('表单数据:', form)
					} else {
						ElMessage.error('请完善表单信息')
						return false
					}
				})
			}

			// 重置表单
			const resetForm = () => {
				formRef.value.resetFields()
				form.imgUrl = ''
			}
			//form ⬆️
			// 暴露给父组件可调用/可读
			expose({
				state,
				open,
				close
			})
			return {
				state,
				dadData,
				open,
				close,
				form,
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-home--main {
		.avatar-uploader {
			width: 150px;
			height: 150px;
			border: 1px dashed #d9d9d9;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}

		.uploaded-img {
			width: 150px;
			height: 150px;
			object-fit: cover;
		}

		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
		}
	}
</style>