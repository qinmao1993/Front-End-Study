# 网络API
## XMLHttpRequest
  ```js
   const $ = {
    // 处理对象的方法
    param: function (obj) {
        const httpStr = "";
        for (const k in obj) {
            httpStr += k + "=" + obj[k] + "&";
        }
        httpStr = httpStr.slice(0, -1);
        return httpStr;
    },
    ajax: function (options) {
        // 1.请求方式
        const type = options.type || "get";
        // 2.请求地址
        const url = options.url || "";
        // 3.请求正文
        let data = this.param(options.data || {});
        // 4.成功时的回调函数
        const successCallback = options.successCallback;

        // 1.实例化对象
        const xhr = new XMLHttpRequest();
        // 2.设置请求行
        if (type == "get") {
            url = url + "?" + data;
            data = null;
        }
        xhr.open(type, url);
        // 3.设置请求头
        if (type == "post") {
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
        }
        // 5.监听并处理相应
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 6.成功时的回调
                successCallback(xhr.responseText);
            }
        };
        // 4.设置请求正文
        xhr.send(data);
        },
    };

  ```

## Fetch 用于发送 HTTP 请求的现代替代方案
* 与 xhr 的区别?
  - Fetch 默认情况下不会发送同源的 Cookie，需要设置 fetch(url, {credentials: 'include'})
  - 服务器返回 400，500 等错误码时并不会 reject，只有网络错误导致请求不能完成时，fetch 才会被 reject。
  - IE 均不支持原生 Fetch
* 请求图片
   ```js
    // 检测请求是否成功
    fetch('flowers.jpg')
    .then(response => response.blob())
    .then(blob => {
        // URL.createObjectURL(blob) 可以获取当前文件的一个内存URL
        myImage.src = URL.createObjectURL(blob);

        // FileReader.readAsDataURL(file)可以获取一段data:base64的字符串
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log(e.target.result)
        };
        reader.readAsDataURL(blob);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    ```
* 上传文件
  ```js
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append('username', 'abc123');
    formData.append('avatar', fileField.files[0]);

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
* json 请求
  ```js
    fetch("http://localhost:3000/", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached   
        credentials: 'same-origin', // include, *same-origin, omit     
        headers: {
            'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'、text/plain、multipart/form-data
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
          });
   ```
* text 文本请求
    ```js
      fetch("http://localhost:3000/", {
            credentials: "include",
            method: "get",
            mode: "cors",
       })
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
        });
    ```
* gbk 乱码问题
  ```js
    // blob 解决返回的 html gbk 乱码问题
    fetch("http://localhost:3000/", {
        credentials: "include",
        method: "get",
        mode: "cors",
    })
        .then((response) => response.blob())
        .then((blob) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                var htmlData = reader.result;
                console.log(htmlData);
            };
            reader.readAsText(blob, "GBK");
        });
    ```
* 返回 arrayBuffer
    ```js
    // arrayBuffer
    fetch("http://localhost:3000/", {
        credentials: "include",
        method: "get",
        mode: "cors",
    })
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
           
        });
    ```

## 数据流式读取
  ```js
    async function sendPost(){
        // 第一个 awiat 等待的是请求头
       const response = await fetch("https://api.binjie.fun/api/generateStream?refer__1360=n4AxuDBDyDg0G%3DG8DlxGO4%2BrOb8p4iK03mQx", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://chat18.aichatos58.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"prompt\":\"取对象数组最后三条记录\",\"userId\":\"#/chat/1733396635331\",\"network\":true,\"system\":\"\",\"withoutContext\":false,\"stream\":false}",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
        // 第二个事请求体
        // const resJson= await response.json()
         const reader=response.body.getReader()
         // 解码器
         const textDecoder= new TextDecoder()
         let contetent=''
         while(true){
            const {done,value}= await reader.read()
            if(done){
                break
            }
            const txt=textDecoder.decode(value)
            contetent+=txt
         }
        console.log(contetent)
    }
    sendPost()
  ```
  