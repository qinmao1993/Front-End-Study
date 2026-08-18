# nodejs 安装

## 环境要求
* Linux
  - node18+ 需要 glibc>=2.28，centos7 需要升级 glibc
  - [glibc升级](/操作系统/linux/glibc升级.md)
  
## nvm 安装 nodejs
* Mac|Linux 推荐安装 nvm 来切换 node 版本
* windows 推荐使用[nvm-windows](https://github.com/coreybutler/nvm-windows)

* 使用 nvm 安装 nodejs
  ```bash
    # 安装 nvm（Node 版本管理器）
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # 下载并安装 Node.js（可能需要重新启动终端）
    # 设置代理,打开nvm目录，找到 setting.txt 文件夹打开没有创建
    # node_mirror: https://npmmirror.com/mirrors/node/
    # npm_mirror: https://npmmirror.com/mirrors/npm/

    nvm install 20

    # 验证环境中是否存在正确的 Node.js 版本
    node -v # 应打印 `v20.16.0`

    # 验证环境中是否存在正确的 npm 版本
    npm -v # 应打印 `10.8.1`

    # nvm 提供 nvm reinstall-packages 命令
    # 如你新安装的是 14.17.3 老版本是 14.17.0
    # 执行 就可以把老版本上的全局包重新安装在新版本上了
    nvm reinstall-packages 14.17.0 
  ```

## 预编译二进制安装（离线）
* nodejs 卸载
  ```bash
    whereis node    # 找到安装路径

    # 手动删除残留文件
    rm  /usr/local/bin/node
    rm  /usr/local/bin/npm
    rm  /usr/local/bin/pm2
    rm  /usr/local/node-v16.15.1-linux-x64
  ```
* 安装步骤
  1. 官网下载指定版本（https://nodejs.org/zh-cn/download）包 如 node-v16.15.1-linux-x64.tar.xz
  2. 拷贝到linux服务器上 任意文件夹 如 /usr/local
  3. 在服务器上解压
    ```bash
      xz -d node-v16.15.1-linux-x64.tar.xz
      tar -xvf node-v16.15.1-linux-x64.tar

      # 创建软连接（类似windows建立快捷方式）
      ln -s  /usr/local/node-v16.15.1-linux-x64/bin/node /usr/local/bin/node 
      ln -s  /usr/local/node-v16.15.1-linux-x64/bin/npm /usr/local/bin/npm 
   ```
  4. 安装 pm2
    - 找到已下载好的 pm2 包拷贝到服务器 /usr/local/node-v16.15.1-linux-x64/lib/node_modules 文件夹下
    - 创建软连接 ln -s /usr/local/node-v16.15.1-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin/pm2
    
    - 如果报权限问题：执行 chmod 777 /usr/local/bin/pm2
  5. 测试命令 
    ```bash
       node -v
       npm -v
       pm2 -v 
    ```

## yum 安装通用方式（离线）
  - yum 源上的版本不是最新的 设置 nodejs 源
  ```bash
    # 找一台联网的机器(yum源已切换国内)和内网的机器一样的配置
    # 1. 下载指定版本的 nodejs rpm 包
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nsolid

    yum clean all        # 清楚所有缓存
    yum makecache        # 生成元数据缓存

    yumdownloader --resolve --destdir=/home/rpm nodejs  

    # 2. 将第一步下载 的 /home/rpm 下的所有 rpm 文件, 上传到内网的机器 如 /home/rpm 文件夹下

    # 3. 进入内网机器 当前目录安装
    cd /home/rpm

    # 推荐 yum会自动搜寻依赖关系并安装
    yum localinstall *.rpm -y

    # 安装 pm2 同上
    # 安装完后运行一下命令检测
    node -v 
    pm2 -v

  ```
  
## 源码安装
1. 安装依赖
  ```bash
   yum install g++ curl libssl-dev apache2-utils git-core build-essential
  ```
2. 下载源码编译
  ```bash
    git clone https://github.com/nodejs/node.git
    cd node
    
    # 指定安装目录
    ./configure --prefix=/usr/local/node  

    # 编译成二进制可执行程序
    # 手动指定：j2表示用2个逻辑cpu
    make -j2  

    # macOS，使用 sysctl -n hw.logicalcpu 获取 CPU 核心数
    # centos cat /proc/cpuinfo | grep processor | wc -l
    make -j$(sysctl -n hw.logicalcpu)   

    make install
  ```
