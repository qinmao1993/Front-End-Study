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
  - yum install kernel-3.10.0 升级内核版本
  - yum update 升级其他软件包和补丁
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
  
## 目录结构（常用的）
* / 根目录
* usr 包含所有的命令、程序库、文档和其它文件。这些文件在正常操作中不会被改变的。
  - /usr/local 本地管理员安装的应用程序
* var 包含在正常操作中被改变的文件，为了保持/usr 的相对稳定，那些经常被修改的 目录可以放在这个目录下，
* home 用户的文件，这个目录在系统升级时应该保留。
* bin 系统启动时需要的执行文件(二进制)，这些文件可以被普通用户使用。
* etc 操作系统的配置文件目录。
* root 系统管理员(也叫超级用户或根用户)的 Home 目录。
* opt 目录，是给主机额外安装软件所摆放的目录，是用户级的程序目录，这里常用于放置额外的大型软件；
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
   - 如：cd /usr/local 绝对路径
   - cd ..            相对路径
   - cd ~
* mkdir：创建一个新的目录 
  - -p 确保目录名称存在，不存在的就建一个
  - mkdir /a/b/c
* rm: 移除文件或目录 
  - rm [-r -f ] 参数1 参数2
  - -r 表示删除文件夹
  - -f 表示强制删除
  - 示例： rm -rf /var/log/httpd/access1  /var/log/httpd/access2
  - rm -rf test* 删除以test开头的文件夹
* cp: 复制文件或目录，
  - -r 复制目录
  - -v 显示复制进度
  - 如：cp -r test test1 表示把 test 复制到 test1
* mv: 移动文件与目录，或修改文件与目录的名称
  - mv test1 test2
* touch 创建一个新的文件
  - touch text.txt
## 文本查看命令
* cat 文本内容显示到终端
  - cat text.txt
* head  查看文件开头
  - head /temp/text
* tail  查看文件结尾
  - -f 文件内容更新后，显示信息同步更新
  - tail -f /test/text.txt
* wc 统计文件内容信息
  - 语法：wc [-c -m -l -w] 文件路径
  - -c 字节数量
  - -m 字符数量
  - -l 行数
  - -w 单词数量
* more 查看文件内容与cat不同的是支持翻页
  - 按q退出查看
## 查找相关命令
* which 要查找的命令程序文件位置
  - which cd 
* find 
  + 按文件名查找文件
    - 语法： find 起始路径 -name '被查找文件名'
    - find / -name '*test'
  + 按文件大小
    - find . -type f -size +1M  -print0 | xargs -0 du -h | sort -nr 
* grep 从文件中通过关键字过滤文件行
  - 语法：grep [-n] 关键字 文件路径  -n 可选显示匹配的行号
  - grep -n 'text' ./text.txt
* | 管道符 左边命令的结果作为右边的输入
* echo 输出的内容
  - echo `pwd`
## 文件打包与压缩
* tar
  + 格式
    - .tar 打包文件，没有体积的减少
    - .gz 极大的压缩体积
  + 归档工具命令
    - x：提取（解压缩）
    - z：通过 gzip 解压,新版本的 tar 通常能自动检测压缩类型，-z 参数可以省略
    - f：指定文件
    - v: 表示详细模式，会在解压缩过程中显示正在提取的文件列表。

  + 常用打包压缩命令
    - tar -cvf test.tar 1.txt 2.txt 3.txt   把 1.txt 2.txt 3.txt 打包到 test.tar 文件内
    - tar -zcvf test.tar.gz 1.txt 2.txt 3.txt  使用 gzip 模式压缩到 test.tar.gz
    - ls -lh test.tar 查看文件大小
  + 常用解包组合
    - tar -xvf test.tar 解压 test.tar 到当前目录
    - tar -xvf test.tar -C /home/xxx  解压到指定目录
    - tar -xvf test.tar.gz 以 gzip 的模式解压
    - tar -xvf vscode-server-linux-x64.tar.gz --strip-components 1 解压时去掉第一层目录结构

  - 解压示例
   ```bash
    xz -d node-v16.15.1-linux-x64.tar.xz
    tar -xvf node-v16.15.1-linux-x64.tar
   ```
* zip
  + 压缩
    - zip -r xxx.zip ./*  当前目录下的所有文件和文件夹全部压缩为xxx.zip文件
  + 解压
    - unzip filename.zip  解压zip文件到当前目录
    - unzip -o -d /home/sunny myfile.zip 把myfile.zip文件解压到 /home/sunny/
    - -o:不提示的情况下覆盖文件；
    - 如果没安装zip、unzip 可用 jar xvf xxx.zip 解压
## 文件传输
* scp :命令用于Linux之间复制文件和目录，-r：递归复制整个目录。
  + 本地到远程
    - scp local_file remote_username@remote_ip:remote_folder 
    - 或者 
    - scp local_file remote_username@remote_ip:remote_file 
    - 或者 
    - scp local_file remote_ip:remote_folder 
    - 或者 
    - scp local_file remote_ip:remote_file 
    > 例子:'scp -r dist/* root@39.96.190.20:/data/www/static' 

  + 远程到本地
    - scp remote_username@remote_ip:remote_folder  local_file
    > 例子：scp -r www.runoob.com:/home/root/others/ /home/space/music/
## vim编辑器使用
> vim 共分为4种模式，分别是正常模式、插入模式、命令模式、可视模式,输入vim 进入，输入 :q 退出
* 命令模式
  - :wq 切换到命令模式，保存文件退出程序
* 插入模式:按 i 切换进入
  - HOME/END，移动光标到行首/行尾
  - Page Up/Page Down，上/下翻页
  - ESC，切换到普通模式 
>例如:打开 host  sudo vi /etc/hosts
## 用户管理
> root才有权限操作
  ```bash
    # 新建用户
    useradd qm
    # 给qm用户设置密码，自己登录后，直接 passwd
    passwd qm  
    
    # 确认是否存在用户信息
    id qm

    # 删除用户
    userdel -r qm

    # 新建用户组
    groupadd group1 
    
    # 删除用户组
    groupdel group1

    # 修改用户
    # 修改用户的家目录
    usermod -d /home/qm

    # 修改qm用户组为group1或者添加时指定用户组
    usermod -g group1 qm
    useradd -g group1 qm

    # root 用户 查看/etc/passwd 当前用户的一些情况
    # x 表是否需要密码登录，第一1001 用户id第二1001 gid
    # user1:x：1001:1001::/home/user1:/bin/bash

    # 普通用户切换root用户
    su - root 
    # 回退上一个用户
    exit

    # 为普通的命令授权，临时以root身份执行
    sudo xxx命令
  ```
## 权限管理
* 查看文件权限
  + 文件类型
    - -普通文件
    - d目录文件
    - b块特殊文件
    - c字符特殊文件
    - l符号链接
    - f命名管道
    - s套接字文件
  + 字符权限的表示方法
    - r 读
    - w 写
    - x 执行
  + 数字权限的表示方法
    - r=4
    - w=2
    - x=1
  ```bash
   # 示例
   # rw- 文件属主的权限
   # r-x 文件属组的权限
   # r-- 其他用户的权限
   -rw-r-xr-- 1 username groupname ntime filename
  ```
* 修改文件权限
  - chmod 修改文件、目录权限
    ```bash
        chmod u+x  /tmp/testfile
        chmod 755  /tmp/testfile
    ```
  - chown 更改属组、属主
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
## 日期设置
* cal 查看当前日历  
  - 查看某年的 cal -y 2022
* date 查看当前系统的日期和时间
  - date "+%Y-%m-%d %H:%M:%S"
* 修改时区
  ```bash
    # 修改时区为东八区
    rm -f /etc/localtime
    sudo ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
    # 或者用下面
    timedatectl set-timezone Asia/Shanghai
   ```
* 时间校准
  > ntp 联网自动校准时间工具，他会自动帮我们校准
  ```bash
   yum install ntp
   ntpdate -u ntp.aliyun.com

   # 离线直接设置或者内网自建 ntp 时间服务器
    date -s "2024-2-6 21:00:00"

    # 推荐使用
    timedatectl set-time '2024-07-25 15:30:00'
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