# npm
## npm 配置
* nrm 配置源
  ``` bash
    npm install  nrm -g
    # 选择网络延迟最少的
    nrm test 
    nrm use cnpm  //switch registry to cnpm
    nrm ls 查看所有
    # 命令添加公司私有npm源
    nrm add 
    # 例子
    nrm add qihoo http://registry.npm.360.org
  ```
* npm config
  ```bash
    # 查看配置信息
    npm config list    

    # 源设置
    npm config get registry
    npm config set registry https://registry.npmmirror.com
    npm config set registry https://mirrors.tuna.tsinghua.edu.cn/npm/
    # 科学上网后或者发布时移掉
    npm config rm registry
  ```
* 项目级 .npmrc 配置环境变量
    ```
    registry="https://registry.npmmirror.com"
    ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
    ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
    chromedriver_cdnurl=http://registry.npmmirror.com/mirrors/chromedriver
    operadriver_cdnurl=http://registry.npmmirror.com/mirrors/operadriver
    phantomjs_cdnurl=http://registry.npmmirror.com/mirrors/phantomjs
    fse_binary_host_mirror=https://registry.npmmirror.com/mirrors/fsevents
    sass_binary_site=http://registry.npmmirror.com/mirrors/node-sass
  ```

## npm 基础用法
* install
  - npm install  将 package.json 中的文件依赖的包从网上下载到本地
  - npm install  包名 -save 将包下载下来并且加载到 dependencies中去（npm 5.x开始不需要-save）
  - npm install  包名 -save-dev  将包下载下来并且加载到devDependencies中去 简写 -D
  - npm install  包名 -g  全局安装
  - npm install express@3.21.2 安装指导版本的包
  - npm i electron -D --timeing=true --loglevel=verbose  安装 electron 并打印安装日志
  
  + ci 和 install 的区别
    > ci 一般用在 CICD pipeline，比 install 更快
    - 必须有个 package-lock.json
    - 如果包锁定中的依赖项与 package.json 中的依赖项不匹配，npm ci 将退出并出现错误，而不是更新包锁定。
    - 一次只能安装整个项目,不能使用此命令添加单个依赖项。
    - 如果 node _ module 已经存在，那么将在 npm ci 开始安装之前自动删除它。
    - 它永远不会写入 package.json 或任何包锁: 安装基本上是冻结的
    - npm ci --omit=dev 忽略安装开发依赖
* update
  - ncu（npm 检查更新）
    ```bash
        # 安装
        npm install -g npm-check-updates
        # 检查 package.json 的最新依赖项
        ncu
        # 检查单个版本
        ncu vue

        #检查除某个包以外的所有包
        ncu \!vue
        ncu -x vue
        ncu --reject vue

        # 查看全局的安装包最新版本
        ncu -g
        
        # 更新 package.json 的最新依赖项
        ncu -u
    ```
* uninstall
    - npm uninstall  <package> 加-D 或-S 移除依赖
    - npm uninstall -g <package>
    + npm <command> -h  quick help on <command>
    + npm docs 包名 查看包的文档
* npm rebuild 重新构建包
  - 如：针对 electron 环境从新构建包
  - npm rebuild --runtime=electron --target=1.1.3 --disturl=https://atom.io/download/atom-shell --abi=102
* npm ls -g  查看安装了哪些全局的包

## package.json
> npm init  创建 package.json文件,-y 获得默认值
  ```json
    "name": "@antv/g6",
    "version": "5.0.45",
    "description": "A Graph Visualization Framework in JavaScript",
    "keywords": ["antv","g6"],

    "homepage": "https://g6.antv.antgroup.com/",
    "bugs": {
        "url": "https://github.com/antvis/g6/issues"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/antvis/g6"
    },
    "license": "MIT",
    "author": "https://github.com/orgs/antvis/people",
    "main": "lib/index.js",
    "module": "esm/index.js",
    "types": "lib/index.d.ts",
    "files": ["src","esm","lib","dist","README"],
    "scripts": {
        "build": "run-p build:*", // 并行执行所有构建命令（build:* 通配符匹配）。
        "build:cjs": "rimraf ./lib && tsc --module commonjs --outDir lib -p tsconfig.build.json",
        "build:esm": "rimraf ./esm && tsc --module ESNext --outDir esm -p tsconfig.build.json",
        "build:umd": "rimraf ./dist && rollup -c && npm run size",
        "build:dev:watch": "npm run build:esm -- --watch",
        "dev": "vite",
        "start": "rimraf ./lib && tsc --module commonjs --outDir lib --watch",
        "tag": "node ./scripts/tag.mjs",
        "version": "node ./scripts/version.mjs"
    },
    "dependencies":{},
    "devDependencies":{},
    "peerDependencies":{},
    "publishConfig": {
        "registry": "https://registry.npmjs.org/"
    },
  ```
* 基础信息字段
  - name 定义包的名称，遵循 npm 包命名规则。@antv 表示组织作用域，g6 是包名,唯一标识包，用户通过 npm install @antv/g6 安装。
  - version: "5.0.45" 包的版本号
  - description:包的简短描述，说明其主要功能。在 npm 搜索和包列表中展示，帮助用户快速理解包的用途
  - "keywords": [...] 关键字列表，用于提高包在 npm 和其他平台的可搜索性

* 项目元数据字段
  - homepage 项目官方网站或文档的 URL
  - bugs 报告项目问题的地址（通常是 GitHub Issues）
  - repository: 代码仓库的地址和类型
  - license: "MIT" 项目的开源许可证类型（此处为 MIT 许可证）。
  - author:项目作者或组织信息
  
  - peerDependencies 通常用于框架类库，表示宿主必须提供该依赖，避免重复打包。并配合 peerDependenciesMeta 指定可选性。如下
    ```json
        "peerDependencies": {
            "@fastify/static": "^8.0.0",
            "@nestjs/common": "^11.0.1",
            "@nestjs/core": "^11.0.1",
            "class-transformer": "*",
            "class-validator": "*",
            "reflect-metadata": "^0.1.12 || ^0.2.0"
        },
        "peerDependenciesMeta": {
            "@fastify/static": {
                "optional": true
            },
            "class-transformer": {
                "optional": true
            },
            "class-validator": {
                "optional": true
            }
        },
    ```

* 模块入口与构建配置
  - main: 定义 CommonJS 模块的入口文件
  - module: 定义 ES Module 入口文件
  - types: TypeScript 类型声明文件的路径,提供类型提示
  - files: 发布到 npm 时包含的目录和文件

* 发包配置
  - publishConfig：配置发布到指定的 npm 仓库

* npx (npm5.2以上自带)
    ```
    # 项目的根目录下执行
    $ node-modules/.bin/mocha --version

    # npx 更方便
    npx mocha --version

    # 就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在
    ```

* 版本号
    - 1.2.3 (1表示重大更新,2表示向下兼容,3表示补丁包更新)
    - ">" +版本号   下载大于某个版本号，npm会下最新版
    - "<" +版本号   下载小于某个版本号，npm会下小于这个版本号最新版
    - "<=" 小于等于 一定会下你写的这个版本，除非没有你写的这个版本
    - ">=" 大于等于  下载最新版
    - " *、' '、X "  任意 npm会给你下最新版
    - "^" +版本号  不跃迁版本下载，^2.1.0 npm会下载大版本不变，去下载2.x.x版本里的最近版
    - "~" +版本号  会去下约等于这个版本的最新版，在大版本不变的情况下下一个比较新的版本

## npm install 发生了什么？
![npm install 过程](./imgs/npm-install.png)
1. 命令解析与初始化:解析命令参数、定位项目根目录、加载配置
2. 依赖解析与安装:
  - 读取依赖信息
  - 构建依赖树:扁平化处理(尝试复用相同版本的依赖)、版本冲突解决：根据 package-lock.json 安装固定版本
  - 下载包：检查本地缓存、
  - 更新元数据：生成/更新 package-lock.json
3. 生命周期脚本执行
  - preinstall：安装前执行（如清理旧文件）。
  - install：包安装后执行（较少使用）。
  - postinstall：安装完成后执行（常见于编译原生模块，如 node-gyp rebuild）。
  - 其他钩子：如 prepublish、prestart、posttest 等。
  
## npm run xxx 发生了什么
* 运行 npm run xxx 的时候，npm 会先在当前目录的 node_modules/.bin 查找要执行的程序，如果找到则运行；
* 没有找到则从全局的 node_modules/.bin 中查找，npm i -g xxx就是安装到到全局目录；
* 如果全局目录还是没找到，那么就从 path 环境变量中查找有没有其他同名的可执行程序。

## npm包开发
* [npm包开发](./npm包开发.md)

## npm私库搭建
* [npm私库搭建](../解决方案/npm私库搭建/npm私有库搭建.md)