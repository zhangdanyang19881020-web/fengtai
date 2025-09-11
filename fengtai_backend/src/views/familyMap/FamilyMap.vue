<template>
	<el-tree style="width:100%" :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false"
		:render-content="renderContent" />
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue'
	import {
		ElInput, ElButton, ElMessageBox,
		ElMessage
	} from 'element-plus'
	import type { RenderContentContext, RenderContentFunction } from 'element-plus'
	import {
		dataApi
	} from '@/utils/api.js'

	interface Tree {
		relationshipId : number
		relationshipName : string
		editing ?: boolean
		children ?: Tree[]
	}

	type Node = RenderContentContext['node']
	type Data = RenderContentContext['data']

	let id = 1000

	let operateType = "";
	let appendParentNode = {};
	let editParentNode = {};
	let newChildNode = {};



	const append = (data : Tree) => {
		const newChild = { relationshipId: id++, relationshipName: '新节点', children: [], editing: true }
		if (!data.children) data.children = []
		data.children.push(newChild)
		dataSource.value = [...dataSource.value];
		operateType = 'append';
		// console.log('append-data--', data)
		appendParentNode = data;
		newChildNode = newChild;


	}


	const remove = async (node : Node, data : Tree) => {
		const parent = node.parent
		const children : Tree[] = parent?.data.children || parent?.data
		const index = children.findIndex((d) => d.relationshipId === data.relationshipId)
		children.splice(index, 1)
		dataSource.value = [...dataSource.value]

		// ⬇️接口
		// console.log('del-node', node);
		// console.log('del-data', data);
		let params = {
			relationshipId: node.data.relationshipId
		}
		const result = await dataApi.delRelationship(params)
		console.log('result', result)
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: result.message,
			});
			getFamilyList();
		}
	}

	const toggleEdit = (data : Tree) => {
		data.editing = !data.editing
		operateType = 'edit';
		editParentNode = data;
		console.log('toggleEdit', data)
		console.log('operateType', operateType)

	}
	const edit = (data : Tree) => {
		data.editing = true;
		operateType = 'edit';
		editParentNode = data;
		console.log('operateType--', operateType);
		console.log('editParentNode--', editParentNode);
	}
	const addRelationshipFn = async (saveNode : Tree) => {
		let params = {
			"topRelationshipId": appendParentNode.relationshipId,
			"currRelationshipId": null,
			"currRelationshipName": saveNode.relationshipName
		}
		const result = await dataApi.updateRelationship(params);
		if (result.code == 200) {
			console.log('nnkn', appendParentNode)
			newChildNode.editing = false;
			dataSource.value = [...dataSource.value];
			ElMessage({
				type: 'success',
				message: result.message,
			});

		}
	}
	const editRelationshipFn = async () => {
		let params = {
			"topRelationshipId": editParentNode.relationshipId,
			"currRelationshipId": editParentNode.relationshipId,
			"currRelationshipName": "444"
		}
		const result = await dataApi.updateRelationship(params);
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: result.message,
			});
			editParentNode.editing = false;
		}
	}

	const save = (data : Tree) => {
		console.log('save', data);
		if (operateType == 'append') {
			//新增接口
			addRelationshipFn(data);
		} else if (operateType == 'edit') {
			//编辑接口
			editRelationshipFn(data);
		}
	}


	const renderContent : RenderContentFunction = (h, { node, data }) => {
		return h(
			'div',
			{ class: 'custom-tree-node' },
			[
				data.editing
					? h(ElInput, {
						modelValue: data.relationshipName,
						'onUpdate:modelValue': (val : string) => (data.relationshipName = val),
						size: 'small',
						style: 'width: 150px',
					})
					: h('span', { onDblclick: () => toggleEdit(data) }, data.relationshipName),
				h('div', null, [
					h(
						ElButton,
						{ type: 'primary', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => append(data) },
						() => '增加'
					),
					// h(
					// 	ElButton,
					// 	{ type: 'danger', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => remove(node, data) },
					// 	() => '删除'
					// ),
					!data.editing &&
					h(
						ElButton,
						{ type: 'warning', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => edit(data) },
						() => '编辑'
					),
					data.editing &&
					h(
						ElButton,
						{ type: 'success', link: true, size: 'small', style: 'margin-left: 4px', onClick: () => save(data) },
						() => '保存'
					)
				])
			]
		)
	}

	// 树数据（去掉“祖辈”，可直接使用）
	const dataSource = ref<Tree[]>([])


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