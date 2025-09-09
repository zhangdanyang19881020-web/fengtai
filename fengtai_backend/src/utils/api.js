import {
	get,
	post,
	put,
	del
} from './request'
import {
	getTokenType,
	getUserInfo,
	getAccessToken,
	clearTokens
} from '@/utils/token'

// 测试
// var _ServiceUrl = 'https://www.gihoo.work'; //ok
// var _commonApiUrl = "https://api.x.gihoo.work";
// var _ServiceUrl = 'http://192.168.0.17:8000'; //ok
var _ServiceUrl = 'http://8.136.3.28:8000'; //ok
var _commonApiUrl = "https://api.x.gihoo.work";

// 用户相关接口
export const userApi = {
	// 用户登录 - 支持多种数据格式
	login: (data) => {
		let requestData = "";
		let headers = {}

		// 构建登录数据
		// requestData = `username=${data.username}&password=${data.password}`;

		headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

		// 添加 Basic 认证头（登录接口特有的）
		// headers['Authorization'] = `Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW`

		return post(_ServiceUrl + '/api/auth/login/', data, )
	},

	// 用户登出
	logout: () => post('/user/logout'),
	// 获取用户信息
	getUserInfo: () => get(_ServiceUrl + "/cas/rest/me"),
	// 更新用户信息
	updateUserInfo: (data) => put('/user/info', data),
	// 修改密码
	changePassword: (data) => post('/user/change-password', data),

	// Token 相关接口
	// 刷新 Token
	refreshToken: (refreshToken) => post(_ServiceUrl + '/cas/OAuth/RefreshToken', {
		refresh_token: refreshToken
	}),
	// 验证 Token 有效性
	validateToken: (token) => post(_ServiceUrl + '/cas/OAuth/ValidateToken', {
		token
	}),
	// 撤销 Token
	revokeToken: (token) => post(_ServiceUrl + '/cas/OAuth/RevokeToken', {
		token
	}),
	// 获取 Token 信息
	getTokenInfo: (token) => get(_ServiceUrl + '/cas/OAuth/TokenInfo', {
		token
	}),
	// 检查 Token 是否过期
	checkTokenExpiry: (token) => post(_ServiceUrl + '/cas/OAuth/CheckTokenExpiry', {
		token
	})
}

// 数据相关接口
export const dataApi = {
	// 获取数据列表
	// 账户人员列表
	getDataList: (params) => post(_ServiceUrl + '/api/visit/userList/', params),
	// 获取所有家族关系
	getFamilyList: () => get(_ServiceUrl + '/api/famil/relationship/'),
	// 人员添加
	addMember: (params) => post(_ServiceUrl + '/api/visit/user/', params),
	// 删除用户
	delMember: (params) => post(_ServiceUrl + '/api/visit/delete_user/', params),
	// 地区列表
	regionList: () => get(_ServiceUrl + '/api/region/list/'),
	// 获取数据详情
	getMemberDetail: (params) => get(_ServiceUrl + `/api/visit/userInfo/`, params),
	// 活动列表
	newsList: (params) => post(_ServiceUrl + '/api/view/activityList/', params),
	// 家乡风貌
	homeViewList: (params) => post(_ServiceUrl + '/api/img/imgList/', params),

	// 创建数据
	createData: (data) => post('/data/create', data),
	// 更新数据
	updateData: (id, data) => put(`/data/update/${id}`, data),
	// 删除数据
	deleteData: (id) => del(`/data/delete/${id}`),
	// 批量删除数据
	batchDeleteData: (ids) => post('/data/batch-delete', {
		ids
	})
}

// 文件上传相关接口
export const uploadApi = {
	// 单文件上传 上传图片
	uploadFile: (formData, onProgress) => {
		// const formData = new FormData()
		// formData.append('file', file)

		return post(_ServiceUrl + '/api/img/upload/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'authorization': `${getTokenType()} ${getAccessToken()}}`,
			},
			onUploadProgress: onProgress
		})
	},
	// 多文件上传
	uploadFiles: (files, onProgress) => {
		const formData = new FormData()
		files.forEach(file => {
			formData.append('files', file)
		})

		return post('/upload/files', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			onUploadProgress: onProgress
		})
	}
}

// 系统相关接口
export const systemApi = {
	// 获取系统配置
	getSystemConfig: () => get('/system/config'),
	// 更新系统配置
	updateSystemConfig: (data) => put('/system/config', data),
	// 获取系统状态
	getSystemStatus: () => get('/system/status'),
	// 系统日志
	getSystemLogs: (params) => get('/system/logs', params)
}

// 导出所有 API
export default {
	_ServiceUrl,
	user: userApi,
	data: dataApi,
	upload: uploadApi,
	system: systemApi
}