# docker 各环境下的安装

## docker 的版本
* Docker 是一个开源的商业产品，有两个版本：
  - 社区版（Community Edition，缩写为 CE）
  - 企业版（Enterprise Edition，缩写为 EE），一般我们说的都是 CE 版本

## CentOS
* 安装新版本之前先卸载旧的
  ```bash
    sudo yum|dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
  ```
  - 注意：Images, containers, volumes, and networks stored in /var/lib/docker/ aren’t automatically removed when you uninstall Docker.

* 在线安装
  ```bash
    # Install the yum-utils package (which provides the yum-config-manager utility) and set up the repository.
    yum install -y yum-utils

    # 添加稳定的 Docker 软件源
    yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

    sudo dnf -y install dnf-plugins-core
    sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

    # 安装 docker 
    yum|dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Docker 需要用户具有 sudo 权限，为了避免每次命令都输入sudo，可以把用户加入 Docker 用户组
    sudo usermod -aG docker $USER
  ```

* 离线安装
  ```bash
    # 在有网络的环境中准备安装包
    # 创建临时目录
    mkdir -p ~/docker-offline
    cd ~/docker-offline

    # 添加稳定的Docker软件源
    yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

    # 方法A：使用官方脚本下载所有依赖（需要yum-utils）
    sudo yum install yum-utils -y  # CentOS/RHEL
    # 或
    sudo apt-get install dpkg-dev -y  # Ubuntu/Debian

    # 下载Docker CE所有rpm包（CentOS/RHEL）
    yumdownloader --resolve docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # 下载Docker CE所有deb包（Ubuntu/Debian）
    apt-get download docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # 传输到离线服务器并安装

    # CentOS/RHEL (7/8):
    # 拷贝所有rpm包到离线服务器，然后安装
    sudo yum localinstall *.rpm -y --skip-broken

    # 或使用rpm安装
    sudo rpm -ivh *.rpm --nodeps --force

    # Ubuntu/Debian:
    # 拷贝所有deb包到离线服务器，然后安装
    sudo dpkg -i *.deb

    # 如果遇到依赖问题，修复依赖
    sudo apt-get -f install -y
  ```

* 验证启动
  ```bash
   # 安装完测试
   docker -v
   docker info

   # systemctl 命令的用法
   systemctl enable --now docker    # 设置Docker开机自启动
   systemctl status docker    # 查看Docker的运行状态

   systemctl start docker    # 启动 Docker 
   systemctl stop docker     # 停止 Docker服务
   systemctl restart docker  # 重启 Docker

  ```

## mac
* brew 安装
* 客户端 安装

## windows
* 客户端 安装
  ![版本要求](./版本要求.png)
* 注意：新版的 docker 需要依赖 WSL2。版本不是2的要升级
  ```powershell
   wsl -l -v  # 检查 WSL 版本：

  # 方式一
   wsl --update   # 自动更新
   wsl --install  # 在线安装的新 Linux 安装将默认设置为 WSL2，离线手动下载安装

   wsl --shutdown # 更新完后重启一下
   wsl --set-default-version 2 # 升级完成后 设置 WSL 2 为默认版本
   
   # 方式二：管理员运行 CMD 执行 
   netsh winsock reset
   wsl --shutdown  # 避免重启电脑
  ```
