// Token 管理工具

// Token 存储键名
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRY_KEY = 'token_expiry'

//用户信息 存储
const USER_INFO = 'user'
/**
 * Token 管理类
 */
class TokenManager {
	/**
	 * 设置访问 Token
	 * @param {string} token 访问 Token
	 * @param {number} expiresIn 过期时间（秒）
	 */
	setAccessToken(token, expiresIn = 3600) {
		if (token) {
			localStorage.setItem(TOKEN_KEY, token)

			// 计算过期时间
			const expiryTime = Date.now() + (expiresIn * 1000)
			localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())

			console.log('Access token 已设置，过期时间:', new Date(expiryTime))
		}
	}

	/**
	 * 获取访问 Token
	 * @returns {string|null} 访问 Token
	 */
	getAccessToken() {
		return localStorage.getItem(TOKEN_KEY)
	}

	/**
	 * 设置刷新 Token
	 * @param {string} refreshToken 刷新 Token
	 */
	setRefreshToken(refreshToken) {
		if (refreshToken) {
			localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
			console.log('Refresh token 已设置')
		}
	}

	/**
	 * 获取刷新 Token
	 * @returns {string|null} 刷新 Token
	 */
	getRefreshToken() {
		return localStorage.getItem(REFRESH_TOKEN_KEY)
	}

	/**
	 * 检查 Token 是否过期
	 * @returns {boolean} 是否过期
	 */
	isTokenExpired() {
		const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
		if (!expiryTime) return true

		const now = Date.now()
		const expiry = parseInt(expiryTime)

		return now >= expiry
	}

	/**
	 * 获取 Token 剩余有效时间（秒）
	 * @returns {number} 剩余时间（秒）
	 */
	getTokenRemainingTime() {
		const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
		if (!expiryTime) return 0

		const now = Date.now()
		const expiry = parseInt(expiryTime)
		const remaining = Math.max(0, Math.floor((expiry - now) / 1000))

		return remaining
	}

	/**
	 * 检查 Token 是否即将过期（默认5分钟内过期）
	 * @param {number} warningTime 警告时间（秒），默认300秒
	 * @returns {boolean} 是否即将过期
	 */
	isTokenExpiringSoon(warningTime = 300) {
		const remainingTime = this.getTokenRemainingTime()
		return remainingTime <= warningTime
	}

	/**
	 * 清除所有 Token 和 用户信息
	 */
	clearTokens() {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(REFRESH_TOKEN_KEY)
		localStorage.removeItem(TOKEN_EXPIRY_KEY)
		localStorage.removeItem(USER_INFO)
		console.log('所有 Token 已清除')
	}

	/**
	 * 清除访问 Token
	 */
	clearAccessToken() {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(TOKEN_EXPIRY_KEY)
		console.log('Access token 已清除')
	}

	/**
	 * 检查是否有有效的 Token
	 * @returns {boolean} 是否有有效 Token
	 */
	hasValidToken() {
		const token = this.getAccessToken()
		return token && !this.isTokenExpired()
	}

	/**
	 * 获取 Token 信息摘要
	 * @returns {object} Token 信息
	 */
	getTokenInfo() {
		const token = this.getAccessToken()
		const refreshToken = this.getRefreshToken()
		const isExpired = this.isTokenExpired()
		const remainingTime = this.getTokenRemainingTime()
		const isExpiringSoon = this.isTokenExpiringSoon()

		return {
			hasToken: !!token,
			hasRefreshToken: !!refreshToken,
			isExpired,
			remainingTime,
			isExpiringSoon,
			expiryDate: localStorage.getItem(TOKEN_EXPIRY_KEY) ? new Date(parseInt(localStorage.getItem(
				TOKEN_EXPIRY_KEY))) : null
		}
	}

	//设置用户信息
	setUserInfo(userInfo) {
		if (userInfo) {
			var ob = JSON.stringify(userInfo);
			localStorage.setItem(USER_INFO, ob);
		}
	}

	getUserInfo() {
		const userInfo = localStorage.getItem(USER_INFO)
		return userInfo ? JSON.parse(userInfo) : null
	}


}

// 创建 Token 管理器实例
const tokenManager = new TokenManager()

// 导出 Token 管理器实例和类
export default tokenManager
export {
	TokenManager
}

// 导出便捷函数 - 绑定正确的 this 上下文
export const setAccessToken = tokenManager.setAccessToken.bind(tokenManager)
export const getAccessToken = tokenManager.getAccessToken.bind(tokenManager)
export const setRefreshToken = tokenManager.setRefreshToken.bind(tokenManager)
export const getRefreshToken = tokenManager.getRefreshToken.bind(tokenManager)
export const isTokenExpired = tokenManager.isTokenExpired.bind(tokenManager)
export const getTokenRemainingTime = tokenManager.getTokenRemainingTime.bind(tokenManager)
export const isTokenExpiringSoon = tokenManager.isTokenExpiringSoon.bind(tokenManager)
export const clearTokens = tokenManager.clearTokens.bind(tokenManager)
export const clearAccessToken = tokenManager.clearAccessToken.bind(tokenManager)
export const hasValidToken = tokenManager.hasValidToken.bind(tokenManager)
export const getTokenInfo = tokenManager.getTokenInfo.bind(tokenManager)


export const setUserInfo = tokenManager.setUserInfo.bind(tokenManager)
export const getUserInfo = tokenManager.getUserInfo.bind(tokenManager)