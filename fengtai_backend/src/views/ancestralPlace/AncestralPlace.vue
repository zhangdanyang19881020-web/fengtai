<template>
	<div class="place-main">
		<div class="cascader-box">
			<el-tag class="cascader-box--tag" type="primary" size="large">奉化区</el-tag>
			<el-cascader-panel class="cascader-box--panel" v-model="ruleForm.street" :props="cascaderProps"
				:options="streetCascadarOptions" />
		</div>
		<el-divider></el-divider>

		<el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
			<el-form-item label=" " prop="">
				<el-tag type="primary" size="large">奉化区</el-tag>
			</el-form-item>
			<el-form-item label="街道/镇" prop="street">
				<el-select v-model="ruleForm.street" placeholder="请选择街道/镇">
					<el-option v-for="(item,index) in streetOptions" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="村" prop="village">
				<el-input v-model="ruleForm.village" placeholder="请输入村" />
			</el-form-item>
			<el-divider></el-divider>
			<el-form-item>
				<el-button type="primary" @click="submitForm(ruleFormRef)">
					确定
				</el-button>
				<el-button @click="resetForm(ruleFormRef)">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
	import { reactive, ref, onMounted } from 'vue'

	import type { FormInstance, FormRules } from 'element-plus'
	import { ElMessage } from 'element-plus'

	import {
		dataApi
	} from '@/utils/api.js'

	interface RuleForm {
		name : string
		region : string
		street : string
		village : string
		count : string
		date1 : string
		date2 : string
		delivery : boolean
		location : string
		type : string[]
		resource : string
		desc : string
	}

	const ruleFormRef = ref<FormInstance>()
	const ruleForm = reactive<RuleForm>({
		name: 'Hello',
		region: '',
		street: '',
		village: '',
		count: '',
		date1: '',
		date2: '',
		delivery: false,
		location: '',
		type: [],
		resource: '',
		desc: '',
	})

	const streetCascadarOptions = reactive([])
	const streetOptions = reactive([])

	const cascaderProps = reactive({
		value: 'id',
		label: 'name',
		children: 'children'
	})

	const locationOptions = ['Home', 'Company', 'School']

	const rules = reactive<FormRules<RuleForm>>({
		name: [
			{ required: true, message: 'Please input Activity name', trigger: 'blur' },
			{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
		],
		street: [
			{
				required: true,
				message: '请选择街道/镇',
				trigger: 'change',
			},
		],
		village: [
			{
				required: true,
				message: '请输入村',
				trigger: 'blur',
			},
		]
	})

	const getStreetList = async () => {
		const result = await dataApi.regionList();
		console.log('result', result)
		if (result.code == 200) {
			streetCascadarOptions.splice(0, streetCascadarOptions.length, ...result.data[0].children);
			console.log('streetCascadarOptions', streetCascadarOptions)
			var arr = result.data[0].children.map(x => ({
				label: x.name,
				value: x.id
			}))
			streetOptions.splice(0, streetOptions.length, ...arr);
		}
	}

	const submitForm = async (formEl : FormInstance | undefined) => {
		if (!formEl) return
		await formEl.validate((valid, fields) => {
			if (valid) {
				console.log('submit!')
				addVillage();
			} else {
				console.log('error submit!', fields)
			}
		})
	}
	const addVillage = async () => {
		let params = {
			"parentId": ruleForm.street,
			"id": null,
			"name": ruleForm.village,
		}
		const result = await dataApi.addVillage(params);
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: result.message,
			});
			ruleForm.village="";
			getStreetList()
		}
	}

	const resetForm = (formEl : FormInstance | undefined) => {
		if (!formEl) return
		formEl.resetFields()
	}

	const options = Array.from({ length: 10000 }).map((_, idx) => ({
		value: `${idx + 1}`,
		label: `${idx + 1}`,
	}))

	onMounted(() => {
		getStreetList()
	})
</script>

<style lang="scss" scoped>
	.place-main {
		width: 80%;
		margin: 20px auto;

		.cascader-box {
			display: flex;

			.cascader-box--tag {
				margin-right: 10px;
			}

			.cascader-box--panel {}

		}
	}
</style>