# brew
* [官网](http://brew.sh/index_zh-cn.html)

## homebrew 的组成
* brew: Homebrew 源代码仓库      
* homebrew-core  Homebrew 核心源   
* homebrew-bottles:预编译二进制软件包
* homebrew-cask: 安装GUI应用 [查看可安装列表]（https://formulae.brew.sh/cask/）

## 安装:
  ```bash 
    # 脚本 默认使用中科大源
    /bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
  ```

## 卸载：
  ```bash
    # 官方脚本同样会遇到 uninstall 地址无法访问问题
   /bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/uninstall.sh)"
  ```

## 手动换源
  ```bash
    # 查看 brew.git 当前源
    cd "$(brew --repo)" && git remote -v

    # 必备设置 替换 brew.git：

    # 清华大学的源 https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
    git -C "$(brew --repo)"  remote set-url origin https://mirrors.ustc.edu.cn/git/homebrew/brew.git
   # 替换 homebrew-core.git：
    git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
    # 以下按需设置：替换 homebrew-cask.git：
    git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

    # 更新一下下载地址
    brew update 
    # 来检查一下地址是否更新成功
    brew config 

    # 还原
    # 步骤一
    git -C "$(brew --repo)" remote set-url origin https://github.com/Homebrew/brew.git
    # 步骤二
    brew update
    
  ```

## brew 用法
```bash
   # Homebrew 安装的软件包通常都存储在 /usr/local/Cellar 目录下
   # sudo rm /usr/local/bin/wget  删除软连接
   brew -v 
   brew config  # 查看 brew 的配置
   brew doctor  # 检测问题

   brew ls 可以查看所有安装的软件
   brew search TEXT|/REGEX/
   brew info xxx

   brew install 软件名  
   brew install --verbose --debug FORMULA|CASK
   brew uses --installed icu4c@77 # 找出依赖所有依赖icu4c@77的包
   brew install --cask dotnet-sdk

   brew uninstall  软件名称

   brew update 更新 homebrew 自己
   brew upgrade 升级所有包 但旧版本仍然会保留

   # 查看哪些旧版本和缓存文件可以安全删除（仅显示，不操作）
   brew cleanup --dry-run -s
   # 查看哪些软件包可以被“自动移除”（不再被任何已安装包依赖）
   brew autoremove --dry-run

   # 清理所有软件的旧版本，并删除超过120天未下载的缓存文件
   # 不会卸载仍被其他包依赖的软件或当前安装的版本，因此非常安全
   brew cleanup --prune=all -s
   # 自动卸载所有未被其他已安装包依赖的“孤儿”包
   brew autoremove

   # 如果你只想清理个别软件，可以指定名称：
   brew cleanup <formula> --dry-run

```
* brew services 管理后台服务
  - macOS 使用 launchctl 命令加载开机自动运行的服务，但是操作起来比较麻烦，使用 Homebrew Services 则可以简化 lauchctl 的操作。以 mysql 为例，如果使用 launchctl 需要这样操作:
  ```bash
    ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist

    # services 常用命令
    brew services list   # 查看本地运行服务列表
    brew services start xxx # 后台开始某个服务
    brew services stop  xxx # 后台停止某个服务
    brew services kill  xxx # 强杀服务进程：

    brew services start --all # 启动所有服务
    brew services stop  --all # 停止所有服务
  ```
