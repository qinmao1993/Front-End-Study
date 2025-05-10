# 说明

## 编译 TypeScript 文件
1. 在项目的根目录下，运行以下命令来编译 TypeScript 文件：
2. 这将使用 tsconfig.json 文件中的配置选项来编译项目中的所有 TypeScript 文件，并将生成的 JavaScript 文件输出到指定的目录（如 ./dist）。
3. 编译并运行
  ```bash
   npx tsc && node dist/index.js
  ```