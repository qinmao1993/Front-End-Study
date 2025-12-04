# linux(CentOS)
>基于 linux 的内核，常见流行的发行版有centos,ubuntu

## 系统的安装与修复
[系统的安装与修复](./系统安装修复.md)

## 系统信息
* 操作系统
  - cat /etc/redhat-release  查看操作系统版本
  - arch                     查看架构
  - uptime 显示系统运行了多少时间、当前登录的用户数，操作系统在过去的1、5、15分钟内的平均负载。
  - users 显示系统当前登录的用户
  - uname -r 查看内核版本号
* 磁盘
  - df 查看磁盘的使用情况
  - iostat 查看磁盘速率
* 网络
  - sar -n DEV num1 num2     （-n 查看网络，DEV 查看网络接口）
* CPU
  - 查看物理CPU的个数： cat /proc/cpuinfo |grep "physical id"|sort |uniq|wc -l    
  - 查看逻辑CPU的个数： cat /proc/cpuinfo |grep "processor"|wc -l
  - 查看CPU是几核：    cat /proc/cpuinfo |grep "cores"|uniq
  - 查看CPU的主频：    cat /proc/cpuinfo |grep MHz|uniq
  
## 标准文件夹结构
* 根目录 (/) - 文件系统起点
  ```text
    /
    ├── bin/          # 二进制可执行文件 (基础命令)
    ├── boot/         # 启动加载程序文件
    ├── dev/          # 设备文件
    ├── etc/          # 系统配置文件
    ├── home/         # 用户主目录
    ├── lib/          # 共享库文件
    ├── media/        # 可移动媒体挂载点
    ├── mnt/          # 临时挂载点
    ├── opt/          # 可选应用软件包
    ├── proc/         # 进程信息虚拟文件系统
    ├── root/         # root用户主目录
    ├── run/          # 运行时的临时数据
    ├── sbin/         # 系统管理命令
    ├── srv/          # 服务相关数据
    ├── sys/          # 系统内核信息
    ├── tmp/          # 临时文件
    ├── usr/          # 用户程序和数据
    └── var/          # 可变数据
  ```
* /etc/ - 配置文件中心
  ```text
    /etc/
    ├── ssh/              # SSH服务配置
    │   ├── sshd_config      # SSH服务器配置
    │   └── ssh_config       # SSH客户端配置
    ├── nginx/            # Nginx配置
    ├── apache2/          # Apache配置
    ├── mysql/            # MySQL配置
    ├── systemd/          # 系统服务配置
    ├── cron.d/           # 定时任务配置
    ├── hosts             # 主机名映射
    ├── fstab             # 文件系统挂载表
    ├── passwd            # 用户账户信息
    ├── group             # 用户组信息
    └── resolv.conf       # DNS解析配置
  ```
* /var/ - 可变数据
  ```text
    /var/
    ├── log/              # 系统日志
    │   ├── syslog           # 系统日志
    │   ├── auth.log         # 认证日志
    │   ├── nginx/           # Nginx访问/错误日志
    │   └── mysql/           # MySQL日志
    ├── www/              # 网站文件 (常见)
    ├── lib/              # 应用程序状态信息
    ├── spool/            # 队列数据 (邮件、打印等)
    ├── tmp/              # 临时文件 (重启保留)
    └── backup/           # 备份目录 (自定义)
  ```
* /home/ - 用户数据
  ```text
    /home/
    ├── username/         # 普通用户目录
    │   ├── .ssh/            # SSH密钥
    │   ├── public_html/     # 个人网站
    │   ├── .bashrc         # Bash配置
    │   └── .bash_history   # 命令历史
    └── www-data/         # Web服务用户目录
  ```
* /usr/ - 用户程序
  ```text
    /usr/
    ├── bin/              # 用户命令
    ├── sbin/             # 系统管理命令
    ├── lib/              # 共享库
    ├── local/            # 本地安装软件
    │   ├── bin/
    │   ├── sbin/
    │   └── src/
    ├── share/            # 架构无关数据
    └── src/              # 源代码
  ```
* /opt/ - 可选软件包
  ```text
    /opt/
    ├── application1/     # 商业或独立应用
    ├── custom_app/       # 自定义应用
    └── vendor_software/  # 第三方软件
  ```

## 特殊路径符
* . 表示当前目录
* .. 表示上一级目录
* ~  表示home目录

## 开关机命令
  ```bash
    reboot     # 重启
    shutdown -r now  # 立刻重启(root用户使用)

    halt            # 立刻关机(就是调用shutdown -h)
    poweroff        # 立刻关机
    shutdown -h now # 立刻关机(root用户使用,安全地将系统关机)
  ```

## 终端快捷键
* Ctrl + l 清除屏幕内容，效果等同于 clear
* Ctrl + c 强制停止
* Ctrl + d 退出账户的登录 退出某些环境如 mysql
* history 显示所有执行过的编号+历史命令。这个可以配合!编辑来执行某某命令
* Ctrl + r 在历史命令中查找 (这个非常好用，输入关键字就调出以前的命令了)
* Ctrl + 键盘左右键 光标左右跳单词

## 帮助命令
* man   
  - man ls
* help  
  1. 内部命令  help cd  
  2. 外部命令 ls --help
* info  
   - info ls

## 文件相关命令
* pwd 显示目前的目录
* ls 列出当前文件下文件目录
  - -a 全部文件包括隐藏文件
  - -l 以列表的形式展示
  - -t 按时间排序
  - -h 需要和l搭配使用 显示大小单位
  - -R 文件夹递归显示
  - ls -ahl
  - ls /root /home
* cd 切换当前所在工作目录
  ```bash
    # 相对路径,返回上级
    cd ..   
    # 回到 home目录
    cd ~        

    # 进入绝对路径
    cd /usr/local 
  ```
* 创建一个新目录、新文件
  ```bash
    # -p 保证存在，不存在创建
    mkdir -p /a/b/c
    # 创建新文件
    touch text.txt
  ```
* 删除文件或目录 
  ```bash
    # -r 表示删除文件夹,-f 表示强制删除
    rm -rf /home/text

    # 删除多个
    rm -rf /var/log/httpd/access1  /var/log/httpd/access2

    #  删除以test开头的文件夹
    rm -rf test*
  ```
* 移动与拷贝
  ```bash
    # -r 复制目录,-v 显示复制进度
    # 把 test 复制到 test1
    cp -r test test1 

    # 将 test1 移动到test2
    mv test1 test2
  ```

## 文本查看与编辑
```bash
   # 文本内容显示到终端
   cat text.txt

   # 打开 host文件
   vi /etc/hosts

   # 按 i 键切换进入编辑模式
   # HOME/END 键移动光标到行首/行尾
   # Page Up/Page Down，上/下翻页

   # ESC键，切换到普通模式 

   # 输入 :wq ，保存文件退出程序

```

## 过滤查找
```bash
  # which 要查找的命令程序文件位置
  which node

  # find 起始路径 -name '被查找文件名'
  find / -name '*test'
  
  # grep 过滤关键字
  # grep [-n] 关键字 文件路径  -n 可选显示匹配的行号
  grep -n 'text' ./text.txt

  # |  管道符 左边命令的结果作为右边的输入
  ps -ef|grep node

  # 输出的内容
  echo  `pwd`

```

## 文件打包与压缩
* tar 归档工具命令
  ```bash
    # 格式：.tar 打包文件，没有体积的减少，.gz 极大的压缩体积
    # x：提取（解压缩），z：通过 gzip 解压,新版本的 tar 通常能自动检测压缩类型，-z 参数可以省略
    # f：指定文件，v: 表示详细模式，会在解压缩过程中显示正在提取的文件列表。

    # 打包: 把 1.txt 2.txt 3.txt 打包到 test.tar 文件内
    tar -cvf test.tar 1.txt 2.txt 3.txt  

    # 使用 gzip 模式压缩到 test.tar.gzs
    tar -cvf test.tar.gz 1.txt 2.txt 3.txt

    ls -lh test.tar # 查看文件大小

    # 解包
    xz -d node-v16.15.1-linux-x64.tar.xz
    tar -xvf node-v16.15.1-linux-x64.tar

    tar -xvf test.tar.gz #以 gzip 的模式解压

    # 解压到指定目录
    tar -xvf test.tar -C /home/xxx  
    # 解压时去掉第一层目录结构
    tar -xvf vscode-server-linux-x64.tar.gz --strip-components 1 
  ```

* zip
  ```bash
    # 压缩目录（需要 -r 递归参数）
    zip -r archive.zip directory/

    unzip filename.zip  解压zip文件到当前目录
    # 把 myfile.zip文件解压到 /home/sunny/
    # -o 不提示的情况下覆盖文件；
    unzip -o -d /home/sunny myfile.zip 

    # 如果没安装zip、unzip 可用 jar xvf xxx.zip 解压
  ```

## 文件传输
* scp:命令用于Linux之间复制文件和目录，-r：递归复制整个目录
  ```bash
    # 本地到远程
    # scp local_file user@ip:filePath
    scp -r dist/* root@39.96.190.20:/data/www/static

    # 远程到本地
    # scp user@remote_ip:remote_folder  local_file
    scp -r www.runoob.com:/home/root/others/ /home/space/music/
  ```


## 用户管理
* 用户类型
  1. 超级用户 (root)
    - UID = 0
    - 拥有系统最高权限
    - 用户名通常是 root
  2. 系统用户
    - UID = 1-999 (CentOS/RHEL) 或 1-999 (Debian/Ubuntu)
    - 用于运行系统服务和守护进程
    - 示例：www-data, mysql, postgres
  3. 普通用户
    - UID ≥ 1000
    - 由管理员创建，用于日常操作
    - 权限受限，不能修改系统关键文件
* 用户相关配置文件
  ```bash
    # 用户信息存储在以下文件中：
    # /etc/passwd - 用户账户信息
    # 格式：username:password:UID:GID:comment:home_directory:shell
    # 示例：
    root:x:0:0:root:/root:/bin/bash
    ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash

    # /etc/shadow - 用户密码和过期信息（只有root可读）
    # 格式：username:encrypted_password:last_change:min_age:max_age:warn:inactive:expire
    ubuntu:$6$rounds=...:18645:0:99999:7:::

    # /etc/group - 组信息
    # 格式：group_name:password:GID:user_list
    sudo:x:27:ubuntu
    developers:x:1001:alice,bob

    # /etc/gshadow - 组密码（很少使用）
  ```
* 创建和管理用户
  ```bash
    # 创建用户
    sudo useradd -m -s /bin/bash username      # 创建用户并生成家目录
    sudo useradd -m -g developers -G sudo username  # 指定主组和附加组

    # 设置/修改密码
    sudo passwd username                        # 设置密码
    echo "newpassword" | sudo passwd --stdin username  # 脚本中设置密码

    # 修改用户属性
    sudo usermod -aG sudo username              # 添加到sudo组
    sudo usermod -s /bin/zsh username           # 修改默认shell
    sudo usermod -L username                    # 锁定用户
    sudo usermod -U username                    # 解锁用户

    # 删除用户
    sudo userdel username                       # 删除用户（保留家目录）
    sudo userdel -r username                    # 删除用户及家目录

    # 查看用户信息
    id username                                 # 显示用户UID、GID和组
    whoami                                      # 显示当前用户名
    w                                           # 显示已登录用户
    last                                        # 显示登录历史
  ```
* 用户切换
  ```bash
    # 切换用户
    su username              # 切换到用户，环境变量不变
    su - username            # 完全切换到用户（登录shell）
    sudo -u username command # 以指定用户执行命令

    # 退出用户
    exit                     # 退出当前用户shell
    logout                   # 注销登录会话
  ```
* 组概念
  + 主组 (Primary Group)
    - 每个用户必须属于一个主组
    - 创建文件时，文件所属组默认为用户的主组
  + 附加组 (Supplementary Groups)
    - 用户可以属于多个附加组
    - 用于权限分配
  + 私有组 (User Private Group, UPG)
    - Ubuntu默认：每个用户有同名私有组作为主组
* 组管理命令
  ```bash
    # 创建组
    sudo groupadd groupname                     # 创建组
    sudo groupadd -g 1500 groupname            # 指定GID创建组

    # 修改组
    sudo groupmod -n newname oldname           # 重命名组
    sudo groupmod -g 2000 groupname            # 修改GID

    # 删除组
    sudo groupdel groupname

    # 组成员管理
    sudo gpasswd -a username groupname         # 添加用户到组
    sudo gpasswd -d username groupname         # 从组移除用户
    sudo gpasswd -A username groupname         # 设置组管理员

    # 查看组信息
    groups username                            # 查看用户所属组
    getent group groupname                     # 查看组信息
    cat /etc/group | grep groupname
  ```

## 文件权限
* Linux权限系统的核心是
  - 用户身份：你是谁（UID）
  - 组成员：你属于哪些组（GID）
  - 文件权限：你能做什么（rwx）
  - 继承和特殊权限：SUID、SGID、Sticky Bit
* 权限表示法
  - 符号表示法
  ```text
    -rwxr-xr--
    ↑ ↑↑↑↑↑↑↑↑
    │ ││││││││
    │ │││││││└── 其他用户权限 (o): r--
    │ │││││└─── 所属组权限 (g): r-x
    │ ││││└──── 所有者权限 (u): rwx
    │ │││└───── 文件类型 (-:文件, d:目录, l:链接等)
  ```
  - 数字表示法（八进制）
  ```bash
    # 权限数字计算
    # r(读) = 4, w(写) = 2, x(执行) = 1

    # 示例：
    rwxr-xr-- = 
    所有者: rwx = 4+2+1 = 7
    所属组: r-x = 4+0+1 = 5
    其他用户: r-- = 4+0+0 = 4
    权限 = 754
  ```
* 特殊权限位
  ```bash
    # SUID (Set User ID) - 执行时以文件所有者身份运行
    # 位置：所有者执行位，显示为 s 或 S
    chmod u+s file
    chmod 4755 file        # rwsr-xr-x
    # 示例：/usr/bin/passwd

    # SGID (Set Group ID)
    # 对文件：执行时以文件所属组身份运行
    # 对目录：新建文件继承目录的所属组
    chmod g+s directory
    chmod 2755 directory   # rwxr-sr-x

    # Sticky Bit (粘滞位)
    # 目录：只有文件所有者、目录所有者或root才能删除文件
    chmod +t directory
    chmod 1777 directory   # rwxrwxrwt
    # 示例：/tmp 目录
  ```
* 修改文件权限
  ```bash
    # 符号模式
    chmod u+rwx file        # 给所有者添加读写执行
    chmod g-w file          # 移除所属组写权限
    chmod o=r file          # 设置其他用户为只读
    chmod a+x file          # 给所有用户添加执行权限
    chmod u=rwx,g=rx,o= file  # 组合设置

    # 数字模式
    chmod 755 file          # rwxr-xr-x
    chmod 644 file          # rw-r--r--
    chmod 600 file          # rw-------

    # 递归修改目录
    chmod -R 755 directory
    chmod -R u+rwX,g+rX,o+rX directory  # 大写X:只给目录执行权限
  ```
* 修改所有者和所属组
  ```bash
    # 修改所有者
    chown username file
    chown alice: file       # 只修改所有者

    # 修改所属组
    chown :groupname file
    chown :developers file

    # 同时修改所有者和组
    chown username:groupname file
    chown alice:developers file

    # 递归修改
    chown -R username:groupname directory

    # 只修改组（使用chgrp）
    chgrp groupname file
    chgrp -R groupname directory
  ```
* 权限设置原则
  - 最小权限原则：只给必要的权限
  - 用户隔离：不同用户的数据互相隔离
  - 组管理：使用组批量管理用户权限
  - 定期审计：检查异常权限设置

## 网络管理
* 网络状态的查看
  > 有两个工具包，net-tools 和 iproute,centos7以前主要用 net-tools，之后主推 iproute
  - net-tools：ifconfig、route、netstat
  - iproute2：ip、ss
  + ifconfig:对应 ip addr ls
    - 管理员直接执行，普通用户 /sbin/ifconfig
    - eth0 第一块网卡(网络接口)
    + 第一个网络接口也可能叫做下面的名字
      - eno1 板载网卡
      - ens33 PCI-E网卡
      - enp0s3 无法获取物理信息的 PCI-E网卡
      - CentOs 7 使用了一致性网络设备命名，以上都不匹配则使用 eth0 
    + 网络接口命名修改
        - 网卡命名规则受 biosdevname 和 net.ifnames 两个参数影响
        + 编辑 /etc/default/grub 文件,GRUB_CMDLINE_LINUX 属性 默认是 biosdevname=0 net.ifnames=1 网卡名ens33
        - 在 GRUB_CMDLINE_LINUX 属性增加 biosdevname=0 net.ifnames=0  生效后 第一块网卡 eth0
        - 在 GRUB_CMDLINE_LINUX 属性增加 biosdevname=1 net.ifnames=0  生效后 第一块网卡 em1
        - 更新grub: grub2-mkconfig -o /boot/grub2/grub.cfg
        - 重启后生效：reboot 
    + 查看网关
      - route -n
      - -n 不解析主机名
  + 查看网卡物理连接情况：
    - mii-tool eth0
  + 端口占用情况: nmap、lsof
    - yum install nmap
    - nmap 127.0.0.1 查看本机端口占用
    - lsof -i:3000
* 网络配置
  + 网卡关闭(两套命令都行)
    - ifdown eth0   
    - ip link set dev eth0 down    
  + 网卡启动
    - ifup eth0
    - ip link set dev eth0 up    
  + 添加网关
    - net-tools： route add -host<指定ip> gw<网关ip>
    - net-tools： route add -net 10.0.0.0 netmask 255.255.255.0 gw 192.168.0.1
    - iproute2：ip route add 10.0.0/24 via 192.168.0.1
* 网络故障排查
  + ping 检测目标主机是否畅通：
    - ping www.baidu.com
  + traceroute 追踪目标主机的网络的每一跳
    - traceroute -w www.baidu.com
  + mtr 检测到目标主机是否有数据包丢失
  + nslookup 域名访问是检测ip
    - nslookup www.baidu.com
  + telnet   检测端口问题
    - telnet www.baidu.com 80
  + tcpdump  细致分析数据包
    - tcpdump -i any -n port 80
    - tcpdump -i any -n hiost 10.0.0.1
  + netstat  服务监听范围
    - netstat -ntpl
  + ss 
    - ss -ntpl
* 网络服务管理
  > 有两种，service、centos7 新增 systemctl
  > 服务器上推荐使用 network
  - service network status
  - systemctl list-unit-files NetworkManger.service
  - service network start|stop|restart 管理网络服务
  - systemctl start|stop|restart NetworkManger 管理网络服务
  - systemctl enable|disable NetworkManger  开启或禁用 NetworkManger
* 常用的网络配置文件
  - ifcfg-eth0
  - /etc/hosts
  ```bash
    # 网卡配置文件
    cd /etc/sysconfig/network-scripts/
    ls ifcfg-*
    # 修改完指定的文件后
    service network restart
  ```
  + 修改主机名
    - hostname 查看主机名
    
    - hostnamectl set-hostname xxx 修改主机名为 xxx
    - 在 /etc/hosts 中 设置127.0.0.1 xxx 防止启动服务过慢
* 特殊的ip
  - 127.0.0.1 代表本机
  + 0.0.0.0  代表本机
    - 在端口绑定中用来确定绑定关系
    - ip地址限制中，表示所有ip的意思，如放行规则表示允许任务ip访问
* 域名解析
  - 先查看本机的记录 hosts
  - 再联网去dns服务器
* 端口划分（规范的建议）
  - 公认端口：1-1023 用于系统内置或常用软件绑定
  - 注册端口：1024-49151 用于松散绑定（用户自定义）
  - 动态端口：49152-65535 用于临时使用

## 包管理
* [yum](/包管理/yum.md)
* [dnf](/包管理/dnf.md)
* [apt](/包管理/apt.md)

## 进程管理
[进程与线程](./进程与线程.md)

## SELinux
> 安全控制组件,可能影响性能
* 查看命令
  ```bash
   getenforce
   /usr/sbin/sestatus
   ps -Z and ls -Z and id -Z

  ```
* 关闭SELinux
  ```bash
   setenforce 0
   /etc/selinux/sysconfig
  ```

## 内存与磁盘管理
* 内存使用率
  ```bash
   # 静态的
   free
   free -m
   free -g 
   # 动态的
   top 
  ```
* 磁盘使用率
  ```bash
    fdisk
    df -h
  ```
* 常见的文件系统
  - ext4
  - xfs（centos7）
  - NTFS(需安装额外软件)

## 环境变量
* env 查看环境变量的值
* $ 取环境变量的值
  - echo $PATH
* 设置环境变量
  - 临时设置：export 变量名
  + 永久生效：
    - 当前用户生效  配置 在当前用户的 ~/.bashrc 
    - 所有用户生效  配置在系统的   /etc/profile 文件中
    - 执行 source 配置文件，进行立刻生效

## 软链接
> 类似 windows 的快捷方式
* ln -s 参数1 参数2
  - s 创建软链接
  - 参数1 被链接的文件或文件夹
  - 参数2 要链接去的目的地
 ```bash
   ln -s  /usr/local/node-v16.15.1-linux-x64/bin/node /usr/local/bin/node 
   ln -s  /usr/local/node-v16.15.1-linux-x64/bin/npm /usr/local/bin/npm 
  ``` 

## 防火墙
* 分类
  - 软件防火墙：CentOS 6 默认的iptables
  - 硬件防火墙: CentOS 7 默认的是firewallD (底层是netfilter)
  - 包过滤防火墙和应用层防火墙
* iptables的表和链
  - filter nat mangle raw
  + 规则链
    - input output forward
    -prerouting postrouting
* firewallD

* 防火墙服务的控制
  ```bash
    # 查看防火墙的状态
    systemctl status firewalld 
    systemctl start firewalld
    systemctl stop firewalld
    systemctl reload firewalld
  ```