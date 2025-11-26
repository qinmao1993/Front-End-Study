# npm 包库开发
npm 包开发详细步骤（Vite（库模式）+ TypeScript 方案）

## 初始化项目
  - 从零配置或通过成熟的脚手架工具生成模版项目
  ```bash
    # 方式一
    mkdir my-lib && cd my-lib
    npm init -y  # 生成 package.json

    # 安装依赖
    npm i xxx
    # 方式二

  ```

## package.json 的配置
  - 只支持esm模块标准包
  - tsc && vite build 先生成类型声明再打包
  ```package.json
    {
        "name": "my-lib",
        "type": "module",
        "files": ["dist"],
        "main": "./dist/index.js",
        "module": "./dist/index.js",
        "types": "./dist/index.d.ts",
         "scripts": {
            "dev": "vite",
            "build": "tsc && vite build"
        },
    }
  ```

## 配置 tsconfig.json
  - Vite 忽略 tsconfig.json 中的 target 值，遵循与 esbuild 相同的行为,默认值为 esnext
  - 也可以 在 build.target修改，build.target 选项优先于 esbuild.target
```json
{
    "include": ["src/**/*"],
    "exclude": ["node_modules", "test", "dist", "**/*spec.ts"],
    "compilerOptions": {
      /* 基本选项 */
      "target": "ESNext",                        /* 将 TypeScript 代码转换为 JavaScript 代码时应使用的 ESNext 生成最新的 ECMAScript 标准的代码 */
      "module": "ESNext",                        /* 生成代码的模块标准 */
      "baseUrl": "./",
      "paths": {
        "@/*": ["src/*"]
      },
      "outDir": "./dist",                        /* 指定输出目录 */

      /* 项目选项 */
      "incremental": true,                       /* 开启增量编译 */
      "tsBuildInfoFile": "./tsconfig.tsbuildinfo",/* 指定 .tsbuildinfo 增量编译文件的路径 */
      // "disableSourceOfProjectReferenceRedirect": true,   /* 禁用引用项目时优先使用源文件而不是声明文件 */
      // "disableSolutionSearching": true,                  /* 禁用多项目引用检查 */
      // "disableReferencedProjectLoad": true,              /* 减少 TypeScript 自动加载的项目数量 */
  
      /* 语言和环境 */
      "lib": ["ESNext", "DOM"],                 /* 内置的类型声明库 */
      "experimentalDecorators": true,           /* 启用装饰器 */
      "emitDecoratorMetadata": true,            /* 启用装饰器元数据 */
      "types": ["node"],                        /* 包含的类型定义 */

      // "jsx": "react",                        /* 指定 JSX 代码生成方式 */
      // "jsxFactory": "React.createElement",   /* 指定 JSX 工厂函数 */
      // "jsxFragmentFactory": "React.Fragment", /* 指定 JSX 片段引用 */
      // "jsxImportSource": "react",             /* 指定用于导入 JSX 工厂函数的模块 */
      // "reactNamespace": React"",              /* 指定用于 `createElement` 的对象 */
      // "noLib": true,                          /* 禁用包含任何库文件，包括默认的 lib.d.ts  */
      // "useDefineForClassFields": true,        /* 生成符合 ECMAScript 标准的类字段 */
    
      /* 模块 */
      "esModuleInterop": true,                   /* 生成额外的 JavaScript 代码，以便更好地支持从 CommonJS 模块导入 */
      "allowSyntheticDefaultImports": true,      /* 允许从没有设置默认导出的模块中默认导入 */
      "forceConsistentCasingInFileNames": true,  /* 强制检查导入路径的大小写是否与文件系统中的实际文件名一致 */
      "isolatedModules": true,                   /* 启用每个文件独立编译 */
      "moduleResolution": "Node",                /* 指定模块解析策略 */
      "resolveJsonModule": true,                 /* 允许导入 JSON 文件 */

      /* JavaScript 支持 */
      "allowJs": true,                           /* 允许js文件作为项目的一部分. Use the `checkJS` option to get errors from these files. */
      "checkJs": true,                           /* 启用对 JavaScript 文件的类型检查和错误报告. */
      "maxNodeModuleJsDepth": 1,                 /* 用于指定在 node_modules 目录中检查 JavaScript 文件时的最大文件夹深度。此选项仅在 allowJs 选项启用时适用. */
  
      /* Emit */
      "declaration": true,                       /* 生成 .d.ts 文件 */
      "sourceMap": false,                        /* 默认值 false 生成 .map 文件 */
      "removeComments": true,                    /* 删除注释. */
      "pretty": true,                            /* 让编译器输出更具可读性的错误信息 */

  
      /* 类型检查 */
      "strict": true,                                /* 启用所有严格类型检查选项 */
      "noImplicitAny": false,                        /* 关闭对隐式 any 类型的错误报告*/
      "strictNullChecks": false,                     /* 关闭严格空值检查 */
      "strictBindCallApply": false,                  /* 关闭对 bind、call 和 apply 方法的参数进行严格检查 */
      "noFallthroughCasesInSwitch": true,            /* 启用对 switch 语句中贯穿情况的错误报告 */
  
      /* 完整性 */
      "skipDefaultLibCheck": true,                   /* 跳过对默认库文件（如 lib.d.ts）的类型检查。可以加快编译速度 */
      "skipLibCheck": true                           /* 跳过检测所有 .d.ts files. */
    }
  }
  
```

## 配置打包工具
  ```js
    // vite.config.js
    import { dirname, resolve } from "node:path";
    import { fileURLToPath } from "node:url";
    import { defineConfig } from "vite";

    const __dirname = dirname(fileURLToPath(import.meta.url));

    export default defineConfig({
        build: {
            lib: {
                // 库模式
                // lib/main.js 入口文件将包含可以被您的包的用户导入的导出内容：
                entry: resolve(__dirname, "lib/main.js"),
                fileName: 'my-lib',
            },
            rollupOptions: {
                // https://cn.rollupjs.org/configuration-options/
                // 确保外部化处理那些,你不想打包进库的依赖
                // external: ["vue"],
                // output: {
                //     // 在 UMD 构建模式下为这些外部化的依赖,提供一个全局变量
                //     globals: {
                //         vue: "Vue",
                //     },
                // },
            },
        },
    });
  ```


## 编写库代码
  ```js
    // lib/utils.ts
    export const greet = (name: string) => {
        return `Hello ${name}!`;
    };

    // lib/index.ts
    export * from './utils';  // 统一导出入口
  ```

## 配置测试环境
- 离线环境安装测试
```bash
    # 在包目录中创建 .tgz 文件
    cd /path/to/your-package
    npm pack

    # 在测试项目中安装
    cd /path/to/your-test-project
    npm install ../path/to/your-package/your-package-1.0.0.tgz
    
```

## 配置 npm 脚本
  ```json
    // package.json
    {
        "scripts": {
        },
        "main": "dist/index.js",      // CommonJS 入口
        "module": "dist/index.js",    // ESM 入口
        "types": "dist/index.d.ts",       // 类型声明,提供类型提示
        "files": ["dist"],                // 包含发布文件
    }
  ```
  
## 代码安全
  - [源码混淆](/安全/源码混淆.md)

## 配置忽略文件
  ```gitignore
    # .gitignore
    node_modules
    dist
    *.log

    # .npmignore
    src
    __tests__
    *.config.*
  ```

## 发布到 npm
  ```bash
    # 登录 npm
    npm login

    # 版本管理 自动升级版本号 1.0.0->1.0.1
    npm version patch  # major|minor|patch

    # 发布
    npm publish
  ```

## 自动生成文档（TypeDoc）
  ```bash
    npm install -D typedoc
  ```
  - typedoc.json
  ```json
    {
        "out": "docs",
        "entryPoints": ["src/index.ts", "src/core/*.ts"],
        "entryPointStrategy": "expand",
        "exclude": ["**/*.test.ts", "**/*.spec.ts", "node_modules/**"],
        "theme": "default",
        "includeVersion": true,
        "readme": "README.md"
    }
  ```
  ```json
    "scripts": {
        "docs:build": "typedoc && echo '文档生成完成'"
    }
  ```

## 持续集成
* 持续集成 - GitHub Actions 示例
  ```yaml
    # .github/workflows/ci.yml
    name: CI
    on: [push]
    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run build
        - run: npm test
  ```
* 持续集成- gitlab 私库
  - TODO