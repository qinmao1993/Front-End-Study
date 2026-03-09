# web-worker
Web Worker 是一种浏览器特性，允许 js 代码在后台线程（与网页的主执行线程分离）中运行。这使得开发者可以执行计算密集型任务，而不会阻塞用户界面（UI）或导致页面卡顿。

## 核心特性
1. 多线程：与主线程并行执行脚本
2. 无法操作DOM：不能直接操作DOM或访问全局变量
3. 基于消息的通信：通过 postMessage 和 onmessage 实现线程间通信
4. 同源限制：Worker脚本必须与主页面同域

## 基础用法
* 主线程代码
  ```js
    // 创建Worker  
    const worker = new Worker('worker.js');  

    // 向Worker发送数据  
    worker.postMessage({ data: 'Hello Worker!' });  

    // 接收Worker的消息  
    worker.onmessage = (event) => {  
      console.log('来自Worker:', event.data);  
    };  

    // 错误处理  
    worker.onerror = (error) => {  
      console.error('Worker错误:', error);  
    };  

    // worker.terminate();  及时终止Worker
  ```
* worker.js（Worker脚本）
  ```js
    // 接收主线程消息  
    self.onmessage = (event) => {  
        const data = event.data;  

        // 处理数据（例如复杂计算）  
        const result = heavyCalculation(data);  

        // 返回结果  
        self.postMessage(result);  
    };  
    function heavyCalculation(data) {  
        // ... 复杂操作 ...  
        return processedData;  
    }  
  ```

## 浏览器支持
* 所有现代浏览器均支持
* IE 10+（部分支持）
* 移动端：Android 4.4+、iOS 5.1+

## 应用场景
* 计算密集型任务
* 数据处理和转换
* 图像处理
* 实时数据处理
* 网络请求和数据缓存
