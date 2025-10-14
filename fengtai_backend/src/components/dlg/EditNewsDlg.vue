<template>
	<el-dialog v-model="state.newHomeViewDlgShow" title="编辑动态" width="70%">
		<div class="new-home--main">
			<!-- 	<div class="new-home--title">
				<el-tag class="address-tag" type="primary" size="large">奉化市 / {{dadData.value.searchData.streetStr}}</el-tag>
			</div> -->
			<div>
				<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
					<el-form-item label="活动类型" prop="type">
						<el-radio-group v-model="form.type">
							<el-radio-button label="默认活动" value="default" />
							<el-radio-button label="平台活动" value="platform" />

						</el-radio-group>
					</el-form-item>
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
									:key="index">{{item.userName}}</el-tag>
							</div>
							<div class="people-add--line">
								<!-- <el-input class="people-add--input" v-model="form.people" placeholder="请输入参与台胞名字" /> -->
								<el-autocomplete v-model="form.people" :fetch-suggestions="querySearch"
									class="z-autocomplete" placeholder="请输入台胞名字添加" @select="handleSelect">
									<template #suffix>
										<el-icon class="el-input__icon" @click="handleIconClick">
											<search />
										</el-icon>
									</template>
									<template #default="{ item }">
										<div class="prople-tr--box">
											<div class="prople-tr">
												<el-avatar class="prople-tr--avatar" v-if="item.headImg" :size="30"
													:src="item.headImg" />
												<el-avatar class="prople-tr--avatar" v-else :size="30"
													src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
												<div class="value">{{ item.userName }}</div>
											</div>
											<div class="prople-tr">
												<div class="prople-tr--address"><label>祖籍:</label>{{ item.address }}
												</div>
												<div class="prople-tr--birthday"><label>生日:</label>{{item.birthMonth}}
												</div>
											</div>
										</div>
									</template>
								</el-autocomplete>
								<!-- 
								<el-button type="primary" plain class="people-add--btn"
									@click="addPeopleFn">添加</el-button> -->
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
		Search
	} from '@element-plus/icons-vue'

	import {
		Editor,
		Toolbar
	} from "@wangeditor/editor-for-vue"
	import "@wangeditor/editor/dist/css/style.css"
	export default {
		name: 'NewHomeViewDlg',
		components: {
			Editor,
			Toolbar,
			Search
		},
		setup(props, {
			expose,
			emit
		}) {

			//搜索人员
			const querySearch = async (queryString, cb) => {
				console.log('')
				let results = {}

				let params = {
					"userName": queryString,
					"pageSize": 100,
					"pageIndex": 1
				}
				results = await dataApi.getDataList(params);
				console.log('results', results)
				cb([...results.data.pageData]);


			}
			var selectPeople = {};


			const handleSelect = (item) => {
				console.log(item)
				form.people = item.userName;
				selectPeople = item;

				const existingIndex = form.peopleList.findIndex(person => person.userName === item.userName);
				if (existingIndex === -1) {
					form.peopleList.push(item);
				} else {
					ElMessage.error('重复添加!')
				}
				console.log('form.peopleList', form.peopleList)
				form.people = "";
			}

			const handleIconClick = (ev) => {
				console.log(ev)
			}
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
							// const url = URL.createObjectURL(file)
							// insertFn(url, file.name, url)
							const formData = new FormData()
							formData.append('file', file)
							formData.append('type', 2)
							const result = await uploadApi.uploadFile(formData)
							console.log('result--', result);
							if (result.code == 200) {
								insertFn(result.data.access_path, file.name, result.data.access_path)
							}
						}
					}
				}
			}
			// const getMemberList = async (params) => {
			// 	const result = await dataApi.getDataList(params)
			// }

			const handleCreated = (editor) => {
				editorRef.value = editor
			}

			onBeforeUnmount(() => {
				if (editorRef.value) editorRef.value.destroy()
			})
			watch(html, (newVal, oldVal) => {
				// console.log('html', newVal)
			})
			// ✅ props 就是父组件传过来的参数


			const content = ref("")

			onMounted(() => {
				// console.log('uploadUrl--', uploadApi.uploadUrl);

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

			// 表单数据
			const form = reactive({
				type: 'default',
				title: '',
				date: '',
				imgUrl: '',
				imgUrlId: '',
				peopleList: [],
				people: '',
				content: ''
			})

			function open(getData, patch = {}) {
				dadData.value = getData;
				state.value = Object.assign(getData, patch)
				console.log('dadData=', dadData)
				form.imgUrl = ''; // 如果没有重新上传图片，清空图片路径
				// uploadData.value.targetId = getData.searchData.stree;
				state.newHomeViewDlgShow = true;
				// getMemberList();
				initData(getData)
			}

			const initData = async (getData) => {
				console.log('getData', getData)
				let params = {
					activityId: getData.row.activityId
				}
				const result = await dataApi.newsDetail(params);
				if (result.code == 200) {
					form.type = result.data.activityType;
					form.title = result.data.title;
					form.date = result.data.createdAt;
					form.imgUrl = result.data.indexImgUrl;
					form.imgUrlId = result.data.indexImgId;
					form.peopleList = result.data.users;
					form.people = "";
					html.value = result.data.text;
				}


			}


			function close() {
				state.newHomeViewDlgShow = false
			}
			//form ⬇️
			const formRef = ref(null)


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
				const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type ===
					'image/gif' || file.type === 'image/webp'
				// const isLt2M = file.size / 1024 / 1024 < 2

				if (!isImage) {
					ElMessage.error('只能上传 JPG/PNG/GIF/WEBP 格式的图片!')
					return
				}

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
					// console.log('File uploaded successfully:', res);
					if (res.code === 200) {
						form.imgUrl = res.data.access_path;
						form.imgUrlId = res.data.id;
						ElMessage.success(res.message);


						// close();

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

			// 时间格式化函数
			function formatDate(dateStr) {
				const date = new Date(dateStr); // 解析 ISO 字符串
				const y = date.getFullYear();
				const m = String(date.getMonth() + 1).padStart(2, '0');
				const d = String(date.getDate()).padStart(2, '0');
				return `${y}-${m}-${d}`;
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
						"activityType":form.type,
						"id": dadData.value.row.activityId,
						"title": form.title,
						"indexImgId": form.imgUrlId, //上传接口报错 
						"activityTime": formatDate(form.date),
						"userIds": form.peopleList.map(item => item.userId),
						"text": String(html.value)
					}
					// console.log('html',html)
					const result = await dataApi.updateNews(params);
					if (result.code == 200) {
						ElMessage.success(result.message);
						emit('refresh')
						close();
					}

				} catch (err) {
					console.error(err)
					ElMessage.error('提交时发生异常')
				}
			}



			// 重置表单
			const resetForm = () => {
				formRef.value.resetFields()
				form.imgUrl = '';
				html.value = "<p></p>";
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
				querySearch,
				handleIconClick,
				handleSelect,
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