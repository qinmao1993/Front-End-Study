# yum|dnf 包管理  
> DNF 和 YUM 都是 Red Hat 系列 Linux 发行版（如 RHEL、CentOS、Fedora）的包管理工具，它们关系密切，但 DNF 是 YUM 的现代化替代品。

## 演进与替代
* YUM：全称 Yellowdog Updater Modified，是早期基于 RPM 系统的包管理器。它用 Python 2 编写，曾是 RHEL/CentOS 5/6/7 的标配。
* DNF：全称 Dandified YUM，是 YUM 的下一代版本。它用 Python 3 编写，旨在解决 YUM 在性能、依赖解析和代码维护性上的问题。从 RHEL/CentOS 8 和 Fedora 22 开始，DNF 已成为默认的包管理器。
* DNF 刻意保持了与 YUM 高度兼容的命令行语法，系统新版本。默认使用 DNF。yum 命令通常作为一个符号链接指向 dnf，所以你用 yum 命令实际上也是在调用 DNF，确保了脚本的向后兼容性。

## CentOS常用的repos
* CentOS内置的软件仓储
  - 完成CentOS系统安装之后,默认激活了几个CentOS的软件在线安装的源：base，extras，updates
  - CentOS-Base.repo: CentOS 的主要软件源配置文件，包含了 CentOS 官方软件包的下载地址和其他相关信息。
  - CentOS-Extras.repo:CentOS 的额外软件源配置文件，提供一些不包含在默认软件源中的额外软件包。

* EPEL (Extra Packages for Enterprise Linux)
  - 通过安装EPEL可以获得一些额外的软件工具包
   ```bash
    yum install epel-release    
   ```

* SCL (Software Collection)
  - SCL提供了工具集的较新的版本，可以体验新版本的特性
  ```bash
    # 安装完成后在/etc/yum.repos.d目录下会出现CentOS-SCLo-scl.repo和CentOS-SCLo-scl-rh.repo两个文件。安装后源默认启用。
    # 1. 安装SCL源
    yum install -y centos-release-scl

    # 2. 配置CentOS-SCLo-scl.repo国内地址
    [centos-sclo-sclo]
    name=CentOS-7 - SCLo sclo
    baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/sclo/
    
    # 配置CentOS-SCLo-scl-rh.repo
    [centos-sclo-rh]
    name=CentOS-7 - SCLo rh
    baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/rh/

    # 查看从 SCL 中安装的包
    scl --list
  ```

* remi.repo: 
  - 是一个专注于提供最新 PHP 和相关库的第三方软件源。

* ELRepo (hardware related packages)
  - linux kernel的新版本

* docker-ce.repo: 
  - Docker Community Edition (CE) 的官方软件源配置文件，用于安装 Docker 和相关工具。

* 查看源和刷新
  ```bash
    yum repolist enabled         # 查看当前使用的源
    yum repolist all             # 列出所有的源

    # Centos-Stream 配置清华源
    # 默认启用了包管理工具 dnf，是 yum 包管理工具的替代品，dnf 与 yum 大部分的命令都是通用的    
    # CentOS Stream 9 中源被整合入两个文件 centos.repo 和 centos-addons.repo，由于文件中不包含 baseurl 字段，需要手动插入，通过文本替换修改源的方法较为复杂，也可以选择直接复制最后的替换结果覆盖源文件

    # 步骤一：备份当前的yum源配置文件
    cp /etc/yum.repos.d/centos.repo /etc/yum.repos.d/centos.repo.backup
    cp /etc/yum.repos.d/centos-addons.repo /etc/yum.repos.d/centos-addons.repo.backup

    # 步骤二：替换配置文件
    centos.repo
    centos-addons.repo

    # 步骤三：清除yum缓存、刷新
    yum clean all && yum makecache  
  ```

* 配置属性
  - /etc/yum.conf  为所有仓库提供公共配置
  ```bash
    [main]
    cachedir=/var/cache/yum/$basearch/$releasever  # rpm 下载的缓存目录 $basearch 代表硬件架构 $releasever os 发行版的主板号
    keepcache=0     # 值为0时，不保留下载的rpm包，值为1时则会保留
    debuglevel=2    # 调试级别，0──10,默认是2
    logfile=/var/log/yum.log
    exactarch=1     # 是否允许不同版本你的rpm安装
    obsoletes=1     # 是否允许旧版本运行
    gpgcheck=1      # 是否验证秘钥 1 验证
    plugins=1       # 是否允许插件 1 允许
    installonly_limit=5 # 保存几个内核
    bugtracker_url=http://bugs.centos.org/set_project.php?project_id=23&ref=http://bugs.centos.org/bug_report_page.php?category=yum
    distroverpkg=centos-release
  ```

  ```bash
    [base]
    name=CentOS-$releasever - Base - mirrors.aliyun.com  # 设置的名称
    failovermethod=priority  # 多源可供选择时，决定其选择的顺序 默认oundrobin随机选择，priority则根据url的次序从第一个开始
    baseurl=http://mirrors.aliyun.com/centos/$releasever/os/$basearch/  #  baseurl 设置的连接地址，有几种方式：1. 本地目录 file://  2. 网络：ftp://  http:// https://
            http://mirrors.aliyuncs.com/centos/$releasever/os/$basearch/
            http://mirrors.cloud.aliyuncs.com/centos/$releasever/os/$basearch/
    gpgcheck=1
    gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

    # mirrorlist：指定了一个URL地址，该地址是一个包含有众多源镜像地址的列表，当用户通过yum安装或升级软件时，yum会试图依次从列表中所示的镜像源中进行下载，如果从一个镜像源下载失败，则会自动尝试列表中的下一个。若列表遍历完成依然没有成功下载到目标软件包，则向用户抛错

    [epel]
    name=Extra Packages for Enterprise Linux 7 - $basearch
    enabled=1
    failovermethod=priority
    baseurl=http://mirrors.cloud.aliyuncs.com/epel/7/$basearch
    gpgcheck=0
    gpgkey=http://mirrors.cloud.aliyuncs.com/epel/RPM-GPG-KEY-EPEL-7
    
  ```

## 自建仓库(内网)
  - [自建仓库](https://blog.51cto.com/u_14968843/10122834)

## yum-utils
> 该工具是YUM工具包的子集
* 安装：yum install yum-utils -y
* 管理源
  ```bash
    # 添加源
    yum-config-manager --add-repo https://mirrors.aliyun.com/repo/Centos-7.repo

    yum clean all        # 清楚所有缓存
    yum makecache        # 生成元数据缓存

  ```

## 常用命令
* 列出查看包信息
  ```bash
    yum list             # 列出所有已经安装和可以安装的程序包
    yum list glibc.i686 --showduplicates  # 查看源中提供哪些包版本
    yum list installed   # 列出所有已安装的包
    yum list installed | grep php # 列出有关的安装包

    yum deplist package-name  # 列出包的依赖

    yum list extras      # 列出已安装的但不在官方库中的rpm包，如安装了epel源的rpm包会列出来
    yum list kernel
    yum check-update     # 列出所有可更新的软件清单

    yum info package1        # 查看软件包描述信息和概要信息
    
    yum search python3       # 查看可用的 Python 版本

    dnf autoclean

  ```
* 安装
  ```bash
    # 在线安装
    yum install -y 包名1 包名2

    # 重新按装
    yum reinstall glibc

    # 离线安装
    # 1. 下载 xxx 及其依赖的 RPM 包到当前目录。
    yumdownloader --resolve --destdir /home/rpm openssl
    yumdownloader --resolve --destdir /home/rpm zlib-devel

    dnf download --downloaddir=/home/rpm  zlib-devel

    # 2.拷贝到离线机器上,进入目录
    cd /path/to/destination/home/rpm
    # 3. 使用 yum 安装软件包，这将安装当前目录下的所有 RPM 软件包。
    # yum 会解决依赖关系并进行装
    yum localinstall *.rpm

  ```
* 更新
  ```bash
    yum update          # 更新全部包,会保留旧版本和配置(生产环境中建议使用)
    yum update package1 # 更新指定的包

    yum upgrade         # 更新全部包,删除旧版本的 package
  ```
* 卸载 
  - yum remove xxx     卸载指定的包
  - yum autoremove xxx 卸载指定包并自动移除依赖包
* 清理缓存
  ```bash
    yum clean packages    # 清除缓存目录下的软件包
    yum clean headers     # 清除缓存目录下的 headers
    yum clean oldheaders  # 清除缓存目录下旧的 headers

    yum clean all         # 清楚所有缓存packages/headers/oldheaders
  ```

## rpm
* 命令参数
  - -q 查询已安装的包
  - -i 安装 
  - -U 升级
  - -e 卸载
  - -V 验证软件包
  - -h 显示安装进度
* 查询    
  - rpm -qa|grep php
  - rpm -qa|grep nginx
* 安装
  ```bash
    rpm -ivh xxx.rpm 
    rpm -ivh xxx.rpm --force
  ```
  - 安装的问题：
    ```bash
    # 包中的部分文件已经存在，会报"某个文件已经存在"的错误，replacefiles 忽略这个报错而覆盖安装
    rpm -ivh --replacefiles 包名.rpm

    # 如果软件包已经安装，那么此选项可以把软件包重复安装一遍。
    rpm -ivh --replacepkgs 包名.rpm
  ```
* 升级
  - rpm -Uvh xxx.rpm
* 卸载
  ```bash
    # 卸载时注意依赖顺序
    rpm -qa|grep php      # 查看还有哪些包未卸载 如 php
    rpm -e xxx.rpm        # 卸载指定的包
  ```
* 缺陷
  - 它无法自动解决RPM包之间的依赖性。

