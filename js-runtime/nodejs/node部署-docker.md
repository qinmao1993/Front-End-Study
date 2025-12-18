# docker 部署
1.下载 rpm 包
 ```bash
  # 找一台联网的机器和内网的机器一样的配置
  # Install the yum-utils package (which provides the yum-config-manager utility) and set up the repository.
  yum install -y yum-utils
  # 添加稳定的Docker软件源
  yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

  # 1. 下载 rpm 包
  yum install -y --downloadonly --downloaddir=/home/rpm docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # 2. copy 上传到内网的机器 如rpm 文件夹下

  # 3. 进入当前目录安装
  cd /home/rpm
  rpm -ivh * --nodeps --force

  # 安装完后运行一下命令检测
  docker -v

  docker info

  # systemctl 命令的用法
  systemctl start docker    # 启动 Docker 
  systemctl stop docker     # 停止 Docker服务
  systemctl restart docker  # 重启 Docker
  systemctl enable docker    # 设置Docker开机自启动
  systemctl status docker    # 查看Docker的运行状态

  ```
2. 导出本地镜像
  - 语法：docker save [OPTIONS] IMAGE [IMAGE...]
 ```bash
  # 将指定镜像 demo 保存成 tar 文件
  docker save -o demo.tar demo
  ```
3. 在服务端机器上拷贝上面导出的镜像,并load
  - 语法：docker load [OPTIONS]
 ```bash
  docker load -i  demo.tar
  docker image ls

  ```


  