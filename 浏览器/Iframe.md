# iframe
<iframe>（内联框架）是一个历史悠久的 HTML 元素，用于在当前页面中嵌入另一个独立的 HTML 文档。它创建了一个全新的浏览上下文（browsing context），拥有独立的 JavaScript 运行环境、文档对象模型（DOM）和渲染堆叠上下文。

自 HTML 4.01 起，iframe 就成为标准的一部分，并且在 HTML5 中得到了强化，增加了安全性和性能相关的属性。即使现代 Web 应用架构不断演进，iframe 仍然是跨源嵌入、沙盒隔离和微前端方案中的关键工具。

## 基本用法与核心属性
```html
    <iframe src="https://example.com/page.html" title="描述性标题"></iframe>

    <!-- 常见属性 -->
    <!-- src	URL	嵌入页面的地址
    srcdoc	HTML 字符串	内嵌的 HTML 代码，优先级高于 src
    name	文本	框架名称，可用于 <a target> 或表单 target
    width/height	像素或百分比	尺寸，CSS 通常更灵活
    sandbox	空格分隔的令牌	启用严格的隔离策略
    allow	权限策略字符串	控制功能权限，如摄像头、麦克风、全屏
    referrerpolicy	枚举值	控制 Referer 头的发送策略
    loading	lazy / eager	懒加载支持（现代浏览器） -->
```
## sandbox —— 最强的隔离沙箱
* 默认全部开启
* 常用令牌：
  - allow-scripts：允许执行脚本。
  - allow-same-origin：允许当作同源对待（危险，常与 allow-scripts 共用易导致逃逸）。
  - allow-forms：允许提交表单。
  - allow-popups：允许弹出窗口（如 window.open）。
  - allow-top-navigation：允许导航顶层窗口。
  - allow-downloads：允许下载文件（现代浏览器）。
  - allow-modals：允许调用 alert 等模态对话框。

## 权限策略（Permissions Policy）
通过 allow 属性控制 iframe 对浏览器特性的访问，替代旧的 allowfullscreen、allowpaymentrequest 等。
```html
  <!-- 表示仅允许当前同源使用摄像头，不允许使用麦克风。权限策略也可通过 HTTP 头 Permissions-Policy 全局设置。 -->
  <iframe src="camera.html" allow="camera 'self'; microphone 'none'"></iframe>
```


## iframe 与父页面通信
* 同源通信
  ```js
    // 父页面获取 iframe 中的元素
    const iframe = document.getElementById('my-iframe');
    const innerH1 = iframe.contentDocument.querySelector('h1');

    // iframe 中修改父页面样式
    window.parent.document.body.style.background = 'red';

  ```
* 跨域通信：postMessage
  - 跨域时，浏览器禁止直接访问对方 DOM，但允许通过 postMessage API 安全地交换数据。
    ```js
        // 父页面发送消息：
        const iframe = document.getElementById('child');
        iframe.contentWindow.postMessage({ type: 'GREET', payload: 'Hello' }, 'https://child.com');

        // iframe 接收消息：
        window.addEventListener('message', (event) => {
            // 务必验证来源！
            if (event.origin !== 'https://parent.com') return;
            console.log('收到:', event.data);
            // 可回复：event.source.postMessage(...)
        });


        // iframe 向父页面发消息
        window.parent.postMessage(message, targetOrigin, [transfer]);
        // message 要发送的数据。可以是任何结构化克隆算法支持的值（对象、数组、字符串、Blob、ArrayBuffer 等）。

        // targetOrigin：必填，指定哪些父窗口能接收到消息。永远不要使用 '*'，应明确指定父页面的源（协议+域名+端口）。这能防止恶意网站通过重定向等手法截获消息。
        // transfer（可选）：可转移对象的数组（如 MessagePort、ArrayBuffer），在传输后所有权转移。

        // 父页面接收消息
        window.addEventListener('message', (event) => {
            // 1. 必须验证来源！只处理来自预期 iframe 的消息
            if (event.origin !== 'https://child-iframe.com') return;

            // 2. 可选：验证 event.source 是否为期望的 iframe 窗口对象
            //  event.source 是发送消息的窗口（即 iframe.contentWindow）
            if (event.source !== document.getElementById('myIframe').contentWindow) return;

            // 3. 安全处理数据
            console.log('收到来自 iframe 的消息:', event.data);
        });
    ```