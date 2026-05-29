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
        mode: 'cors', // no-cors,  same-origin
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
  + mode 请求模式
    - cors 默认，允许跨域请求，要求服务器支持 CORS（需返回 Access-Control-Allow-Origin 等头）。如果跨域响应不合法，会报错。
    - 'no-cors' 只允许发送特定“简单请求”（如 GET/POST，只能使用 text/plain 等有限内容类型）。响应无法通过 JavaScript 读取（状态码、内容都不可见），常用于 Service Worker 或 <img>/<script> 类请求。
    - 'same-origin'	仅允许同源请求（协议、域名、端口完全相同）。任何跨域请求都会直接报错。
  + cache 缓存模式 控制浏览器 HTTP 缓存的行为。
    - 'default'（默认）	遵循浏览器默认缓存策略（如强缓存 Expires/Cache-Control，协商缓存 Last-Modified/ETag）。
    - 'no-cache'	不使用缓存。会先向服务器验证缓存是否过期（发送 If-Modified-Since 等），若返回 304 则复用缓存，否则获取新资源。
    - 'reload'	强制从网络获取，类似 Ctrl+F5。请求头会携带 Cache-Control: no-cache，响应也不会存入缓存
    - 'force-cache'	强制使用缓存。只要缓存里有就使用，完全不走网络（除非缓存不存在才请求）。
    - 'only-if-cached'	仅当存在缓存时才使用，且只能用于 same-origin 模式。否则返回网络错误。
  + credentials 凭证携带策略 决定请求是否携带 Cookie、Authorization 等凭证信息。
    - 'same-origin'（默认）	仅在同源请求中携带凭证。跨域请求不会携带。
    - 'include'	无论同源还是跨域，都始终携带凭证。跨域时需要服务器配置 Access-Control-Allow-Credentials: true
    - 'omit'	绝不携带凭证。请求中不会包含 Cookie、认证头等。
  + redirect  重定向处理 控制遇到 HTTP 重定向（状态码 301/302/307/308）时的行为。
    - 'follow'（默认）	自动跟随重定向，最终返回最终目标地址的响应。
    - 'manual'	手动处理重定向。fetch 会返回一个不透明（opaque）的响应（状态码为 0，无法读取内容），但可以获取 response.url 和 response.type === 'opaqueredirect'，用于自己实现重定向逻辑。
    - 'error'	将重定向视为错误，直接抛出异常。
    
* 响应的数据类型
  - json、blob、text、arrayBuffer
  ```js
     async function fetchData() {
        try {
            const response = await fetch('https://api.example.com/data');
            
            const jsonData = await response.json();

            // blob 应用场景：图片地址
            const blob = await response.blob()
            // FileReader.readAsDataURL(blob)可以获取一段data:base64的字符串
            const url = URL.createObjectURL(blob); // 获取当前文件的一个内存URL
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
    async function fetchStream(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ...' },
            body: JSON.stringify(body),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // 按行解析 SSE 事件
            const lines = buffer.split('\n');
            buffer = ''; 
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    const json = JSON.parse(data);
                    // 处理 json.choices[0].delta.content 等...
                }
            }
        }
    }
  ```
* 为了更方便地处理重连与解析，可用第三方库如 @microsoft/fetch-event-source（支持 POST、自定义头、自动重连）。

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

## 排查cookie 写入
```js
// 拦截 fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).then(response => {
    const clone = response.clone();
    const headers = clone.headers;
    if (headers.has('set-cookie')) {
      console.log('Set-Cookie from fetch:', args[0], headers.get('set-cookie'));
    }
    return response;
  });
};

// 拦截 XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
  this.addEventListener('readystatechange', function() {
    if (this.readyState === 2) {
      const setCookie = this.getResponseHeader('set-cookie');
      if (setCookie) {
        console.log('Set-Cookie from XHR:', this.responseURL, setCookie);
      }
    }
  });
  return originalOpen.apply(this, arguments);
};
```