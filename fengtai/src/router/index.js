import {
	createRouter,
	createWebHashHistory
} from 'vue-router'


const routes = [{
		path: '/',
		name: 'home',
		component: () => import('@/views/home/home.vue'),
		children: [{
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
				path: '/company',
				name: 'company',
				component: () => import('@/views/family/company.vue')
			}
		]
	},

]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router