# 图片压缩工具

一个简单易用的在线图片压缩工具，采用纯前端实现，无需后端服务。支持批量上传、实时预览和压缩质量调节。

## 功能特性

- 🖼️ 支持PNG和JPG格式图片
- 📦 支持批量上传（最多10张）
- 🎚️ 可调节压缩质量（1-100%）
- 👀 实时预览压缩效果
- 📊 显示原始和压缩后的文件大小
- ⬇️ 支持单张/批量下载压缩后的图片
- 🎨 优雅的Apple风格界面设计
- 📱 完全响应式，支持移动端

## 技术栈

- HTML5
- CSS3
  - Flexbox
  - Grid
  - CSS Variables
  - CSS Animations
- JavaScript (ES6+)
  - Canvas API
  - File API
  - Drag & Drop API

## 使用说明

1. 打开网页后，可以通过以下方式上传图片：

   - 点击上传区域选择文件
   - 拖拽图片到上传区域
2. 上传图片后：

   - 左侧显示原始图片
   - 右侧显示压缩后的预览
   - 底部显示文件大小对比
   - 可以通过滑块调节压缩质量
3. 多张图片时：

   - 底部会显示图片列表
   - 点击列表项切换当前预览的图片
   - 可以单独下载当前图片或批量下载所有图片

## 效果展示

![1742298995859](./images/README/1742298995859.png)

![1742299039186](./images/README/1742299039186.png)

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

- 所有压缩操作都在浏览器本地完成，不会上传到服务器
- 建议使用现代浏览器以获得最佳体验
- 图片大小限制取决于浏览器内存限制

## 开发说明

项目采用纯前端实现，无需安装任何依赖，直接在浏览器中运行即可。

### 文件结构

```
.
├── index.html      # 主页面
├── styles.css      # 样式文件
└── script.js       # 功能实现
```

### 核心功能实现

- 图片压缩：使用Canvas API进行图片压缩
- 文件处理：使用File API处理文件上传
- 拖拽上传：使用Drag & Drop API实现
- 界面交互：使用CSS3实现流畅的动画效果

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目。

## 许可证

MIT License
