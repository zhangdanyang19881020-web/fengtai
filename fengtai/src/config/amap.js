// 高德地图配置
export const amapConfig = {
  // 请替换为你的高德地图 API Key
  // 申请地址：https://console.amap.com/dev/key/app
  // 注意：必须是 "Web端(JS API)" 类型的Key，不是 "Web服务" 类型
  key: '2c902c096aec5c3664eb27f7425ad153',
  securityKey: '4202a15eb97e7315a0be11b3b8c2aac1', // 安全密钥
  
  // API 版本
  version: '2.0',
  
  // 需要加载的插件
  plugins: [
    'AMap.Scale',
    'AMap.ToolBar', 
    'AMap.InfoWindow',
    'AMap.Marker',
    'AMap.Polygon'
  ],
  
  // 地图样式
  mapStyle: 'amap://styles/normal',
  
  // 奉化区中心坐标
  fenghuaCenter: [121.5, 29.6],
  
  // 默认缩放级别
  defaultZoom: 12
}

// 街道/村庄坐标数据
export const locationData = {
  '锦屏街道': { 
    center: [121.45, 29.65], 
    zoom: 15,
    boundary: [
      [121.4, 29.6],
      [121.5, 29.6],
      [121.5, 29.7],
      [121.4, 29.7],
      [121.4, 29.6]
    ]
  },
  '岳林街道': { 
    center: [121.55, 29.65], 
    zoom: 15,
    boundary: [
      [121.5, 29.6],
      [121.6, 29.6],
      [121.6, 29.7],
      [121.5, 29.7],
      [121.5, 29.6]
    ]
  },
  '西坞街道': { 
    center: [121.45, 29.55], 
    zoom: 15,
    boundary: [
      [121.4, 29.5],
      [121.5, 29.5],
      [121.5, 29.6],
      [121.4, 29.6],
      [121.4, 29.5]
    ]
  }
}
