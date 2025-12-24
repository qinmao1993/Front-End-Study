# 网络API
以下是浏览器几种异步请求api

## 什么是异步请求？
异步请求允许浏览器在不阻塞主线程的情况下与服务器通信，从而避免页面"冻结"，提供更流畅的用户体验。

## XMLHttpRequest（xhr） 早期方式
  ```js
    // 创建XHR对象
    const xhr = new XMLHttpRequest();
    // 配置请求
    xhr.open('GET', 'https://api.example.com/data', true); // 第三个参数true表示异步
    // 设置回调函数
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // 请求完成
            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText));
            } else {
                console.error('请求失败:', xhr.status);
            }
        }
    };
    // 设置请求头
    xhr.setRequestHeader('Content-Type', 'application/json');
    // 发送请求
    xhr.send();
    // xhr.abort(); // 取消请求

    // 也可以监听特定事件
    xhr.onload = function() { /* 请求成功完成 */ };
    xhr.onerror = function() { /* 请求失败 */ };
    xhr.onprogress = function(event) { 
        // 进度事件
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
        }
    };
  ```



## Fetch 现代方式
* 基本用法
  ```js
    // 默认 Get 请求
    fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // 解析JSON
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });

    // 带配置的请求
    fetch('https://api.example.com/data', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'、text/plain、multipart/form-data
            'Authorization': 'Bearer token123'
        },
        body: JSON.stringify({                 // body data type must match "Content-Type" header
            name: 'John',
            age: 30
        }),
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, omit
        redirect: 'follow' // manual, follow, error
    });

    // 使用 async/await
    async function fetchData() {
        try {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('请求失败:', error);
        }
    }
  ```
* 服务器响应的数据类型
  - json 
  - blob 
  - text
  - arrayBuffer
  ```js
     async function fetchData() {
        try {
            const response = await fetch('https://api.example.com/data');
            
            const jsonData = await response.json();

            // 应用场景：图片地址
            const blob = await response.blob()
            // URL.createObjectURL(blob) 可以获取当前文件的一个内存URL
            // FileReader.readAsDataURL(blob)可以获取一段data:base64的字符串
            const url = URL.createObjectURL(blob);

            // 应用场景：解决返回的 html gbk 乱码问题
            const reader = new FileReader();
            reader.onload = function (e) {
                var htmlData = reader.result;
                console.log(htmlData);
            };
            reader.readAsText(blob, "GBK");

            const buffer = await response.arrayBuffer()

            const text = await response.text()




        } catch (error) {
            console.error('请求失败:', error);
        }
    }
* 文件上传
  ```js
    const formData = new FormData();
    formData.append('username', 'abc123');
    const fileField = document.querySelector('input[type="file"]');
    formData.append('file', fileField.files[0]);

    fetch('https://example.com/profile/avatar', {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  ```
* 数据流式读取
  ```js
    async function sendPost(){
        // 第一个 awiat 等待的是请求头
       const response = await fetch("https://api.binjie.fun/api/generateStream?refer__1360=n4AxuDBDyDg0G%3DG8DlxGO4%2BrOb8p4iK03mQx", {
            "body": "{\"prompt\":\"取对象数组最后三条记录\",\"userId\":\"#/chat/1733396635331\",\"network\":true,\"system\":\"\",\"withoutContext\":false,\"stream\":false}",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
          // 解码器
         const textDecoder = new TextDecoder()
         const reader = response.body.getReader()
         let content=''
         while(true){
            const { done,value }= await reader.read()
            if(done){
                break
            }
            const txt=textDecoder.decode(value)
            content+=txt
         }
        console.log(contetent)
    }
  ```

## Axios 第三方库 
* responseType
  - 'arraybuffer','blob','document','json','text','stream' 默认是json
* node.js 获取图片
    ```js
    axios({
        method: 'get',
        url: 'http://bit.ly/2mTM3nY',
        responseType: 'stream'
    })
    .then(function (response) {
        response.data.pipe(fs.createWriteStream('test.jpg'))
    });

    axios({
        method: "post",
        url: `/wxa/getwxacodeunlimit`,
        data: params,
        responseType: "arraybuffer",
        transformResponse: [
        function (data) {
            const base64 = Buffer.from(data, "binary").toString("base64");
            return `data:image/jpeg;base64,${base64}`;
        },
        ],
    });
* browser 获取图片
  ```js
     axios({
        method: 'get',
        url: 'http://bit.ly/2mTM3nY',
        responseType: 'blob',
    }).then(function (response) {
        // const url = URL.createObjectURL(blob);
    });
  ```
* 请求体编码
    ```js
    // By default, axios serializes JavaScript objects to JSON.
    // To send data in the application/x-www-form-urlencoded format instead

    // browser and Node.js 都支持 推荐使用
    const qs = require('qs');
    // import qs from 'qs';
    axios.post('/foo', qs.stringify({ 'bar': 123 }));

    const FormData = require('form-data');
    const form = new FormData();
    form.append('my_field', 'my value');
    form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
    axios.post('https://example.com', form, { headers: form.getHeaders() })

    ```
* GBK 解码
  ```js
    axios({
        // 后台返回的是GBK导致乱码，转成GBK才能取到中文的值
        responseType: 'arraybuffer',
        transformResponse: [
            function (data) {
                const htmlStr = iconv.decode(Buffer.from(data), 'GBK')
                return htmlStr
            },
        ],
    })
  ```
* 取消请求（v0.22.0+）
  - Axios 支持以 fetch API方式—— AbortController 取消请求：
  ```js
    const controller = new AbortController();
    const signal = controller.signal;

    axios.get('/foo/bar', {
        signal
    }).then(function(response) {
        //...
    }).catch(error => {
        if (error.name === 'AbortError') {
            console.log('请求已取消');
        }
    });
    // 取消请求
    controller.abort()

  ```
  
## xhr 与 fetch 区别
  - Fetch 默认情况下不会发送同源的 Cookie，需要设置 fetch(url, {credentials: 'include'})
  - 服务器返回 400，500 等错误码时并不会 reject，只有网络错误导致请求不能完成时，fetch 才会被 reject。
  - IE 均不支持原生 Fetch