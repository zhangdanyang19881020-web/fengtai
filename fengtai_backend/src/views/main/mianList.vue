<template>
	<div>
		<h1>Home Page {{ count }}</h1>
		<NavMenu />
		<button @click="increment">Increment</button>
		<router-link to="/">Go Home</router-link>
	</div>
</template>

<script setup lang="ts">
	import NavMenu from '@/components/layout/NavMenu.vue'
	import { ref, onMounted } from 'vue'

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
</script>

<style scoped>
	h1 {
		color: #2c3e50;
		margin-bottom: 20px;
	}
	
	button {
		background: #42b983;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		margin: 10px;
	}
	
	button:hover {
		background: #3aa876;
	}
</style>