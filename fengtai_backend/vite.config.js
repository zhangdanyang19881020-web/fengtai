import {
	fileURLToPath,
	URL
} from 'node:url'

import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
	server: {
		hmr: true, // 确保 HMR 是开启的
	},
	plugins: [
		vue(),
		vueDevTools(),
	],
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				// 配置全局 Sass 变量（如果需要）
				additionalData: `@use "@/styles/variables.scss" as *;`, // 确保加上分号
			},
		},
	},
})