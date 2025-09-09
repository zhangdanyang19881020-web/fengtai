<template>
	<div class="form-container">
		<el-form :model="form" label-width="100px">
			<!-- 头像 -->
			<el-form-item label="头像" class="required-label">
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
			<el-form-item label="名字" required>
				<el-input v-model="form.name" placeholder="请输入" />
			</el-form-item>

			<!-- 籍贯 -->
			<el-form-item label="籍贯" required>
				<el-select v-model="form.province" placeholder="请选择省份" style="width: 150px;">
					<el-option label="奉化市" value="奉化市" />
				</el-select>
				<el-select v-model="form.city" placeholder="请选择街道" style="width: 150px; margin-left: 10px;">
					<el-option label="锦屏街道" value="锦屏街道" />
				</el-select>
				<el-select v-model="form.community" placeholder="请选择社区" style="width: 150px; margin-left: 10px;">
					<el-option label="奉中社区" value="奉中社区" />
				</el-select>
			</el-form-item>

			<!-- 个人信息 -->
			<el-form-item label="个人信息" required>
				<el-input type="textarea" v-model="form.info" placeholder="请输入内容" />
			</el-form-item>

			<!-- 到访年份 -->
			<el-form-item label="到访年份" >
				<div class="come-year--box">
					<div class="year-tag-box">
						<el-tag v-for="(year, index) in form.visitYears" :key="index" closable
							@close="removeYear(index)">
							{{ year }}
						</el-tag>
					</div>
					<el-input v-model="yearInput" placeholder="请输入1949-2025之间的年份数字"
						style="width: 250px; margin-left: 10px;" @keyup.enter="addYear" />
					<el-button type="success" @click="addYear" style="margin-left: 10px;">添加到访年份</el-button>
				</div>
			</el-form-item>

			<!-- 家族关系 -->
			<el-form-item label="家族关系" required>
				<el-table :data="form.family" border style="width: 500px;">
					<el-table-column prop="relation" label="关系" width="120" />
					<el-table-column prop="name" label="名字" width="180" />
					<el-table-column label="操作" width="80">
						<template #default="{ $index }">
							<i class="iconfont icon-chacha" @click="removeFamily($index)"></i>
						</template>
					</el-table-column>
				</el-table>

				<div style="margin-top: 10px;">
					<el-select v-model="familyRelation" placeholder="关系" style="width: 120px;">
						<el-option label="爷爷" value="爷爷" />
						<el-option label="父亲" value="父亲" />
						<el-option label="母亲" value="母亲" />
						<el-option label="姐姐" value="姐姐" />
					</el-select>
					<el-input v-model="familyName" placeholder="请输入姓名" style="width: 180px; margin-left: 10px;" />
					<el-button type="success" @click="addFamily" style="margin-left: 10px;">添加</el-button>
				</div>
			</el-form-item>

			<!-- 提交按钮 -->
			<el-form-item>
				<el-button type="primary" size="large">添加台胞</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
	import {
		ref
	} from "vue"
	import {
		Picture,
		Close,

	} from "@element-plus/icons-vue"
	import {
		ElMessage
	} from 'element-plus'
	import {
		uploadApi,
	} from '@/utils/api.js'
	import {
		getUserInfo,
		getAccessToken,
		clearTokens
	} from '@/utils/token'

	const form = ref({
		avatar: "",
		name: "",
		province: "",
		city: "",
		community: "",
		info: "",
		visitYears: ["2008", "2021"],
		family: [{
				relation: "爷爷",
				name: "蒋生挺"
			},
			{
				relation: "父亲",
				name: "蒋孝天"
			},
			{
				relation: "母亲",
				name: "王慧菊"
			},
			{
				relation: "姐姐",
				name: "蒋音甄"
			},
		],
	})

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
			// if (file.size > 10 * 1024 * 1024) {
			// 	ElMessage.error('头像图片大小不能超过2MB');
			// 	return;
			// }
			uploadApiFn(file);

		}
	};
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


	const yearInput = ref("")
	const familyRelation = ref("")
	const familyName = ref("")

	const addYear = () => {
		const year = yearInput.value.trim()
		if (year && /^\d{4}$/.test(year)) {
			form.value.visitYears.push(year)
			yearInput.value = ""
		}
	}

	const removeYear = (index) => {
		form.value.visitYears.splice(index, 1)
	}

	const addFamily = () => {
		if (familyRelation.value && familyName.value) {
			form.value.family.push({
				relation: familyRelation.value,
				name: familyName.value,
			})
			familyRelation.value = ""
			familyName.value = ""
		}
	}

	const removeFamily = (index) => {
		form.value.family.splice(index, 1)
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
		}

		.icon-chacha {
			font-size: 14px;
			color: #f00000;
			cursor: pointer;

			&:hover {
				font-size: 16px;
			}
		}
	}
</style>