<template>
	<nav class="menu">
		<div class="menu-title">
			{{route.meta.name}}
		</div>
		<ul class="nav-ul">
			<li class="nav-li" :class="{'active':item.type==$route.meta.type}" v-for="item in tradeManageNavs"
				:key="item.type" @click="goPage(item.go)">
				<div class="nav-icon">
					<i :class="item.icon"></i>
				</div>
				<span class="nav-name">{{ item.name }}</span>
			</li>
			<li class="nav-li pos-buttom">
				<div class="nav-icon">
					<i class="iconfont icon-anli"></i>
				</div>
				<span class="nav-name">应用</span>
			</li>
		</ul>

		<!-- 	<div class="open-page--box">
			<div class="open-title">广告主访问列表</div>
			<el-scrollbar class="open-item--list" :style="{height:adHeight+'px'}">

				<div class="open-item" :class="{active:item.active}" v-for="(item,index) in openPageList"
					@click="activeItemFn(item,index)" :key="item.id">
					<div class="open-item--name" :title="item.name">{{item.name}}</div>
					<i class="iconfont icon-chacha"></i>
				</div>

			</el-scrollbar>
		</div> -->

	</nav>
</template>

<script>
	import {
		ref,
		defineComponent,
		reactive,

		onMounted,
		onUnmounted,

		watch

	} from 'vue'
	import {
		useRouter,
		useRoute
	} from 'vue-router'

	export default defineComponent({
		name: 'NavMenu',
		setup() {

			// 路由信息读取
			const route = useRoute() // 使用 `useRoute` 获取当前路由


			// 定义菜单项类型
			const tradeManageNavs = reactive([{
					name: "台胞列表",
					icon: "iconfont icon-renyuanliebiao",
					go: "/table",
					type: "table",
				},
				{
					name: "家乡风貌",
					icon: "iconfont icon-mianji",
					go: "/searchBox",
					type: "money",
				},
				{
					name: "最新动态",
					icon: "iconfont icon-zuixinxunqing",
					go: "/api-example",
					type: "api",
				},
				{
					name: "家族关系",
					icon: "iconfont icon-ygqsxxgl",
					go: "/token-test",
					type: "token",
				},


			])

	

			// 路由跳转
			const router = useRouter()


			function goPage(path) {
				router.push(path)
			}


			function activeItemFn(item) {
				openPageList.forEach(x => {
					x.active = false;
				});
				item.active = true;
				console.log('openPageList--', openPageList)
			}



			// 在 return 之前调用 onMounted
			onMounted(() => {
			
				window.addEventListener('resize', handleResize);
			});

			onUnmounted(() => {
				window.removeEventListener('resize', handleResize);
			});

			return {
				route, // 可以在模板中直接访问

				tradeManageNavs, //左侧导航数据

				goPage,
				activeItemFn,



			}


		}
	})
</script>



<style lang="scss" scoped>
	nav.menu {
		width: 100px;
		height: 100%;
		background: #f0f7ff;
		text-align: center;

		.menu-title {
			font-size: 18px;
			padding: 40px 0;
			color: #2d70f3;
			font-weight: bold;

		}

		.menu-version {
			font-size: 14px;
			font-weight: normal;
			color: rgba(0, 0, 0, 0.3);
		}

		ul.nav-ul {
			list-style: none;
			width: 100px;
			padding-bottom: 10px;
			// border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			li.nav-li {
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 16px;
				// transitioxn: background 0.2s;
				width: 100px;
				height: 100px;

				&.active {
					background: #2d70f3;

					.nav-icon {

						i {
							color: #fff;

						}
					}

					.nav-name {
						color: #fff;

					}
				}

				&.pos-buttom {
					width: 100px;
					height: 100px;
					position: absolute;
					left: 0;
					bottom: 30px;
				}

				.nav-space {
					width: 100%;
					height: 10px;
				}

				.nav-icon {

					margin: 0 10px;
					padding: 20px 0 5px 0;

					i {
						font-size: 30px;
						color: #7d889c;
					}
				}

				.nav-name {
					color: #878787;
					font-size: 14px;
				}

			}

			li:hover {
				background: #deedff;
			}
		}

	}
</style>