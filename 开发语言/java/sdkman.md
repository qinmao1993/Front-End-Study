# sdkman
是一个强大的命令行工具，用于在类Unix系统（Linux、macOS、WSL）上管理多个软件开发工具包的版本。它就像是Java开发者的"瑞士军刀"

## 核心特性
  - 多版本管理：轻松安装、切换、删除不同版本的JDK和开发工具
  - 一键安装：简化软件安装过程
  - 自动配置：自动设置环境变量
  - 跨平台：支持Linux、macOS、WSL
  - 插件系统：可扩展功能

## 支持的软件类型
  - JDK发行版 (OpenJDK, Oracle JDK, GraalVM等)
  - 构建工具 (Maven, Gradle, SBT等)
  - 开发框架 (Spring Boot, Micronaut, Quarkus等)
  - 其他工具 (Jbang, Leiningen等)

## 安装SDKMAN
  ```bash
    # 使用curl安装
    curl -s "https://get.sdkman.io" | bash

    # 或者使用wget安装
    wget -qO- "https://get.sdkman.io" | bash

    # 初始化SDKMAN
    source "$HOME/.sdkman/bin/sdkman-init.sh"

    # 验证安装
    sdk version

    # 配置 Shell
    source "/Users/xxx/.sdkman/bin/sdkman-init.sh"
  ```

## 常用命令
  ```bash    
    # 列出可用的Java版本
    sdk list java
    sdk list gradle
    sdk list maven

    # 查看当前使用的版本
    sdk current

    # 安装最新的稳定版Java
    sdk install java

    # 安装特定版本的Java
    sdk install java 17.0.7-tem

    # 切换版本（仅在当前shell会话中有效）
    sdk use java 11.0.12-open

    # 设置默认版本
    sdk default java 17.0.7-tem

    # 卸载特定版本
    sdk uninstall java 11.0.2-open

    # 检查SDKMAN自身更新
    sdk selfupdate

  ```

## .sdkmanrc
  - 在项目根目录创建 .sdkmanrc 文件来自动切换版本
  ```bash
    # 生成 .sdkmanrc 文件（基于当前环境）
    sdk env init

    # 在当前目录中启用配置的环境
    sdk env
    
    # 签出新项目后，可能会缺少 项目的文件。要安装这些缺少的 SDK
    sdk env install

    # 自动为当前shell启用环境
    sdk env enable

    # 禁用自动环境
    sdk env disable
  ```
  - 示例 .sdkmanrc
  ```text
    # Enable auto-env through SDKMAN!
    java=8.0.472-zulu   
    gradle=9.1.0
    maven=3.9.11
  ```

## 配置管理
  ```bash
    # 查看当前配置
    sdk config

    # 编辑配置
    sdk config edit
  ```
