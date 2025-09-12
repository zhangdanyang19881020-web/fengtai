<template>
	<router-view></router-view>
</template>

<script>
	import {
		defineComponent,
		ref,
		onMounted
	} from 'vue'

	export default defineComponent({
		name: 'HomeList',
		components: {},
		setup() {


			// 生命周期钩子
			onMounted(() => {

			})

			return {

			}
		}
	})
</script>

<style lang="scss" scoped>
	.inner-page {
		display: flex;
		width: 100%;
		height: 100%;
	}
</style>