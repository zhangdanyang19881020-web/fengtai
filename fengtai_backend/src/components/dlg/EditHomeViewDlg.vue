<template>
	<el-dialog v-model="state.newHomeViewDlgShow" title="编辑家乡风貌" width="800">
		<div class="new-home--main">
			<div>
				<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
					<el-form-item label="祖籍">
						<el-tag class="address-tag" type="primary" size="large">奉化市 /
							{{dadData.value.searchData.streetStr}}</el-tag>
					</el-form-item>
					<!-- 名称 -->
					<el-form-item label="景点名称" prop="title">
						<el-input v-model="form.title" placeholder="请输入家乡景点名称" />
					</el-form-item>

					<!-- 图片上传 -->
					<el-form-item label="景点图片" prop="imgUrl">
						<el-upload class="avatar-uploader" :on-change="handleFileChange" :show-file-list="false"
							:auto-upload="false">
							<img v-if="form.imgUrl" :src="form.imgUrl" class="uploaded-img" />
							<i v-else class="el-icon-plus avatar-uploader-icon">+</i>
						</el-upload>
					</el-form-item>


					<!-- 按钮 -->
					<el-form-item>
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="resetForm">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- <template #footer>
			<div class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button type="primary" @click="submitForm">
					确定
				</el-button>
			</div>
		</template> -->
	</el-dialog>
</template>

<script>
	import {
		reactive,
		ref,
		onMounted,
		toRefs,
	} from 'vue'
	import {
		getTokenType,
		getAccessToken,
	} from '@/utils/token'
	import {
		uploadApi,
		dataApi,
	} from '@/utils/api.js'
	import {
		ElInput,
		ElTable,
		ElTableColumn,
		ElButton,
		ElAvatar,
		ElPagination,
		ElMessageBox,
		ElMessage,
	} from 'element-plus'
	export default {
		name: 'NewHomeViewDlg',
		components: {
	
		},
		setup(props, {
			expose,
			emit
		}) {
			// ✅ props 就是父组件传过来的参数

			onMounted(() => {
				console.log('uploadUrl--', uploadApi.uploadUrl)
			})
			// 可选：提供命令式方法，父组件可直接调用
			const dadData = reactive({})

			const uploadUrl = ref(uploadApi.uploadUrl)

			const uploadHeaders = reactive({
				"Authorization": `${getTokenType()} ${getAccessToken()}`
			})

			const state = reactive({
				newHomeViewDlgShow: false,
			})
			const uploadData = reactive({
				file: '',
				type: 1,
				targetId: '',
				title: ''
			})

			function open(getData, patch = {}) {
				// console.log('getData--edit--', getData);
				dadData.value = getData;
				dadData.value = getData; // 直接给 dadData 赋值
				state.newHomeViewDlgShow = true; // 弹窗显示

				// 调用 initData 初始化数据
				initData(getData);
			}

			// 初始化弹窗时，检查 imgUrl 是否有值
			const initData = (getData) => {
				if (getData && getData.row) {
					form.title = getData.row.title || '';
					form.imgUrl = getData.row.imgUrl || ''; // 如果有图片，直接赋值
				} else {
					console.warn('getData or getData.row is missing');
				}
			};


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

			// 修改验证规则
			const rules = {
				title: [{
					required: true,
					message: '请输入景点名称',
					trigger: 'blur'
				}],
				imgUrl: [{
					required: false, // 图片可以为空，不强制验证
					message: '请上传图片',
					trigger: 'change',
					validator: (rule, value, callback) => {
						// 如果没有重新上传图片，跳过验证
						if (!selectedFile.value && !value) {
							callback();
						} else if (!value) {
							callback(new Error('请上传图片'));
						} else {
							callback();
						}
					}
				}]
			};



			const selectedFile = ref(null)

			const handleFileChange = (uploadFile) => {
				const file = uploadFile.raw
				console.log('file', file)
				const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' ||
					file.type === 'image/webp'
				// const isLt2M = file.size / 1024 / 1024 < 2

				if (!isImage) {
					ElMessage.error('只能上传 JPG/PNG/GIF/WEBP 格式的图片!')
					return
				}
				// if (!isLt2M) {
				// 	ElMessage.error('上传图片大小不能超过 2MB!')
				// 	return
				// }

				selectedFile.value = file
				form.imgUrl = URL.createObjectURL(file) // ✅ 本地预览
			}

			// 上传成功回调
			const handleUploadSuccess = (response, file) => {
				form.imgUrl = URL.createObjectURL(file.raw) // 本地预览
			}


			// 提交表单
			const submitForm = async () => {
				if (!formRef.value) {
					ElMessage.error('表单未渲染')
					return
				}
				try {
					const valid = await formRef.value.validate()
					if (!valid) {
						ElMessage.error('请完善表单信息')
						return
					}

					// if (!selectedFile.value) {
					// 	ElMessage.error('请先选择图片')
					// 	return
					// }

					const formData = new FormData()
					formData.append('id', dadData.value.row.id)
					formData.append('file', selectedFile.value)
					formData.append('title', form.title)
					formData.append('type', 1)
					formData.append('targetId', dadData.value?.searchData?.street || '')

					const res = await uploadApi.uploadFile(formData)
					if (res.code === 200) {
						form.imgUrl = res.data.access_path;

						ElMessage.success(res.message);

						emit('refresh')
						close();

					} else {
						ElMessage.error(res.message || '上传失败')
					}
				} catch (err) {
					console.error(err)
					ElMessage.success(res.message);
				}
			}



			// 重置表单
			const resetForm = () => {
				formRef.value.resetFields()
				form.imgUrl = '';
				close()
			}
			//form ⬆️
			// 暴露给父组件可调用/可读
			expose({
				state,
				open,
				close
			})
			return {
				formRef,
				selectedFile,
				state,
				dadData,
				open,
				close,
				form,
				rules,
				resetForm,
				submitForm,
				handleUploadSuccess,
				handleFileChange,
				// customUpload,
				uploadUrl,
				uploadData,
				uploadHeaders
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-home--main {
		width: calc(100% - 100px);
		margin-top: 10px;

		.new-home--title {
			.address-tag {}
		}

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