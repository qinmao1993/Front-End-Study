# esbuild
esbuild 是一个极快的 JavaScript 打包工具，用 Go 语言编写，专注于构建性能。

## 优势
* 构建速度极快
  - esbuild 的并行架构：利用多核CPU,并行解析和编译
  - 流水线操作：不同阶段可以重叠执行
  - 内存共享：减少数据复制
* 内存占用低
* 原生 TypeScript 支持
* 缓存机制
  ```js
  // 开发环境使用缓存
    const ctx = await esbuild.context({
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/bundle.js',
    });

    // 增量构建
    await ctx.watch();

    // 重建时只处理变化的文件
    await ctx.rebuild();
  ```
  
## 局限性
* 插件生态相对较小
* 高级功能不如 Webpack 丰富
* HMR 功能相对基础

## 配置示例
  ```js
    // esbuild.config.js
    require('esbuild').build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        splitting: true,  // 代码分割
        format: 'esm',
        outdir: 'dist'
        platform: 'browser',
        target: ['es2020'],
        minify: true,
        sourcemap: true,
        loader: {
            '.ts': 'ts',
            '.png': 'file',
            '.css': 'css'
        },
        plugins: [
            // 自定义插件
        ]
    }).catch(() => process.exit(1))
  ```

## 打包过程
1. 解析阶段 (Parsing)
  > esbuild 首先读取入口文件，然后:
  - 语法分析：将源代码转换为抽象语法树 (AST)
  - 模块识别：找出所有的 import 和 require 语句
  - 路径解析：解析相对路径和模块路径
  ```js
  // esbuild 配置示例
    esbuild.build({
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/bundle.js'
    })
  ```
2. 依赖解析和模块收集
  > 递归依赖分析
  - 从入口文件开始，分析所有导入
  - 递归遍历每个依赖模块
  - 构建完整的模块依赖图
  ```js
    // src/index.js
    import { utils } from './utils.js';
    import React from 'react';

    // src/utils.js
    export function utils() { ... }
  ```
3. 模块转换和编译
  > 支持的文件类型处理
  ```js
    // TypeScript
    const message: string = "Hello";

    // JSX|TSX
    const element = <div>Hello</div>;

    // CSS
    import './styles.css';

    // JSON 文件处理
  ```
4. 打包和代码生成
  - 模块合并策略
5. 优化阶段
  - Tree Shaking (摇树优化)
  ```js
    // 原始代码
    export function usedFunction() { ... }
    export function unusedFunction() { ... }

    // 打包后（如果 unusedFunction 未被使用）
    // 只有 usedFunction 被包含在 bundle 中
  ```
  - 代码压缩
  ```js
    // 压缩前
    function calculateSum(a, b) {
        return a + b;
    }

    // 压缩后
    function n(e,r){return e+r}
  ```

## 插件系统
  ```js
    const myPlugin = {
        name: 'my-plugin',
        setup(build) {
            build.onResolve({ filter: /^custom:/ }, args => {
                return { path: args.path, namespace: 'custom' }
            });
            
            build.onLoad({ filter: /.*/, namespace: 'custom' }, args => {
                return { contents: '// 自定义模块内容' }
            });
        }
    };
  ```