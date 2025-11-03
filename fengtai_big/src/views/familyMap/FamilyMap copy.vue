<template>
	<el-tree style="width:100%" :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false"
		:render-content="renderContent" />
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue'
	import { ElInput, ElButton } from 'element-plus'
	import type { RenderContentContext, RenderContentFunction } from 'element-plus'
	import {
		dataApi
	} from '@/utils/api.js'

	interface Tree {
		id : number
		label : string
		editing ?: boolean
		children ?: Tree[]
	}

	type Node = RenderContentContext['node']
	type Data = RenderContentContext['data']

	let id = 1000



	const append = (data : Tree) => {
		const newChild = { id: id++, label: '新节点', children: [] }
		if (!data.children) data.children = []
		data.children.push(newChild)
		dataSource.value = [...dataSource.value]
	}

	const remove = async (node : Node, data : Tree) => {
		const parent = node.parent
		const children : Tree[] = parent?.data.children || parent?.data
		const index = children.findIndex((d) => d.id === data.id)
		children.splice(index, 1)
		dataSource.value = [...dataSource.value]

		// ⬇️接口
		console.log('del-node', node);
		console.log('del-data', data);
		let params = {
			relationshipId: node.id
		}
		const result = await dataApi.delRelationship(params)
		console.log('result', result)
	}

	const toggleEdit = (data : Tree) => {
		data.editing = !data.editing
		console.log('toggleEdit', data)
	}

	const renderContent : RenderContentFunction = (h, { node, data }) => {
		return h(
			'div',
			{ class: 'custom-tree-node' },
			[
				data.editing
					? h(ElInput, {
						modelValue: data.label,
						'onUpdate:modelValue': (val : string) => (data.label = val),
						size: 'small',
						style: 'width: 150px',
					})
					: h('span', { onDblclick: () => toggleEdit(data) }, data.label),
				h('div', null, [
					h(
						ElButton,
						{ type: 'primary', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => append(data) },
						() => '增加'
					),
					h(
						ElButton,
						{ type: 'danger', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => remove(node, data) },
						() => '删除'
					),
					!data.editing &&
					h(
						ElButton,
						{ type: 'warning', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => toggleEdit(data) },
						() => '编辑'
					),
					data.editing &&
					h(
						ElButton,
						{ type: 'success', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => toggleEdit(data) },
						() => '保存'
					)
				])
			]
		)
	}

	// 树数据（去掉“祖辈”，可直接使用）
	const dataSource = ref<Tree[]>([
		{
			id: 3,
			label: '爷爷',
			children: [
				{ id: 4, label: '奶奶' },
				{
					id: 5,
					label: '父亲',
					children: [
						{ id: 6, label: '母亲' },
						{
							id: 7,
							label: '我',
							children: [
								{ id: 8, label: '配偶' },
								{
									id: 9,
									label: '子女',
									children: [
										{ id: 10, label: '儿子' },
										{ id: 11, label: '女儿' }
									]
								}
							]
						},
						{
							id: 12,
							label: '兄弟姐妹',
							children: [
								{ id: 13, label: '哥哥' },
								{ id: 14, label: '姐姐' },
								{ id: 15, label: '弟弟' },
								{ id: 16, label: '妹妹' }
							]
						},
						{
							id: 17,
							label: '侄外甥辈',
							children: [
								{ id: 18, label: '侄子（兄弟的儿子）' },
								{ id: 19, label: '侄女（兄弟的女儿）' },
								{ id: 20, label: '外甥（姐妹的儿子）' },
								{ id: 21, label: '外甥女（姐妹的女儿）' }
							]
						}
					]
				},
				{ id: 22, label: '伯父', children: [{ id: 23, label: '伯母' }] },
				{ id: 24, label: '叔叔', children: [{ id: 25, label: '婶婶' }] },
				{ id: 26, label: '姑妈', children: [{ id: 27, label: '姑父' }] }
			]
		},
		{
			id: 28,
			label: '外公',
			children: [
				{ id: 29, label: '外婆' },
				{ id: 30, label: '母亲', children: [{ id: 31, label: '父亲（已在父系）' }] },
				{ id: 32, label: '舅舅', children: [{ id: 33, label: '舅妈' }] },
				{ id: 34, label: '姨妈', children: [{ id: 35, label: '姨父' }] }
			]
		}
	])

	
	const getFamilyList = async () => {
		const result = await dataApi.getFamilyList();
		console.log('fa-', result)
		if (result.code == 200) {
			dataSource.value = [...result.data];
		}
	}
	onMounted(() => {
		getFamilyList();
	})
</script>

<style>
	.custom-tree-node {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>