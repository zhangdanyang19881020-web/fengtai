import {
	createRouter,
	createWebHashHistory
} from 'vue-router'

import AccountLogin from '@/views/login/AccountLogin.vue'

const routes = [{
		path: '/',
		name: 'login',
		component: AccountLogin,
		meta: {
			public: true
		}
	}, {
		path: '/main',
		name: 'main',
		component: () => import('@/views/main/main.vue'),
		meta: {
			name: '奉台家缘',
		},
		children: [{
				path: '/taibaoList',
				name: 'taibaoList',
				component: () => import('@/views/taibaoList/TaibaoList.vue'),
				meta: {
					name: '奉台家缘',
					type: 'taibaoList',
					title: '台胞人员列表',
					for: 'back'
				},
			},
			{
				path: '/newTaibao',
				name: 'newTaibao',
				component: () => import('@/views/taibaoList/NewTaibao.vue'),
				meta: {
					name: '奉台家缘',
					type: 'taibaoList',
					title: '新建',
					for: 'back'
				}
			},
			{
				path: '/editTaibao/:userId',
				name: 'editTaibao',
				component: () => import('@/views/taibaoList/EditTaibao.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'taibaoList',
					title: '编辑',
					for: 'back'
				}
			},
			{

				path: '/homeView',
				name: 'homeView',
				component: () => import('@/views/homeView/homeView.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'homeView',
					title: '家乡风貌',
					for: 'back'
				}
			},
			{

				path: '/newsList',
				name: 'newsList',
				component: () => import('@/views/newsList/NewsList.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'newsList',
					title: '最新动态',
					for: 'back'
				}
			},
			{

				path: '/familyMap',
				name: 'familyMap',
				component: () => import('@/views/familyMap/FamilyMap.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'familyMap',
					title: '家族关系',
					for: 'back'
				}
			},
			{

				path: '/ancestralPlace',
				name: 'ancestralPlace',
				component: () => import('@/views/ancestralPlace/AncestralPlace.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'ancestralPlace',
					title: '祖籍地',
					for: 'back'
				}
			},
			{

				path: '/denglong',
				name: 'denglong',
				component: () => import('@/viewFront/denglong/denglong.vue'),
				props: true,
				meta: {
					name: '奉台家缘',
					type: 'denglong',
					title: '灯笼',
					for: 'back'
				}
			},


		]
	}, {
		path: '/front',
		name: 'front',
		component: () => import('@/viewFront/index/main/main.vue'),
		meta: {
			name: '奉台家缘',
		},
		children: [{
			path: '/index',
			name: 'index',
			component: () => import('@/viewFront/index/index.vue'),
			meta: {
				name: '奉台家缘',
			},
		}]

	},
	{
		path: '/home',
		name: 'home',
		component: () => import('@/views/home/home.vue'),
		meta: {
			name: '奉台家缘',
		},
		children: [{
				path: '/about',
				name: 'about',
				component: () => import('@/views/about/about.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/map',
				name: 'map',
				component: () => import('@/views/map/MapDemo.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/amap',
				name: 'amap',
				component: () => import('@/views/map/AmapDemo.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/test',
				name: 'test',
				component: () => import('@/views/map/SimpleMapTest.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/basic',
				name: 'basic',
				component: () => import('@/views/map/BasicTest.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/fenghua',
				name: 'fenghua',
				component: () => import('@/views/map/FenghuaMapPage.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/year',
				name: 'year',
				component: () => import('@/views/year/year.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/family',
				name: 'family',
				component: () => import('@/views/family/family.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/familyRelation',
				name: 'familyRelation',
				component: () => import('@/views/family/familyRelation.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/familyRelation2',
				name: 'familyRelation2',
				component: () => import('@/views/family2/familyTree.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/FamilyTree',
				name: 'FamilyTree',
				component: () => import('@/views/family/FamilyTree.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/company',
				name: 'company',
				component: () => import('@/views/family/company.vue'),
				meta: {
					name: '奉台家缘',
				},
			},
			{
				path: '/quill',
				name: 'quill',
				component: () => import('@/views/quill/wangeditor.vue'),
				meta: {
					name: '奉台家缘',
				},
			}
		]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router