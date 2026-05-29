# ffmpeg安装
  >ffmpeg 是一个开源的多媒体处理工具，广泛用于音频、视频和流媒体的处理、转码、录制和播放等任务。它提供了强大的命令行工具集，可以在不同的操作系统上运行。

## mac
> 测试： ffmpeg -version
* 方式一：使用 Homebrew 安装：brew install ffmpeg
* 方式二：手动下载安装：ffmpeg 官网 下载 macOS 版本的 ffmpeg，解压缩后将可执行文件移动到合适的位置，如 /usr/local/bin

## windows
* 方式一：
  - 下载 ffmpeg：访问 ffmpeg 官网 或者 ffmpeg Windows 版本下载页面。解压缩压缩包到你希望安装的目录，设置系统环境变量（可选）：

## linux
* 方式一：包管理器安装：
    ```bash
        # Ubuntu
        sudo apt-get update
        sudo apt-get install ffmpeg
    ``` 
* 方式二：conda 安装
   ```bash
        # conda-forge 是一个社区驱动的 Conda 软件包仓库，通常提供了最新版本的软件包
        conda install -c conda-forge ffmpeg
   ```
## 源码安装
* 如果你需要更高级的配置或者特定的功能，可以选择手动编译安装 ffmpeg。
   - 参考[编译安装文档](https://trac.ffmpeg.org/wiki/CompilationGuide)。  