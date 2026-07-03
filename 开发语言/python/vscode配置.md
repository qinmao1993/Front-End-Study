# vscode python开发配置

## python插件安装
* Python 核心包，提供 IntelliSense、调试、Linting 和单元测试等核心功能。有3个拓展包
  - Pylance 高性能语言服务器，提供闪电般的代码补全、类型检查和跨文件跳转
  - Python Debugger 官方的专业调试器，让你告别 print() 调试，支持断点、变量查看、单步执行等多种调试功能
  - Python Environments 环境管理
* 代码质量与格式化
  - Ruff：一个用 Rust 编写的极速 Python Linter 和 Formatter，正在成为新一代工具的标准。其 VS Code 插件支持实时检查，并能替代 flake8、isort、pydocstyle 等多个旧工具，性能非常出色。
  - Mypy Type Checker 静态类型检查能力
* 推荐在项目中写入.vscode/extensions.json 文件,自动提示推荐插件安装
  ```json
        {
        "recommendations": [
            "ms-python.python",
            "charliermarsh.ruff",
            "ms-python.mypy-type-checker"
        ]
    }

  ```
* 推荐写入.vscode/settings.json
  ```json
    {
        "[python]": {
            "editor.defaultFormatter": "charliermarsh.ruff",
            "editor.formatOnSave": true
        }
    }

  ```