<template>
	<div class="container">
		<div class="search-box--container">
			<div class="search-box--left">
				<div class="search-box--item">
					<el-tag class="search-box--tag" type="primary" size="large">奉化市</el-tag>
					<el-select v-model="searchData.street" placeholder="选择街道或镇进行筛选" @change="searchFn"
						style="width: 240px">
						<el-option v-for="item in streetOptions" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
				</div>
			</div>
			<div class="search-box--right">
				<el-button type="primary" v-if="newHomeViewDlgRef" class="new-button"
					@click.native="goNewFn">新建</el-button>
			</div>
		</div>

		<el-table class="z-table" :data="filteredData" style="width: 100%">
			<el-table-column label="图片" width="150">
				<template #default="scope">
					<div class="row-img--box">
						<el-image v-if="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" hide-on-click-modal
							class="row-img" :lazy="true" :src="scope.row.imgUrl" fit="scale-down"
							:preview-teleported="true" />
						<el-image v-else class="no-img" src="./images/no-img2.png" fit="scale-down" />
					</div>
				</template>
			</el-table-column>
			<el-table-column label="名称" :formatter="emptyFormatter" :show-overflow-tooltip="true"
				prop="title"></el-table-column>
			<el-table-column label="操作" width='120'>
				<template #default="scope">
					<el-button link @click="editRow(scope.row)" size="small" type="primary">编辑</el-button>
					<el-button link @click="deleteRow(scope.row)" size="small" type="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-box">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]" :background="background" size="default" :total="total"
				layout="sizes, prev, pager, next, jumper" @size-change="getListFn" @current-change="getListFn" />
		</div>


		<new-home-view-dlg ref="newHomeViewDlgRef" @refresh="searchFn"></new-home-view-dlg>

		<edit-home-view-dlg ref="editHomeViewDlgRef" @refresh="searchFn"></edit-home-view-dlg>


	</div>
</template>

<script>
	import {
		ref,
		reactive,
		computed,
		watch,
		onMounted,
		toRefs,
		defineAsyncComponent,
		nextTick
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'
	import {
		ElMessageBox,
		ElMessage
	} from 'element-plus'
	import {
		Search
	} from '@element-plus/icons-vue'

	import {
		dataApi
	} from '@/utils/api.js'

	import {
		debounce
	} from 'lodash-es'

	import EditHomeViewDlg from '@/components/dlg/EditHomeViewDlg.vue'

	export default {
		name: 'HomeView',
		components: {
			Search, // 注册图标
			NewHomeViewDlg: defineAsyncComponent(() => import('@/components/dlg/NewHomeViewDlg.vue')),
			EditHomeViewDlg: defineAsyncComponent(() => import('@/components/dlg/EditHomeViewDlg.vue')),
		},
		setup() {

			const currentPage = ref(1)
			const pageSize = ref(10)
			const background = ref(true)
			const total = ref(0)

			const state = reactive({
				addressOptions: [],
				streetOptions: [],
				searchData: {
					street: '',
					streetStr: ''
				}
			})
			// ✅ 同时解构出 searchData
			const {
				addressOptions,
				streetOptions,
				searchData
			} = toRefs(state)

			const router = useRouter();

			const emptyFormatter = (_row, _column, cellValue) => {
				// null / undefined
				if (cellValue == null) return '--'

				// 字符串：去掉空白后为空
				if (typeof cellValue === 'string') {
					const v = cellValue.trim()
					return v ? v : '--'
				}

				// 数组：空数组
				if (Array.isArray(cellValue)) {
					return cellValue.length ? cellValue.join(', ') : '--'
				}

				// 数字：NaN
				if (typeof cellValue === 'number' && Number.isNaN(cellValue)) {
					return '--'
				}

				// 其它类型（对象/布尔等）按需定制，这里统一转成字符串
				return String(cellValue)
			}


			// params object to track page info and search query
			const params = computed(() => ({
				"targetId": state.searchData.street,
				"targetType": 1,
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
				return total.value;
			})


			onMounted(() => {
				regionListFn();
			})

			// 村街道

			const regionListFn = async () => {
				const result = await dataApi.regionList();
				if (result.code === 200 && Array.isArray(result.data)) {
					// addressOptions.splice(0, addressOptions.length, ...result.data);
					state.addressOptions = result.data;
					state.streetOptions = state.addressOptions.map(x => ({
						label: x.name,
						value: x.id
					}))
					if (!state.searchData.street && state.streetOptions.length) {
						state.searchData.street = state.streetOptions[0].value;
						state.searchData.streetStr = state.streetOptions[0].label;
						// 这里不需要额外 watch 触发的话，直接拉一次
						getListFn()
					}

				}
			}

			const searchFn = () => {
				currentPage.value = 1
				getListFn()
			}




			// Fetch list from API
			const getListFn = async () => {
				try {
					const result = await dataApi.homeViewList(params.value)
					console.log('result', result)
					data.value = result.data.pageData; // assuming result.data is the data
					total.value = result.data.totalPage;
				} catch (error) {
					console.error('Failed to fetch data:', error)
				}
			}

			//新建弹窗
			const newHomeViewDlgRef = ref(null)
			const goNewFn = () => {
				console.log('newHomeViewDlgRef', newHomeViewDlgRef)
				if (newHomeViewDlgRef.value) {
					// console.log('state--', state)
					newHomeViewDlgRef.value.open(state);

				} else {
					console.warn('newHomeViewDlgRef is not ready')
				}
			}
			//编辑弹窗
			const isEditDlgVisible = ref(false);
			const editHomeViewDlgRef = ref(null)
			// 编辑行数据 - 修复方法名
			const editRow = (row) => {
				// console.log('编辑行数据:', row)
				console.log('editHomeViewDlgRef:', editHomeViewDlgRef)
				if (editHomeViewDlgRef.value) {
					editHomeViewDlgRef.value.open({
						row: {
							...row
						},
						...state
					})
				} else {
					console.error('编辑弹窗组件未正确加载或缺少 open 方法')
					ElMessage.error('编辑功能暂时不可用')
				}
			}

			// Search query watcher
			const debouncedGetList = debounce(() => {
				currentPage.value = 1
				getListFn()
			}, 500) // 500ms 内只触发一次

			const delHometownFn = async (row) => {
				let params = {
					id: row.id
				}
				const result = await dataApi.delHometown(params);
				if (result.code == 200) {
					ElMessage({
						type: 'success',
						message: result.message,
					});
					currentPage.value = 1
					getListFn()
				}
			}
			const handleDeleteRow = (row) => {
				const target = {
					...row
				} // 浅拷贝，避免后续响应式丢失
				// console.log('准备删除的行数据:', target)
				ElMessageBox.confirm(
					`确认删除 <span class="el-tag el-tag--danger el-tag--light">${target.title||'--'}</span> ?`,
					'提示', {
						dangerouslyUseHTMLString: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				).then(() => {
					delHometownFn(target)
				}).catch(() => {
					ElMessage.info('已取消删除')
				})
			}

			// 删除行数据 - 保持原名
			const deleteRow = (row) => {
				handleDeleteRow(row)
			}
			// watch(() => state.searchData.street, () => {
			// 	// debouncedGetList()
			// 	currentPage.value = 1
			// 	getListFn()
			// })

			return {
				newHomeViewDlgRef,
				editHomeViewDlgRef,
				streetOptions,
				searchData,
				searchFn,
				emptyFormatter,
				currentPage,
				pageSize,
				background,
				filteredData,
				filteredTotal,
				getListFn,
				editRow,
				deleteRow,
				Search,
				goNewFn,
				total
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