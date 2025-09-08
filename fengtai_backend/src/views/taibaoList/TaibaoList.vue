<template>
	<div class="container">
		<div class="header">
			<el-input v-model="searchQuery" placeholder="输入名字搜索" :suffix-icon="Search" class="search-box" />
			<el-button type="primary" class="new-button">新增</el-button>
		</div>

		<el-table class="z-table" :data="filteredData" style="width: 100%">
			<el-table-column label="头像" width="100">
				<template #default="scope">
					<el-avatar v-if="scope.row.headImg" :src="scope.row.headImg" size="small"></el-avatar>
					<el-avatar v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" size="small"></el-avatar>
				</template>
			</el-table-column>
			<el-table-column label="名字" prop="userName"></el-table-column>
			<el-table-column label="生日" prop="birthMonth"></el-table-column>
			<el-table-column label="祖籍" prop="address"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button link @click="editRow(scope.row)" size="small" type="primary">编辑</el-button>
					<el-button link @click="deleteRow(scope.row)" size="small" type="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-box">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]" :background="background" size="default"
				layout="total, sizes, prev, pager, next, jumper" :total="filteredTotal" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		computed,
		watch,
		onMounted
	} from 'vue'
	import {
		ElInput,
		ElTable,
		ElTableColumn,
		ElButton,
		ElAvatar,
		ElPagination
	} from 'element-plus'
	import {
		Search
	} from '@element-plus/icons-vue'
	import {
		dataApi
	} from '@/utils/api.js'

	export default {
		name: 'UserTable',
		components: {
			ElInput,
			ElTable,
			ElTableColumn,
			ElButton,
			ElAvatar,
			ElPagination,
			Search, // 注册图标
		},
		setup() {
			const searchQuery = ref('')
			const currentPage = ref(1)
			const pageSize = ref(5)
			const background = ref(true)
			const total = ref(0)

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
			const filteredTotal= computed(() => {
				return total.value;
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
					const result = await dataApi.getDataList(params.value)
					console.log('result', result)
					data.value = result.data.pageData; // assuming result.data is the data
					total.value = result.data.totalPage;
				} catch (error) {
					console.error('Failed to fetch data:', error)
				}
			}

			// Search query watcher
			watch(searchQuery, () => {
				currentPage.value = 1 // Reset to page 1 on search change
				getListFn() // Trigger API call with new search query
			})

			// Mounted lifecycle hook to fetch initial data
			onMounted(() => {
				getListFn()
			})

			return {
				searchQuery,
				currentPage,
				pageSize,
				background,
				filteredData,
				filteredTotal,
				handleSizeChange,
				handleCurrentChange,
				editRow: (row) => console.log('编辑行:', row),
				deleteRow: (row) => {
					const index = data.value.indexOf(row)
					if (index !== -1) {
						data.value.splice(index, 1)
					}
				},
				Search,
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 20px;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 30px;
		position: relative;

		.search-box {
			width: 400px;
		}

		.new-button {
			position: absolute;
			right: 0;
		}
	}

	.pagination-box {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}
</style>