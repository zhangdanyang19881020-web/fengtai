<template>
	<div class="inner-page">
		<router-view></router-view>
	</div>
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
			// 响应式状态
			const count = ref(0)

			// 用来修改状态、触发更新的函数
			function increment() {
				count.value++
			}

			// 生命周期钩子
			onMounted(() => {
				console.log(`The initial count is ${count.value}.`)
				increment()
			})

			return {
				count,
				increment
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