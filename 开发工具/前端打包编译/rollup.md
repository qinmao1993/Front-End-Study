# rollup
Rollup 是一个 JavaScript 模块打包器，专注于库的打包，以高效的 Tree-shaking 著称。

## 核心特点
* 高效的 Tree-shaking：消除未使用代码
* ES 模块优先：基于 ES6 模块标准
* 输出格式灵活：ESM、CommonJS、UMD、IIFE
* 插件生态系统丰富
* 适合库打包,输出代码干净简洁

## 局限性
* 开发服务器功能较弱
* 代码分割能力有限
* 配置相对复杂

## 工作原理
```text
// Rollup 的 Tree-shaking 过程
输入模块:
  - moduleA.js: export { a, b, c }
  - moduleB.js: import { a, c } from './moduleA'
  
打包过程:
  1. 分析导入导出关系
  2. 标记使用的导出 (a, c)
  3. 消除未使用的导出 (b)
  
输出: 只包含 a 和 c 的代码

```

## 配置示例
  ```js
    // rollup.config.js
    import { nodeResolve } from '@rollup/plugin-node-resolve'
    import commonjs from '@rollup/plugin-commonjs'
    import typescript from '@rollup/plugin-typescript'
    import { terser } from 'rollup-plugin-terser'

    export default {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/bundle.esm.js',
                format: 'esm'
            },
            {
                file: 'dist/bundle.cjs.js',
                format: 'cjs'
            }
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            terser()
        ],
        external: ['react', 'react-dom'] // 外部依赖
    }
  ```