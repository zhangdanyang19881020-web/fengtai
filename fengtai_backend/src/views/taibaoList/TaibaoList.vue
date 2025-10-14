<template>
	<div class="container">
		<div class="header">
			<el-input v-model="searchQuery" placeholder="输入名字搜索" :suffix-icon="Search" class="search-box" />
			<div>
				<el-button link type="warning" @click="templateDownload">
					模板下载&nbsp;
					<el-icon>
						<Download />
					</el-icon>
				</el-button>
				<el-button type="primary" @click="goNewFn">
					<i class="iconfont icon-xinjianzhanghao"></i>&nbsp; 新建
				</el-button>
				<el-button type="success" bg @click="batcgImportFn">
					<el-icon>
						<Upload />
					</el-icon>&nbsp;导入
				</el-button>
				<input type="file" ref="fileInput" @change="handleExcelUpload" accept=".xlsx, .xls"
					style="display: none">
			</div>

		</div>

		<el-table class="z-table" :data="filteredData" style="width: 100%" v-loading="loading">
			<el-table-column label="头像" width="100">
				<template #default="scope">
					<el-avatar v-if="scope.row.headImg" :src="scope.row.headImg" size="small"></el-avatar>
					<el-avatar v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
						size="small"></el-avatar>
				</template>
			</el-table-column>
			<el-table-column label="名字" prop="userName"></el-table-column>
			<el-table-column label="生日" prop="birthMonth"></el-table-column>
			<el-table-column label="祖籍" prop="address"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button link @click.native="editRow(scope.row)" size="small" type="primary">编辑</el-button>
					<el-button link @click.native="deleteRow(scope.row)" size="small" type="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-box">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]" :background="background" size="default"
				layout="sizes, prev, pager, next, jumper" :total="filteredTotal" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script setup>
	import moment from 'moment';
	import {
		ref,
		reactive,
		computed,
		watch,
		onMounted
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'
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
		Search,
		Upload,
		Plus,
		Download
	} from '@element-plus/icons-vue'
	import {
		dataApi
	} from '@/utils/api.js'

	import {
		debounce
	} from 'lodash-es'


	// export default {
	// 	name: 'UserTable',
	// 	components: {
	// 		Search, // 注册图标
	// 	},
	// 	setup() {
	const searchQuery = ref('')
	const currentPage = ref(1)
	const pageSize = ref(10)
	const background = ref(true)
	const totalPage = ref(0)
	const loading = ref(false)
	const fileInput = ref(null);

	const batcgImportFn = () => {
		fileInput.value.click();
	};
	const handleExcelUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			console.log('file', file)
			const validFileTypes = [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx, .xlsm
				'application/vnd.ms-excel', // .xls, .xlt, .xlsb
				'application/vnd.openxmlformats-officedocument.spreadsheetml.template', // .xltx
				'application/vnd.ms-excel.sheet.binary.macroEnabled.12' // .xlsb
			];
			// const isExcel = file.type === 'image/jpeg' || file.type === 'image/png' || file.type ===
			// 	'image/gif' || file.type === 'image/webp'
			// console.log('isImage',isImage)
			if (validFileTypes.includes(file.type)) {
				uploadApiFn(file);
			} else {
				ElMessage.error('只能上传 JPG/PNG/GIF/WEBP 格式的图片!')
				return
			}
		}
	};

	const uploadApiFn = async (file) => {
		const result = await dataApi.batchImport(file);
		console.log('uploadApiFn--result--', result)
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: result.message,
			});
			currentPage.value = 1
			getListFn()
		}
	}
	const router = useRouter();

	// params object to track page info and search query
	const params = computed(() => ({
		userName: searchQuery.value,
		pageSize: pageSize.value,
		pageIndex: currentPage.value,
	}))

	// Simulated data
	const data = ref([])

	// Filtered data based on search query
	const filteredData = computed(() => {
		return data.value;
	})
	const filteredTotal = computed(() => {
		return totalPage.value * pageSize.value;
	})

	// Handle pagination size change
	const handleSizeChange = (val) => {
		pageSize.value = val
		getListFn()
	}

	// Handle page change
	const handleCurrentChange = (val) => {
		currentPage.value = val
		getListFn()
	}

	// Fetch list from API
	const getListFn = async () => {
		try {
			loading.value = true
			const result = await dataApi.getDataList(params.value)
			console.log('result', result)
			data.value = result.data.pageData; // assuming result.data is the data
			totalPage.value = result.data.totalPage;
		} catch (error) {
			console.error('Failed to fetch data:', error)
		} finally {
			loading.value = false
		}
	}
	const goNewFn = () => {
		router.push('/newTaibao')
	}

	// Search query watcher
	const debouncedGetList = debounce(() => {
		currentPage.value = 1
		getListFn()
	}, 500) // 500ms 内只触发一次

	const delMemberFn = async (row) => {
		let params = {
			userId: row.userId
		}
		const result = await dataApi.delMember(params);
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: result.message,
			});
			currentPage.value = 1
			getListFn()
		}
	}
	const editRow = (row) => {
		router.push({
			name: 'editTaibao',
			params: {
				userId: row.userId

			}
		})
	}

	const deleteRow = (row) => {
		ElMessageBox.alert(`确认删除 <span class="el-tag el-tag--danger el-tag--light">${row.userName}</span>`,
			'提示', {
				// if you want to disable its autofocus
				// autofocus: false,
				dangerouslyUseHTMLString: true,
				confirmButtonText: 'OK',
				callback: (action) => {
					delMemberFn(row)
				},
			})

	}

	const templateDownload = async () => {
		const result = await dataApi.downloadTemplate();
		console.log('templateDownload', result);
		downloadResFile(result, '导入模板');
	}
	const downloadResFile = (res, title) => {
		if (!res) {
			return
		}
		// console.log('downloadResFile', res)
		let url = window.URL.createObjectURL(new Blob([res], {
			type: "application/vnd.ms-excel"
		}));
		let link = document.createElement('a')
		link.style.display = 'none'
		link.href = url;
		var datetime = moment().unix();
		link.setAttribute('download', title + '_' + datetime + ".xlsx")
		document.body.appendChild(link)
		link.click()
	}

	watch(searchQuery, () => {
		// debouncedGetList()
		currentPage.value = 1
		getListFn()
	})


	// Mounted lifecycle hook to fetch initial data
	onMounted(() => {
		getListFn()
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 20px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		position: relative;

		.search-box {
			width: 400px;
		}


	}

	.pagination-box {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}
</style>