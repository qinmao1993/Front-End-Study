# pm2
>pm2 是 process manager，主要功能进程管理、日志管理、负载均衡、性能监控这些。
## 安装
 ```bash
  npm install pm2 -g

  whereis pm2   # 安装位置

 ```
## 为什么要用 pm2 呢？它解决了啥问题？
* 程序崩溃自动重启
* 日志管理
* 多核cpu的利用
* 支持性能监控
* 内建负载均衡（使用 Node cluster 集群模块）
## pm2 的系统设置
 ```bash
  # 设置 pm2 开机自启
  pm2 startup 
  # 移除开机自启
  pm2 unstartup 
  # 保存设置
  pm2 save 
  ```
## 常用命令：
* 启动一个node程序
  ```bash
    pm2 start app.js

    # 添加进程监视（在文件改变的时候会重新启动程序）
    pm2 start app.js --watch
  ```

* 进程管理
 ```bash
    # 列出所有进程
    pm2 ls           
    
    # 停止
    pm2 stop [options] <id|name|namespace|all|json|stdin...> 

    # 重启进程
    pm2 restart xxx  
    pm2 restart all  

    # 将 pm2 list 中移除当前进程
    pm2 delete [appname] | id  
    pm2 delete all
  ```
* 负载均衡
 ```bash
  #  -i num 就是启动 num 个进程做负载均衡的意思
  pm2 start app.js -i max 
  pm2 start app.js -i 0

  # 动态调整为3个进程
  pm2 scale main 3

  # 动态调整 加3个进程，pm2 会把请求分配到不同进程上去
  pm2 scale main +3

 ```
* 日志
 ```bash
    #  查看进程的日志
    pm2 logs [appname] | id  
    pm2 logs all     
  ```
* 性能监控
 ```bash
    # 查看某个进程具体情况
    pm2 describe app 

    # 终端查看进程的资源消耗情况
    pm2 monitor   
  ```
* 配置文件
>一次性启动，停止，重启并重载您的所有应用程序：
  - pm2 ecosystem 生成模版
  - pm2 start ecosystem.config.js --env production

## pm2 部署日志和程序中内置日志组件的冲突的问题
* 问题原因：
  - 当同时在应用程序中使用 Pino 进行日志记录，并且使用 PM2 来管理应用程序时，可能会出现日志输出冲突的问题。
  - 这是因为 PM2 会默认捕获应用程序的标准输出（stdout）和标准错误输出（stderr），而 Pino 可能也会将日志输出到这些流中，导致重复输出或混乱的日志记录。

* 解决方案
  - 禁用pm2 日志 pm2 start --disable-logs ecosystem.config.js  --env production
  - 使用pino 日志，注意输出日志到文件夹，文件夹如logs 必须先创建
  