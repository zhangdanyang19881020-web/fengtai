<template>
	<div class="container">
		<div class="header">
			<el-input v-model="searchQuery" placeholder="输入名字搜索" :suffix-icon="Search" class="search-box" />
			<el-button type="primary"  class="new-button">新增</el-button>
		</div>

		<el-table class="z-table" :data="filteredData" style="width: 100%">
			<el-table-column label="头像" width="100">
				<template #default="scope">
					<el-avatar :src="scope.row.avatar" size="small"></el-avatar>
				</template>
			</el-table-column>
			<el-table-column label="名字" prop="name"></el-table-column>
			<el-table-column label="生日" prop="birthdate"></el-table-column>
			<el-table-column label="祖籍" prop="hometown"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button link @click="editRow(scope.row)" size="small" type="primary">编辑</el-button>
					<el-button link @click="deleteRow(scope.row)" size="small" type="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-box">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				:page-sizes="[100, 200, 300, 400]" :background="background"
				layout="total, sizes, prev, pager, next, jumper" :total="filteredData.length"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>

	</div>
</template>

<script>
	import {
		ref,
		computed
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
			const size = ref('default')
			const background = ref(false)

			// 模拟的数据
			const data = ref([{
					avatar: 'https://via.placeholder.com/40',
					name: '张维攻',
					birthdate: '1952.8',
					hometown: '春化深口二村'
				},
				{
					avatar: 'https://via.placeholder.com/40',
					name: '张维攻',
					birthdate: '1952.8',
					hometown: '春化深口二村'
				},
				{
					avatar: 'https://via.placeholder.com/40',
					name: '张维攻',
					birthdate: '1952.8',
					hometown: '春化深口二村'
				},
				{
					avatar: 'https://via.placeholder.com/40',
					name: '张维攻',
					birthdate: '1952.8',
					hometown: '春化深口二村'
				},
				{
					avatar: 'https://via.placeholder.com/40',
					name: '张维攻',
					birthdate: '1952.8',
					hometown: '春化深口二村'
				},
				// 更多模拟数据
			])

			// 搜索数据
			const filteredData = computed(() => {
				return data.value.filter(item => item.name.includes(searchQuery.value))
			})

			// 页码变化处理
			const handleSizeChange = (val) => {
				pageSize.value = val
			}

			const handleCurrentChange = (val) => {
				currentPage.value = val
			}

			// 编辑功能（模拟）
			const editRow = (row) => {
				console.log('编辑行:', row)
			}

			// 删除功能（模拟）
			const deleteRow = (row) => {
				const index = data.value.indexOf(row)
				if (index !== -1) {
					data.value.splice(index, 1)
				}
			}

			return {
				searchQuery,
				currentPage,
				pageSize,
				size,
				background,
				filteredData,
				handleSizeChange,
				handleCurrentChange,
				editRow,
				deleteRow,
				Search, // 注册图标
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
		.search-box{
			width:400px;
		}
		.new-button{
			position: absolute;
			right:0;
		}
	}
	.pagination-box{
		display: flex;
		justify-content: flex-end;
		margin-top:20px;
	}
</style>