<template>
	<div class="form-container">
		<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="100px">
			<!-- 头像 -->
			<el-form-item label="头像" class="required-label" prop="avatar">
				<div class="avatar-uploader">
					<img v-if="form.avatar" :src="form.avatar" class="avatar" alt="头像">
					<img v-else :src="defaultAvatar" class="avatar" alt="默认头像">
					<el-button class="avatar-uploader--btn" plain type="primary" @click="triggerUpload">
						<i class="iconfont icon-shangchuan"></i> <span>上传头像</span>
					</el-button>
					<input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*"
						style="display: none">
				</div>
				<!-- <div class="hint-text">支持JPG、PNG格式，大小不超过2MB</div> -->
			</el-form-item>
			<el-form-item label="名字" prop="name">
				<el-input v-model="form.name" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="form.sex">
					<el-radio value="male">男</el-radio>
					<el-radio value="female">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="生日" prop="birthday">
				<el-date-picker v-model="form.birthday" type="date" placeholder="请选择生日" />
			</el-form-item>

			<!-- 籍贯 -->
			<el-form-item label="籍贯" prop="address">
				<div class="city-label">
					<el-tag type="success" size="large">奉化区</el-tag>
				</div>
				<el-cascader v-model="form.address" :props="addressProp" :options="addressOptions"
					placeholder="请选择街道/镇/村" clearable style="width: 350px" />
			</el-form-item>

			<el-form-item label="联系人" prop="contact">
				<el-input v-model="form.contact" placeholder="请输入联系人" />
			</el-form-item>
			<el-form-item label="联系人电话" prop="contactPhone">
				<el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
			</el-form-item>

			<!-- 个人信息 -->
			<el-form-item label="个人信息" prop="info">
				<el-input type="textarea" v-model="form.info" placeholder="请输入个人信息" />
			</el-form-item>

			<!-- 到访年份 -->
			<el-form-item label="到访年份">
				<div class="come-year--box">
					<div class="year-tag-box">
						<el-tag v-for="(year, index) in form.visitYears" :key="index" closable
							@close="removeYear(index)">
							{{ year }}
						</el-tag>
					</div>
					<!-- 		<el-input v-model="yearInput" placeholder="请输入1949-2025之间的年份数字" class="year-input"
						@keyup.enter="addYear" /> -->
					<el-select v-model="yearInput" placeholder="请选择年份" style="width: 240px" @change="addYear">
						<el-option v-for="item in filteredYearOptions" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
					<!-- <el-button type="success" @click="addYear" style="margin-left: 10px;">添加</el-button> -->
				</div>
			</el-form-item>

			<!-- 家族关系 -->
			<el-form-item label="家族关系">
				<el-table class="z-table" :data="form.familyTable">
					<el-table-column prop="relation" label="关系" width="120" />
					<el-table-column prop="name" label="名字" />
					<el-table-column label="操作" width="80">
						<template #default="{ $index }">
							<i class="iconfont icon-chacha" @click="removeFamily($index)"></i>
						</template>
					</el-table-column>
				</el-table>

				<div style="margin-top: 10px;">
					<el-select v-model="familyRelation" placeholder="关系" style="width: 120px;">
						<el-option v-for="item in familyRelationOption" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
					<el-input v-model="familyName" placeholder="请输入姓名" style="width: 180px; margin-left: 10px;" />
					<el-button type="success" @click="addFamily" style="margin-left: 10px;">添加</el-button>
				</div>
			</el-form-item>
			<el-divider />
			<!-- 提交按钮 -->
			<el-form-item>
				<el-button type="primary" size="large" @click="submitForm(ruleFormRef)">添加台胞</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,

		onMounted,
	} from "vue"
	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import {
		Picture,
		Close,

	} from "@element-plus/icons-vue"
	import {
		ElMessage
	} from 'element-plus'
	import {
		uploadApi,
		dataApi,
	} from '@/utils/api.js'
	import {
		getUserInfo,
		getAccessToken,
		clearTokens
	} from '@/utils/token'
	import rawData from '@/datas/fenghua.json'

	onMounted(() => {
		getFamilyData();
		regionListFn();
	})

	const router = useRouter()
	const addressProp = reactive({
		value: 'id',
		label: 'name',
		children: 'children'
	})
	const form = ref({
		avatar: "",
		name: "",
		sex: 'male',
		birthday: '',
		address: [],
		community: "",
		info: "",
		visitYears: [],
		familyTable: [],
		contact: '',
		contactPhone: ''
	})
	const ruleFormRef = ref();

	const rules = reactive({
		avatar: [{
			required: true,
			message: '请上传头像',
			trigger: 'change'
		}],
		name: [{
			required: true,
			message: '请输入名字',
			trigger: 'blur'
		}],
		contact: [{
			required: true,
			message: '请输入联系人',
			trigger: 'blur'
		}],
		contactPhone: [{
			required: true,
			message: '请输入联系人电话',
			trigger: 'blur'
		}, {
			pattern: /^(\d+(-\d+)?)$/,
			message: '电话格式不正确，只能是纯数字或数字中间带“-”',
			trigger: 'blur'
		}],
		sex: [{
			required: true,
			message: '请选择性别',
			trigger: 'change'
		}],
		birthday: [{
			required: true,
			message: '请选择生日',
			trigger: 'change'
		}],
		address: [{
			required: true,
			message: '请选择街道/镇和村',
			trigger: 'change'
		}],
		info: [{
			required: true,
			message: '请输入个人信息',
			trigger: 'blur'
		}],
	})
	const submitForm = async (formEl) => {
		if (!formEl) return
		await formEl.validate((valid, fields) => {
			if (valid) {
				// console.log('submit!')
				addMemberFn()
			} else {
				console.log('error submit!', fields)
			}
		})
	}
	const addressOptions = reactive([])
	// // 转换成 el-cascader 需要的格式
	// const addressOptions = rawData.subdivisions.map(sub => ({
	// 	value: sub.name,
	// 	label: sub.name,
	// 	children: sub.villages.map(v => ({
	// 		value: v,
	// 		label: v
	// 	}))
	// }))
	// const convertToCascaderData = (nodes) => {
	// 	return nodes.map(node => ({
	// 		value: node.id,
	// 		label: node.name,
	// 		children: node.children && node.children.length > 0 ? convertToCascaderData(node
	// 			.children) : []
	// 	}))
	// }

	// 村街道
	const regionListFn = async () => {
		const result = await dataApi.regionList();
		if (result.code === 200 && result.data) {
			addressOptions.splice(0, addressOptions.length, ...result.data[0].children);
		}
	}


	const addMemberFn = async () => {
		// console.log('form.address', form.value.address)
		if (form.value.address.length > 0) {
			var regionArr = reactive(form.value.address);
		} else {
			regionArr = [null, null]
		}

		var tableData = form.value.familyTable.map(x => {
			return {
				"relationshipId": x.id,
				"relationshipName": x.name
			}
		})
		// 时间格式化函数
		function formatDate(dateStr) {
			const date = new Date(dateStr); // 解析 ISO 字符串
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, '0');
			const d = String(date.getDate()).padStart(2, '0');
			return `${y}-${m}-${d}`;
		}
		const params = {
			"id": null,
			"gender": form.value.sex,
			"birthDate": formatDate(form.value.birthday),
			"headImgId": headerImgOb.value.id,
			"name": form.value.name,
			"regionId": regionArr[0],
			"villageId": regionArr[1],
			"info": form.value.info,
			"contact": form.value.contact,
			"contactPhone": form.value.contactPhone,
			"yearList": form.value.visitYears.map(y => Number(y)),
			"relationshipList": tableData
		}
		const result = await dataApi.addMember(params)
		if (result.code == 200) {
			ElMessage.success(result.message);
			router.push('/taibaoList')
		}
	}

	//家族关系

	const familyRelation = ref("")
	const familyRelationOption = ref([])

	const familyName = ref("")
	// 扁平化函数
	const flattenFamilyTree = (nodes, parentPath = "") => {
		let result = [];
		nodes.forEach(node => {
			// 构造完整路径
			const path = parentPath ? `${parentPath} > ${node.relationshipName}` : node.relationshipName;
			// console.log("path", path)
			// 添加到结果数组
			// 只有没有 children 或 children 为空数组才加入
			var arr = path.split('>');
			var leaf = arr[arr.length - 1];
			// console.log('leaf', leaf)

			result.push({
				value: node.relationshipId,
				label: leaf
			})


			// 递归子节点
			if (node.children && node.children.length > 0) {
				result = result.concat(flattenFamilyTree(node.children, path));
			}
		});
		return result;
	}



	const getFamilyData = async () => {
		try {
			const result = await dataApi.getFamilyList();
			console.log('fa-', result)
			// 扁平化后的数组
			if (result.code == 200 && result.data) {
				const flatArray = flattenFamilyTree(result.data)
				const uniqueArray = Array.from(new Map(flatArray.map(item => [item.value, item])).values())
				familyRelationOption.value = uniqueArray
			}
		} catch (error) {
			return []
		}
	}

	const addFamily = () => {
		if (familyRelation.value && familyName.value) {
			var relationName = familyRelationOption.value.find(x => x.value == familyRelation.value).label;
			form.value.familyTable.push({
				id: familyRelation.value,
				relation: relationName,
				name: familyName.value,
			})
			familyRelation.value = ""
			familyName.value = ""
		}
	}

	const removeFamily = (index) => {
		form.value.familyTable.splice(index, 1)
	}


	// 年份
	const yearArr = Array.from({
		length: 2025 - 1949 + 1
	}, (_, index) => 1949 + index)

	// 动态过滤已选年份
	const filteredYearOptions = computed(() =>
		yearArr
		.filter(y => !form.value.visitYears.includes(String(y))) // 都转成字符串比较
		.map(y => ({
			label: y,
			value: y
		}))
	);


	const yearInput = ref(null)

	const addYear = () => {
		if (yearInput.value) {
			const yearStr = String(yearInput.value); // 转成字符串
			if (!form.value.visitYears.includes(yearStr)) {
				form.value.visitYears.push(yearStr);
				// 排序
				form.value.visitYears.sort((a, b) => Number(a) - Number(b));
			}
			yearInput.value = null; // 清空选择
		}
	};


	const removeYear = (index) => {
		form.value.visitYears.splice(index, 1);
		// 删除后也可以排序，保持一致（可选）
		form.value.visitYears.sort((a, b) => Number(a) - Number(b));
	};




	// 头像上传
	// Avatar upload action URL
	const fileInput = ref(null);
	const defaultAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');
	const uploadUrl = ref('http://8.136.3.28:8000/api/img/upload/');
	const uploadData = ref({}); // Additional data that may be needed for the upload (e.g., user ID or session token)

	// Handle the file selection manually (if you want to use manual file uploads)
	const triggerUpload = () => {
		fileInput.value.click();
	};
	const handleAvatarUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			uploadApiFn(file);
		}
	};
	const headerImgOb = reactive({});
	const uploadApiFn = async (file) => {
		try {
			// console.log('file',file)
			const formData = new FormData()
			formData.append('file', file)
			formData.append('type', 0)
			formData.append('targetId', 1)
			formData.append('title', file.name)
			const result = await uploadApi.uploadFile(formData)
			console.log('result', result)
			if (result?.data.access_path) {
				headerImgOb.value = result.data;
				// console.log('headerImgOb',headerImgOb)
				form.value.avatar = result.data.access_path; // 更新为服务器地址
				// 上传完后清空
				fileInput.value.value = "";
			} else {
				ElMessage.warning('上传成功，但未返回头像地址');
			}
			ElMessage.success('头像上传成功');
			setTimeout(() => {

			})
		} catch (error) {
			console.error('Failed to fetch data:', error)
		}
	}
</script>

<style lang="scss" scoped>
	.form-container {
		padding: 20px;
		width: calc(100% - 200px);

		.avatar-uploader {
			display: flex;
			align-items: center;

			.avatar {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				margin-right: 10px;
				border: 1px solid rgba(0, 0, 0, 0.08);
				background: rgba(0, 0, 0, 0.03);
				color: rgba(0, 0, 0, 0.3);
			}

			.avatar-uploader--btn {
				margin-left: 10px;

				.iconfont {
					margin-right: 5px;
				}
			}
		}

		.come-year--box {
			.year-tag-box {
				.el-tag {
					margin-right: 5px;
				}
			}

			.year-input {
				width: 250px;
				margin-top: 5px;
			}
		}

		.icon-chacha {
			font-size: 14px;
			color: #f00000;
			cursor: pointer;

			&:hover {
				font-size: 16px;
			}
		}

		.city-label {
			margin-right: 10px;
		}
	}
</style>