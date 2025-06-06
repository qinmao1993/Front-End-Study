# node
## 总体上的感知
* Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. 
* Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

## 应用场景
> NodeJS适合运用在高并发、I/O密集、少量业务逻辑的场景
* RESTful API
* 统一Web应用的UI层
* 大量Ajax请求的应用

## 优缺点
* 优点:
  + 高并发,高性能
    - 构建在 Chrome V8 引擎上，动态语言运行时里最快的
    - 天生异步的
  + 适合I/O密集型应用
    - 网络应用的瓶颈在I/O的处理
  + 并发编程简单
    - 有了事件驱动和非阻塞的I/O机制，可以使用少量的资源处理非常多的连接和任务
* 缺点:
  - 不适合CPU 密集型应用，老版本由于JavaScript单线程的原因(新版本支持多线程)，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起；
  + 解决：分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞I/O调用的发起；
    - 开源组件库质量参差不齐，更新快，向下不兼容
    - 写法上恶心的回调，终极解决方案：Async/Await

## es支持检测
* npm install -g es-checker
* 运行：es-checker

## 软件管理包
* [npm](../包管理/npm.md)

## nodejs架构
![node架构](./imgs/node结构.jpg)

## 模块
* 内置全局对象大致能够分为5大类（无需引入）：
  + ① 为模块包装而提供的全局对象： 
    - exports、require、module、
    - __fileName：当前执行脚本的文件名的路径 如：/path/to/your/current/directory/your_script.js
    - __dirname：当前执行脚本所在的目录的路径 如：/path/to/your/current/directory
  + ② 内置的 process 对象
  + ③ 控制台 Console 模块
    - console.table(非常有用)
    - console.time
      ```js
        console.time('100-elements'); // 打印：100-elements: 0.093ms 0
        for (let i = 0; i < 100; i++) {
          console.timeLog('100-elements',i) // 打印100次：100-elements: xxxms i
        }
        console.timeEnd('100-elements'); // 打印：100-elements: 34.542ms
      ```
  - ④ EventLoop 相关API:setTimeout、setInterval、setImmediate
  - ⑤ Buffer数据类型和全局对象 Global
* 如何引入外部模块
  - 引入外部模块有两种规范 Commonjs(早期es没有模块，nodejs 中的定义的模块规范) 和 ES的 modules(es 标准)， 推荐使用 es 标准库模块。
  - nodejs 现在已经支持标准库模块
* 在 nodejs 中如何直接使用 es 标准库模块？
  > 从 Node.js 12 版本开始，Node.js 支持大部分 ECMAScript 标准库模块，无需额外安装或配置。
  + 几种方式
    - 方式一：脚本文件的扩展名为 .mjs
    - 方式二：package.json 文件中将 "type" 字段的值设置为 "module"
    - 方式三：命令行参数 --input-type=module 指定输入类型为模块
  - 推荐使用方式二 在 package.json 文件中可以使用 "type": "module" 表示整个项目使用 ES 模块，但仍然可以引入 CommonJS 模块。
  + 注意：
    - 在 ES 模块中，Node.js 不再提供 __dirname 和 __filename 这样的特殊变量。
    - 使用 import.meta.filename and import.meta.dirname 来代替
    ```js
      console.log('import.meta.filename:', import.meta.url);
      console.log('import.meta.dirname:', new URL('.', import.meta.url).pathname);
    ```
    - Addons are not currently supported with ES module imports.They can instead be loaded with module.createRequire() or process.dlopen.
     ```js
        import { createRequire } from 'node:module';
        const require = createRequire(import.meta.url);

        // sibling-module.js is a CommonJS module.
        const siblingModule = require('./sibling-module');
     ```

## RPC（远程过程调用）
* 是什么东西
  - 一种用于实现分布式系统中进程间通信的技术。它允许一个进程（或程序）调用另一个进程（或程序）中的函数或方法，就像调用本地函数一样，而无需程序员显式地处理底层通信细节。

* 应用场景：

* 优缺点：
  - 优点：简化分布式系统开发、提高代码复用性、隐藏底层通信细节等。
  - 缺点： 如网络延迟、序列化和反序列化开销、服务发现和负载均衡等问题
* 常见的框架
  - gRPC：由 Google 开发的高性能、通用的远程过程调用框架，基于 HTTP/2 协议和 Protocol Buffers（protobuf）进行通信和数据序列化
  
## 进程
[nodejs进程](./nodejs进程.md)

## 新版本新增的特性
* v20
  - 测试功能增强 node --test 并行测试多个文件
    ```bash
      node --test file1.js file2.js
    ```
  - 环境变量原生支持，直接读取.env,淘汰 dotenv 库
    ```js
      console.log(process.env.xxx)
    ```
    ```bash
      node --env-file .env index.js
    ```
* v21
  - 支持使用 fetch 淘汰 axios
  - 内置彩色控制台输出，淘汰 chalk 库
    ```js
     const { styleText }=require('util')

     console.log(styleText('red', '红色文本'));
     // 多个样式嵌套写法
     console.log(styleText('italic', styleText('bold', styleText('blue', '蓝色加粗斜体'))));
    ```
* v22
  - 文件监听实时运行,淘汰 nodemon
    ```js
      node --watch index.js
    ```
  - 全文件搜索 glob、globSync

## web framework
* 通用型
  - [express](https://www.expressjs.com.cn/)
  - [koa](http://www.ruanyifeng.com/blog/2017/08/koa.html)
* 企业级：
  - [egg](https://eggjs.org/zh-cn/intro/index.html)
  - nestjs(基于ts)

## 数据库
* mysql
  - [typeorm](https://typeorm.io/)
* redis（ioredis）
   - ioredis 是一个强大的 nodejs 库用于和 redis 交互
   - 高性能：支持管道操作、支持连接池、支持断线重连
   - promise 和 async、await 支持
   - 支持集群
   - 支持 lua 脚本
   - 支持发布订阅
   - 流和管道

## 串口技术
* [串口技术](./串口通信.md)

## 调测
* [Nodejs调试](./nodejs调试.md)

## Nodejs c++扩展
* [Nodejs-c++扩展](./nodejs-c++.md)

## 安全
* 限流 
  - 同一个ip在指定的时间内访问的次数
* Helmet
  - 设置与安全相关的 HTTP 标头