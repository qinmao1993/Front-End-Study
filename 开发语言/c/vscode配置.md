# vscode c开发配置
将 VS Code 打造成一个高效的 C 语言开发环境，核心在于三个位于 .vscode 文件夹下的配置文件。理解它们如何协同工作，就能把 VS Code 变成一个强大的集成开发环境。

## 第一步：安装核心插件
C/C++ Extension Pack（含有4个插件）这是微软官方插件，是智能感知（IntelliSense）、调试和代码浏览的基础。
  - C/C++
  - C/C++ Themes
  - C/C++ DevTools
  - CMake Tools

## 第二步：配置三个核心JSON文件
> 创建工程目录，vscode 打开该目录，创建 hello.c 文件
* 配置 tasks.json (编译任务), 告诉 VS Code 如何将你的 .c 文件编译成可执行文件。
  1. 打开 hello.c 文件，使其成为当前活动编辑器（这一步很关键）。
  2. 在顶部菜单栏选择 终端 -> 配置默认生成任务...。
  3. 在弹出的列表中，选择 C/C++: gcc.exe 生成活动文件。
  4. VS Code 会自动在 .vscode 文件夹下创建 tasks.json 文件。
  - 对于单文件编译，默认配置通常就足够了。当你开始编写多文件项目时，需要调整 args 参数。你需要将 "${file}" 替换为 "${workspaceFolder}/*.c"，以编译当前工作区下的所有 .c 源文件。一个完整的多文件编译 tasks.json 配置示例如下：
  ```json
    {
        "version": "2.0.0",
        "tasks": [
            {
                "type": "cppbuild",
                "label": "C/C++: clang 生成活动文件", // 是您在任务列表中看到的值，它基于您的个人偏好
                "command": "/usr/bin/clang", // 请确认这是你的gcc路径
                "args": [
                    "-fdiagnostics-color=always",
                    "-g", // 生成调试信息，这是调试的关键！生成独立的.dSYM文件，将其修改为 "-g0"，表示不生成任何调试信息。
                    "${workspaceFolder}/*.c", // 编译所有.c文件
                    "-o",      // 指定输出文件
                    "${workspaceFolder}/build/${workspaceFolderBasename}"
                ],
                "options": {
                    "cwd": "${workspaceFolder}"
                },
                "problemMatcher": ["$msCompile"], // 用于在编译器输出中查找错误和警告的输出解析器
                "group": { // 右键下的选项会默认的取这个task
                    "kind": "build",
                    "isDefault": true
                },
                "detail": "编译器: gcc" // 任务描述说明
            }
        ],
    }

  ```
* 配置 launch.json (调试配置),告诉 VS Code 如何启动调试器（如 GDB）来运行你编译好的程序。
  1. 确保 hello.c 仍是活动编辑器。
  2. 点击左侧活动栏的“运行和调试”图标（或按 Ctrl+Shift+D）。
  3. 点击顶部的“创建 launch.json 文件”。
  4. 在弹出的列表中，选择 C++ (GDB/LLDB)，然后选择 gcc - 生成和调试活动文件。
  5. VS Code 会创建 launch.json 文件。一个核心的 launch.json 配置示例如下
    ```json
    {
        // 使用 IntelliSense 了解相关属性。
        // 悬停以查看现有属性的描述。
        // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [
            {
                "name": "C/C++: build and debug active file", // 调试配置的名称
                "type": "cppdbg",
                "request": "launch", // 请求类型，launch 表示启动新程序进行调试
                "program": "${workspaceFolder}/build/${workspaceFolderBasename}",  // 调试程序路径，应与 tasks.json 中的输出一致
                "args": [], // 传递给程序的命令行参数，例如 ["arg1", "arg2"]
                "stopAtEntry": false, // 是否在 main 函数入口处暂停，默认为 false
                "cwd": "${workspaceFolder}", // 程序运行时的工作目录
                "environment": [],
                "externalConsole": false, // 为 true 则使用外部系统终端，false 使用 VS Code 集成终端
                "MIMode": "lldb", //  调试器类型，Windows 上常用 gdb，macOS 上可能为 lldb
                "preLaunchTask": "C/C++: clang 生成活动文件" // 调试前要执行的任务，必须与 tasks.json 中的 "label" 一致
            }
        ]
    }
  ```
* 配置 c_cpp_properties.json (智能感知) 告诉 C/C++ 插件头文件在哪，提供代码补全和语法高亮
  >这个文件确保代码补全、错误提示等功能正常工作。
  1. 按 Ctrl+Shift+P 打开命令面板。
  2. 输入并选择 C/C++: 编辑配置(UI)。
  3. 这会自动生成 c_cpp_properties.json 文件。一般使用默认配置即可。如果之后遇到 #include 错误，可以在这里手动添加头文件路径。
    ```json
    {
        "configurations": [
            {
                "name": "Mac",
                "includePath": [
                    "${workspaceFolder}/**"
                ],
                "defines": [],
                "compilerPath": "/usr/bin/clang",
                "cStandard": "c17",
                "cppStandard": "c++14",
                "intelliSenseMode": "macos-clang-x64"
            }
        ],
        "version": 4
    }
  ```

## 第三步：开发与调试实战
1. 设置断点：在你怀疑有问题的代码行号左侧点击，出现红点即表示已设置断点。程序运行到此处会暂停。
2. 开始调试：按 F5 键启动调试。
3. 控制执行流程：程序在断点暂停后，你可以使用顶部的调试工具栏来控制：
  - 继续 (F5)：让程序继续运行，直到下一个断点或结束。
  - 单步跳过 (F10)：执行当前行，如果当前行有函数调用，会将其作为一个整体执行完。
  - 单步进入 (F11)：逐行执行代码。如果当前行有函数调用，会进入该函数内部。
  - 单步跳出 (Shift+F11)：在当前函数内时，跳出该函数，回到调用它的位置。
  - 重启 (Ctrl+Shift+F5)：从头开始重新调试。
  - 停止 (Shift+F5)：结束当前调试会话。