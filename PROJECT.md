# 湖北大学校车预约小程序

## 项目简介
基于 uni-app 框架开发的校车预约微信小程序,面向湖北大学师生提供便捷的校车查询、预约、乘车管理服务。

## 技术栈
- **框架**: uni-app (Vue 3)
- **目标平台**: 微信小程序
- **数据存储**: 本地存储 (uni.setStorage/getStorage)
- **UI方案**: 自定义组件

## 功能特性

### 1. 车辆预约页面
- **我的预约板块**: 横向滑动展示待出行的预约
- **车辆预约板块**: 
  - 路线选择 (长江新区至武昌 / 武昌至长江新区)
  - 日期选择 (未来7天)
  - 车次信息列表 (出发时间、剩余座位、候车位置)
  - 一键预约功能

### 2. 乘车码页面
- 动态二维码生成
- 预约信息展示
- 30秒自动刷新
- 使用说明提示

### 3. 我的页面
- 身份认证入口
- 预约须知查看
- 客服反馈信息
- 乘车历史查询
- 身份信息展示

### 4. 身份认证页面
- 姓名、学号/工号输入
- 身份类型选择 (学生/教职工)
- 表单验证
- 本地存储认证信息

## 项目结构

```
School-Bus-Scheduling-System/
├── pages/                      # 页面目录
│   ├── booking/
│   │   └── index.vue          # 车辆预约页面
│   ├── qrcode/
│   │   └── index.vue          # 乘车码页面
│   ├── profile/
│   │   └── index.vue          # 我的页面
│   └── auth/
│       └── index.vue          # 身份认证页面
├── api/                        # API接口层
│   ├── booking.js             # 预约相关接口
│   ├── user.js                # 用户相关接口
│   └── mock.js                # 模拟数据
├── utils/                      # 工具函数
│   ├── storage.js             # 本地存储封装
│   └── date.js                # 日期处理
├── static/                     # 静态资源
│   └── icons/                 # TabBar图标
├── pages.json                  # 页面配置
├── manifest.json               # 应用配置
├── App.vue                     # 根组件
└── main.js                     # 入口文件
```

## 快速开始

### 环境要求
- HBuilderX 3.0+ 或 Vue CLI
- 微信开发者工具

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd School-Bus-Scheduling-System
   ```

2. **使用 HBuilderX 打开项目**
   - 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
   - 文件 -> 导入 -> 从本地目录导入
   - 选择项目目录

3. **运行到微信小程序**
   - 在 HBuilderX 中点击 "运行" -> "运行到小程序模拟器" -> "微信开发者工具"
   - 首次运行需要配置微信开发者工具的路径

4. **在微信开发者工具中预览**
   - HBuilderX 会自动编译并打开微信开发者工具
   - 在微信开发者工具中可以实时预览效果

### 注意事项

1. **TabBar图标**
   - 当前使用的是占位图标文件
   - 需要替换为真实的 PNG 图标 (建议尺寸: 81x81px)
   - 图标路径: `static/icons/`
   - 需要6个图标:
     - `booking.png` / `booking-active.png` (车辆预约)
     - `qrcode.png` / `qrcode-active.png` (乘车码)
     - `profile.png` / `profile-active.png` (我的)

2. **二维码生成**
   - 当前使用简易的 canvas 绘制示例
   - 实际项目建议集成成熟的二维码库,如:
     - [uQRCode](https://ext.dcloud.net.cn/plugin?id=2492)
     - [weapp-qrcode](https://github.com/PeachScript/weapp-qrcode)

## 开发说明

### 数据流设计

```
用户操作 → Vue组件 → API层 (mock) → 本地存储
                              ↓
                        更新组件状态
```

### API接口层

所有数据请求通过 `api/` 目录下的接口层,便于后期替换为真实后端:

```javascript
// 当前: 使用mock数据
import bookingApi from '@/api/booking.js'
await bookingApi.getBusList(route, date)

// 后期: 只需修改 api/booking.js 中的实现
// 组件代码无需修改
```

### 本地存储

数据存储在微信小程序本地存储中:
- `user_info`: 用户身份信息
- `booking_list`: 预约记录列表
- `bus_data`: 车次预约数据

### 模拟数据

在 `api/mock.js` 中提供了完整的模拟数据:
- 两条路线的车次信息
- 随机的座位预约情况
- 预约创建和取消逻辑

## 后期后端接入

### Python后端建议技术栈
- **框架**: Flask / FastAPI
- **数据库**: MySQL / PostgreSQL
- **ORM**: SQLAlchemy
- **认证**: JWT Token
- **管理后台**: Vue Element Admin / Flask-Admin

### 核心API接口
```
POST /api/auth/login          # 用户登录认证
GET  /api/bus/list            # 获取车次列表
POST /api/booking/create      # 创建预约
GET  /api/booking/my          # 获取我的预约
POST /api/booking/cancel      # 取消预约
GET  /api/user/profile        # 获取用户信息
```

### 接入步骤
1. 在 `api/` 目录下的文件中取消注释后端API代码
2. 替换 `url` 为实际后端地址
3. 添加 token 认证逻辑
4. 测试接口连通性

## 色彩规范

- **主色**: #1E50A2 (湖大蓝)
- **成功**: #52C41A (绿色)
- **警告**: #FAAD14 (橙色)
- **错误**: #FF4D4F (红色)
- **背景**: #F5F5F5

## 常见问题

### 1. 运行时报错 "pages.json 配置错误"
- 检查 `pages.json` 中的路径是否正确
- 确保所有页面文件都已创建

### 2. TabBar不显示图标
- 检查 `static/icons/` 目录下是否有对应的图标文件
- 图标必须是 PNG 格式
- 图标尺寸建议为 81x81px

### 3. 预约功能无法使用
- 检查是否已完成身份认证
- 查看控制台是否有错误信息
- 清除本地存储后重试: `uni.clearStorage()`

### 4. 二维码不显示
- 当前是简易实现,建议集成专业的二维码库
- 检查 canvas 组件是否正确渲染

## 更新日志

### v1.0.0 (2024-04-09)
- ✨ 初始版本发布
- ✨ 实现车辆预约功能
- ✨ 实现乘车码展示
- ✨ 实现用户身份认证
- ✨ 实现个人中心
- 📝 预留后端API接口

## 许可证

MIT License

## 联系方式

如有问题或建议,请联系开发团队。
