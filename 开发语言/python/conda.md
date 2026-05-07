# conda
  > 开源跨平台的包管理和环境管理系统，支持多种编程语言（包括 Python、R 等），不仅可以管理 Python 包，还可以管理其他软件包和依赖项。

## 安装
* 有两种方式
  - Anaconda：包含了大量常用的数据科学包，还有可视化的界面，适合需要一站式解决方案的用户体积较大。
  - Miniconda：Miniconda 只包含 Conda 本身和 Python 可以按需安装其他包。 是Anaconda迷你版本
* 方式一：不同系统下载对应安装包
  - [下载](https://docs.anaconda.com/miniconda/)
  ```bash
    # windows 使用终端命令
    # 方式一：使用conda自带的终端
    # 方式二：集成中在 vscode bash 终端
    # 使用conda自带的终端 运行
    conda init bash
  ```

* 方式二：快速命令行安装
   ```
    # windows powershell
    curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe -o miniconda.exe
    Start-Process -FilePath ".\miniconda.exe" -ArgumentList "/S" -Wait
    del miniconda.exe

    # linux
    mkdir -p ~/miniconda3
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
    rm ~/miniconda3/miniconda.sh

    # macos
    mkdir -p ~/miniconda3
    curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh -o ~/miniconda3/miniconda.sh
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
    rm ~/miniconda3/miniconda.sh


    # 安装后，初始化新安装的 Miniconda。
    # 以下命令为 bash 和 zsh shell 初始化：
    ~/miniconda3/bin/conda init bash
    ~/miniconda3/bin/conda init zsh
   ```

* 验证
  ```bash
    conda --version
  ```

## 常用命令
* 镜像源配置
  ```bash
    # 查看源
    conda config --show channels
    # 换回conda的默认源
    conda config --remove-key channels

    # 方式一：手动编辑 .condarc 文件进行配置

    # 方式二：
    conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
    conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r/
    conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2/
    conda config --add channels https://mirrors.bfsu.edu.cn/anaconda/cloud/pytorch/
    conda config --set show_channel_urls yes

    # conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud

    # 更换镜像源后，执行以下命令更新所有包
    conda update --all

    # 如果要使用pip配置源
  ```
* 环境相关
  - conda 中的环境是独立的隔离空间，您可以在其中安装特定版本的软件包，包括依赖项、库和 Python 版本
  ```bash
    # 取消每次启动自动激活conda的基础环境 true 恢复
    conda config --set auto_activate_base false

    # 列出所有环境
    conda info --envs
    conda env list

    # 创建新环境
    # 不指定python版本 默认去当前最新的
    conda create --name face python=3.12

    # 导出环境配置.yml 文件
    conda env export > environment.yml
    # 在新的机器上以你的导出的环境文件创建新环境
    conda env create -f environment.yml

    # 删除环境
    conda remove --name face --all

    # 切换新环境
    conda activate face
    # 退出当前环境
    conda deactivate

    # 更新Conda
    conda update conda
  ```
* 查询相关
  ```bash
        # 查找可用的 python3
        conda search python

        # 当前环境中的软件包列表
        conda list

        # 查看安装包的信息
        conda list cudatoolkit
    ```  
* 安装更新卸载
  ```bash
    # 如果 conda 软件包可用，则首选方式应该是安装 conda 软件包,否则用 pip

    conda install package-name 

    # 安装特定版本的软件包
    conda install package-name=2.3.4 
    conda install package-name=2

    conda remove xxx
    conda update xxx

  ```

## 离线安装
```bash
    # 在有网环境安装 conda-pack
    # conda-pack 是一个用于打包 Conda 环境的工具，它可以将整个 Conda 环境及其依赖项打包成一个压缩文件，便于在不同环境之间传输和部署。

    # 方式一：表示从 conda-forge 频道安装 conda-pack 

    # 经测试 Linux 可以 windows 会丢失包（如果存在全局的）
    # 所以 必须清理本机之前已安装的缓存记录
    # 一般在 C:\Users\qinmao\AppData\Roaming 下的 pyhton 和pip 都清理掉
    conda install -c conda-forge conda-pack
    conda install -c conda-forge ffmpeg

    conda pack -n face 
    cd /root/anaconda3/envs/ 
    mkdir face
    tar -xzvf face.tar.gz -C face

    # 方式二：从 指定环境克隆
    conda create -n yourenvname --clone root

  ```