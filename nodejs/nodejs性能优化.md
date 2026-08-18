# nodejs 性能优化
* vscode
* chrome

## http 性能指标
* qps（request per second） 每秒服务器能够承载的并发量
* transfer rate(吞吐量) 每秒吞吐的数据量大小

## 性能测试工具
* ab
  ```bash
    # 安装 Apache 会自动安装，如果要单独安装ab，可以使用 yum 安装：
    yum -y install httpd-tools

    #  基本的参数：-c 200 并发请求个数 -n 1600 执行的请求数量  -t20 测试20s 
    #            -p 包含了需要POST的数据的文件 -T POST数据所使用的Content-type头信息
    ab -c200 -n1600 -t10 http://127.0.0.1:3000/app/hello

    # mac 系统下 请求本地 报 apr_socket_recv: Connection reset by peer (54) 
    # 原因是：mac 自带的 ab 限制了并发数导致的。下载最新的 ab，新安装的 httpd 下的 ab
    brew install httpd
  ```
* autocannon 
  > Node.js 写的压测工具
  ```bash
    npm i -g autocannon
    autocannon -v

    -a, --amount: 总请求数量，默认值为 0（表示持续运行）
    -b, --body BODY 请求报文体  可以是 JSON 文件、URL 编码的字符串或二进制文件路径。
    -c, --connections NUM 并发连接的数量，默认100
    -d, --duration SEC 执行的时间，单位秒
    -p, --pipelining 管道请求数量，默认值为 1。
    -m, --method METHOD 请求类型 默认GET
    -t, --timeout: 单个请求最长超时时间，单位为秒，默认值为 10。
    -H, --header: 自定义请求头，例如 -H 'Authorization: Bearer xxxx'.

    # 使用示例
    autocannon -c 10 -d 5 -p 1 http://127.0.0.1:3000

  ```
* linux 的命令
  - top：cpu、内存
  - iostat：硬盘
  - profile 性能分析工具（nodejs自带的）
  - chrome devtool

## 分析性能瓶颈的步骤
1. 命令行运行 node --inspect-brk main.js 出现 Debugger listening on xxx 表示成功
2. chrome 浏览器 输入 chrome://inspect  找到 target 下的 inspect 点击， 工具栏有 Profile(cpu)、Memory(内存) 
3. 点击 cpu 开始记录 使用 ab 压测 cpu
 ```bash
   ab -c 100 -n 100 -t 10 http://127.0.0.1:3000/app/hello
 ```
4. 点击 chrome 停止记录按钮, 找到百分比高的函数具体分析:
