# node 引用原生模块
> Nodejs 在 IO 方面拥有极强的能力，但是对 CPU 密集型任务，会有不足，为了填补这方面的缺点，Nodejs支持 c/c++ 为其编写原生 nodejs 插件，补充这方面的能力。在 Node.js 中开发 C/C++ 插件（称为 Addons）可以显著提升性能关键任务的执行效率

## 使用场景
  - CPU 密集型应用
  - 代码保护
  - 示例：使用 C++ 编写的 Nodejs 库如 node-sass 等

## 原理：
  - c++编写的代码能够被编译成一个动态链接库(dll),可以被 nodejs 引入使用，后缀是.node 的文件
  - .node文件的原理就是(window dll) (Mac dylib) (Linux so)

## 开发流程
1. 环境准备
  ```bash
    # 安装编译工具
    # Windows：安装 Visual Studio Build Tools（选择 C++ 桌面开发）
    # macOS：xcode-select --install
    # Linux：sudo apt-get install build-essential

    # 全局安装 node-gyp
    npm install -g node-gyp

    # 创建项目：
    mkdir my-addon && cd my-addon
    npm init -y 
  ```
2. 在项目根目录创建并配置编译文件 (binding.gyp)
  -  该配置指定了编译所需的模块名和源码文件
  ```json
    {
        "targets":[
            {
                "target_name": "demo", 
                "sources": ["src/demo.cc" ], // C++ 源文件
                "include_dirs": [
                    "<!@(node -p \"require('node-addon-api').include_dir\")"  // N-API 头文件
                ],
                "dependencies": ["<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except"],

                "cflags!": ["-fno-exceptions"],
                "cflags_cc!": ["-fno-exceptions"],
                
                "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],  // // 禁用 C++ 异常
                
            }
        ]
    }
  ```
3. 安装 N-API 库
  - node-addon-api 是使用 c++ 对 node-api 再次封装，该方式更精简。
  - 特性：无需重新编译，它提供了一个稳定的、跨版本的 API，使得你的插件可以在不同版本的 Node.js 上运行，而无需修改代码。
  ```bash
    npm install node-addon-api
  ```
4. 编写 C++ 插件代码 (src/demo.cc)
  ```cpp
    // #define NAPI_VERSION 3      // 为了确保与特定版本的 Node-API 兼容，可以在包含报头时显式指定版本:
    // #define NAPI_CPP_EXCEPTIONS // 启用 Node.js N-API 中的 C++ 异常支持
    #include <napi.h>

    // 示例 1：同步方法 
    Napi::String Hello(const Napi::CallbackInfo &info)
    {
        Napi::Env env = info.Env(); // 指定环境

        return Napi::String::New(env, "hello world!");
    }
    // ...

    // 初始化模块
    Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        // 暴露一个函数 hello 给外部
        exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, Hello));
        return exports;
    }

    // addon 固定语法 必须抛出这个方法
    NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
  ```
5. 编译插件 
  ```bash
    node-gyp configure  # 生成平台构建文件
    node-gyp build      # 编译插件

    # 编译调试
    node-gyp configure --debug
    node-gyp build --debug
    # 输出文件：build/Release/demo.node
  ```
6. 在 Node.js 中使用插件 (test.js)
  ```js
    const addon = require('./build/Release/demo.node')
    console.log(addon.hello())
  ```
* 优化
  - node-gyp-build 是一个专为 Node.js C/C++ 插件设计的轻量级构建工具，旨在简化插件的编译和加载流程。它特别适合需要预编译或跨平台发布的 npm 包，解决了原生模块开发中的常见痛点
    ```bash
      # 无需全局安装 node-gyp
      npm install node-gyp-build 
    ```
  + prebuildify 是一个专门为 Node.js 原生模块设计的预编译工具，它解决了原生模块分发中的核心痛点：跨平台预编译二进制文件的创建和管理。
    - 特性：在模块发布前完成所有目标平台的编译，一次性生成所有主流平台的二进制文件
    ```bash
      npm install prebuildify -D
    
      # --napi  生成与 N-API 版本无关的二进制
      # targets 简写 -t  指定要为哪些目标平台和架构构建预构建文件。如，["node", "electron"] 默认是是 node
      # strip：一个布尔值，表示是否在构建预构建文件时剥离调试符号。
      # arch：指定要构建的架构。
    ```
  + run-script-os
    - 根据操作系统执行不同的测试命令
    - 当你执行 npm test 时，run-script-os 命令将会根据当前操作系统选择相应的测试命令来执行测试用例。

  - 添加脚本 (package.json)
    ```json
        {
        "scripts": {
            "install": "node-gyp-build",
            "install-debug": "node-gyp-build --debug",

            "prebuild": "prebuildify  --napi --strip", // 全平台编译（发布前）

            "prebuild-darwin-universal": "prebuildify --napi --strip --arch x64+arm64",
            "prebuild-linux-x64": "prebuildify --napi --strip --arch x64",
            "prebuild-win32-x86": "prebuildify --napi --strip --arch ia32",
            "prebuild-win32-x64": "prebuildify --napi --strip --arch x64",

            "test": "run-script-os",
            "test:darwin:linux": "jasmine test/**/*.js",
            "test:win32": "jasmine test/**/*.js",
            "test-keyboard": "node test/keyboard.js",
        }
    }
    ```
  - 优化第 6 步
   ```js
    // 加载原生模块
    const nativeAddon = require('node-gyp-build')(__dirname);

    // 暴露接口
    module.exports = {
        hello: nativeAddon.hello
    };
  ```
* 工作流程
  - 在插件发布时，执行 npm run prebuild 进行全平台的预编译，生成全平台的二进制预编译文件
  - 用户 npm install 该插件时，自动检测匹配的预编译二进制，直接加载 .node 文件

## Node.js 原生模块构建的终极解决方案 CMake.js
* CMake.js 是一个革命性的构建工具，专为 Node.js 原生模块开发设计。它使用 CMake 构建系统替代传统的 node-gyp，为复杂原生模块提供了更强大、更灵活的构建方案。
* CMake.js 解决了 node-gyp 的三大痛点
  1. 复杂依赖管理：无缝集成第三方 C/C++ 库
  2. 跨平台一致性：统一 Windows/Linux/macOS 构建流程
  3. 构建系统标准化：使用工业级标准 CMake 替代 gyp

## CMake.js 完整开发指南
1. 环境配置
  + 系统要求：
    - nodejs>=12
    - cMake>=3.10
  + 平台编译工具链：
    - Windows: Visual Studio Build Tools
    - macOS: Xcode Command Line Tools
    - Linux: build-essential
2. 项目结构
 ```text
    my-native-module/
    ├── src/
    │   ├── native.cpp
    │   └── native.h
    ├── libs/
    │   └── thirdparty/    # 第三方C++库
    ├── CMakeLists.txt     # CMake主配置文件
    ├── binding.gyp        # 可选，兼容层
    ├── package.json
    └── index.js           # JavaScript入口
 ```
3. 配置package.json
  ```json
    {
    "scripts": {
        "install": "cmake-js compile",
        "build:debug": "cmake-js build --debug",
        "build:release": "cmake-js build",
        "rebuild": "cmake-js clean && cmake-js build"
    },
    "cmake-js": {
        "runtime": "node",
        "runtimeVersion": "18.0.0",
        "arch": "x64"
    }
  }
  ```
4. 编写CMakeLists.txt
    ```cMake
        cmake_minimum_required(VERSION 3.10)
        project(MyNativeModule VERSION 1.0.0 LANGUAGES CXX)

        # 包含CMake.js支持
        include(${CMAKE_JS_INC})

        # 添加子目录（第三方库）
        add_subdirectory(libs/thirdparty)

        # 设置C++标准
        set(CMAKE_CXX_STANDARD 17)
        set(CMAKE_CXX_STANDARD_REQUIRED ON)

        # 添加源文件
        file(GLOB_RECURSE SOURCES "src/*.cpp" "src/*.h")

        # 创建原生模块
        add_library(${PROJECT_NAME} SHARED ${SOURCES})
        set_target_properties(${PROJECT_NAME} PROPERTIES
            PREFIX ""
            SUFFIX ".node"
            OUTPUT_NAME "${PROJECT_NAME}")

        # 链接依赖
        target_link_libraries(${PROJECT_NAME}
            PRIVATE
                ${CMAKE_JS_LIB}
                thirdparty::core
                $<$<PLATFORM_ID:Windows>:winmm.lib>)
    ```
5. 与N-API集成
  ```cpp
    #include <napi.h>

    // 示例 同步方法 
    Napi::String Hello(const Napi::CallbackInfo &info)
    {
        Napi::Env env = info.Env(); // 指定环境

        return Napi::String::New(env, "hello world!");
    }
    // ...

    // 初始化模块
    Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        // 暴露一个函数 hello 给外部
        exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, Hello));
        return exports;
    }

    // addon 固定语法 必须抛出这个方法
    NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
  ```
* 优化
  - 并行编译加速  
    ```bash
      # 使用所有CPU核心
      cmake-js build --parallel $(nproc)
    ```
  - 