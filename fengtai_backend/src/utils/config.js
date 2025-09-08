// 环境配置
const env = process.env.NODE_ENV

// 基础配置
const baseConfig = {
  // 应用名称
  appName: 'VUE3 frame',
  // 应用版本
  appVersion: '1.0.0',
  // 请求超时时间
  timeout: 10000,
  // 分页配置
  pagination: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  }
}

// 开发环境配置
const development = {
  ...baseConfig,
  // API 基础地址
  baseURL: 'http://localhost:3000/api',
  // 是否开启调试模式
  debug: true,
  // 是否开启 Mock 数据
  mock: true
}

// 生产环境配置
const production = {
  ...baseConfig,
  // API 基础地址
  baseURL: 'https://api.msb-browser.com/api',
  // 是否开启调试模式
  debug: false,
  // 是否开启 Mock 数据
  mock: false
}

// 测试环境配置
const test = {
  ...baseConfig,
  // API 基础地址
  baseURL: 'https://test-api.msb-browser.com/api',
  // 是否开启调试模式
  debug: true,
  // 是否开启 Mock 数据
  mock: false
}

// 根据环境导出配置
let config
switch (env) {
  case 'development':
    config = development
    break
  case 'production':
    config = production
    break
  case 'test':
    config = test
    break
  default:
    config = development
}

// 导出配置
export default config

// 导出环境变量
export const isDev = env === 'development'
export const isProd = env === 'production'
export const isTest = env === 'test'

