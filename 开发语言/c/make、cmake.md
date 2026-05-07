## c 构建工具
当源文件越来越多、依赖关系复杂时，手动维护 tasks.json 会变得吃力。这时需要make、cmake

## Make
* 是什么？
  - 一个经典的构建工具，核心是读取 Makefile 中的规则，自动化完成编译和链接。它能智能检查文件时间戳，实现“增量编译”，即只重新编译修改过的文件，大幅提升构建效率。

* 典型的项目结构
  ```text
    my_project/
    ├── Makefile
    ├── bin/               (存放生成的可执行文件)
    ├── obj/               (存放编译过程中产生的 .o 文件，可选但推荐)
    ├── src/
    │   ├── main.c
    │   └── utils.c
    └── include/
        └── utils.h
  ```

* Makefile
  - 在项目根目录下新建 Makefile 文件
  ```makefile
    # ==============================================
    # Makefile for macOS (using clang)
    # ==============================================

    # 编译器设置
    CC       = clang
    CFLAGS   = -Wall -Wextra -g -Iinclude
    LDFLAGS  =

    # 目录设置
    SRC_DIR  = src
    OBJ_DIR  = obj
    BIN_DIR  = bin
    INC_DIR  = include

    # 自动查找 src 目录下所有 .c 文件
    SRCS     = $(wildcard $(SRC_DIR)/*.c)
    # 将 .c 文件名替换为 obj/ 目录下的 .o 文件名
    OBJS     = $(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(SRCS))

    # 最终生成的可执行文件名
    TARGET   = $(BIN_DIR)/my_program

    # ==============================================
    # 构建规则
    # ==============================================

    # 默认目标（输入 make 或 make all 时执行）
    all: $(TARGET)

    # 链接目标文件生成最终的可执行文件
    $(TARGET): $(OBJS) | $(BIN_DIR)
        $(CC) $(OBJS) $(LDFLAGS) -o $@
        @echo "✅ Build complete: $@"

    # 编译每个 .c 文件为 .o 文件
    $(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
        $(CC) $(CFLAGS) -c $< -o $@

    # 创建必要的目录
    $(OBJ_DIR):
        mkdir -p $@

    $(BIN_DIR):
        mkdir -p $@

    # ==============================================
    # 辅助目标
    # ==============================================

    # 清理编译产物
    clean:
        rm -rf $(OBJ_DIR) $(BIN_DIR)
        @echo "🧹 Clean complete."

    # 运行程序
    run: all
        $(TARGET)

    # 声明这些目标不是文件名，避免与同名文件冲突
    .PHONY: all clean run
  ```
  - 自动处理头文件依赖
    > 如果你修改了 utils.h，希望 main.c 和 utils.c 都能被重新编译，可以添加依赖文件生成规则。在基础模板中加入以下代码：
   ```makefile
    # 自动生成依赖关系文件 (.d) 存于 obj 目录
    DEPFLAGS = -MMD -MP
    CFLAGS  += $(DEPFLAGS)

    # 在编译规则中加入依赖文件生成
    $(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
        $(CC) $(CFLAGS) -c $< -o $@

    # 包含所有已生成的 .d 文件，让 make 知道头文件依赖
    -include $(OBJS:.o=.d)
   ```
  - 支持多个独立可执行文件（多 main 场景）
  ```makefile
    # 每个 .c 文件编译为一个独立程序
    TARGETS = $(patsubst $(SRC_DIR)/%.c, $(BIN_DIR)/%, $(wildcard $(SRC_DIR)/*.c))

    all: $(TARGETS)

    $(BIN_DIR)/%: $(SRC_DIR)/%.c | $(BIN_DIR)
        $(CC) $(CFLAGS) $< -o $@
  ```

* 确保 make 可用
  ```bash
    # 若提示命令未找到，可运行 xcode-select --install
    make --version

    # 它会包含clang和make
    xcode-select --install
  ```

* 编译源码
  - 执行 make 命令，根据 Makefile 规则编译,可使用 -j 参数加速（如 make -j4 用4个核心编译）。
  - 若编译出错，检查错误信息，通常为依赖缺失或版本不兼容。
   ```bash
    # 对于 macOS，使用 sysctl -n hw.logicalcpu 获取 CPU 逻辑核心数
    # centos cat /proc/cpuinfo | grep processor | wc -l
    make -j$(sysctl -n hw.logicalcpu) 
   ```

## CMake
* 是什么？
  - 使用 CMake 构建项目，可以把它想象成一个三步走的流程：你首先写一份“设计蓝图” (CMakeLists.txt)，然后 CMake 这个“总工程师”会根据你的设计，为不同的操作系统和工具生成具体的“施工图纸”（如 Makefile），最后由 make 等构建工具“施工队”按照图纸完成编译。

* CMake 核心优势
  - 跨平台支持：生成适用于 Windows (Visual Studio)、macOS (Xcode) 和 Linux (Makefile) 的构建文件
  - 依赖管理：轻松管理内部和外部依赖关系
  - 模块化配置：支持大型项目的模块化开发
  - 自动化测试：集成 CTest 进行单元测试
  - 安装打包：提供安装和打包功能（CPack）

* 操作流程
  1. 安装 CMake
    ```bash
      brew install cmake
      cmake --version # 验证
    ```
  2. 准备一个 C 语言项目
    >一个典型的多文件 C 项目结构如下
    ```text
        my_c_project/
        ├── CMakeLists.txt              # 根 CMake 配置文件
        ├── include/                    # 头文件目录
        │   └── mylib.h
        ├── src/                        # 源文件目录
        │   ├── main.c
        │   └── mylib.c
        ├── libs/                       # 第三方库目录（可选）
        │   └── thirdparty/
        ├── tests/                      # 测试文件目录
        │   └── test_mylib.c
        └── build/                      # 构建输出目录（通常添加到.gitignore）
    ```
  3. 编写 CMake 配置文件 CMakeLists.txt
    ```cmake
        # 设置 CMake 最低版本要求，保证语法兼容性
        cmake_minimum_required(VERSION 3.10)

        # 定义项目名、版本和语言
        project(my_app VERSION 1.0 LANGUAGES C)

        # 使用 C17 标准，并禁用 GNU 扩展
        set(CMAKE_C_STANDARD 17)
        set(CMAKE_C_STANDARD_REQUIRED ON)
        set(CMAKE_C_EXTENSIONS OFF)

        # 默认构建类型为 Release，除非用户指定其它类型
        if(NOT CMAKE_BUILD_TYPE)
            set(CMAKE_BUILD_TYPE Release CACHE STRING "Build type" FORCE)
        endif()

        # 生成编译命令数据库，便于工具集成和代码分析
        set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

        # 指定可执行文件输出目录为 build/bin
        set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

        # 收集源文件目录并递归查找所有 C 文件
        set(SOURCE_DIR ${CMAKE_SOURCE_DIR}/src)
        file(GLOB_RECURSE SOURCES "${SOURCE_DIR}/*.c")

        # 定义可执行目标并添加源文件
        add_executable(${PROJECT_NAME} ${SOURCES})

        # 添加项目头文件搜索路径
        target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_SOURCE_DIR}/include)

        # 根据构建类型设置编译选项
        target_compile_options(${PROJECT_NAME} PRIVATE
            $<$<CONFIG:Debug>:-g;-O0;-Wall;-Wextra>
            $<$<CONFIG:Release>:-O3;-march=native;-DNDEBUG>
        )

        # 给 Debug 构建定义 DEBUG 宏，便于条件编译
        target_compile_definitions(${PROJECT_NAME} PRIVATE
            $<$<CONFIG:Debug>:DEBUG>
        )
    ```
  4. 使用 CMake 构建项目
    - 基本构建流程
      ```bash
        # 1. 配置与生成
        # 命令会读取当前目录 (.) 的源码，并在 build 目录下生成构建文件（如 Makefile）。
        cmake -S . -B build

        # 2. 会自动调用 make 等底层构建工具完成编译，生成的二进制文件会在 build 目录下
        ccmake --build build

        # 3. 切换构建类型，开发时需要调试信息（Debug），发布时需要优化（Release）
        cmake -DCMAKE_BUILD_TYPE=Debug
        cmake -DCMAKE_BUILD_TYPE=Release
      ```

## 使用场景：从简单到复杂的三种方案
* 无需 Make 或 CMake (使用 VS Code tasks.json)：适合仅包含 1-2 个 .c 文件的单文件测试，直接通过 tasks.json 调用 gcc 最快。

* 使用 Make：适合项目扩展至 3-10 个源文件，需定义 Makefile 规则实现增量编译；或作为在 Unix/Linux 上编译开源项目的通用技能。

* 使用 CMake：适合有跨平台需求，希望代码在多个 OS 上编译运行；或项目结构复杂，依赖外部库，或需生成多种类型构建文件的场景。目前大多数 C/C++ 开源项目（如 OpenCV、LLVM）都采用 CMake。


## 在 VS Code 中集成
* Make
  > 使用tasks.json (基础、通用)：这是手动配置的方式。配置好后，选择并运行构建任务
  1. [配置编译任务] 在项目根目录的 .vscode 文件夹中，创建一个名为 tasks.json 的文件，
    ```json
        {
        "version": "2.0.0",
        "tasks": [
            {
                "label": "Build with Make",
                "type": "shell",
                "command": "make",
                "group": {
                    "kind": "build",
                    "isDefault": true
                },
                "problemMatcher": [
                    "$msCompile"
                ],
                "detail": "Run make to build the project"
            },
            {
                "label": "Clean project",
                "type": "shell",
                "command": "make",
                "args": ["clean"],
                "problemMatcher": []
            }
        ]
        }
    ```
  2. [配置调试] launch.json,告诉调试器如何启动你的程序。
    ```json
        {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "Debug with LLDB",
                    "type": "cppdbg",
                    "request": "launch",
                    "program": "${workspaceFolder}/build/my_program_name",
                    "args": [],
                    "stopAtEntry": false,
                    "cwd": "${workspaceFolder}",
                    "environment": [],
                    "externalConsole": false,
                    "MIMode": "lldb",
                    "preLaunchTask": "Build with Make"
                }
            ]
        }
    ```

* CMake
  > 根目录下已存在配置好的 CMakeLists.txt 文件
  1. 安装 CMake Tools 插件,可以实现“一键配置、一键构建、一键调试”。
    - CMake Tools 插件会自动配置好调试器，不再需要你手动编写 launch.json 和 tasks.json 文件。
  2. 使用 Ctrl+Shift+P 运行 "CMake: Configure"，VS Code 会自动在根目录下创建一个 build 文件夹。
  3. 再次执行 CMake: Build，你会在 build 文件夹里看到项目名的可执行文件
  4. 一键运行和调试：配置并构建成功后，VS Code 底部状态栏会出现几个快捷按钮，从左到右依次是：
    - Configure (配置，发生重大更改时使用)
    - Build (构建)
    - Run (运行) / Debug (调试)
  - 注意：在mac上直接运行调试按钮不行，需要安装 CodeLLDB 扩展,设置配置文件
    ```json
        {
            "cmake.debugConfig": {
                "type": "lldb",              // 使用 CodeLLDB 提供的调试器类型
                "request": "launch"
                // program 会自动由 CMake Tools 填充，无需手动写
            }
        }
    ```
     

