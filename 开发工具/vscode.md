# vscode

## 下载安装
* 官网下载太慢改下域名 vscode.cdn.azure.cn 如
  - 原来官网的地址：https://az764295.vo.msecnd.net/stable/129500ee4c8ab7263461ffe327268ba56b9f210d/VSCodeUserSetup-x64-1.72.1.exe
  - 修改为：https://vscode.cdn.azure.cn/stable/129500ee4c8ab7263461ffe327268ba56b9f210d/VSCodeUserSetup-x64-1.72.1.exe
* 截止2024 8月1号，官网直接下载已经很快了

## 插件离线安装
找到本机插件的安装地址，/Users/xxx/.vscode 将 extensions 文件拷贝的目标机器上

## 命令行打开
* 在 macOS / Linux 上：系统配置（如果命令无效）
  1. 打开 VS Code。
  2. 按 Ctrl/Cmd + Shift + P 打开命令面板。
  3. 输入 Shell Command: Install 'code' command in PATH，选择并运行。
* Windows
  1. 安装 VS Code 时勾选 “添加到 PATH” 选项
  2. 如果已安装但未勾选，可重新运行安装程序并选择修改配置
* 常用命令
  ```bash
    code -v
    code ~/project/index.html  # 打开指定文件
    code file1.txt file2.txt   # 同时打开多个文件

    code .                     # 打开当前目录
    code ..                    # 打开上级目录

    code -n 文件路径            # 新建窗口打开
    code --goto 文件路径:行号

  ```

## 调试
### c/c++
* tasks.json 编译器构建设置
  - type 有三个值：shell、process、cppbuild
  - command:设置指定要运行的程序
  - args 数组指定传递给 clang 的命令行参数,有顺序
  - problemMatcher 用于在编译器输出中查找错误和警告的输出解析器。对于 clang ，$gcc 问题匹配器创建最佳结果
  - label 是您在任务列表中看到的值，它基于您的个人偏好
  - group:{ "kind": "build", "isDefault": true } 右键下的选项会默认的取这个task
  - detail 任务描述说明
  ```json
    {
        "tasks": [
            {
                "type": "cppbuild",
                "label": "C/C++: clang 生成活动文件",
                "command": "/usr/bin/clang",
                "args": [
                    "-fcolor-diagnostics",
                    "-fansi-escape-codes",
                    "-g", // 生成调试信息，这是调试的关键！
                    "${file}", // 当前活动文件
                    "-o",      // 指定输出文件
                    "${fileDirname}/${fileBasenameNoExtension}" // 输出文件路径（与源文件同名无扩展名）
                ],
                "options": {
                    "cwd": "${workspaceFolder}"
                },
                "problemMatcher": ["$gcc"],
                "group": {
                    "kind": "build",
                    "isDefault": true
                },
                "detail": "调试器生成的任务。"
            }
        ],
        "version": "2.0.0"
    }

  ```
* launch.json 调试器设置 
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
                "program": "${workspaceFolder}/dist/${fileBasenameNoExtension}",  // 调试程序路径，应与 tasks.json 中的输出一致
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
* c_cpp_properties.json 编译器路径和 IntelliSense 设置
  ```json
    {
        "configurations": [
            {
                "name": "Mac",
                "includePath": [
                    "${workspaceFolder}/**"
                ],
                "defines": [],
                "macFrameworkPath": [
                    "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/System/Library/Frameworks"
                ],
                "compilerPath": "/usr/bin/clang",
                "cStandard": "c17",
                "cppStandard": "c++17",
                "intelliSenseMode": "macos-clang-x64"
            }
        ],
        "version": 4
    }
  ```

## 远程开发(linux)
* 依赖：git>2.0、vscode-server（远程服务器）
* vscode-server 离线安装
  1. 下载地址：https://update.code.visualstudio.com/commit:${commit-id}/server-linux-x64/stable
    - commit-id在关于中找
    ```bash
      # 版本: 1.91.1 (user setup)
      # 提交: f1e16e1e6214d7c44d078b1f0607b2388f29d729
      # 日期: 2024-07-09T22:06:49.809Z
      # Electron: 29.4.0
      # ElectronBuildId: 9728852
      # Chromium: 122.0.6261.156
      # Node.js: 20.9.0
      # V8: 12.2.281.27-electron.0
      # OS: Windows_NT x64 10.0.22000
    ```
    x86:
    https://vscode.download.prss.microsoft.com/dbazure/download/stable/${commit_id}/vscode-server-linux-x64.tar.gz

    https://vscode.download.prss.microsoft.com/dbazure/download/stable/${commit_id}/vscode_cli_alpine_x64_cli.tar.gz

    arm:
    https://vscode.download.prss.microsoft.com/dbazure/download/stable/${commit_id}/vscode-server-linux-arm64.tar.gz

    https://vscode.download.prss.microsoft.com/dbazure/download/stable/${commit_id}/vscode_cli_alpine_arm64_cli.tar.gz

  2. 进入目标服务器 
    - 第一个文件 vscode-server-linux-x64.tar.gz 解压解包后名为 vscode-server-linux-x64 文件夹改名为 server 放在 /home/${user}/.vscode-server/cli/servers/Stable-${commit_id}/ 目录下.

    - 第二个文件 vscode_cli_alpine_x64_cli.tar.gz 解压解包后名为 code 的文件改名为 code-${commit_id}放在/home/${user}/.vscode-server/目录下

  3. 找到 remote-ssh 插件 点击extension setting（扩展设置）
    - 找到 Local Server Download，把auto改成off，如下所示，之后便可以正常连接服务器。
  4. 尝试连接,如果任然连接不上,则可能需要修改.vscode-server文件夹及其子目录的权限,例如权限改为777,再尝试连接:
    - chmod -R 777 /home/${user}/.vscode-server/
  5. 设置免密登录
    ```bash
       # 生成 SSH 密钥
      ssh-keygen -t rsa
      ssh-copy-id -i ~/.ssh/id_rsa.pub root@你的IP地址
    ```
* 远程开发遇到的问题
  - 离线环境拷贝nodejs项目，需要 npm rebuild 下包
  + vite vue 项目 
    - 报 esbuild 权限问题，给赋予执行权限
    - 报 esbuild/install.js 的问题
