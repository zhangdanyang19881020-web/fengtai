import axios from 'axios'
import {
	ElMessage
} from 'element-plus'
import config from './config'
import {
	getTokenType,
	setTokenType,
	getAccessToken,
	isTokenExpired,
	clearTokens
} from './token'

// 创建 axios 实例
const service = axios.create({
	baseURL: config.baseURL, // 基础URL
	timeout: config.timeout, // 请求超时时间
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
	}
})

// 请求拦截器
service.interceptors.request.use(
	config => {
		// 在发送请求之前做些什么

		// 检查是否是登录接口，如果是则不添加 token
		const isLoginRequest = config.url && (
			config.url.includes('/login')
		)

		// 如果不是登录接口，则添加 token
		if (!isLoginRequest) {
			const token = getAccessToken()
			if (token && !isTokenExpired()) {
				config.headers['Authorization'] = `Bearer ${token}`
			} else if (isTokenExpired()) {
				// Token 已过期，清除无效 token
				clearTokens()
				console.warn('Token 已过期，已自动清除')
			}
		}

		if (getAccessToken()) {
			config.headers = {
				Authorization: `${getTokenType()} ${getAccessToken()}`,
			}
		}

		// 添加时间戳防止缓存
		if (config.method === 'get') {
			config.params = {
				...config.params,
				_t: Date.now()
			}
		}

		// console.log('请求拦截器:', config)
		return config
	},
	error => {
		// 对请求错误做些什么
		console.error('请求拦截器错误:', error)
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		// 对响应数据做点什么
		const {
			data,
			status,
			statusText,
			config
		} = response

		// console.log('响应拦截器:', response)
		console.log('config:', config)
		console.log('status', status)
		// 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
		if (status === 200 || status == 201) {
			// 检查是否是登录接口的响应，如果是则自动保存 token
			const isLoginResponse = config.url && (
				config.url.includes('/api/auth/login/')
			)
			console.log('isLoginResponse--', isLoginResponse);
			if(config.responseType=='blob'){
				//文件返回
				return data;
			}

			if (isLoginResponse || data.code == 200) {
				// 自动保存登录返回的 token
				var loginResOb = data.data;
				import('./token').then(({
					setTokenType,
					setAccessToken,
					setRefreshToken,
					setUserInfo
				}) => {
					setAccessToken(loginResOb.access_token, loginResOb.expires_in || 3600)
					if (loginResOb.token_type) {
						setTokenType(loginResOb.token_type)
					}
					if (loginResOb.refresh_token) {
						setRefreshToken(loginResOb.refresh_token)
					}
					if (loginResOb.user + "") {
						setUserInfo(loginResOb.user)
					}
					console.log('登录成功，Token 已自动保存')
				})
			} else {
				console.log('others--', config)
			}

			// 这里可以根据后端的响应结构进行调整
			console.log('data--', data)
			if (data.code == 200) {
				return data
			} else {
				// 业务错误处理
				console.log('data', data)
				ElMessage.error(data.message || '请求失败')
				return Promise.reject(new Error(data.message || '请求失败'))
			}
		} else {
			// 其他状态码处理
			ElMessage.error(statusText || '请求失败')
			return Promise.reject(new Error(statusText || '请求失败'))
		}
	},
	error => {
		// 对响应错误做点什么

		console.error('响应拦截器错误:', error)

		if (error.response) {
			// 服务器返回了错误状态码
			const {
				status,
				data
			} = error.response
			console.log('errpr--status', status)
			console.log('errpr--data', data)

			switch (status) {
				case 400:
					ElMessage.error(data.message)
					break
				case 401:
					ElMessage.error('未授权，请重新登录')
					// 清除所有 token 并跳转到登录页
					clearTokens()
					// 这里可以添加路由跳转逻辑
					break
				case 403:
					ElMessage.error('拒绝访问')
					break
				case 404:
					ElMessage.error(data.message)
					break
				case 500:
					ElMessage.error('服务器内部错误')
					break
				case 502:
					ElMessage.error('网关错误')
					break
				case 503:
					ElMessage.error('服务不可用')
					break
				case 504:
					ElMessage.error('网关超时')
					break
				default:
					ElMessage.error(data?.message || '请求失败')
			}
		} else if (error.request) {
			// 请求已经发出，但没有收到响应
			ElMessage.error('网络错误，请检查网络连接')
		} else {
			// 在设置请求时发生了一些事情，触发了一个错误
			ElMessage.error('请求配置错误')
		}

		return Promise.reject(error)
	}
)

// 封装 GET 请求
export function get(url, params, config = {}) {
	return service.get(url, {
		params,
		...config
	})
}

// 封装 POST 请求
export function post(url, data, config = {}) {
	return service.post(url, data, config)
}

// 封装 PUT 请求
export function put(url, data, config = {}) {
	return service.put(url, data, config)
}

// 封装 DELETE 请求
export function del(url, config = {}) {
	return service.delete(url, config)
}

// 导出 axios 实例
export default service