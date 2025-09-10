<template>
	<el-dialog v-model="state.newHomeViewDlgShow" title="新建动态" width="70%">
		<div class="new-home--main">
			<!-- 	<div class="new-home--title">
				<el-tag class="address-tag" type="primary" size="large">奉化市 / {{dadData.value.searchData.streetStr}}</el-tag>
			</div> -->
			<div>
				<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
					<!-- 		<el-form-item label="祖籍">
						<el-tag class="address-tag" type="primary" size="large">奉化市 /
							{{dadData.value.searchData.streetStr}}</el-tag>
					</el-form-item> -->
					<!-- 名称 -->
					<el-form-item label="活动名称" prop="title">
						<el-input v-model="form.title" placeholder="请输入活动名称" />
					</el-form-item>
					<el-form-item label="活动时间" prop="date">
						<el-date-picker v-model="form.date" type="date" placeholder="请选择活动时间" />
					</el-form-item>

					<!-- 图片上传 -->
					<el-form-item label="活动图片" prop="imgUrl">
						<el-upload class="avatar-uploader" :on-change="handleFileChange" :show-file-list="false"
							:auto-upload="false">
							<img v-if="form.imgUrl" :src="form.imgUrl" class="uploaded-img" />
							<i v-else class="el-icon-plus avatar-uploader-icon">+</i>
						</el-upload>
					</el-form-item>

					<el-form-item label="参与台胞">
						<div class="people-in--box">
							<div class="people-box" v-if="form.peopleList.length>0">
								<el-tag class="people-box--tag" type="primary" closable
									@close="handleTagClose(item,index)" v-for="(item,index) in form.peopleList"
									:key="index">{{item}}</el-tag>
							</div>
							<div class="people-add--line">
								<el-input class="people-add--input" v-model="form.people" placeholder="请输入参与台胞名字" />
								<el-button class="people-add--btn" @click="addPeopleFn">添加</el-button>
							</div>
						</div>


					</el-form-item>
					<el-form-item label="活动内容">
						<div class="rich-text--box">
							<Toolbar :editor="editorRef" class="rich-text--toolbar" />
							<!-- 	{{html}}
							<el-divider></el-divider> -->
							<Editor v-model="html" :default-config="editorConfig"
								style="height: 400px; overflow-y: auto;" @onCreated="handleCreated" />
						</div>
					</el-form-item>


					<!-- 按钮 -->
					<el-form-item>
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="resetForm">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 		<template #footer>
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
		defineProps,
		toRefs,
		watch,
		onMounted,
		onBeforeUnmount,
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
		ElMessage
	} from 'element-plus'

	import {
		Editor,
		Toolbar
	} from "@wangeditor/editor-for-vue"
	import "@wangeditor/editor/dist/css/style.css"
	export default {
		name: 'NewHomeViewDlg',
		components: {
			Editor,
			Toolbar
		},
		setup(props, {
			expose,
			emit
		}) {
			//富文本
			const html = ref("<p></p>")
			const editorRef = ref(null)

			// 配置
			const editorConfig = {
				placeholder: "请输入内容...",
				MENU_CONF: {
					uploadImage: {
						async customUpload(file, insertFn) {
							// 上传逻辑，这里只是演示
							const url = URL.createObjectURL(file)
							insertFn(url, file.name, url)
						}
					}
				}
			}

			const handleCreated = (editor) => {
				editorRef.value = editor
			}

			onBeforeUnmount(() => {
				if (editorRef.value) editorRef.value.destroy()
			})
			watch(html, (newVal, oldVal) => {
				console.log('html', newVal)
			})
			// ✅ props 就是父组件传过来的参数


			const content = ref("")

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
				dadData.value = getData;
				state.value = Object.assign(getData, patch)
				console.log('dadData=', dadData)

				// uploadData.value.targetId = getData.searchData.stree;
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
				date: '',
				imgUrl: '',
				peopleList: [],
				people: '',
				content: ''
			})
			//添加台胞名字
			const addPeopleFn = () => {
				console.log('form', form)
				if (form.people) {
					form.peopleList.push(form.people);
					form.people = "";
				} else {
					ElMessage.error('请输入参与台胞名字!')
				}

			}

			const handleTagClose = (item, index) => {
				form.peopleList.splice(index, 1);
				form.people = "";
			}
			// 校验规则
			const rules = {
				title: [{
					required: true,
					message: '请输入景点名称',
					trigger: 'blur'
				}],
				date: [{
					required: true,
					message: '请选择活动时间',
					trigger: 'change'
				}],
				imgUrl: [{
					required: true,
					message: '请上传图片',
					trigger: 'change'
				}]
			}

			// const customUpload = async ({
			// 	file
			// }) => {
			// 	const formData = new FormData()
			// 	formData.append('file', file)
			// 	formData.append('type', 1)
			// 	formData.append('targetId', dadData.value.searchData.stree)
			// 	formData.append('title', form.title)

			// 	try {
			// 		const data = await uploadApi.uploadFile(formData) // axios 封装
			// 		handleUploadSuccess(data, file)
			// 	} catch (err) {
			// 		ElMessage.error('上传失败')
			// 	}
			// }


			const selectedFile = ref(null)

			const handleFileChange = async (uploadFile) => {
				const file = uploadFile.raw
				const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
				// const isLt2M = file.size / 1024 / 1024 < 2

				if (!isImage) {
					ElMessage.error('只能上传 JPG/PNG 格式的图片!')
					return
				}
				// if (!isLt2M) {
				// 	ElMessage.error('上传图片大小不能超过 2MB!')
				// 	return
				// }

				selectedFile.value = file
				form.imgUrl = URL.createObjectURL(file) // ✅ 本地预览

				if (!selectedFile.value) {
					ElMessage.error('请先选择图片')
					return
				}

				const formData = new FormData()
				formData.append('file', selectedFile.value)
				formData.append('type', 2)

				try {
					const res = await uploadApi.uploadFile(formData)
					console.log('File uploaded successfully:', res);
					if (res.code === 200) {
						form.imgUrl = res.data.access_path;

						ElMessage.success(res.message);

						emit('refresh')
						close();

					} else {
						ElMessage.error(res.message || '上传失败')
					}
				} catch (error) {
					console.error('File upload failed:', error);
				}



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
					let params = {
						"id": null,
						"title": form.title,
						"indexImgId": "1", //上传接口报错 TODO
						"activityTime": form.date,
						"userIds": form.peopleList,
						"text": html.toString()
					}
					const result = await dataApi.updateNews(params);


				} catch (err) {
					console.error(err)
					ElMessage.error('提交时发生异常')
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
				uploadHeaders,

				addPeopleFn,
				handleTagClose,

				editorRef,
				html,
				editorConfig,
				handleCreated,
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