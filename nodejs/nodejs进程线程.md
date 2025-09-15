# nodejs 中的进程线程

## 进程线程
* 进程
  - 是操作系统进行资源分配和调度的基本单位。每个进程都拥有自己独立的内存空间（堆、栈）、代码段、数据段以及系统资源（如文件描述符、环境变量等）。进程之间的通信（IPC - Inter-Process Communication）需要额外的机制，如管道、消息队列、共享内存等，开销较大。
* 线程（Thread）：
  - 是进程内的一个执行单元，是 CPU 调度和执行的最小单位。同一个进程下的多个线程共享进程的大部分内存空间和资源。线程之间的通信可以直接读写共享的内存数据，因此开销远小于进程间通信。但也正因为共享内存，需要引入锁等机制来避免竞态条件，编程模型更复杂。

## nodejs 初始设计
* Node.js 基于事件循环（Event Loop）和异步 I/O，是单线程的。这个“单线程”指的是其 JavaScript 代码运行在一个主线程上。这种设计避免了多线程编程的复杂性（如死锁），并且对于 I/O 密集型的应用效率极高。
* 弱点
  - 无法利用多核 CPU：一个 Node.js 实例只能在一个 CPU 核心上运行。
  - 阻塞事件循环：如果主线程上执行了计算密集型的同步代码（如大量 for 循环、图像处理、复杂数学计算），会阻塞事件循环，导致整个应用无法处理新的请求或其它异步操作。
* 如何解决
  - 为了解决这些问题，Node.js 提供了下面的模块，让我们能够创建子进程或多线程，从而充分利用硬件资源并避免阻塞。

## process 对象
* 这不是用于创建进程或线程的，而是一个与当前 Node.js 进程交互的全局对象
* 代表当前的 nodejs 进程,它提供了对进程的控制和管理的功能，可以访问进程的信息、事件和各种操作。可以获取命令行参数、环境变量，设置定时器、退出程序等。

* 核心功能/API：
  - process.pid    当前进程的 PID
  - process.argv   获取启动进程时的命令行参数
  - process.env    区别环境变量
  - process.cwd()  返回当前工作目录

  - process.exit(code)   进程即将退出时触发,并返回退出码
  - process.kill(pid)    杀死进程，需要进程 id 作为参数 

  + process.on(‘event’): 监听进程事件，如：
    - ‘exit’: 进程即将退出时触发。
    - ‘SIGINT’: 收到中断信号（如用户在终端按 Ctrl+C）时触发。
    - ‘uncaughtException’: 捕获未处理的异常，防止进程突然崩溃。

* 常用方法
  + process.memoryUsage()
    - rss           常驻集大小，物理内存的存量
    - heapTotal     v8 给分配的内存总大小包括未使用的内存
    - headUsed      已使用的内存
    - external      外部的内存c、c++使用的
    - arrayBuffers  二进制的总量
  
  + process.nextTick  将在下一轮事件循环中调用
    - 并不属于 Event loop 中的某一个阶段, 而是在 Event loop 的每一个阶段结束后, 直接执行 nextTickQueue 中插入的 "Tick", 并且直到整个 Queue 处理完. 
    ```js
        // 递归调用 process.nextTick 会怎么样? 
        // 会导致 Node.js 事件循环中的微任务队列不断增长，从而占用大量的内存，并最终导致堆栈溢出错误。
        function test() { 
            process.nextTick(() => test());
        }
        function test() { 
            setTimeout(() => test(), 0);
        }
    ```

* 三个标准流
  - process.stderr, process.stdout 以及 process.stdin 

## 守护进程
* 守护进程是不依赖终端（tty）的进程, 不会因为用户退出终端而停止运行的进程
* Node 如何实现守护进程？
  - PM2：生产级进程管理工具，支持集群模式、日志管理、监控

## child_process
> 用于创建和管理子进程
* 是什么？
  - 允许你创建一个非 Node.js 的进程（如系统命令：ls, find）或另一个 Node.js 脚本进程。子进程与父进程完全独立，拥有自己的内存和 V8 实例。核心创建方法如下

* spawn(command[, args][, options]) 
  - 最基础、最核心的方法，流式执行命令（适合持续输出，如日志），返回一个 ChildProcess 实例
  ```js
    const { spawn } = require('node:child_process');

    // 使用 spawn 创建子进程并执行命令
    const childProcess = spawn('ls', ['-l']);

    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    childProcess.stdout.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

  ```

* exec(command[, options][, callback])
  - 启动一个 shell（如 /bin/sh 或 cmd.exe）来执行命令并缓冲输出,命令结束后一次性返回给回调函数。适用于输出数据量不大的场景。。
  ```js
    const { exec } = require('node:child_process');
    exec('ls -l', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
  ```
* execFile(file[, args][, options][, callback])
  - 类似 exec，但不启动一个 shell，而是直接执行可执行文件，效率稍高，更安全（避免了 shell 注入）。

* fork(modulePath[, args][, options]) 
  - spawn 的特例, 专门用于创建新的 Node.js 子进程，它除了建立一个通信通道（IPC）外，还会额外建立一个通信通道，允许父子进程通过 send() 方法和 ‘message’ 事件相互发送消息
  ```js
    // index.js
    const { fork } = require('node:child_process');

    const child = fork('child.js');
    child.on('message', (message) => {
        console.log('Message from child:', message);
    });
    child.send({ x: '4' });
    // 错误处理
    child.on('error', (err) => console.error('子进程错误：', err));
    child.on('exit', (code) => console.log('子进程退出码：', code));

    // 资源回收:父进程退出时清理子进程
    process.on('exit', () => child.kill());

    // 子进程 child.js 中
    process.on('message', ({ x }) => {
        const result = x * 2;
        process.send(result);
    });
  ```
* 适用场景：
  - 执行系统命令或脚本：如调用 FFmpeg 进行视频转码，调用 ImageMagick 处理图片。
  - 拆分CPU密集型任务:将一个会阻塞事件循环的复杂计算任务放到另一个 Node.js 脚本中，通过 fork() 启动它，计算完成后通过 IPC 将结果发送回主进程。这样主进程的事件循环就不会被阻塞。
  - 运行有安全风险或不太稳定的代码：即使子进程崩溃，也不会影响主进程的稳定性。
* 案例[child_process](./case/child_process.js)

## Cluster 
* 是什么？
  - 可以轻松地创建一个共享同一端口的“进程群集”（Cluster），充分利用多核CPU。集群中有一个主进程（Master）和多个工作进程（Worker）。
* 工作原理：
  - 主进程：管理子进程，监听端口并分发请求。
  - 子进程：由 cluster.fork() 创建，多个工作进程在不同的 CPU 核心上运行应用实例，处理具体请求。
* 核心API：
  - cluster.isPrimary / cluster.isWorker: 判断当前进程是主进程还是工作进程。
  - cluster.fork(): （在主进程中调用）衍生一个新的工作进程。
  - cluster.on(‘exit’): （在主进程中监听）当一个工作进程退出时，可以重新 fork 一个新的，提高健壮性。
* 适用场景：
  - 最大化多核 CPU 的利用率：为每个 CPU 核心创建一个工作进程，让你的 Node.js Web 应用性能得到近乎线性的提升。
  - 提高应用的可用性和韧性：即使某个工作进程因未捕获的异常而崩溃，主进程可以立即重启一个新的工作进程，而不会导致整个服务下线。
* 示例
  - [cluster](./case/cluster.js)

## worker_threads
* 是什么：
  - 它允许在一个 Node.js 进程中并行执行多个 JavaScript 线程。
  - 关键点在于：线程之间可以共享内存（通过 SharedArrayBuffer），而通信开销远小于进程间通信（IPC）。
* 与 child_process 或 cluster 的区别：
  - child_process/cluster 创建的是进程，资源开销大，通信开销也大。
  - worker_threads 创建的是线程，资源开销小，且可以共享内存，通信效率极高。
  - worker 线程非常适合 CPU 密集型的 JavaScript 操作（如数据加密、复杂算法、大数据处理）。而 child_process 更适合集成外部程序或运行独立的脚本。
* 核心概念：
  - 工作线程（Worker Thread）：在新的线程中运行你的代码。
  - 线程间通信：默认不共享内存。主线程和工作线程通过 postMessage() 传递消息（传递的是数据的副本，而非共享）。可以使用 Transferable 对象来转移所有权，避免拷贝大对象，提升性能。
  - 共享内存：通过 SharedArrayBuffer，多个线程可以操作同一块内存，但需要使用 Atomics 模块来进行同步操作以避免竞态条件。
* 应用场景：
  - CPU 密集型的数学计算：如物理模拟、机器学习推理、密码学操作。
  - 处理非常大的数据：如大型 JSON 或 XML 的解析、压缩/解压缩。
  - 需要大量同步计算的 Web 服务器：例如，一个提供实时图像滤镜的 API，可以将每个图像的像素计算任务分发给不同的工作线程。
* 示例
  - [worker_threads](./case/worker_threads.js)


