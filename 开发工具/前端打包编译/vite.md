# vite
> Vite 需要 Node.js 版本 18+ 或 20+
## vite 为什么快
* 冷启动:不存在打包(bundle)的过程,冷启动速度很快
* HMR性能:代码是按需编译的，只编译的当前页面导入的代码,热更新的性能与模块的数量是解耦的
* 构建速度:Go 语言编写的快速、轻量级的 js/ts 构建工具，比以 js 编写的打包器预构建依赖快 10-100 倍。

## 组成
* 开发阶段
  - 使用 esbuild 预构建依赖，将非js部分如（css、图片、vue等组件文件）转换并按需提供源码
  - 源码模块进行协商缓存，依赖模块请求则会设置强缓存
* 构建阶段
  - 使用 Rollup，侧重包体积大小和广泛的生态

## 创建一个vue项目
  ```bash
    npm create vite@latest my-vue-app -- --template vue
  ```

## 浏览器兼容性
> 用于生产环境的构建包会假设目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的目标是能够 支持原生 ESM script 标签、支持原生 ESM 动态导入 和 import.meta 的浏览器：
* 在低版本的谷歌浏览器上报错误
  - Uncaught Syntaxerror: Unexpected token ‘?‘
* 默认支持的浏览器版本
  - Chrome >=87
  - Firefox >=78
  - Safari >=14
  - Edge >=88
* 兼容的解决方案：
  - 传统浏览器可以通过插件 @vitejs/plugin-legacy 来支持，它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。
  - 亲测谷歌版本 < 50 的，都不支持，以上的均可支持，40+ 版本的请升级版本吧！
  ```js
    // vite.config.js
    import legacy from '@vitejs/plugin-legacy';
    export default defineConfig({
        plugins: [
            legacy({
                targets: ["chrome < 60"], // 需要兼容的目标列表，可以设置多个
                additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // 面向IE11时需要此插件
            })
        ]
    })

  ```
  
## 插件开发
- TODO