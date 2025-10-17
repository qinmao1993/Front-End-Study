# Promise
> Promise 是异步编程的一种解决方案,用同步的书写方式开发异步的代码，解决回调地狱的问题
## 是什么东西?
  - 简单说就是一个容器，里面保存着某个未来才会结束的事件
  - ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例
  
## 特性
* Promise 实例创建后就会立即执行，无法取消
* 不设置回调函数，Promise 内部抛出的错误，不会反应到外部

## Promise 状态
* 有三种状态：Pending（进行中）、Resolved（已完成）和 Rejected（已失败）
    ```js
        // 基本用法
        const promise = new Promise(function(resolve, reject) {
            if (/* 异步操作成功 */){
                resolve(value);
            } else {
                reject(error);
            }
        });

        // Promise 实例生成后，可用 then 方法指定 resolved 状态和 rejected 状态的回调函数。
        // 第二个函数是可选的
        promise.then(function(value) {
            // success
        }, function(error) {
            // failure
        });

        // 注意：调用 resolve 或 reject 并不会终结 Promise 的参数函数的执行
        new Promise((resolve, reject) => {
            resolve(1);
            console.log(2); // 会继续执行
        })
        .then(r => {
            console.log(r);
        });
        // 2
        // 1
    ```
    
* Promise.prototype
  - .then() resolve 的回调 
  + .catch() 是.then(null, rejection) 或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数
    - then()方法指定的回调函数，如果运行中抛出错误，也会被 catch() 方法捕获
  - .finally() promise 对象最后状态如何，都会执行的操作，无参数

  + Promise.all 和 Promise.race
    - 都是用于将多个 Promise 实例，包装成一个新的 Promise 实例
    ```js
        // 全部执行完成并成功返回一个结果数组,任意一个出错 返回的状态就是 reject 返回参数是第一个 reject 报错的实例参数
        const allP = Promise.all([p1, p2, p3]);

        // 只要 p1、p2、p3 之中有一个实例率先改变状态，raceP的状态就跟着改变。返回第一个状态变化的实例值
        const raceP = Promise.race([p1, p2, p3]);
    ```

  + Promise.resolve 和 Promise.reject 功能类似
    - Promise.resolve('foo') 等价于 new Promise(resolve => resolve('foo'))

## async 和 await
* async：Promise 实例的语法糖
  - 一个函数如果加上 async ，那么该函数就会返回一个 Promise
* await：内部 then 命令的语法糖
  - 表示在这里等待 promise 返回结果了，再继续执行。
  - await 后面跟着的应该是一个 promise 对象（其他返回值也没关系，只是会立即执行，不过那样就没有意义）
* Async/Await 如何通过同步的方式（形式）实现异步？
  > 其核心机制结合了 Promise、生成器（Generator） 和 事件循环
  + Generator 函数：
    - Generator 函数是带有 * 标记的函数，可以在执行过程中暂停和恢复。
    - 通过 yield 暂停执行，通过 next() 恢复,Async/Await 的行为类似生成器，但无需手动控制迭代器。
    ```js
        function* genDemo() {
            console.log("开始执行第一段")
            yield 'generator 2'
            console.log("开始执行第二段")
            yield 'generator 2'
            console.log("执行结束")
            return 'generator 2'
        }
        console.log('main 0')
        let gen = genDemo()
        console.log(gen.next().value)
        console.log('main 1')
        console.log(gen.next().value)
        console.log('main 2')
        console.log(gen.next().value)
    ```
  + Promise 链与微任务（Microtasks）：
     - await 后的表达式被转换为 Promise，其后续代码包装成微任务，在 Promise 解决后执行。

  + 协程:
    - 可把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程
    - 协程不是被操作系统内核所管理，完全由程序所控制，不会像线程切换那样消耗资源

## promise A+规范
* 是一套规则，规定 promise 是一个函数或对象，带一个then方法,es6 中的 Promise 就是基于这个规范实现的
  ```js
    // 判断一个值是否是promise like
    function isPromiseLike(value){
      retrun (
        value!==null&&(typeof value==='object'||typeof value==='function')&&typof value.then==='function'
      )
    }
  ```

## Promise.all 实现方式
* 实现核心:
  - 通过遍历 Promise 数组，为每个 Promise 添加 then 和 catch 处理，并通过计数器跟踪完成状态
* 代码实现
  ```js
    function promiseAll(promises) {
        return new Promise((resolve, reject) => {
            // 如果输入不是可迭代对象，直接 reject
            if (!promises || typeof promises[Symbol.iterator] !== 'function') {
                return reject(new TypeError('Argument is not iterable'));
            }
            const results = []; // 存储每个 Promise 的结果
            let completedCount = 0; // 已完成的 Promise 数量

            // 如果输入为空，直接 resolve 空数组
            if (promises.length === 0) {
                return resolve(results);
            }
            // 遍历每个 Promise
            promises.forEach((promise, index) => {
                // 确保当前项是 Promise（如果不是，用 Promise.resolve 包装）
                Promise.resolve(promise)
                    .then((result) => {
                        results[index] = result; // 存储结果
                        completedCount++;

                        // 如果所有 Promise 都完成，resolve 结果数组
                        if (completedCount === promises.length) {
                            resolve(results);
                        }
                    })
                    .catch((error) => {
                        // 如果任何一个 Promise 被拒绝，立即 reject
                        reject(error);
                    });
            });
        });
    }
  ```

## 实现一个 sleep 函数
* 使用 Promise 和 setTimeout,这是最常见的方式，利用 Promise 和 setTimeout 实现异步延迟
  ```js
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // 使用示例
    async function run() {
        console.log('Start');
        await sleep(2000); // 暂停 2 秒
        console.log('End');
    }
    run();
  ```
* 使用 Generator 函数
  ```js
    function* sleepGenerator(ms) {
        yield new Promise((resolve) => setTimeout(resolve, ms));
    }
    // 使用示例
    function run() {
        const iterator = sleepGenerator(2000);
        iterator.next().value.then(() => {
            console.log('2 seconds later');
        });
    }
    run();
  ```
* 使用 AbortController 实现可取消的 sleep
  ```js
    function sleep(ms, signal) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            // 监听取消信号
            signal?.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Sleep aborted'));
            });
        });
    }

    // 使用示例
    const controller = new AbortController();
    async function run() {
        try {
            console.log('Start');
            await sleep(2000, controller.signal); // 暂停 2 秒
            console.log('End');
        } catch (error) {
            console.error(error.message); // 输出：Sleep aborted
        }
    }
    run();
    controller.abort(); // 取消 sleep
  ```

