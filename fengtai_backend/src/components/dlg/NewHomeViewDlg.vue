<template>
	<el-dialog v-model="state.newHomeViewDlgShow" title="新建家乡风貌" width="800">
		1111
	</el-dialog>
</template>

<script>
	import {
		reactive,
		ref,
		defineExpose
	} from 'vue'
	export default {
		name: 'NewHomeViewDlg',
		components: {},
		setup(props, { expose }) {
			const state = reactive({
				newHomeViewDlgShow: false,
			})
			// 可选：提供命令式方法，父组件可直接调用
			function open(patch = {}) {
				Object.assign(state, patch)
				state.newHomeViewDlgShow = true
			}

			function close() {
				state.newHomeViewDlgShow = false
			}
			// 暴露给父组件可调用/可读
			expose({
				state,
				open,
				close
			})
			return {
				state
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>