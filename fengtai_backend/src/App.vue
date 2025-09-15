<template>
	<div class="main-out--box">
		<div v-if="$route.meta.for == 'back'" class="home-page">
			<!-- 后台管理页面 -->
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
		<div v-else class="app-body">
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
		width: 100%;
		height: 100%;
	
	}

	body {
		width: 100%;
		height: 100%;
		background: url('@/static/f-Images/home-bg.jpg') repeat;
		overflow-x: hidden;
	}

	.main-out--box {
		width: 100%;
		height:100%;
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