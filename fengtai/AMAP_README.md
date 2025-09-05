# 高德地图集成说明

## 功能特性

- 🗺️ 集成高德地图 JavaScript API
- 📍 显示奉化区街道和村庄位置
- 👥 人员列表与地图标记联动
- 🎯 点击人员高亮对应位置
- 📱 响应式设计，支持移动端

## 使用步骤

### 1. 获取高德地图 API Key

1. 访问 [高德开放平台](https://console.amap.com/dev/key/app)
2. 注册/登录账号
3. 创建应用，选择 Web 端
4. 获取 API Key

### 2. 配置 API Key

编辑 `src/config/amap.js` 文件：

```javascript
export const amapConfig = {
  key: 'your-amap-api-key', // 替换为你的 API Key
  // ... 其他配置
}
```

### 3. 访问地图页面

- 开发环境：http://localhost:5174/#/amap
- 生产环境：https://your-domain.com/#/amap

## 文件结构

```
src/
├── components/
│   └── AmapFenghua.vue          # 高德地图组件
├── views/map/
│   └── AmapDemo.vue             # 高德地图页面
├── config/
│   └── amap.js                  # 高德地图配置
└── router/
    └── index.js                 # 路由配置
```

## 配置说明

### 地图配置 (src/config/amap.js)

```javascript
export const amapConfig = {
  key: 'your-amap-api-key',      // API Key
  version: '2.0',                // API 版本
  plugins: [...],                // 需要加载的插件
  mapStyle: 'amap://styles/normal', // 地图样式
  fenghuaCenter: [121.5, 29.6],  // 奉化区中心坐标
  defaultZoom: 12                // 默认缩放级别
}
```

### 位置数据配置

```javascript
export const locationData = {
  '锦屏街道': { 
    center: [121.45, 29.65],     // 中心坐标
    zoom: 15,                    // 缩放级别
    boundary: [...]              // 边界坐标
  },
  // ... 其他街道
}
```

## 自定义功能

### 添加新的街道/村庄

1. 在 `locationData` 中添加新位置：

```javascript
'新街道': { 
  center: [经度, 纬度], 
  zoom: 15,
  boundary: [[经度, 纬度], ...]
}
```

2. 在人员数据中添加对应的 `town` 或 `village` 字段

### 修改地图样式

在 `amapConfig` 中修改 `mapStyle`：

```javascript
mapStyle: 'amap://styles/dark'    // 暗色主题
mapStyle: 'amap://styles/light'   // 浅色主题
mapStyle: 'amap://styles/fresh'   // 清新主题
```

### 添加更多插件

在 `amapConfig.plugins` 中添加需要的插件：

```javascript
plugins: [
  'AMap.Scale',
  'AMap.ToolBar',
  'AMap.InfoWindow',
  'AMap.Marker',
  'AMap.Polygon',
  'AMap.Heatmap',        // 热力图
  'AMap.Clusterer'       // 点聚合
]
```

## 注意事项

1. **API Key 安全**：不要将 API Key 提交到公共代码仓库
2. **配额限制**：注意高德地图的调用次数限制
3. **HTTPS 要求**：生产环境必须使用 HTTPS
4. **跨域问题**：确保域名已在高德控制台配置

## 故障排除

### 地图不显示
- 检查 API Key 是否正确
- 确认网络连接正常
- 查看浏览器控制台错误信息

### 标记不显示
- 检查人员数据格式
- 确认坐标数据正确
- 验证街道名称匹配

### 样式问题
- 检查 CSS 样式冲突
- 确认容器高度设置
- 验证响应式布局

## 技术支持

- [高德地图 JavaScript API 文档](https://lbs.amap.com/api/jsapi-v2/documentation)
- [高德开放平台](https://lbs.amap.com/)
- [Vue 3 官方文档](https://vuejs.org/)
