import {
	createRouter,
	createWebHashHistory
} from 'vue-router'
import AccountLogin from '@/views/login/AccountLogin.vue'

const routes = [
	{
		path: '/',
		name: 'login',
		component: AccountLogin,
		meta: {
			public: true
		}
	},{
		path: '/main',
		name: 'main',
		component: () => import('@/views/main/home.vue'),
		children: [{
			path: '/about',
			name: 'about',
			component: () => import('@/views/about/about.vue')
		}]
	},
	{
		path: '/home',
		name: 'home',
		component: () => import('@/views/home/home.vue'),
		children: [
			{
				path: '/about',
				name: 'about',
				component: () => import('@/views/about/about.vue')
			},
			{
				path: '/map',
				name: 'map',
				component: () => import('@/views/map/MapDemo.vue')
			},
			{
				path: '/amap',
				name: 'amap',
				component: () => import('@/views/map/AmapDemo.vue')
			},
			{
				path: '/test',
				name: 'test',
				component: () => import('@/views/map/SimpleMapTest.vue')
			},
			{
				path: '/basic',
				name: 'basic',
				component: () => import('@/views/map/BasicTest.vue')
			},
			{
				path: '/fenghua',
				name: 'fenghua',
				component: () => import('@/views/map/FenghuaMapPage.vue')
			},
			{
				path: '/year',
				name: 'year',
				component: () => import('@/views/year/year.vue')
			},
			{
				path: '/family',
				name: 'family',
				component: () => import('@/views/family/family.vue')
			},
			{
				path: '/familyRelation',
				name: 'familyRelation',
				component: () => import('@/views/family/familyRelation.vue')
			},
			{
				path: '/familyRelation2',
				name: 'familyRelation2',
				component: () => import('@/views/family2/familyTree.vue')
			},
			{
				path: '/FamilyTree',
				name: 'FamilyTree',
				component: () => import('@/views/family/FamilyTree.vue')
			},
			{
				path: '/company',
				name: 'company',
				component: () => import('@/views/family/company.vue')
			},
			{
				path: '/quill',
				name: 'quill',
				component: () => import('@/views/quill/wangeditor.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
