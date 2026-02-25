# shell 脚本编程
Shell脚本是一种使用命令行解释器（Shell）编写的脚本程序，用于自动化执行一系列命令。它是Linux/Unix系统管理和软件开发中不可或缺的工具。
Shell脚本 是将多条Shell命令按逻辑组合在一个文本文件中，实现自动化任务，如文件管理、程序部署、系统监控等。

## Shell概述
Shell 是用户与操作系统内核之间的接口，既是一种命令解释器，也是一种强大的编程语言。常见的Shell有：
* Bash（Bourne Again Shell）：Linux默认，功能最丰富，本文以Bash为主。
* sh（Bourne Shell）：Unix早期标准，兼容性好。
* zsh、fish、ksh等：各有特色。

## 第一个Shell脚本(最佳实践)
```bash
    #!/bin/bash
    set -euo pipefail
    IFS=$'\n\t'

    # script.sh 
    echo "Hello, World!"
```
* 解释
  - #!/bin/bash 称为 Shebang，指定脚本由哪个Shell解释执行
  - -e：出错退出
  - -u：变量未定义时报错
  - -o pipefail：管道中任一命令失败则整体失败
  - IFS 设置安全的分隔符（避免空格问题）
* 最佳实践
  - 变量命名： 使用小写字母，下划线分割（user_name），环境变量大写。
  - 引用变量：始终用双引号 "$var"，避免单词拆分和路径名扩展。
  - 检查命令是否存在：
    ```bash
    if ! command -v curl &> /dev/null; then
        echo "curl not found"
    fi
    ```

* 执行
  ```bash
   chmod +x script.sh # 使脚本具有执行权限
   ./script.sh  # 执行此脚本
  ```

## 基本语法
* 变量
  ```bash
    # 定义变量：name=value（等号两边不能有空格）
    name="Alice"
    age=25
    
    # 引用变量：$name 或 ${name}（花括号用于边界识别）
    echo "My name is $name"
  ```
* 特殊变量
  - $0	脚本文件名
  - $n	第n个位置参数（n≥1）
  - $#	参数个数
  - $@	所有参数列表（作为多个字符串）
  - $*	所有参数列表（作为一个字符串）
  - $?	上一条命令的退出状态
  - $$	当前Shell进程PID
* 环境变量
  - export VAR=value 使其成为环境变量，子进程可继承
* 字符串操作
  - 单引号：原样输出，不解析变量。
  - 双引号：解析变量，支持转义。
  ```bash
    str="Hello"
    echo "${str}World"      # HelloWorld
    echo "${#str}"          # 5（长度）
    echo "${str:1:3}"       # ell（切片）
    echo "${str/He/xx}"     # xxllo（替换）
  ```
* 数组
  ```bash
    # 索引数组
    arr=(apple banana cherry)
    echo ${arr[0]}          # apple
    echo ${arr[@]}          # 所有元素
    echo ${#arr[@]}         # 数组长度

    # 关联数组（Bash 4+）
    declare -A info
    info=([name]="Alice" [age]=25)
    echo ${info[name]}
  ```
* 算术运算
  - 支持 $(( )) 或 let：
  ```bash
    a=5
    b=3
    echo $((a + b * 2))     # 11
    let c=a+b; echo $c      # 8
  ```
* 输入输出
  - echo：输出，默认换行，-n 不换行
  - printf：格式化输出，类似C语言
  - read：读取输入
  ```bash
    read -p "Enter your name: " user_name
    echo "Hello, $user_name"
  ```
* 分支循环
  - 注意：[ 后和 ] 前必须有空格；变量引用建议加双引号避免空值错误。
  ```bash
    if [ "$name" = "Alice" ]; then
        echo "Match"
    fi

    if condition; then
        commands
    elif condition; then
        commands
    else
        commands
    fi

    case "$var" in
        pattern1)
            commands ;;
        pattern2|pattern3)
            commands ;;
        *)
            default commands ;;
    esac

    # for循环
    for i in 1 2 3; do
        echo $i
    done

    # 类似C语言
    for ((i=0; i<5; i++)); do
        echo $i
    done
  ```
* 函数
  ```bash
    function_name() {
        # 参数通过 $1, $2 访问
        echo "Hello, $1"
        return 0   # 返回值（0-255）
    }
  ```

## 常用文本处理命令
  - grep	文本搜索	grep "error" log.txt
  - awk	    文本处理、格式化输出	awk '{print $1}' file
  - sed	    流编辑器（替换、删除）	sed 's/old/new/g' file
  - cut	    按列切割	cut -d: -f1 /etc/passwd
  - sort	排序	sort -n -k2 data.txt
  - uniq	去重（常与sort联用）	sort file | uniq -c
  - tr	    字符转换	echo "abc" | tr 'a-z' 'A-Z'
  - xargs	将标准输入转为命令行参数	find . -name "*.txt" | xargs rm
  - find	查找文件	find / -name "*.conf"

## 脚本参数处理
* 位置参数
  - $1, $2, ... $9, ${10} 等。
* shift
  - 左移位置参数，丢弃 $1，$2 变 $1。

## 退出状态与错误处理
* 命令执行成功返回 0，失败返回非零。
* exit n 退出脚本并设置退出码。
* set -e：脚本遇到错误（非零状态）立即退出。
* set -u：使用未定义变量时报错并退出。
* set -x：调试模式，显示执行的每条命令。
* trap：捕获信号并执行自定义命令。

## 进程作业控制
* &：后台运行
* jobs：查看后台作业
* fg、bg：前后台切换
* kill：终止进程

## 信号处理
* 常用信号
  - SIGINT(2)、SIGTERM(15)、SIGHUP(1)、SIGKILL(9)。
  ```bash
   trap "echo 'Received SIGINT'; exit" SIGINT
  ```

## 综合案例（备份脚本）
  ```bash
    #!/bin/bash
    # 功能：备份指定目录，压缩并带日期标记，保留最近5份
    set -euo pipefail

    BACKUP_SRC="/home/user/documents"
    BACKUP_DST="/backup"
    MAX_BACKUPS=5
    DATE=$(date +%Y%m%d_%H%M%S)

    # 确保目标目录存在
    mkdir -p "$BACKUP_DST"

    # 备份文件名
    BACKUP_FILE="$BACKUP_DST/backup_$DATE.tar.gz"

    # 执行打包
    tar -czf "$BACKUP_FILE" "$BACKUP_SRC" 2>/dev/null || {
        echo "ERROR: Backup failed" >&2
        exit 1
    }
    echo "Backup created: $BACKUP_FILE"

    # 清理旧备份
    cd "$BACKUP_DST"
    ls -t backup_*.tar.gz 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm

  ```