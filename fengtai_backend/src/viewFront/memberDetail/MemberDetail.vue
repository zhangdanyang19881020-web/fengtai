<template>
	<div>
		台胞详情
		<div>{{memberDetailOb}}</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		defineExpose,
		computed,
		onMounted
	} from "vue";
	import {
		dataApi
	} from "@/utils/api";
	import {
		useRoute
	} from 'vue-router';

	const route = useRoute();
	// 响应式变量
	const memberDetailOb = ref({});
	const loading = ref(true);
	const error = ref(null);
	// 获取台胞详情
	const getDetail = async () => {
		try {
			// 获取路由参数中的 id
			const params = {
				id: route.params.id
			};
			const result = await dataApi.memberDetail(params);

			if (result.code === 200 && result.data) {
				memberDetailOb.value = result.data; // 假设接口返回的数据存储在 result.data
			} else {
				error.value = '未找到相关数据';
			}
		} catch (err) {
			console.error('获取台胞详情失败:', err);
			error.value = '数据加载失败，请稍后重试';
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		getDetail(); // 在组件挂载时调用
	});
</script>

<style lang='scss'>
</style>