<template>
	<div class="main-box">
		<div v-if="$route.name !== 'login'" class="home-page">
			<el-container>
				<el-aside width="100px">
					<NavMenu />
				</el-aside>
				<el-container class="z-container">
					<el-header>
						<TopHeader />
					</el-header>
					<el-main>
						<router-view></router-view>
					</el-main>
				</el-container>
			</el-container>
		</div>
		<div v-else>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import {
		defineComponent,
		ref,
		reactive,
		onMounted
	} from 'vue'
	import NavMenu from '@/components/layout/NavMenu.vue'

	import TopHeader from '@/components/layout/TopHeader.vue'
	export default defineComponent({
		name: 'App',
		components: {
			NavMenu,
			TopHeader
		},
		setup() {


			// 生命周期钩子
			onMounted(() => {

			})

			return {

			}
		}
	})
</script>

<style lang="scss">
	#app {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		width: 100%;
		height: 100%;
	}


	.main-box {
		width: 100%;
		height: 100%;
	}

	.home-page {
		display: flex;
		width: 100%;
		height: 100%;
		background: #f0f7ff;

		.z-container {
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			overflow: hidden;
			background: #fff;
		}

		.z-main {
			margin: 0;
			padding: 0;
		}
	}
</style>