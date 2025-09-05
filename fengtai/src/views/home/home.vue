<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	const title = ref('欢迎来到首页 Home')
	const now = ref('')

	function updateNow() {
		const d = new Date()
		const pad = n => String(n).padStart(2, '0')
		now.value =
			`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	}

	onMounted(() => {
		updateNow()
		const timer = setInterval(updateNow, 1000)
		// 清理
		addEventListener('unload', () => clearInterval(timer))
	})
</script>

<template>
	<div class="home">
		<h1>{{ title }}</h1>
		<p class="subtitle">当前时间：{{ now }}</p>

		<div class="card">
			<p>这是一个基于 Vue 3 + Vue Router 的示例首页。</p>
			<p>使用下面的按钮前往不同页面。</p>
			<div class="nav-buttons">
				<router-link to="/about" class="link-btn">关于页面</router-link>
				<router-link to="/map" class="link-btn">ECharts地图</router-link>
				<router-link to="/amap" class="link-btn">高德地图</router-link>
				<router-link to="/year" class="link-btn">年份</router-link>
				<router-link to="/family" class="link-btn">家族</router-link>
				<router-link to="/company" class="link-btn">公司</router-link>
				<!--        <router-link to="/fenghua" class="link-btn">奉化地图</router-link>
        <router-link to="/test" class="link-btn">地图测试</router-link>
        <router-link to="/basic" class="link-btn">基础测试</router-link> -->

			</div>
		</div>
		<div>
			<router-view />
		</div>
	</div>
</template>

<style scoped>
	.home {
		padding: 24px;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 24px;
	}

	.subtitle {
		margin: 0 0 16px;
		color: #666;
	}

	.card {
		padding: 16px;
		border: 1px solid #eee;
		border-radius: 8px;
		background: #fafafa;
	}

	.nav-buttons {
		display: flex;
		gap: 12px;
		margin-top: 16px;
		flex-wrap: wrap;
	}

	.link-btn {
		display: inline-block;
		padding: 8px 16px;
		background: #409eff;
		color: #fff;
		border-radius: 6px;
		text-decoration: none;
		transition: background 0.3s;
	}

	.link-btn:hover {
		background: #337ecc;
	}
</style>