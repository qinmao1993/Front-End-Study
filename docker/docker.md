# docker
## what Docker，它解决了什么问题？
* 容器是在主机上运行的沙盒进程，它与该主机上运行的所有其他进程隔离
* 出现的背景：开发最麻烦的事之一就是环境配置的问题，不同的环境代码运行可能存在问题
* 虚拟机：为了解决环境的问题出现了虚拟机，虚拟机自带环境但是有几个缺点
  - 资源占用多
  - 冗余步骤多
  - 启动慢
* linux 容器：
  - 为了解决虚拟机的这些缺点，linux 发展出了另一种虚拟化技术Linux 容器（Linux Containers，缩写为 LXC） Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离，由于容器是进程级别的，相比虚拟机有很多优势。
  - 启动快
  - 资源占用少
  - 体积小
* docker
  - 是属于 linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案。Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

## Docker 实现原理的三大基础技术：
* Namespace：实现各种资源的隔离
* Control Group：实现容器进程的资源访问限制
* UnionFS：实现容器文件系统的分层存储，写时复制，镜像合并

## docker 的用途
  > Docker 的主要用途，目前有三大类。
  - 提供一次性的环境。比如，本地测试他人的软件、持续集成的时候提供单元测试和构建的环境。
  - 提供弹性的云服务。因为 Docker 容器可以随开随关，很适合动态扩容和缩容。
  - 组建微服务架构。通过多个容器，一台机器可以跑多个服务，因此在本机就可以模拟出微服务架构。

## 用 docker 部署的好处：
  - 提供一致的运行环境
  - 更轻松的迁移
  - 持续交付和部署
  - 快速部署、回滚

## 镜像文件类型
* 类型（nodejs为例）
  + 完整版本镜像：x.y.z（例如 22.0.0） 或 x（例如 22）
    - 这些镜像包含了完整的 Node.js 运行时环境以及对应的 npm 包管理器
  + 精简版本镜像：x.y.z-alpine 或 x-alpine。
    - 基于 Alpine Linux 构建，Alpine Linux 是一个轻量级的 Linux 发行版，因此这种镜像体积非常小
    - 需要注意的是，alpine 使用 musl 代替 glibc。某些依赖于 glibc 的 Node.js 模块可能无法正常工作
  + Slim 版本镜像：x.y.z-slim 或 x-slim。
    - slim 版本只包含了运行 Node.js 应用所需的最小依赖，体积相对较小，适用于那些不需要完整开发工具链的生产环境
  + 基于操作系统的镜像
    - Debian 基础镜像：以 x.y.z-buster 或 x-buster 等形式存在。buster 是 Debian 10 的代号
    - Ubuntu 基础镜像：如 x.y.z-focal 或 x-focal，focal 是 Ubuntu 20.04 的代号

* 选择标准： 
  - 官方的、经常维护的、体积小的
  - 有操作系统系统要求的

## image 文件
* 特性
  - Docker 把应用程序及其依赖，打包在 image 文件里面，通过这个文件，才能生成 Docker 容器，image 文件可以看作是容器的模板
  - image 是二进制文件，一个 image 文件往往通过继承另一个 image 文件，加上一些个性化设置而生成
  - image 文件是通用的，一台机器的 image 文件拷贝到另一台机器，照样可以使用

* 本地image管理
  ```bash
    docker image ls   # 来列出本地主机上的 image 文件
    docker image rmi [image_id|imageName] # 删除本地一个或多个镜像，-f 强制删除；
    docker rmi $(docker images -q)        # 删除所有docker镜像：
  ```

## image 文件离线部署
1. 在联网环境中导出镜像
  ```bash
    docker pull <镜像名称>:<标签>  # 例如：docker pull nginx:latest
    docker image ls

    docker save -o <输出文件名>.tar <镜像名称>:<标签>
    # 示例：docker save -o gitlab.tar gitlab/gitlab-ce:17.11.1-ce.0

    # 如果需要保存多个镜像，可以一次导出：
    docker save -o all_images.tar <镜像1>:<标签> <镜像2>:<标签>

    # 注意内外网 cpu 的架构兼容性
    # 在 macOS（M1/M2/M3）上操作：
    docker pull --platform=linux/amd64 <镜像名>:<标签>
    # 示例：docker pull --platform=linux/amd64 nginx:latest

    # 启用 buildx
    docker buildx create --use
    # 构建多平台镜像
    docker buildx build --platform linux/amd64,linux/arm64 -t <镜像名>:<标签> .
  ```
2. 传输镜像文件到离线环境
3. 在离线环境中导入镜像
  ```bash
    docker load -i <文件名>.tar  # 示例：docker load -i nginx.tar
    
    # 批量导入
    for file in *.tar; do
        docker load -i "$file"
    done
    docker images   # 验证镜像是否导入成功
  ```
4. 运行容器

## Dockerfile
* Dockerfile 只是一个基于文本的文件，没有文件扩展名，其中包含指令脚本。Docker 使用此脚本构建容器镜像。
* CMD 与 RUN 命令
  + RUN 
    - RUN 命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件
    - 一个 Dockerfile 可以包含多个 RUN 命令
  + CMD 表示容器启动后执行,只能有一个CMD 命令 

* 它是一个文本文件，用来配置 image。Docker 根据该文件生成二进制的 image 文件。
  ```Dockerfile
    FROM node:18.16.0-bullseye-slim

    # 设置容器上海时间
    ENV TZ=Asia/Shanghai \
        DEBIAN_FRONTEND=noninteractive
    RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata && rm -rf /var/lib/apt/lists/*

    #  指定在容器上的工作目录
    WORKDIR /usr/src/app

    # 将当前目录（dockerfile所在目录）下所有文件都拷贝到工作目录下
    COPY . ./

    # npm 源，选用国内镜像源以提高下载速度
    RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
    
    # npm 安装依赖
    RUN npm ci

    ENTRYPOINT ["npm", "run"]

    # 容器启动后执行
    CMD ["start"]

    EXPOSE 3000

  ```

* 生成 image 文件
  ```bash
    # -t 参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。
    # .表示 Dockerfile 文件所在的路径

    # 根据 Dockerfile 文件, 生成一个名为 gateway:0.0.1的 镜像文件
    docker build  -t gateway:0.0.1 .   
  ```

## 容器
* 特性
  - image 文件生成的容器实例，本身也是一个文件，称为容器文件，一旦容器生成，就会同时存在两个文件： image 文件和容器文件
  - 而且关闭容器并不会删除容器文件，只是容器停止运行而已

* 容器的管理
  ```bash
    docker ps                  # 列出本机正在运行的容器 早期的命令，和下面一样，下面更具语义化
    docker ps -a 
    docker container ls         # 列出本机正在运行的容器
    docker container ls -a      # 查看所有的容器,包括终止运行的容器
                         
    docker rm [containerID]    # 删除容器
    docker rm $(docker ps -aq) # 删除所有容器

    # 根据镜像文件启动容器，每运行一次，就会新建一个容器
    # 你可以通过宿主机的端口 8000 访问容器内部运行的服务（假设容器内部有服务监听 3000 端口）。

    # -i：表示以交互模式运行容器，保持容器的标准输入流（stdin）打开，这样你可以与容器进行交互
    # -t：表示分配一个伪终端（tty），让你能够获得类似终端的界面。
    # -d：表示容器将在后台运行，不会阻塞终端。
    # /bin/bash：这是容器启动后要执行的命令，启动一个 Bash shell的终端
    # --rm 启动容器后，当容器停止时自动删除容器,避免容器停止后还留在本地，占用系统资源

    docker run -p --name=c3 8000:3000 gateway:0.0.1      
    docker run -p 8000:3000 -itd gateway:0.0.1           
    docker run -p 8000:3000 -itd gateway:0.0.1 /bin/bash 

    docker run --rm -p 8000:3000 -itd gateway:0.0.1 /bin/bash 

    docker exec -it [containerID] /bin/bash  # 进入一个正在运行的 docker 容器
    docker exec -it [containerID] /bin/sh

    docker start ${container_id} # 启动已终止的容器
    docker stop ${container_id}  # 停止容器
    docker stop $(docker ps -q) & docker rm $(docker ps -aq)  # 停用并删除容器
   
    docker kill <container_name_or_id> # 终止容器运行
    docker kill $(docker ps -aq)       # 杀死 docker 有关的容器：

  ```

## 镜像仓库
  ```bash
   docker login -u 用户名 -p 密码  # 未指定镜像仓库地址，默认为官方仓库 Docker Hub
   docker logout
   
   docker pull xxx  # 下载这个镜像 如 docker push YOUR-USER-NAME/getting-started
   docker push xxx  # 要先登陆到镜像仓库, 例子:docker push myapache:v1
   docker search xxx # 从 Docker Hub 网站来搜索镜像,找适合的下载
  ```

## 数据卷
* 是什么？
  - Docker 数据卷是一种 持久化存储数据的机制，用于在容器生命周期之外保存和管理数据。
  - 本质是由 Docker 管理的特殊目录，独立于容器的联合文件系统（UnionFS），存储在宿主机上。

* 核心特性
  - 持久性：删除容器后，数据卷不会被自动删除。
  - 高性能：绕过容器文件系统层，直接操作宿主机文件系统。
  - 共享性：支持多个容器共享同一数据卷。
  - 跨平台：由 Docker 统一管理，兼容 Linux、Windows 和 macOS。

* 数据卷 vs 绑定挂载（Bind Mount）
  + 存储位置不同：
    - 数据卷：
      1. macos（/var/lib/docker/volumes/）
      2. Windows：(\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\)
    - 绑定挂载（Bind Mount）用户指定的宿主机任意目录
  + 数据隔离
    - 数据卷：高（仅通过 Docker 访问）
    - 绑定挂载（Bind Mount）：低（直接暴露宿主机文件系统）
  + 性能
    - 数据卷：高（针对容器操作优化）
    - 绑定挂载： 中（依赖宿主机文件系统性能）
  + 备份/迁移
    - 数据卷：容易（通过 Docker 命令）
    - 需手动操作宿主机目录
  + 适用场景
    - 数据卷：数据库文件、应用数据持久化
    - 绑定挂载：开发环境代码、配置文件等敏感数据使用绑定挂载

* 数据卷的核心操作
  ```bash
    docker volume create my_volume     # 创建卷

    docker volume ls                 # 列出所有数据卷
    docker volume inspect my_volume  # 查看数据卷详细信息
    docker system df -v              # 查看卷占用的磁盘空间

    docker volume rm my_volume       # 删除
    docker volume prune              # 删除所有未使用的数据卷

    docker run -d \
      --name my_container \
      -v my_volume:/app/data \    # 挂载命名卷
      nginx:latest

    # 修改数据卷中的文件
    docker exec -it 容器名或ID /bin/bash  # 或 /bin/sh
    vim /容器内路径/配置文件               # 有编辑器的
    docker restart 容器名或ID            # 改完重启生效

    # 使用 docker cp 命令复制文件
    docker cp 容器名或ID:/容器内路径/配置文件 ./临时本地路径         # 从容器复制文件到宿主机
    docker cp ./临时本地路径/配置文件 容器名或ID:/容器内路径/配置文件  # 将文件复制回容器

  ```

* 备份与恢复
  ```bash
    # 备份数据卷到宿主机
    docker run --rm \
      -v my_volume:/data \          # 挂载需备份的卷
      -v $(pwd):/backup \           # 挂载宿主机备份目录
      alpine:latest \
      tar czf /backup/my_volume_backup.tar.gz -C /data .

    # 从备份恢复数据卷
    docker run --rm \
      -v my_volume:/data \          # 挂载目标卷
      -v $(pwd):/backup \           # 挂载宿主机备份文件
      alpine:latest \
      tar xzf /backup/my_volume_backup.tar.gz -C /data
  ```

* 高级用法
  ```bash
    # 只读挂载
    docker run -d \
      -v my_volume:/app/data:ro \  # 容器内只读
      nginx:latest

    # 共享数据卷（多容器挂载）
    # 容器1写入数据
    docker run -d --name writer -v shared_vol:/data alpine:latest sh -c "echo 'Hello' > /data/test.txt"
    # 容器2读取数据
    docker run -d --name reader -v shared_vol:/data alpine:latest tail -f /data/test.txt

    # 数据卷驱动（支持 NFS、云存储等）
    # 使用 NFS 驱动创建卷
    docker volume create --driver local \
      --opt type=nfs \
      --opt o=addr=192.168.1.100,rw \
      --opt device=:/path/to/nfs/share \
      nfs_volume

      # 指定容器内用户权限
    docker run -d \
      -v my_volume:/data \
      --user 1000:1000 \        # 指定 UID:GID
      nginx:latest
  ```

## docker compose
* 是什么？
  - 是一个用于定义和运行多容器 Docker 应用的工具，通过 声明式 YAML 文件 描述应用的各个服务、网络、卷等组件，简化复杂多容器环境的部署与管理
  
* 核心功能
  - 一键启动多容器应用：通过单条命令启动所有服务。
  - 服务依赖管理：自动处理服务启动顺序和健康检查。
  - 环境隔离与复用：支持多环境（开发、测试、生产）配置。
  - 资源统一管理：集中定义网络、卷、环境变量等资源。

* 核心概念
  - 服务（Service）：定义单个容器的运行参数（镜像、端口、卷挂载等）。如一个 Web 服务 + 一个数据库服务。
  - 项目（Project）：由一组关联的服务、网络和卷组成的完整应用。默认以当前目录名作为项目名（可通过 -p 参数指定）。
  - 网络（Network）：自动创建自定义网络，实现服务间隔离通信。默认所有服务加入同一网络，可通过服务名互相访问。
  - 卷（Volume）：定义持久化存储，供多个服务共享数据。

* 安装
  - 独立安装（Linux/macOS）
    ```bash
        # 下载最新版本（需替换为当前版本号）
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

        # 添加执行权限
        sudo chmod +x /usr/local/bin/docker-compose

        # 验证安装
        docker-compose --version
    ```
  - Docker Desktop 已内置无需安装

* 配置示例
  ```yaml
    version: "3.9"  # Compose 文件版本
    services:
        demo-web:                     # 服务名称
            image: nginx:latest       # 使用镜像
            ports:
                - "80:80"             # 端口映射
            volumes:
                - ./html:/usr/share/nginx/html  # 绑定挂载
            depends_on:
                - db                  # 依赖其他服务
        db:
            image: mysql:8.0
            environment:              # 环境变量
                MYSQL_ROOT_PASSWORD: secret
            volumes:
                - mysql_data:/var/lib/mysql  # 数据卷挂载

    volumes:
        mysql_data:                   # 定义数据卷
  ```

* 常用命令
  ```bash
    # 在 docker-compose.yml 配置文件同级文件路径下

    docker compose stop      # 先停止但不删除容器
    docker compose down	  # 停止并删除所有容器、网络（-v 同时删除卷）

    docker compose up -d	 # 启动所有服务（-d 后台运行）应用新配置
    docker compose up -d --force-recreate --no-deps app     # 只重启 app 服务（其他服务不受影响）

    docker compose ps	  # 列出运行中的容器
    docker compose logs	  # 查看服务日志（-f 实时跟踪）
    docker compose config # 验证并查看最终的 Compose 配置

    docker compose exec	xxx /bin/bash # 进入运行中的容器执行命令（如 exec web sh）

    docker compose pull	  # 拉取服务所需的镜像

  ```

## 日志
 ```bash
   docker logs --since 30m 容器id
 ```

## 网络问题
* TODO

## 遇到的一些问题
* docker容器内应用访问宿主机的 MySQL？
  ```bash
   # 1. 开放数据库端口
   # 防火墙 开放 3306 端口
   firewall-cmd --zone=public --add-port=3306/tcp --permanent
   # 刷新一下
   firewall-cmd --reload

    # 2. 查看容器是从哪个 IP 连宿主机 MySQL
    docker exec -it 容器ID ip addr

    # 开放权限给这个IP
    mysql -u root -p
    
    # 进入 mysql 后，开放权限，当root用户以pwd（密码记得换成自己的）从端口 172.17.0.3 登入时，允许它操作数据库的所有表，下面的单引号别省了
    grant all privileges on *.* to 'root'@'IP' identified by 'pwd' with grant option;

  ```
* docker容器内访问宿主机的或第三方接口？
  - TODO
