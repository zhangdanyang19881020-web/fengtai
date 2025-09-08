<template>
	<nav class="menu">
		<div class="menu-title">
			{{$route.meta.name}}
			<div class="menu-version">
				{{$route.meta.version}}
			</div>
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

		<div class="open-page--box">
			<div class="open-title">广告主访问列表</div>
			<el-scrollbar class="open-item--list" :style="{height:adHeight+'px'}">

				<div class="open-item" :class="{active:item.active}" v-for="(item,index) in openPageList"
					@click="activeItemFn(item,index)" :key="item.id">
					<div class="open-item--name" :title="item.name">{{item.name}}</div>
					<i class="iconfont icon-chacha"></i>
				</div>

			</el-scrollbar>
		</div>

	</nav>
</template>

<script>
	import {
		ref,
		defineComponent,
		reactive,

		onMounted,
		onUnmounted,

	} from 'vue'
	import {
		useRouter
	} from 'vue-router'

	export default defineComponent({
		name: 'NavMenu',
		setup() {
			const adHeight = ref(300);
			const lengthList = ref(50);

			// 监听窗口大小变化
			const handleResize = () => {
				calculateHeight();
			};
			// 计算滚动区域高度的函数
			const calculateHeight = () => {
				// 获取浏览器视口高度
				adHeight.value = window.innerHeight - 450;
				console.log('adHeight', adHeight)
				// 减去菜单标题高度 (约80px) + 导航菜单高度 (约200px) + 底部应用按钮高度 (约50px) + 一些边距
			}


			// 定义菜单项类型
			const tradeManageNavs = reactive([{
					name: "广告主列表",
					icon: "iconfont icon-table",
					go: "/table",
					type: "table",
				},
				{
					name: "充值页面",
					icon: "iconfont icon-caiwu",
					go: "/searchBox",
					type: "money",
				},
				{
					name: "API-example",
					icon: "iconfont icon-caiwu",
					go: "/api-example",
					type: "api",
				},
				// {
				// 	name: "token-test",
				// 	icon: "iconfont icon-caiwu",
				// 	go: "/token-test",
				// 	type: "token",
				// },
				// {
				// 	name: "TokenManagerExample",
				// 	icon: "iconfont icon-caiwu",
				// 	go: "/TokenManagerExample",
				// 	type: "TokenManagerExample",
				// },

			])

			const openPageList = reactive([{
				name: '礼貌微笑11 (57754388577543885775438857754388)广告主',
				id: 11,
			}, {
				name: '礼貌微笑礼貌微笑礼貌微笑礼貌微笑22 (57754388)广告主',
				id: 22,
			}, {
				name: '礼貌微笑33 33 33 33 33 (57754388)广告主',
				id: 33,
			}, {
				name: '礼貌微笑44 (57754388)广告主',
				id: 44,
			}, {
				name: '礼貌微笑55 (57754388)广告主',
				id: 55,
			}, {
				name: '礼貌微笑66 (57754388)广告主',
				id: 66,
			}, {
				name: '礼貌微笑77 (57754388)广告主',
				id: 77,
			}, {
				name: '礼貌微笑88 (57754388)广告主',
				id: 88,
			}, {
				name: '礼貌微笑99 (57754388)广告主',
				id: 99,
			}, {
				name: '礼貌微笑11 (57754388)广告主',
				id: 110,
			}, {
				name: '礼貌微笑22 (57754388)广告主',
				id: 220,
			}, {
				name: '礼貌微笑33 (57754388)广告主',
				id: 330,
			}, {
				name: '礼貌微笑44 (57754388)广告主',
				id: 440,
			}, {
				name: '礼貌微笑55 (57754388)广告主',
				id: 550,
			}, {
				name: '礼貌微笑66 (57754388)广告主',
				id: 660,
			}, {
				name: '礼貌微笑77 (57754388)广告主',
				id: 770,
			}, {
				name: '礼貌微笑88 (57754388)广告主',
				id: 880,
			}, {
				name: '礼貌微笑99 (57754388)广告主',
				id: 990,
			}, {
				name: '礼貌微笑11 (57754388)广告主',
				id: 1111,
			}, {
				name: '礼貌微笑22 (57754388)广告主',
				id: 2211,
			}, {
				name: '礼貌微笑33 (57754388)广告主',
				id: 3311,
			}, {
				name: '礼貌微笑44 (57754388)广告主',
				id: 4411,
			}, {
				name: '礼貌微笑55 (57754388)广告主',
				id: 5511,
			}, {
				name: '礼貌微笑66 (57754388)广告主',
				id: 6611,
			}, {
				name: '礼貌微笑77 (57754388)广告主',
				id: 7711,
			}, {
				name: '礼貌微笑88 (57754388)广告主',
				id: 8811,
			}, {
				name: '礼貌微笑99 (57754388)广告主',
				id: 9911,
			}])

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
				calculateHeight();
				window.addEventListener('resize', handleResize);
			});

			onUnmounted(() => {
				window.removeEventListener('resize', handleResize);
			});

			return {
				tradeManageNavs,
				openPageList,
				adHeight,
				lengthList,

				goPage,
				calculateHeight,
				activeItemFn,

			}


		}
	})
</script>



<style lang="scss" scoped>
	nav.menu {
		width: 300px;
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
			width: 300px;
			padding-bottom: 10px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			li.nav-li {
				box-sizing: border-box;
				display: flex;
				align-items: center;
				cursor: pointer;
				border-radius: 16px;
				// transitioxn: background 0.2s;
				width: calc(100% - 20px);
				height: 35px;
				padding: 0 0 0 25px;
				margin: 5px 10px;

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
					width: 270px;
					position: absolute;
					left: 10px;
					bottom: 30px;
					margin-left: 4px;
				}

				.nav-space {
					width: 100%;
					height: 10px;
				}

				.nav-icon {
					margin-right: 10px;

					i {
						font-size: 20px;
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


		.open-page--box {
			font-size: 14px;
			padding: 10px 0 30px;
			text-align: left;
			
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			.open-title {
				display: flex;
				text-align: left;
				margin: 10px 20px 0;
				background: #409eff;
				padding: 5px 10px;
				color: #fff;
				display: inline-block;
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				font-size: 14px;
			}

			.open-item--list {
				border: 1px solid rgba(0, 0, 0, 0.05);
				border-radius: 4px;
				padding-top: 10px;
				margin: 0 20px;
				background:rgba(0, 0, 0, 0.03);

				.open-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 5px 10px;
					margin:0 15px;
					color: rgba(0, 0, 0, 0.6);
					border-radius: 4px;
					box-sizing: border-box;
				
					.open-item--name{
						width:100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					&.active {
						background: #3977f3;
						color: #fff;
					}

					.icon-chacha {
						display: none;
					}

					&:hover {

						background: #409EFF;
						color: #fff;

						.icon-chacha {
							display: block;
							cursor:pointer;
						}
					}
				}
			}


		}

	}
</style>