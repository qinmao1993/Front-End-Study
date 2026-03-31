# Iconify
Iconify 是一个统一的图标框架，它聚合了超过 150 个开源图标集、总计超过 200,000 个图标，让你能用统一的语法使用来自 Material Symbols、FontAwesome、Carbon 等不同图标集的图标

## 什么是 Iconify？
> 传统的图标使用方式通常存在几个痛点：每个图标集有自己的一套命名和引入方式；字体图标渲染模糊；加载整个图标集导致包体积臃肿。
* Iconify 的核心设计理念是统一与按需加载：
  - 统一的语法：无论使用哪个图标集，都用 "集合名:图标名" 的格式来引用
  - 按需加载：只加载当前页面实际用到的图标数据，而非整个图标集
  - 原生 SVG 渲染：输出像素级精确的 SVG，而非模糊的字体图标

## 工作原理
- Iconify 的核心机制是通过公共 API 动态加载图标数据，流程如下
  ```text
    开发者写入 <iconify-icon icon="mdi:home">
            ↓
    组件向 Iconify API 请求 "mdi:home" 的数据
            ↓
    API 返回该图标的 SVG 数据
            ↓
    组件渲染为 <svg> 元素
  ```
* 这意味着：
  - 无需预打包图标：图标数据在运行时按需获取
  - 开发体验好：图标集更新后无需重新构建项目
  - 首次加载快：HTML 中只有简洁的标签，没有冗长的 SVG 代码

## 使用方式
> Iconify 官方推荐使用 Web Component 方式，因为它利用 Shadow DOM 隔离样式、避免 CSS 冲突，并且能完美解决 SSR 和 hydration 问题
### Web Component
* 安装
  ```bash
    npm install iconify-icon
  ```
* 使用
  ```js
  // main
  import "iconify-icon";
  ```
  ```html
    <iconify-icon icon="mdi:home"></iconify-icon>
    <style>
        iconify-icon {
            display: inline-block;
            width: 1em;
            height: 1em;
        }
    </style>

  ```

### Vue Component
* 安装
  ```bash
  npm install --save-dev @iconify/vue
  ```
* 用法
  ```js
  import { Icon } from "@iconify/vue";
  ```
  ```vue
  <Icon icon="mdi-light:home" />
  ```

## 离线使用与性能优化
虽然 Iconify 的核心优势是按需从 API 加载，但生产环境中你可能不希望依赖外部服务。成本最低、维护最简单的方案。前端代码几乎无需改动，只需将 API 地址指向内网服务即可
  ```bash
    # 拉取官方 API 项目
    git clone https://github.com/iconify/api.git
    cd api

    # 安装依赖（会自动生成 lib 和 cache 文件夹）
    npm install

    # 启动服务（默认监听 3000 端口）
    npm run start
    # 服务启动后，cache 目录会自动缓存首次请求的图标数据。
  ```
  ```html
    <script>
        // 配置自定义 API Provider（需确认 Web Component 是否支持此方法）
        // 具体 API 请查阅官方文档：https://docs.iconify.design/api/providers.html
        addAPIProvider('', {
            resources: ['http://your-internal-server:3000'],
        });
    </script>
  ```