# nodejs 核心模块及常见用法

## ES 标准模块与 CommonJS 模块
> 从 Node.js 12 版本开始，Node.js 支持大部分 ECMAScript 标准库模块，无需额外安装或配置。
* 在 nodejs 中使用 ES 模块的几种方式
  1. package.json 文件中将 "type" 字段的值设置为 "module", 推荐
  2. 脚本文件的扩展名为 .mjs
  3. 命令行参数 --input-type=module 指定输入类型为模块

## 内置全局对象模块
* 为模块包装而提供的全局对象： 
  - exports、require、module
  - __fileName：当前执行脚本的文件名的绝对路径 如：/path/to/your/current/directory/your_script.js
  - __dirname：当前执行脚本所在的目录的绝对路径 如：/path/to/your/current/directory
  + 注意：
    - 在 ES 模块的项目中，Node.js 不再提供 __dirname 和 __filename 这样的特殊变量。
    - 使用 import.meta.url 和 import.meta.dirname 来代替
    ```js
        // 获取绝对路径（去掉 file:// 前缀）
        import { fileURLToPath } from 'url';
        import { dirname } from 'path';

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        console.log('__filename:', __filename);
        console.log('__dirname:', __dirname);
    ```

* process 对象
  - 代表当前的 nodejs 进程,可以访问进程的信息、事件和各种操作。可以获取命令行参数、环境变量，设置定时器、退出程序等。
  - [nodejs进展线程](./nodejs进程线程.md)

* Console 模块
  - console.table(非常有用)
  - console.time
    ```js
      console.time('100-elements'); // 打印：100-elements: 0.093ms 0
      for (let i = 0; i < 100; i++) {
        console.timeLog('100-elements',i) // 打印100次：100-elements: xxxms i
      }
      console.timeEnd('100-elements'); // 打印：100-elements: 34.542ms
    ```

* EventLoop 相关API
  - setTimeout
  - setInterval
  - setImmediate

* Buffer
  + 是什么？
    - Buffer 是 Node.js 中用于处理二进制数据的一个核心类。在 ES6 引入 TypedArray 之前，js 没有用于处理二进制数据流的机制，Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流、文件系统操作等场景中处理二进制数据。
    - Buffer 是一个类似于整数数组的对象，但对应的是 V8 堆外部的固定大小的原始内存分配。Buffer 的大小在创建时确定，且无法调整。
    - 可以将 Buffer 视为一段固定长度的内存空间，用于存储二进制数据。每个元素都是一个字节（8 位），值范围从 0 到 255（0x00 到 0xFF）。
  + 如何创建 Buffer
    > 在 Node.js 的不同版本中，创建 Buffer 的方式有所变化。现在推荐使用以下方法：
    1. Buffer.alloc(size[, fill[, encoding]]) 创建一个指定大小的 Buffer，并用指定的值填充（默认填充 0）
     ```js
        // 创建长度为 10 的 Buffer，并用 0 填充
        const buf1 = Buffer.alloc(10);
        console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>

        // 创建长度为 10 的 Buffer，并用 'a' 填充
        const buf2 = Buffer.alloc(10, 'a');
        console.log(buf2); // <Buffer 61 61 61 61 61 61 61 61 61 61>

        // 创建长度为 10 的 Buffer，并用 'hello' 填充（UTF-8 编码）
        const buf3 = Buffer.alloc(10, 'hello', 'utf8');
        console.log(buf3); // <Buffer 68 65 6c 6c 6f 68 65 6c 6c 6f>
     ```
    2. Buffer.allocUnsafe(size) 创建一个指定大小的 Buffer，但不初始化内存（可能包含敏感数据）
      ```js
        // 创建长度为 10 的未初始化的 Buffer
        const buf = Buffer.allocUnsafe(10);
        console.log(buf); // 内容不确定，可能包含旧数据
      ```
    3. Buffer.from() 从现有数据创建 Buffer
      ```js
        // 从数组创建
        const buf1 = Buffer.from([1, 2, 3, 4, 5]);
        console.log(buf1); // <Buffer 01 02 03 04 05>

        // 从字符串创建（默认 UTF-8 编码）
        const buf2 = Buffer.from('Hello World');
        console.log(buf2); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

        // 从字符串创建（指定编码）
        const buf3 = Buffer.from('Hello World', 'base64');
        console.log(buf3); // <Buffer 1d e9 65 5b a0>

        // 从另一个 Buffer 创建（复制）
        const buf4 = Buffer.from(buf2);
        console.log(buf4); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
      ```
  + Buffer 与字符编码
    > Buffer 支持以下几种字符编码：
    - 'utf8' - 多字节编码的 Unicode 字符（默认）
    - 'utf16le' - 2 或 4 字节编码的 Unicode 字符
    - 'latin1' - ISO-8859-1
    - 'ascii' - 仅适用于 7 位 ASCII 数据
    - 'base64' - Base64 编码
    - 'hex' - 将每个字节编码为两个十六进制字符
      ```js
        // 创建 Buffer
        const buf = Buffer.from('Hello World', 'utf8');

        // 转换为不同编码的字符串
        console.log(buf.toString('hex'));      // 48656c6c6f20576f726c64
        console.log(buf.toString('base64'));   // SGVsbG8gV29ybGQ=
        console.log(buf.toString('utf8'));     // Hello World
        console.log(buf.toString('ascii'));    // Hello World
      ```
  + Buffer 操作
    1. 写入数据
      ```js
        const buf = Buffer.alloc(10);
        // 写入字符串
        const len1 = buf.write('Hello');
        console.log(`${len1} bytes: ${buf.toString('utf8', 0, len1)}`); // 5 bytes: Hello

        // 写入指定位置的字符串
        const len2 = buf.write('World', 5);
        console.log(`${len2} bytes: ${buf.toString('utf8')}`); // 5 bytes: HelloWorld

        // 写入十六进制值
        buf[10] = 0x41; // 'A' 的 ASCII 码
      ```
    2. 读取数据
      ```js
        const buf = Buffer.from('Hello World');

        // 读取指定位置的字节
        console.log(buf[0]); // 72 (H 的 ASCII 码)

        // 读取部分数据
        console.log(buf.toString('utf8', 0, 5)); // Hello
        console.log(buf.toString('utf8', 6)); // World

        // 使用 slice 获取部分 Buffer
        const slice = buf.slice(0, 5);
        console.log(slice.toString()); // Hello
      ```
    3. 连接 Buffer
      ```js
        const buf1 = Buffer.from('Hello');
        const buf2 = Buffer.from(' ');
        const buf3 = Buffer.from('World');

        // 连接多个 Buffer
        const result = Buffer.concat([buf1, buf2, buf3]);
        console.log(result.toString()); // Hello World
      ```
  + Buffer 与 Stream
    ```js
        import fs from 'node:fs';
        // 创建可读流
        const readableStream = fs.createReadStream('input.txt');

        // 数据到达时处理
        readableStream.on('data', (chunk) => {
            // chunk 是一个 Buffer
            console.log(`接收到 ${chunk.length} 字节的数据`);
            console.log(chunk.toString());
        });

        // 流结束时处理
        readableStream.on('end', () => {
            console.log('没有更多数据了');
        });
    ```
  + Buffer 与 TypedArray
    - Buffer 是 Uint8Array 的子类，因此可以与 JavaScript 的 TypedArray 互操作
    ```js
        // 创建 Buffer
        const buf = Buffer.from([1, 2, 3, 4, 5]);

        // 转换为 Uint8Array
        const uint8array = new Uint8Array(buf);

        // 修改 Uint8Array
        uint8array[0] = 10;

        // Buffer 也会被修改（共享内存）
        console.log(buf[0]); // 10
    ```
  + Buffer 的应用场景
    - 网络数据传输（TCP/UDP）
    - 文件系统 I/O 操作
      ```js
        import { createReadStream,createWriteStream } = import 'node:fs';

        const inputStream = createReadStream('input.txt'); // 创建可读流
        const outputStream = createWriteStream('output.txt'); // 创建可写流
        inputStream.pipe(outputStream); // 管道读写
      ```
    - 处理图片、音频、视频等二进制文件
    - 加密/解密操作参考 crypto 模块
    - 压缩/解压缩数据

* Global
  - 全局命名空间对象，类似于浏览器环境中的 window 对象，它包含了所有全局可用的变量、函数和对象，是 Node.js 全局作用域的核心。
  
## path 和 url
* url
  - Node.js 的 url 模块是一个核心模块，用于处理 URL 的解析和格式化
  - 它提供了两种不同的 API：传统 API（Node.js 早期版本）、WHATWG URL API（符合现代标准，推荐使用）
  ```js
    // 创建 URL 对象
    const myURL = new URL('https://example.org:8080/path/name?query=string#hash');
    // URL 对象属性，可修改
    console.log(url.href,url.protocol、url.username、url.password);        // 完整URL、 'https:'
    console.log(url.host,hostname,url.port); // 'example.com:8080'、'example.com'、'8080'
    console.log(url.pathname,url.search,url.hash,url.origin);    // '/path/name'、'?q=term'、'#fragment'、'https://example.com:8080'

    console.log(url.searchParams); // URLSearchParams 对象
    const url = new URL('https://example.com/?name=John&age=30');
    // 获取查询参数
    console.log(url.searchParams.get('name')); // 'John'
    console.log(url.searchParams.has('age'));  // true

    // 设置/修改参数
    url.searchParams.set('name', 'Jane');
    url.searchParams.append('city', 'NYC');
    url.searchParams.delete('age');

    // 遍历参数
    for (const [key, value] of url.searchParams) {
        console.log(`${key}: ${value}`);
    }
    // 转换为字符串
    console.log(url.searchParams.toString()); // 'name=Jane&city=NYC'
    // 所有值
    console.log([...url.searchParams.values()]); // ['Jane', 'NYC']

    import { fileURLToPath,pathToFileURL } from "node:url";
    // ES模块中获取当前文件绝对路径
    console.log(import.meta.url) // file:///xxx/xxx/xxx.js
    const __filename = fileURLToPath(import.meta.url); // /xxx/xxxx/xxx.js
    const __dirname = dirname(__filename);

    // 将路径转换为文件URL
    const fileURL = pathToFileURL('/path/to/file.txt');
    console.log(fileURL.href); // 'file:///path/to/file.txt'

  ```
* path
  - 提供了一些常用的方法和属性，用于处理文件路径的字符串
   ```js
    import { join,resolve,dirname,basename,parse,extname} = from "node:path";

    // 连接路径
    join("pub", "index.html"); // '/Users/michael/pub/index.html'

    // resolve() 解析绝对路径
    resolve("/etc", "joe.txt"); //'/etc/joe.txt'

    // basename(path[, ext])：返回路径的最后一部分，即文件名。可选的 ext 参数可以过滤掉指定的文件扩展名。
    const notes = "/users/joe/notes.txt";
    basename(notes); // notes.txt
    // 指定第二个参数来获取不带扩展名的文件名
    const ext=extname(notes)
    basename(notes, ext); //notes

    dirname('/foo/bar/baz/asdf/quux');
    // 返回: '/foo/bar/baz/asdf'

    // 返回一个对象，包含路径的各个部分，如 root、dir、base、ext 和 name
    parse(pathString)
  ```

## fs
  - 提供了与文件系统进行交互的 API，允许你在服务器上执行各种文件操作，包括读取、写入、更新、删除文件以及目录管理
  - 详情见[fs.js](./case/fs.js)

## crypto
> 提供加密和解密功能，基本上是对OpenSSL的包装，底层调用的事c/c++ 的实现的算法，速度很快
### 加密
* 对称性加密
* 非对称性加密
   - 在加密和解密时，使用不同的秘钥。一般具有一对秘钥 分公钥（可对外公开）和私钥（管理员拥有）；
   - 如果明文使用了私钥加密，必须使用与其对应的公钥才能解密成功。
   - 如果明文使用了公钥加密，必须使用与其对应的私钥才能解密成功。
* 哈希函数
  + 核心特性：
    - 确定性：相同的输入永远产生相同的哈希值。
    - 高效性：计算哈希值的过程非常快。
    - 单向性（不可逆）：从哈希值无法反推出原始输入数据。这是加密哈希函数的关键特性。
    - 雪崩效应：输入数据即使发生极其微小的改变（例如一个比特位），产生的哈希值也会发生巨大的、不可预测的变化。
    - 抗碰撞性：极难找到两个不同的输入产生相同的哈希值。
  + 哈希使用
    ```js
        import { createHash }  from "node:crypto";
        const str = "hello world";
        // 1. 创建一个哈希对象，并指定算法（例如： 'sha256'、'md5'）
        const md5Hash = createHash("md5")
        // 2. 向哈希对象输入数据（可以是字符串、Buffer等）,可以多次调用 .update() 来追加数据
        // 3. 计算最终的哈希值（十六进制字符串）
        const md5HashStr = md5Hash.update(str).digest("hex");

        // 注意常用算法：
        // MD5  (已不安全，不推荐用于安全目的)
        // 'sha1'： (已不安全，不推荐用于安全目的)
        // 'sha256' / 'sha512'： SHA-2 家族成员，目前是安全的标准选择。
        // 'sha3-256' / 'sha3-512'： 更新的 SHA-3 标准。

        hash.digest(encoding)： // 计算所有传入数据的哈希摘要。调用后，哈希对象不能再被使用。
        // encoding 可以是 'hex'， 'base64'， 'binary'， 或者不传则返回 Buffer。
    ```
  + 应用场景
    - 密码存储（最重要、最经典的应用）
    ```js
        // 现代更推荐使用 scrypt，因为它被设计为更能抵抗硬件（ASIC，GPU）暴力破解。
        // 目前主流的方案：需要安装 bcrypt
        import { scryptSync, randomBytes, timingSafeEqual }  from "node:crypto";

        const password = 'password';
        const salt = randomBytes(16).toString('hex');
        const key = scryptSync(password, salt, 64).toString('hex');
        const storedRecord = `${salt}:${key}`;
        // ... 验证逻辑类似
    ```
    - 数据完整性校验（唯一性标识/指纹）
      ```js
        const crypto = require('crypto');
        const fs = require('fs');

        function calculateFileHash(filePath, algorithm = 'sha256') {
            // 创建一个哈希对象
            const hash = crypto.createHash(algorithm);
            // 创建文件流
            const fileStream = fs.createReadStream(filePath);
        
            // 通过流的方式，将文件数据一点点喂给哈希对象，适合大文件
            fileStream.on('data', (data) => {
                hash.update(data);
            });
            return new Promise((resolve, reject) => {
                fileStream.on('end', () => {
                    // 文件流结束，计算最终哈希值
                    const fileHash = hash.digest('hex');
                    resolve(fileHash);
                });
                
                fileStream.on('error', (err) => {
                    reject(err);
                });
            });
        }
      ```
    - 生成唯一标识符
      ```js
        function generateApiKey(userId, secret) {
            const data = `${userId}-${Date.now()}-${secret}-${Math.random()}`;
            return crypto.createHash('sha256').update(data).digest('hex');
        }
        const apiKey = generateApiKey(12345, 'my-app-super-secret');
        console.log(apiKey); // 输出一个长哈希字符串作为API Key
      ```
    - [详情参见crypto](./case/crypto.js)

### 生成随机UUID
  ```js
    import { randomUUID }  from "node:crypto";
    const requestId = randomUUID();
    console.log(requestId);
    // 7c34e9e8-56db-4132-9dab-d5fe7900ee32
  ```

## 网络模块(http|https|http2)
* 这三个模块的关系是逐步演进和增强的，http是基础，处理明文HTTP通信，https是 http + TLS/SSL，提供加密通信。http2 是新一代协议，性能远超 HTTP/1.1（即 http 和 https 使用的协议）

### http
> 模块是 Node.js 用于创建 HTTP 服务器和客户端的基石。它实现了 HTTP/1.1 协议
* 核心概念
  - 服务器 (http.Server): 用于监听端口，接收和处理 incoming HTTP 请求。
  - 客户端 (http.ClientRequest): 用于向其他 HTTP 服务器发出请求
  - 请求/响应流: 请求是可读流，响应是可写流。这个设计使得处理大量数据（如文件上传）非常高效。
  - 事件驱动: 整个模块基于事件驱动。例如，当服务器收到请求时，会触发 'request' 事件
* 创建 HTTP 服务器 
  - [http服务js](./case/http服务.js)

### https
* https 模块是 http 模块的扩展，用于处理通过 TLS/SSL 加密的 HTTPS 连接。它的 API 与 http 模块几乎完全一致。
* 核心区别
  - 创建服务器和客户端时需要提供安全证书（SSL/TLS certificate）。
* 创建 HTTPS 服务器
  - [http服务js](./case/http服务.js)

### http2
* http2 模块实现了 IETF 的 HTTP/2 协议。其主要目标是显著提高 Web 性能，解决 HTTP/1.1 的诸多缺陷
* HTTP/2 的核心优势
  - 多路复用 (Multiplexing): 在一个 TCP 连接上并行交错地发送多个请求和响应，彻底解决了 HTTP/1.1 的队头阻塞问题。
  - 服务器推送 (Server Push): 服务器可以主动将客户端很可能需要的资源（如 CSS, JS）“推送”给客户端，无需客户端解析 HTML 后再发起请求。
  - 头部压缩 (HPACK): 使用 HPACK 算法压缩 HTTP 头部，减少了开销。
  - 二进制分帧层: 将传输的数据拆分为更小的帧（Frame），编码为二进制，解析更高效。
* 创建 HTTP2 服务器
  - [http服务js](./case/http服务.js)

## 进程线程模块（process、child_process、Cluster、worker_threads）
[nodejs 中的进程线程](./nodejs进程线程.md)

## os
> os 模块提供了与操作系统相关的实用方法和属性。它可以用来获取操作系统相关信息，如 CPU 架构、内存、网络接口、系统运行时间等。
* 返回操作系统信息
  - os.platform()	操作系统平台： 'darwin' (macOS), 'win32' (Windows), 'linux', 'freebsd' 等
  - os.type()       操作系统类型：'Darwin' (macOS), 'Windows_NT' (Windows), 'Linux' 等
  - os.release()	操作系统版本：'10.0.19042' (Windows 10), '20.6.0' (macOS Big Sur)

* 返回硬件信息
  - os.arch()	返回当前系统的 CPU 架构, 如 'x64', 'arm', 'arm64', 'ia32' 等
  - os.cpus()	返回 CPU 每个核的信息

  - os.totalmem()	返回总内存大小(同内存条大小) 单位是字节
  - os.freemem()	返回系统空闲内存的大小, 单位是字节

  - os.networkInterfaces()	返回网卡信息 (类似 ifconfig)
  - os.loadavg()	返回负载信息

* 系统运行时间信息
  - os.uptime()     返回系统已经运行的秒数

* 用户信息
  - os.userInfo();

* 其他信息
  - os.homedir()	返回当前用户的根目录
  - os.hostname()	返回当前系统的主机名

## events
* 用法和 vue的 event bus 三方库 mitt 采用发布订阅模式
* 用法
  - 事件默认是监听10个
  ```js
    // 引入 events 模块
    // import { EventEmitter } from 'node:events';
    const { EventEmitter } = require("node:events");
    const bus = new EventEmitter();

    bus.on("connection", () => {
        console.log("连接成功。");
        bus.emit("data_received");
    });

    bus.on("data_received", function () {
        console.log("数据接收成功。");
    });

    // myEmitter.emit('event', 1, 2, 3, 4, 5);
    bus.emit("connection");

    console.log("程序执行完毕。");

    // once(): 添加单次监听器。
    // off(): 从事件中移除事件监听器。
    // removeListener() 
    // removeAllListeners(): 移除事件的所有监听器。
  ```
* process 上的事件触发器
  - 经查阅源码发现，nodejs 已经把 events 事件触发器嫁接到 process 上

## zlib
> zlib 是一个用于压缩和解压缩数据的核心模块，它通过封装 Zlib 库来实现功能。在 Node.js 中，它提供了对 Gzip、Deflate/Inflate 和 Brotli 等多种压缩算法的支持，使得开发者可以轻松地在应用程序中实现数据压缩
[stream-zlib](./case/stream-zlib.js)

## util 工具模块
* promisify
  - 将基于回调的函数转换为返回 Promise 的函数
  ```js
    import { promisify } from 'node:util';

    const execPromise = promisify(exec);
    execPromise("node -v")
    .then((res) => {
        console.log(`res:`,res);
    })
    .catch((err) => {
        console.log("err", err);
    });
  ```
