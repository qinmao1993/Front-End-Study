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

## 离线使用
> 在离线内网环境下使用 @iconify/vue，核心思路是将图标所需的元数据（JSON文件）或完整API服务预先部署到内网。根据项目规模和需求，主要有三种方案：手动注册、自动化插件和部署API服务。所有离线方案的实质，都是将这个“在线请求”变成“本地获取”。
* 方案一：手动按需注册 (最推荐，最可控)
  > 适用场景：绝大部分项目。它完美平衡了可控性和性能，且构建产物不会包含未使用的图标数据。
  1. 安装依赖
  ```bash
    # @iconify/json 包含了所有图标集的元数据，体积约300MB（不推荐）
    npm install @iconify/vue @iconify/json -D

    # 独立图标集(推荐)
    npm install @iconify/json/ep -D
  ```
  2. 引入并注册图标集
    - 在应用入口文件（如 main.js 或 main.ts）中，只引入你需要的图标集JSON文件。
    ```js
        // main.js
        // 1. 核心 API 保持不变
        import { addCollection } from '@iconify/vue'


        // 完整包 @iconify/json
        import antDesignIcons from '@iconify/json/json/ant-design.json'; // 仅按需引入
        // 应用初始化前，注册图标集
        addCollection(antDesignIcons);

  
        // 2. 引入指定的独立图标集包
        // 假设我们只需要 Element Plus (ep) 和 Ant Design (ant-design)
        import { icons as epIcons } from '@iconify-json/ep'

        // 3. 应用启动前注册它们
        addCollection(epIcons)

        // ... 后续初始化代码

    ```
* 方案二：部署内网Iconify API服务 (适合团队级应用)
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